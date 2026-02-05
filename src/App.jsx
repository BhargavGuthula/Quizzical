import { useState } from 'react'
import './App.css'
import EntrancePage from './EntrancePage.jsx'
import QuizGame from './QuizGame.jsx' 

function App() {
  const [startQuiz, setStartQuiz] = useState(true)
  return (
    <main>
      {startQuiz && <EntrancePage clicked = {() => setStartQuiz(false)} />}
      {!startQuiz && <QuizGame />}
    </main>
  )
}

export default App
