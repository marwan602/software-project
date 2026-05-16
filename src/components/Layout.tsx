import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import useAppStore from '../stores/useAppStore'
import { authService } from '../services/authService'

export default function Layout() {
  const setUser = useAppStore((state) => state.setUser)
  const fetchProjects = useAppStore((state) => state.fetchProjects)

  useEffect(() => {
    void fetchProjects()
    void authService
      .getMe()
      .then((data) => {
        if (data.success && data.user) {
          setUser({
            name: data.user.username,
            email: data.user.email,
            avatarInitial: data.user.username?.[0]?.toUpperCase() || 'U',
          })
        }
      })
      .catch(() => {
        // Session data is optional here; protected routing already gates access.
      })
  }, [fetchProjects, setUser])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 min-w-0 bg-dev-bg flex flex-col min-h-0">
        <Header />
        
        <div className="p-8 flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto">
          <Outlet /> 
        </div>

      </div>
    </div>
  )
}
