import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import octofitLogo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

const navigation = [
  { to: '/activities', label: 'Activities', number: '01' },
  { to: '/leaderboard', label: 'Leaderboard', number: '02' },
  { to: '/teams', label: 'Teams', number: '03' },
  { to: '/users', label: 'Athletes', number: '04' },
  { to: '/workouts', label: 'Workouts', number: '05' },
]

function App() {
  const location = useLocation()
  const currentPage = navigation.find((item) => item.to === location.pathname)?.label ?? 'Activities'

  return (
    <div className="octofit-app">
      <aside className="sidebar">
        <a className="brand-lockup" href="/activities" aria-label="OctoFit Tracker home">
          <img src={octofitLogo} alt="" className="brand-logo" />
          <span className="brand-name">OCTOFIT<span>TRACKER</span></span>
        </a>

        <div className="sidebar-group-label">TRACKING</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-number">{item.number}</span>
              <span>{item.label}</span>
              <span className="nav-indicator" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <span className="sidebar-rule" />
          <p className="sidebar-school">MERGINGTON HIGH SCHOOL</p>
          <p className="sidebar-season">Fall fitness program <span>2026</span></p>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb"><span>OCTOFIT</span><span className="breadcrumb-slash">/</span>{currentPage}</div>
          <div className="api-label"><span className="api-dot" /> API <span className="api-port">PORT 8000</span></div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/activities" replace />} />
          </Routes>
        </main>

        <footer className="page-footer">
          <span>OCTOFIT TRACKER</span>
          <span>MOVE WELL. MOVE TOGETHER.</span>
        </footer>
      </div>
    </div>
  )
}

export default App