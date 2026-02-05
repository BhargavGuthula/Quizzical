import './App.css';
import { useState } from 'react';
export default function EntrancePage({clicked}) {
    
    return (
        <div className='entrance-page'>
            <section>
                <h1>Welcome to Quizical!</h1>
                <p>Test your knowledge with our
                    fun and interactive quiz game. Click the button below to get started!</p>
                <button className='start-btn' onClick={clicked}>Start Quiz</button>
            </section>

        </div>
    )
}