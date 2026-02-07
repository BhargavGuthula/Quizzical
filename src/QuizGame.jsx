import { useState, useEffect, useMemo, useRef } from 'react'
import { animate } from 'motion'
export default function QuizGame() {
    const [question, setQuestion] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [answer, setAnswer] = useState([])
    const [checked, setIsChecked] = useState(false)
    const spinnerRef = useRef(null)
    const decodeHtml = (str) => {
        const textarea = document.createElement('textarea')
        textarea.innerHTML = str
        return textarea.value
    }

    const fetchQuestions = async (signal) => {
        setLoading(true)
        try {
            const result = await fetch('https://opentdb.com/api.php?amount=5&type=multiple', signal ? { signal } : {})
            const data = await result.json()
            setQuestion(data)
            setAnswer(data.results.map((q, i) => ({ index: i, options: [decodeHtml(q.correct_answer), ...q.incorrect_answers.map(decodeHtml)].sort(() => Math.random() - 0.5) })))
            setSelectedAnswers({})
            setIsChecked(false)
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

    useEffect(() => {
        const controller = new AbortController()
        fetchQuestions(controller.signal)

        return () => controller.abort()
    }, [])

    useEffect(() => {
        if (!loading) return
        const anim = animate(spinnerRef.current, { rotate: 360 }, {
            duration: 1.5,
            repeat: Infinity,
            easing: 'linear'
        })
        return () => anim.cancel?.()
    }, [loading])

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
                                className={`answer-btn ${isSelected && 'selected'} ${isCorrect && checked && 'correct'} ${isWrong && checked && 'wrong'} `}
                                onClick={() => handleAnswerClick(option, index)}
                            >
                                {option}
                            </button>
                        )
                    })}
                </div>

            )
        })
    }, [selectedAnswers, checked, question, answer])

    function handleCheckAnswers() {
        if (checked) {
            fetchQuestions()
            return
        }
        setIsChecked(true)
    }
    return (
        <div className='quiz-game-page'>
            {loading ? <div ref={spinnerRef} className='spinner' style={{
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #293264',
                borderRadius: '50%'
            }} /> :
                <div className='quiz-game'>
                    {questionOptions}
                    <p className='score'> {checked && 'Your Score:'} {checked && Object.entries(selectedAnswers).reduce((score, [index, answer]) => {
                        return score + (answer === question.results[index].correct_answer ? 2 : 0)
                    }, 0)}{checked && '/10'} </p>
                    <button className='check-btn' onClick={handleCheckAnswers} >{checked ? "Play Again" : "Check Answers"}</button>
                </div>
            }
        </div>
    )
}