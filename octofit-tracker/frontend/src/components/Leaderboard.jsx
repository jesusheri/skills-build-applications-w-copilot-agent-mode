import CollectionTable from './CollectionTable.jsx'
import { displayReference } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

function Leaderboard() {
  const columns = [
    {
      label: 'RANK',
      render: (_record, index) => <span className={`rank-number${index < 3 ? ' rank-highlight' : ''}`}>{String(index + 1).padStart(2, '0')}</span>,
    },
    { label: 'ATHLETE', render: (record) => <strong>{displayReference(record.userId)}</strong> },
    { label: 'TEAM', render: (record) => displayReference(record.teamId) },
    { label: 'PERIOD', render: (record) => record.period || '--' },
    { label: 'TOTAL POINTS', render: (record) => <strong className="points-value">{record.totalPoints ?? 0}</strong> },
  ]

  return <CollectionTable endpoint={endpoint} title="Leaderboard" category="COMPETITION" description="Points earned across the current challenge period." columns={columns} />
}

export default Leaderboard