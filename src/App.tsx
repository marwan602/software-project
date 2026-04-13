import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-dev-bg min-h-screen">
        <h1 className="text-4xl font-bold p-8">DevCollab</h1>
        <p className="text-dev-text-muted p-8">Foundation Ready</p>
      </div>
    </div>
  )
}

export default App
