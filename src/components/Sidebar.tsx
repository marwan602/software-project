import { LayoutGrid, List, Calendar, Plus, Sun, Settings } from 'lucide-react'

function Sidebar() {
  return (
    <div className="w-20 bg-dev-surface border-r border-dev-border h-screen flex flex-col items-center py-6">
      {/* Logo */}
      <div className="w-12 h-12 bg-dev-accent rounded-xl flex items-center justify-center mb-8">
        <span className="text-white font-bold text-xl">T</span>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-4">
        <button className="w-12 h-12 bg-dev-accent rounded-xl flex items-center justify-center">
          <LayoutGrid className="text-white w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-dev-card rounded-xl flex items-center justify-center hover:bg-dev-border">
          <List className="text-dev-text-muted w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-dev-card rounded-xl flex items-center justify-center hover:bg-dev-border">
          <Calendar className="text-dev-text-muted w-6 h-6" />
        </button>
      </div>

      {/* Bottom Icons */}
      <div className="mt-auto flex flex-col gap-4">
        <button className="w-12 h-12 bg-dev-card rounded-xl flex items-center justify-center hover:bg-dev-border">
          <Plus className="text-dev-text-muted w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-dev-card rounded-xl flex items-center justify-center hover:bg-dev-border">
          <Sun className="text-dev-text-muted w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-dev-card rounded-xl flex items-center justify-center hover:bg-dev-border">
          <Settings className="text-dev-text-muted w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default Sidebar
