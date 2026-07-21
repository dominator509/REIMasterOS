import type { PropertyListResponseSchema } from "@rei-os/contracts";
import Link from "next/link";
import type { ResourceState } from "../../lib/api-client";
import { ResourceStatePanel } from "../../components/resource-state";

export type PropertyListEnvelope = ReturnType<typeof PropertyListResponseSchema.parse>;

export function PropertiesView({ state }: { state: ResourceState<PropertyListEnvelope> }) {
  return (
    <section aria-labelledby="properties-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Acquisitions workspace</p>
          <h1 id="properties-title">Properties</h1>
          <p>Search local records and review results in a screen-reader-friendly table.</p>
        </div>
      </div>
      <form className="filter-bar" role="search" method="get">
        <label htmlFor="property-search">Address or market</label>
        <input id="property-search" name="search" type="search" />
        <button type="submit">Search properties</button>
      </form>
      <ResourceStatePanel
        state={state}
        isEmpty={(result) => result.data.items.length === 0}
        empty="No properties match this workspace. Import approved data or adjust the search."
      >
        {(result) => (
          <section aria-label="Property results table alternative">
            <p className="result-summary" aria-live="polite">
              {result.data.total} property result{result.data.total === 1 ? "" : "s"}
            </p>
            <div className="table-scroll" tabIndex={0}>
              <table>
                <caption>Property search results</caption>
                <thead>
                  <tr>
                    <th scope="col">Address</th>
                    <th scope="col">Type</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.items.map((property) => (
                    <tr key={property.id}>
                      <th scope="row">
                        <Link href={`/properties/${property.id}`}>
                          {property.address.street}, {property.address.city}
                        </Link>
                      </th>
                      <td>{property.characteristics.propertyType.replaceAll("_", " ")}</td>
                      <td>{property.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </ResourceStatePanel>
    </section>
  );
}
