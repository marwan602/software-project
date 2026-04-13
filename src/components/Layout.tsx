import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
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
