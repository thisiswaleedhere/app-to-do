import Board from "./components/Board.tsx"
// import Footer from "./components/Footer"
import Header from "./components/Header.tsx"
import Modal from "./components/Modal.tsx"

function App() {

  return (
    <div className="h-screen min-w-[350px] overflow-y-auto">
      <div className=" absolute min-w-[350px] -z-10 w-full h-full bg-gradient-to-br from-violet-800 via-pink-700 to-blue-700 filter opacity-75 blur-2xl"></div>
      <Header />
      <Board />
      <Modal />
    </div>
  )
}

export default App
