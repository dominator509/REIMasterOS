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

/** In-memory connection for testing — implements DbConnection. */
export function createTestConnection(): DbConnection {
  return {
    config: { host: "test", port: 0, database: "test", user: "test", password: "test" },
    async query<T>(_sql: string, _params?: unknown[]): Promise<T[]> {
      return [] as T[];
    },
    async execute(_sql: string, _params?: unknown[]): Promise<void> {
      // no-op for test
    },
    async transaction<T>(fn: (conn: DbConnection) => Promise<T>): Promise<T> {
      return fn(this);
    },
    async close(): Promise<void> {},
  };
}
