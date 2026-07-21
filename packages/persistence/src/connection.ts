/** Database connection config — injectable, no framework dependency. */
export interface DbConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly user: string;
  readonly password: string;
  readonly ssl?: boolean;
}

export interface DbConnection {
  readonly config: DbConfig;
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<void>;
  transaction<T>(fn: (conn: DbConnection) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export interface RecordedStatement {
  readonly kind: "query" | "execute";
  readonly sql: string;
  readonly params: readonly unknown[];
}

export interface TestDbConnection extends DbConnection {
  readonly statements: readonly RecordedStatement[];
}

/** In-memory connection for testing — implements DbConnection. */
export function createTestConnection(): TestDbConnection {
  const statements: RecordedStatement[] = [];
  const connection: TestDbConnection = {
    config: { host: "test", port: 0, database: "test", user: "test", password: "test" },
    statements,
    async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
      statements.push({ kind: "query", sql, params });
      return [];
    },
    async execute(sql: string, params: unknown[] = []): Promise<void> {
      statements.push({ kind: "execute", sql, params });
    },
    async transaction<T>(fn: (conn: DbConnection) => Promise<T>): Promise<T> {
      return fn(connection);
    },
    async close(): Promise<void> {},
  };
  return connection;
}

type PgQueryable = Pick<Pool | PoolClient, "query">;

/** PostgreSQL connection used by application repositories. */
export class PgDbConnection implements DbConnection {
  private readonly pool: Pool;

  constructor(readonly config: DbConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: true } : undefined,
    });
  }

  private async queryWith<T>(
    client: PgQueryable,
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const result = await client.query(sql, params);
    return result.rows as T[];
  }

  async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.queryWith<T>(this.pool, sql, params);
  }

  async execute(sql: string, params: unknown[] = []): Promise<void> {
    await this.pool.query(sql, params);
  }

  async transaction<T>(fn: (conn: DbConnection) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    const transactionConnection: DbConnection = {
      config: this.config,
      query: <R>(sql: string, params: unknown[] = []) => this.queryWith<R>(client, sql, params),
      execute: async (sql: string, params: unknown[] = []) => {
        await client.query(sql, params);
      },
      transaction: async <R>(nested: (conn: DbConnection) => Promise<R>) =>
        nested(transactionConnection),
      close: async () => {},
    };

    try {
      await client.query("BEGIN");
      const result = await fn(transactionConnection);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
import { Pool, type PoolClient } from "pg";
