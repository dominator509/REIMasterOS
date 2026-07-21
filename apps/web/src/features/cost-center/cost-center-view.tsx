import type { ProviderHealthListResponseSchema } from "@rei-os/contracts";
import { ResourceStatePanel } from "../../components/resource-state";
import type { ResourceState } from "../../lib/api-client";

export type ProviderHealthEnvelope = ReturnType<typeof ProviderHealthListResponseSchema.parse>;

export function CostCenterView({ state }: { state: ResourceState<ProviderHealthEnvelope> }) {
  return (
    <section aria-labelledby="cost-center-title">
      <p className="eyebrow">Provider-optional operations</p>
      <h1 id="cost-center-title">Cost Optimization Center</h1>
      <p>
        Health and fallbacks come from the API. Spend remains unavailable until metering is
        implemented; no zero-cost claim is inferred from missing telemetry.
      </p>
      <ResourceStatePanel
        state={state}
        isEmpty={(result) => result.data.length === 0}
        empty="No provider health records are available. Local/manual workflows remain the default."
      >
        {(result) => (
          <div className="table-scroll" tabIndex={0}>
            <table>
              <caption>Provider health, fallback, and cost telemetry</caption>
              <thead>
                <tr>
                  <th scope="col">Provider</th>
                  <th scope="col">Category</th>
                  <th scope="col">Health</th>
                  <th scope="col">Fallback</th>
                  <th scope="col">Spend</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((provider) => (
                  <tr key={`${provider.category}:${provider.provider}`}>
                    <th scope="row">{provider.provider.replaceAll("_", " ")}</th>
                    <td>{provider.category.replaceAll("_", " ")}</td>
                    <td>{provider.status.replaceAll("_", " ")}</td>
                    <td>{provider.fallback?.replaceAll("_", " ") ?? "None configured"}</td>
                    <td>Telemetry unavailable</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ResourceStatePanel>
      <section className="surface-card" aria-labelledby="cache-health-title">
        <h2 id="cache-health-title">AI cache health</h2>
        <p>
          Hermes prefix reuse and hosted cache metrics are not available yet. Targets are not
          reported as achieved without measured eligible traffic.
        </p>
      </section>
    </section>
  );
}
