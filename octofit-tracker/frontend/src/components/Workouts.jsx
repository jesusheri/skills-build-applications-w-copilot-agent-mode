import CollectionTable from './CollectionTable.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

function Workouts() {
  const columns = [
    { label: 'WORKOUT', render: (record) => <strong>{record.name || '--'}</strong> },
    { label: 'FOCUS', render: (record) => <span className="type-label">{record.focus || '--'}</span> },
    { label: 'DIFFICULTY', render: (record) => <span className={`difficulty-label difficulty-${record.difficulty || 'beginner'}`}>{record.difficulty || '—'}</span> },
    { label: 'DURATION', render: (record) => `${record.durationMinutes ?? '--'} min` },
    { label: 'DESCRIPTION', render: (record) => record.description || '--' },
  ]

  return <CollectionTable endpoint={endpoint} title="Workouts" category="TRAINING" description="Suggested sessions for a balanced training week." columns={columns} />
}

export default Workouts