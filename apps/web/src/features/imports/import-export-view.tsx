export type ImportPreviewState =
  | { status: "idle" }
  | { status: "validation_error"; errors: string[] }
  | { status: "queued"; jobId: string };

export function ImportExportView({ preview }: { preview: ImportPreviewState }) {
  return (
    <section aria-labelledby="imports-title">
      <p className="eyebrow">Controlled data movement</p>
      <h1 id="imports-title">Import & manual export</h1>
      <div className="split-layout">
        <section className="surface-card" aria-labelledby="csv-import-title">
          <h2 id="csv-import-title">CSV import preview</h2>
          <p>Uploads must be stored in an authorized tenant artifact before preview.</p>
          <form>
            <label htmlFor="csv-file">Synthetic or approved CSV file</label>
            <input id="csv-file" name="file" type="file" accept=".csv,text/csv" />
            <button type="button" disabled>
              Upload and preview
            </button>
          </form>
          <p className="field-note">Artifact upload is not configured; no browser file is sent.</p>
          {preview.status === "validation_error" ? (
            <div className="state-panel state-panel--error" role="alert">
              <strong>Import validation failed</strong>
              <ul>
                {preview.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {preview.status === "queued" ? (
            <div className="state-panel" role="status">
              Preview queued. Job {preview.jobId} will appear in activity.
            </div>
          ) : null}
        </section>
        <section className="surface-card" aria-labelledby="manual-export-title">
          <h2 id="manual-export-title">Manual outreach exports</h2>
          <article>
            <h3>Email CSV</h3>
            <p>Export selected, policy-eligible contacts for manual SMTP or provider upload.</p>
            <button type="button" disabled>
              Prepare email CSV
            </button>
          </article>
          <article>
            <h3>Direct-mail CSV / PDF</h3>
            <p>Prepare approved address data without requiring a paid postage provider.</p>
            <button type="button" disabled>
              Prepare direct-mail export
            </button>
          </article>
          <p className="field-note">Select authorized records after EP-006 enables identity.</p>
        </section>
      </div>
    </section>
  );
}
