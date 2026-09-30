import CollectionTable from './CollectionTable.jsx'
import { displayReference, formatDate } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

function Activities() {
  const columns = [
    { label: 'ACTIVITY', render: (record) => <span className="type-label">{record.type || '--'}</span> },
    { label: 'ATHLETE', render: (record) => displayReference(record.userId) },
    { label: 'DURATION', render: (record) => `${record.durationMinutes ?? '--'} min` },
    { label: 'DISTANCE', render: (record) => record.distanceKm == null ? '--' : `${record.distanceKm} km` },
    { label: 'POINTS', render: (record) => <strong className="points-value">{record.points ?? 0}</strong> },
    { label: 'COMPLETED', render: (record) => formatDate(record.completedAt) },
  ]

  return <CollectionTable endpoint={endpoint} title="Activities" category="MOVEMENT" description="Recent training logged by the OctoFit community." columns={columns} />
}

export default Activities