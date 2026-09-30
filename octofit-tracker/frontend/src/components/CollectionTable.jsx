import { useState } from 'react'
import { useCollection } from '../api.js'

function rowSearchText(record) {
  return Object.values(record ?? {})
    .flatMap((value) => (value && typeof value === 'object' ? Object.values(value) : [value]))
    .filter((value) => value !== null && value !== undefined)
    .join(' ')
    .toLocaleLowerCase()
}

function CollectionTable({ endpoint, title, category, description, columns }) {
  const { records, loading, error, reload } = useCollection(endpoint)
  const [query, setQuery] = useState('')
  const visibleRecords = records.filter((record) => rowSearchText(record).includes(query.trim().toLocaleLowerCase()))

  return (
    <section className="collection-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{category} <span>/</span> OCTOFIT DATA</p>
          <h1>{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        <div className="record-total" aria-live="polite">
          <strong>{String(visibleRecords.length).padStart(2, '0')}</strong>
          <span>{visibleRecords.length === 1 ? 'RECORD' : 'RECORDS'}</span>
        </div>
      </div>

      <div className="table-toolbar">
        <label className="search-field">
          <span className="search-mark" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Filter ${title.toLocaleLowerCase()}`}
            aria-label={`Filter ${title.toLocaleLowerCase()}`}
          />
        </label>
        <button className="refresh-button" type="button" onClick={reload} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading && <div className="table-message" role="status">Loading {title.toLocaleLowerCase()}...</div>}

      {!loading && error && (
        <div className="table-message error-message" role="alert">
          <div><strong>Could not reach the API</strong><span>{error}</span></div>
          <button className="refresh-button" type="button" onClick={reload}>Try again</button>
        </div>
      )}

      {!loading && !error && visibleRecords.length === 0 && (
        <div className="table-message empty-message">
          <strong>{records.length ? 'No matching records' : 'No records yet'}</strong>
          <span>{records.length ? 'Try a different search.' : 'New data will appear here when it is available.'}</span>
        </div>
      )}

      {!loading && !error && visibleRecords.length > 0 && (
        <div className="table-frame">
          <div className="table-scroll">
            <table className="table data-table mb-0">
              <thead>
                <tr>{columns.map((column) => <th key={column.label} scope="col">{column.label}</th>)}</tr>
              </thead>
              <tbody>
                {visibleRecords.map((record, index) => (
                  <tr key={record._id || record.id || `${title}-${index}`}>
                    {columns.map((column) => (
                      <td key={column.label}>{column.render(record, index)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-caption">
            <span>SHOWING {visibleRecords.length} OF {records.length}</span>
            <span>OCTOFIT / {category.toLocaleUpperCase()}</span>
          </div>
        </div>
      )}
    </section>
  )
}

export default CollectionTable