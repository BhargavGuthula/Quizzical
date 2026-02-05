import { useState, useEffect } from 'react'

export default function QuizGame() {
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(true)
    const [answers , setAnswers] = useState([])
    useEffect(() => {
        const controller = new AbortController()
        const fetchData = async () => {
            try {
                const result = await fetch('https://opentdb.com/api.php?amount=5&type=multiple',
                    {
                        signal: controller.signal
                    })
                const data = await result.json()
                console.log(data.results[0].question, data.results[0].correct_answer, data.results[0].incorrect_answers)
                setQuestion(data)
                setLoading(false)
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch cancelled')
                } else {
                    console.error('Fetch error:', error)
                    setLoading(false)
                }
            }
        }
        fetchData()
        return () => controller.abort()
    }, [])

      const decodeHtml = (str) => {
        const textarea = document.createElement('textarea')
        textarea.innerHTML = str
        return textarea.value
      }
      return (
          <div className='quiz-game'>
              {loading ? <div>Loading...</div> :
                  <div>{question.results.map (q =>{
                      return (
                      <div key={q.question}>
                      <p className='questions'>{decodeHtml(q.question)}</p>
                        {[decodeHtml(q.correct_answer), ...q.incorrect_answers.map(decodeHtml)]
                        .sort(() => Math.random() - 0.5).map((answers , index) =>(
                          <button key={index} className='answer-btn'>{answers}</button>
                        )
                        ) }
                      {console.log(q.correct_answer)}                   
                      </div>
                  )})}

                  </div>
                
            }
        </div>
    )
}