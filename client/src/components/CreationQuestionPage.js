import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import NotificationContext from '../NotificationContext';

const CreationQuestionPage = (props) => {
    const [openModal, setOpenModal] = useState(false);
    const { setNotification } = useContext(NotificationContext);

    const handleQuestionTextChange = (e) => {
        const { value } = e.target;

        props.setQuestions((prev) => {
            let tempArr = [...prev.arr];

            tempArr[prev.current] = {
                ...tempArr[prev.current],
                text: value
            };

            return ({
                arr: tempArr,
                current: prev.current
            });
        });
    };

    const handleAnswerChange = (e) => {
        const { value } = e.target;
        const index = parseInt(e.target.dataset.index, 10);

        props.setQuestions((prev) => {
            let tempArr = [...prev.arr];
            let tempAnswers = [...tempArr[prev.current].answers];

            tempAnswers[index] = value;

            tempArr[prev.current] = {
                ...tempArr[prev.current],
                answers: tempAnswers
            };

            return ({
                arr: tempArr,
                current: prev.current
            });
        });
    };

    const handleCorrectIndexChange = (e) => {
        const index = parseInt(e.target.dataset.answerIndex, 10);

        props.setQuestions((prev) => {
            let tempArr = [...prev.arr];

            tempArr[prev.current] = {
                ...tempArr[prev.current],
                correctIndex: index
            };

            return ({
                arr: tempArr,
                current: prev.current
            });
        });
    };

    const handleQuestionDelete = (e) => {
        if (props.questions.arr.length > 1) {
            setOpenModal(true);
        } else {
            setNotification({ body: 'Quizzes must contain at least one question' });
        }
    };

    const modalAcceptHandler = (e) => {
        setOpenModal(false);

        props.removeCurrentQuestion();
    };

    const modalDeclineHandler = (e) => {
        setOpenModal(false);
    };

    const questionListItems = [0, 1, 2, 3].map((index) => {
        const checkedStatus = props.questions.arr[props.questions.current].correctIndex === index;

        return (
            <div key={index} className="mb-3">
                <label htmlFor={'question' + index} className="form-label">
                    Answer {index + 1}:
                </label>
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        name="answerOption"
                        className="form-check-input"
                        id={'check' + index}
                        data-answer-index={index}
                        onChange={handleCorrectIndexChange}
                        checked={checkedStatus}
                    />
                    <label
                        htmlFor={'check' + index}
                        className="form-check-label"
                    >
                        {(checkedStatus) ? 'Correct' : 'Mark as correct'}
                    </label>
                </div>
                <textarea
                    id={'answer' + index}
                    className="form-control"
                    data-index={index}
                    rows="3"
                    value={props.questions.arr[props.questions.current].answers[index]}
                    onChange={handleAnswerChange}
                    required
                />
            </div>
        );
    });

    return (
        <div>
            {(openModal) && (
                <Modal
                    title={'Question deletion'}
                    body={'Are you sure you want to remove this question?'}
                    declineHandler={modalDeclineHandler}
                    acceptHandler={modalAcceptHandler}
                />
            )}
            <h3>Question {props.questions.current + 1}.</h3>
            <div className="mb-3">
                <label htmlFor="questionText" className="form-label">
                    Question text:
                </label>
                <textarea
                    id="questionText"
                    className="form-control"
                    rows="3"
                    value={props.questions.arr[props.questions.current].text}
                    onChange={handleQuestionTextChange}
                    required
                />
            </div>
            <div className="row row-cols-1 row-cols-lg-2">
                {questionListItems}
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-between my-3">
                <button
                    className="btn btn-primary rounded-pill px-4 py-2 mb-3 mb-md-0"
                    onClick={props.addQuestion}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add New Question
                </button>
                <button
                    className="btn btn-danger rounded-pill px-4 py-2 mb-3 mb-md-0"
                    onClick={handleQuestionDelete}
                >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete Current Question
                </button>
            </div>
        </div >
    );
};

export default CreationQuestionPage;