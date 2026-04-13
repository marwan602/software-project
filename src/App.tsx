import Sidebar from './components/Sidebar'
import Header from './components/Header'

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-dev-bg min-h-screen">
        <Header />
        <div className="p-8">
          <p className="text-dev-text-muted">Foundation Ready</p>
        </div>
      </div>
    </div>
  )
}

export default App
