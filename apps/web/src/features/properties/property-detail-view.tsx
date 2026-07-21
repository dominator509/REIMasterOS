import type { ApiResponse, PropertyResponse } from "@rei-os/contracts";
import { ResourceStatePanel } from "../../components/resource-state";
import type { ResourceState } from "../../lib/api-client";

export function PropertyDetailView({
  state,
}: {
  state: ResourceState<ApiResponse<PropertyResponse>>;
}) {
  return (
    <section aria-labelledby="property-detail-title">
      <p className="eyebrow">Property record</p>
      <ResourceStatePanel state={state} isEmpty={() => false} empty="Property not found.">
        {(result) => (
          <>
            <h1 id="property-detail-title">
              {result.data.address.street}, {result.data.address.city}
            </h1>
            <dl className="detail-grid">
              <div>
                <dt>Status</dt>
                <dd>{result.data.status}</dd>
              </div>
              <div>
                <dt>Property type</dt>
                <dd>{result.data.characteristics.propertyType.replaceAll("_", " ")}</dd>
              </div>
              <div>
                <dt>Market</dt>
                <dd>
                  {result.data.address.city}, {result.data.address.state} {result.data.address.zip}
                </dd>
              </div>
            </dl>
            <section aria-labelledby="property-timeline-title">
              <h2 id="property-timeline-title">Property activity</h2>
              <p>No activity is loaded in this bounded detail request.</p>
            </section>
          </>
        )}
      </ResourceStatePanel>
    </section>
  );
}
