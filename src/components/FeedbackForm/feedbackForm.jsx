import React, { useState, useEffect } from "react";
import './feedbackForm.css';

function FeedbackForm() {
    const [showForm, setShowForm] = useState(true);
    const [answerFound, setAnswerFound] = useState('');
    const [ruleMatch, setRuleMatch] = useState('');
    const [suggestions, setSuggestions] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Handle the submission of the feedback
    };

    const handleOpenForm = () => {
        setShowForm(true);
      };
    
      const handleCloseForm = () => {
        setShowForm(false);
      };

    useEffect(() => {
        const handleClickOutsideForm = (event) => {
        if (event.target.className === "feedback-form-overlay") {
            setShowForm(false);
        }
        };

        window.addEventListener("click", handleClickOutsideForm);

        return () => {
        window.removeEventListener("click", handleClickOutsideForm);
        };
    }, []);

    return (
        <>
        <button className="open-form-btn" onClick={handleOpenForm}>Feedback</button>
        {
            showForm && (
                <div className="feedback-form-overlay">
                    <div className="feedback-form-container">
                        <span className="form-close" onClick={handleCloseForm}>
                                &times;
                        </span>
                        <h2 className='gradient-text'>Feedback</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="feedback-question">
                                <p>Câu trả lời tìm được có đúng với điều bạn cần tìm ?</p>
                                <label>
                                <input
                                    type="radio"
                                    name="answer-found"
                                    value="Absolutely correct"
                                    checked={answerFound === 'Absolutely correct'}
                                    onChange={(e) => setAnswerFound(e.target.value)}
                                />
                                Đúng hoàn toàn
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    name="answer-found"
                                    value="Partly correct"
                                    checked={answerFound === 'Partly correct'}
                                    onChange={(e) => setAnswerFound(e.target.value)}
                                />
                                Đúng một phần
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    name="answer-found"
                                    value="There is an answer in the rules, but I can't answer it yet"
                                    checked={answerFound === 'There is an answer in the rules, but I can\'t answer it yet'}
                                    onChange={(e) => setAnswerFound(e.target.value)}
                                />
                                Có câu trả lời trong quy định tìm được nhưng chưa trả lời được
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    name="answer-found"
                                    value="Irrelevant"
                                    checked={answerFound === 'Irrelevant'}
                                    onChange={(e) => setAnswerFound(e.target.value)}
                                />
                                Không liên quan
                                </label>
                            </div>
                            <div className="feedback-question">
                                <p>Đoạn quy định tìm được có ứng với điều bạn cần ?</p>
                                <label>
                                <input
                                    type="radio"
                                    name="rule-match"
                                    value="True to the top 1"
                                    checked={ruleMatch === 'True to the top 1'}
                                    onChange={(e) => setRuleMatch(e.target.value)}
                                />
                                Đúng với top 1
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    name="rule-match"
                                    value="True to the top 2"
                                    checked={ruleMatch === 'True to the top 2'}
                                    onChange={(e) => setRuleMatch(e.target.value)}
                                />
                                Đúng với top 2
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    name="rule-match"
                                    value="True to the top 3"
                                    checked={ruleMatch === 'True to the top 3'}
                                    onChange={(e) => setRuleMatch(e.target.value)}
                                />
                                Đúng với top 3
                                </label>
                                <label>
                                <input
                                    type="radio"
                                    name="rule-match"
                                    value="Not found yet"
                                    checked={ruleMatch === 'Not found yet'}
                                    onChange={(e) => setRuleMatch(e.target.value)}
                                />
                                Chưa tìm được
                                </label>
                            </div>
                            <div className="feedback-question">
                                <p>Bạn có góp ý gì thêm với hệ thống không ?</p>
                                <textarea
                                value={suggestions}
                                onChange={(e) => setSuggestions(e.target.value)}
                                />
                            </div>
                            <button type="submit" className='btn'>Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default FeedbackForm;
