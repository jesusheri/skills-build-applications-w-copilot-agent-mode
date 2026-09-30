import CollectionTable from './CollectionTable.jsx'
import { displayReference } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

function Users() {
  const columns = [
    { label: 'ATHLETE', render: (record) => <strong>{record.displayName || record.username || '--'}</strong> },
    { label: 'USERNAME', render: (record) => <span className="secondary-value">@{record.username || '--'}</span> },
    { label: 'EMAIL', render: (record) => record.email || '--' },
    { label: 'TEAM', render: (record) => displayReference(record.teamId) },
    { label: 'POINTS', render: (record) => <strong className="points-value">{record.totalPoints ?? 0}</strong> },
  ]

  return <CollectionTable endpoint={endpoint} title="Athletes" category="MEMBERS" description="Profiles and participation across the program." columns={columns} />
}

export default Users