import { useState, useEffect, useMemo } from 'react'

export default function QuizGame() {
    const [question, setQuestion] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [answer, setAnswer] = useState([])
    const [checked ,setIsChecked] = useState(false)
    useEffect(() => {
        const controller = new AbortController()
        const fetchData = async () => {
            try {
                const result = await fetch('https://opentdb.com/api.php?amount=5&type=multiple',
                    {
                        signal: controller.signal
                    })
                const data = await result.json()
                setQuestion(data)
                setAnswer(data.results.map((q, i) => {
                    return (
                        {index: i, options: [decodeHtml(q.correct_answer), ...q.incorrect_answers.map(decodeHtml)].sort(() => Math.random() - 0.5)}
                    )
                }))
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
    function handleAnswerClick(answer, index) {
        setSelectedAnswers(prevSelected => (
            { ...prevSelected, [index]: answer }
        ))
    }
    


    

    const questionOptions = useMemo(() => {
        return question?.results?.map((q, index) => {
            return (
                <div className='quiz' key={index}>
                    <p className='questions'>{decodeHtml(q.question)}</p>
                    {answer[index]?.options?.map((option, i) => {
                        const isSelected = selectedAnswers[index] === option
                        const isCorrect = q.correct_answer === option
                        const isWrong = isSelected && !isCorrect
                        return (
                            <button
                                key={i}
                                className={`answer-btn ${isSelected && 'selected'} ${isCorrect &&checked && 'correct'} ${isWrong && checked && 'wrong'}`}
                                onClick={() => handleAnswerClick(option, index)}
                            >
                                {option}
                            </button>
                        )
                    })}
                </div>

            )
        })
    }, [selectedAnswers,checked, question])

    return (
        <div className='quiz-game-page'>
            {loading ? <>Loading...</> :
                <div className='quiz-game'>
                    {questionOptions}
                    {checked && <p className='score'>Your Score: {Object.entries(selectedAnswers).reduce((score, [index, answer]) => {
                        return score + (answer === question.results[index].correct_answer ? 2 : 0)
                    }, 0)}/10</p>}
                    <button className='check-btn' onClick={() => setIsChecked(true  )} >Check Answers</button>
                </div>
            }
        </div>
    )
}