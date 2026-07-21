import {
  METRIC_DEFINITIONS,
  type MetricDefinition,
  type MetricObservation,
  type MetricsCollector,
  type MetricType,
} from "../metrics.interface.js";

const LABEL_VALUE = /^[a-zA-Z0-9_.:-]{1,64}$/u;

export class InMemoryMetricsCollector implements MetricsCollector {
  private readonly definitions: ReadonlyMap<string, MetricDefinition>;
  private readonly observations: MetricObservation[] = [];

  constructor(definitions: readonly MetricDefinition[] = METRIC_DEFINITIONS) {
    this.definitions = new Map(definitions.map((definition) => [definition.name, definition]));
  }

  increment(name: string, labels: Record<string, string> = {}, value = 1): void {
    this.record(name, "counter", value, labels);
  }

  gauge(name: string, value: number, labels: Record<string, string> = {}): void {
    this.record(name, "gauge", value, labels);
  }

  observe(name: string, value: number, labels: Record<string, string> = {}): void {
    this.record(name, "histogram", value, labels);
  }

  snapshot(): readonly MetricObservation[] {
    return this.observations.map((observation) => ({
      ...observation,
      labels: { ...observation.labels },
    }));
  }

  private record(
    name: string,
    expectedType: MetricType,
    value: number,
    labels: Record<string, string>,
  ): void {
    const definition = this.definitions.get(name);
    if (!definition || definition.type !== expectedType) {
      throw new Error(`Unknown or mismatched metric: ${name}`);
    }
    if (!Number.isFinite(value) || (expectedType !== "gauge" && value < 0)) {
      throw new Error(`Invalid metric value: ${name}`);
    }
    const allowedLabels = new Set(definition.labels ?? []);
    for (const [label, labelValue] of Object.entries(labels)) {
      if (!allowedLabels.has(label) || !LABEL_VALUE.test(labelValue)) {
        throw new Error(`Unsafe metric label: ${name}.${label}`);
      }
    }
    this.observations.push({ name, type: expectedType, value, labels: { ...labels } });
  }
}

export class NoopMetricsCollector implements MetricsCollector {
  increment(_name: string, _labels?: Record<string, string>, _value?: number): void {}
  gauge(_name: string, _value: number, _labels?: Record<string, string>): void {}
  observe(_name: string, _value: number, _labels?: Record<string, string>): void {}
}
