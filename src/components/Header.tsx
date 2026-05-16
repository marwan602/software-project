import { Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'

function Header() {
  const user = useAppStore((state) => state.user)
  const projects = useAppStore((state) => state.projects)
  const activeProjectId = useAppStore((state) => state.activeProjectId)
  const setActiveProjectId = useAppStore((state) => state.setActiveProjectId)
  const searchTerm = useAppStore((state) => state.searchTerm)
  const setSearchTerm = useAppStore((state) => state.setSearchTerm)
  const clearSearchTerm = useAppStore((state) => state.clearSearchTerm)

  const activeProjectName =
    activeProjectId === 'all'
      ? 'All Projects'
      : projects.find((project) => project.id === activeProjectId)?.name || 'All Projects'

  return (
    <div className="h-20 bg-dev-surface border-b border-dev-border flex items-center justify-between px-8">
      {/* Left: Title */}
      <div>
        <h1 className="text-2xl font-bold text-dev-text-main">Projects</h1>
        <p className="text-sm text-dev-text-muted">Active project: {activeProjectName}</p>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        <select
          value={activeProjectId}
          onChange={(e) => setActiveProjectId(e.target.value)}
          className="min-w-44 bg-dev-card border border-dev-border rounded-lg px-3 py-2 text-sm text-dev-text-main focus:outline-none focus:border-dev-primary"
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dev-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dev-card border border-dev-border rounded-lg px-10 py-2 text-dev-text-main placeholder-dev-text-muted focus:outline-none focus:border-dev-primary"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={clearSearchTerm}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dev-text-muted hover:text-dev-text-main"
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>
        <button className="relative p-2 bg-dev-card rounded-lg hover:bg-dev-border">
          <Bell className="w-5 h-5 text-dev-text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-dev-accent rounded-full"></span>
        </button>
        <Link to="/profile" className="w-10 h-10 bg-dev-primary rounded-full flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
          <span className="text-white font-bold">{user.avatarInitial || 'U'}</span>
        </Link>
      </div>
    </div>
  )
}

export default Header
