import CollectionTable from './CollectionTable.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

function Teams() {
  const columns = [
    { label: 'TEAM', render: (record) => <strong>{record.name || '--'}</strong> },
    { label: 'ABOUT', render: (record) => record.description || '--' },
    { label: 'MEMBERS', render: (record) => <span className="member-count">{Array.isArray(record.memberIds) ? record.memberIds.length : 0}</span> },
  ]

  return <CollectionTable endpoint={endpoint} title="Teams" category="COMMUNITY" description="Groups building consistency together." columns={columns} />
}

export default Teams