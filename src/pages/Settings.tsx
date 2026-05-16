import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'
import { authService } from '../services/authService'

export default function Settings() {
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const user = useAppStore((state) => state.user)
  const searchTerm = useAppStore((state) => state.searchTerm)
  const clearSearchTerm = useAppStore((state) => state.clearSearchTerm)
  const dashboardView = useAppStore((state) => state.dashboardView)
  const setDashboardView = useAppStore((state) => state.setDashboardView)
  const hideCompletedInDashboard = useAppStore((state) => state.hideCompletedInDashboard)
  const toggleHideCompletedInDashboard = useAppStore((state) => state.toggleHideCompletedInDashboard)
  const projects = useAppStore((state) => state.projects)
  const activeProjectId = useAppStore((state) => state.activeProjectId)
  const setActiveProjectId = useAppStore((state) => state.setActiveProjectId)
  const createProject = useAppStore((state) => state.createProject)
  const clearUser = useAppStore((state) => state.clearUser)

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectColor, setProjectColor] = useState('#6C3BFF')
  const [projectError, setProjectError] = useState('')
  const [isCreatingProject, setIsCreatingProject] = useState(false)

  const handleLogout = () => {
    clearUser()
    clearSearchTerm()
    setActiveProjectId('all')
    authService.logout()
  }

  const handleCreateProject = async (event: FormEvent) => {
    event.preventDefault()
    if (!projectName.trim()) return

    setIsCreatingProject(true)
    setProjectError('')
    try {
      await createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
        color: projectColor,
      })
      setProjectName('')
      setProjectDescription('')
      setProjectColor('#6C3BFF')
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : 'Failed to create project')
    } finally {
      setIsCreatingProject(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dev-text-main">Settings</h1>
        <p className="text-dev-text-muted mt-2">Adjust the app behavior and appearance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl bg-dev-surface border border-dev-border p-6">
          <h2 className="text-xl font-semibold text-dev-text-main mb-2">Appearance</h2>
          <p className="text-sm text-dev-text-muted mb-4">
            Current theme: <span className="text-dev-text-main font-medium">{theme}</span>
          </p>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center rounded-xl bg-dev-accent px-4 py-2 font-medium text-white hover:opacity-90"
          >
            Toggle theme
          </button>
        </section>

        <section className="rounded-3xl bg-dev-surface border border-dev-border p-6">
          <h2 className="text-xl font-semibold text-dev-text-main mb-2">Dashboard behavior</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dev-text-main mb-2">Default dashboard view</label>
              <select
                value={dashboardView}
                onChange={(e) => setDashboardView(e.target.value as 'cards' | 'list' | 'kanban')}
                className="w-full rounded-xl border border-dev-border bg-dev-card px-4 py-2 text-dev-text-main focus:outline-none focus:border-dev-primary"
              >
                <option value="cards">Cards</option>
                <option value="list">List</option>
                <option value="kanban">Kanban</option>
              </select>
            </div>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-dev-border bg-dev-card px-4 py-3">
              <div>
                <div className="text-sm font-medium text-dev-text-main">Hide completed tasks</div>
                <div className="text-xs text-dev-text-muted">Applies to dashboard cards, list, and Kanban.</div>
              </div>
              <input
                type="checkbox"
                checked={hideCompletedInDashboard}
                onChange={toggleHideCompletedInDashboard}
                className="h-5 w-5 accent-dev-primary"
              />
            </label>
          </div>
        </section>
      </div>

      <section className="rounded-3xl bg-dev-surface border border-dev-border p-6">
        <h2 className="text-xl font-semibold text-dev-text-main mb-2">Projects</h2>
        <p className="text-sm text-dev-text-muted mb-4">Create and switch between project spaces.</p>
        <form onSubmit={handleCreateProject} className="space-y-3 mb-5">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full rounded-xl border border-dev-border bg-dev-card px-4 py-2 text-dev-text-main placeholder-dev-text-muted focus:outline-none focus:border-dev-primary"
            />
            <input
              type="text"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Project description"
              className="w-full rounded-xl border border-dev-border bg-dev-card px-4 py-2 text-dev-text-main placeholder-dev-text-muted focus:outline-none focus:border-dev-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={projectColor}
              onChange={(e) => setProjectColor(e.target.value)}
              className="h-10 w-16 rounded-lg border border-dev-border bg-dev-card"
            />
            <button
              type="submit"
              disabled={isCreatingProject}
              className="rounded-xl bg-dev-accent px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isCreatingProject ? 'Creating...' : 'Create project'}
            </button>
            {projectError ? <span className="text-sm text-red-400">{projectError}</span> : null}
          </div>
        </form>

        <div className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-sm text-dev-text-muted">No projects loaded yet.</p>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveProjectId(project.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  activeProjectId === project.id
                    ? 'border-dev-primary bg-dev-card'
                    : 'border-dev-border bg-dev-card/60 hover:bg-dev-card'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-dev-text-main truncate">{project.name}</div>
                      <div className="text-xs text-dev-text-muted truncate">{project.description || 'No description'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-dev-text-muted whitespace-nowrap">{project.taskCount} tasks</div>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-dev-surface border border-dev-border p-6">
        <h2 className="text-xl font-semibold text-dev-text-main mb-2">Search</h2>
        <p className="text-sm text-dev-text-muted mb-4">
          Active search: <span className="text-dev-text-main font-medium">{searchTerm || 'None'}</span>
        </p>
        <button
          type="button"
          onClick={clearSearchTerm}
          disabled={!searchTerm}
          className="inline-flex items-center rounded-xl bg-dev-card px-4 py-2 font-medium text-dev-text-main border border-dev-border hover:bg-dev-border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear search
        </button>
      </section>

      <section className="rounded-3xl bg-dev-surface border border-dev-border p-6">
        <h2 className="text-xl font-semibold text-dev-text-main mb-2">Session</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm text-dev-text-muted">Signed in as</p>
            <p className="text-base font-medium text-dev-text-main">{user.name || 'Unknown user'}</p>
            <p className="text-sm text-dev-text-muted">{user.email || 'No email on file'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-red-500/10 px-4 py-2 font-medium text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
          >
            Log out
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-dev-surface border border-dev-border p-6">
        <h2 className="text-xl font-semibold text-dev-text-main mb-2">Navigation</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="rounded-xl bg-dev-card px-4 py-2 font-medium text-dev-text-main border border-dev-border hover:bg-dev-border"
          >
            Back to dashboard
          </Link>
          <Link
            to="/planning"
            className="rounded-xl bg-dev-card px-4 py-2 font-medium text-dev-text-main border border-dev-border hover:bg-dev-border"
          >
            Open planning view
          </Link>
          <Link
            to="/profile"
            className="rounded-xl bg-dev-card px-4 py-2 font-medium text-dev-text-main border border-dev-border hover:bg-dev-border"
          >
            Profile
          </Link>
        </div>
      </section>
    </div>
  )
}