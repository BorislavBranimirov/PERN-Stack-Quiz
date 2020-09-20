import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import CreationStartPage from './CreationStartPage';
import CreationQuestionPage from './CreationQuestionPage';
import CreationQuestionPagination from './CreationQuestionPagination';
import Modal from './Modal';
import NotificationContext from '../NotificationContext';

// template for an empty question
const emptyQuestion = {
    text: '',
    answers: ['', '', '', ''],
    correctIndex: 0
};

const CreationPage = (props) => {
    const [quizInfo, setQuizInfo] = useState({
        title: '',
        description: '',
        image: {}
    });
    const [questions, setQuestions] = useState({
        arr: [emptyQuestion],
        current: 0
    });
    const [displayQuizInfo, setDisplayQuizInfo] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const { setNotification } = useContext(NotificationContext);
    const history = useHistory();

    useEffect(() => {
        const handleArrowNavigation = (e) => {
            // only allow navigation if user is not in a textarea or text input field
            const tagName = e.target.tagName;
            const tagType = e.target.type;
            if (tagName === 'TEXTAREA' || (tagName === 'INPUT' && tagType === 'text')) {
                return;
            }

            switch (e.key) {
                case "ArrowLeft":
                    // if on question page, move to previous question
                    if (displayQuizInfo) {
                        return;
                    }

                    setQuestions((prev) => ({
                        arr: prev.arr,
                        current: (prev.current <= 0) ? prev.current : prev.current - 1
                    }));
                    break;
                case "ArrowRight":
                    // if on question page, move to next question
                    if (displayQuizInfo) {
                        return;
                    }

                    setQuestions((prev) => ({
                        arr: prev.arr,
                        current: (prev.current >= prev.arr.length - 1) ? prev.current : prev.current + 1
                    }));
                    break;
                case "ArrowUp":
                case "ArrowDown":
                    // switch between quiz info and question pages
                    setDisplayQuizInfo((status) => !status);
                    break;
            }
        };

        document.addEventListener('keydown', handleArrowNavigation);
        return () => {
            document.removeEventListener('keydown', handleArrowNavigation);
        };
    }, [questions.current, questions.arr.length, displayQuizInfo]);

    // reset scroll to top of page whenever the user creates or deletes a question
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [questions.arr.length]);

    const submitQuiz = async () => {
        // construct the quiz object that gets send to the back end
        let quiz = {};

        if (!quizInfo.title) {
            return setNotification({ body: 'No quiz title was provided' });
        }
        quiz.title = quizInfo.title;

        if (quizInfo.description) {
            quiz.description = quizInfo.description;
        }

        quiz.questions = [];
        for (let i = 0; i < questions.arr.length; i++) {
            const question = questions.arr[i];

            if (!question.text) {
                return setNotification({ body: `No question body was provided for Question ${i + 1}` });
            }
            if (!question.answers) {
                return setNotification({ body: `No answer array was provided for Question ${i + 1}` });
            }

            if (typeof question.correctIndex !== 'number') {
                return setNotification({ body: `No correct answer was provided for Question ${i + 1}` });
            }

            quiz.questions.push({
                text: question.text,
                answers: []
            });

            for (let j = 0; j < question.answers.length; j++) {
                const answer = question.answers[j];

                if (!answer) {
                    return setNotification({
                        body: `No text was provided for Question ${i + 1}, Answer ${j + 1}`
                    });
                }

                quiz.questions[i].answers.push({
                    text: answer,
                    is_correct: (question.correctIndex === j) ? true : false
                });
            }
        }

        try {
            // save image to server if provided
            if (quizInfo.image instanceof File) {
                let formData = new FormData();
                formData.append('image', quizInfo.image);

                const resImg = await fetch('/api/media', {
                    method: 'POST',
                    body: formData
                });

                const resImgJSON = await resImg.json();
                // check if an error was returned
                if (resImgJSON.err) {
                    return setNotification({ body: resImgJSON.err });
                }

                // append image to the quiz object
                quiz.image = resImgJSON.name;
            }

            const res = await fetch('/api/quiz', {
                method: 'POST',
                body: JSON.stringify({
                    quiz: quiz
                }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            });

            const resJSON = await res.json();
            // check if an error was returned
            if (resJSON.err) {
                return setNotification({ body: resJSON.err });
            }

            history.push('/quiz/' + resJSON.id);
        } catch (err) {
            return setNotification({ body: 'Failed to create quiz' });
        }
    };

    const setCurrentQuestion = (newQuestionIndex) => {
        if (newQuestionIndex < 0 || newQuestionIndex >= questions.arr.length) {
            return;
        }
        setQuestions((prev) => ({
            arr: prev.arr,
            current: newQuestionIndex
        }));
    };

    const addQuestion = () => {
        // add a new question and redirect to it
        setQuestions((prev) => ({
            arr: [...prev.arr, emptyQuestion],
            current: prev.arr.length
        }));
    };

    const removeCurrentQuestion = () => {
        if (questions.arr.length <= 1) {
            setNotification({ body: 'Quizzes must contain at least one question' });
        }

        // if current question is the last question, redirect to the one before it
        setQuestions((prev) => ({
            arr: prev.arr.filter((question, index) => prev.current !== index),
            current: (prev.current === prev.arr.length - 1) ? prev.current - 1 : prev.current
        }));
    };

    const handleSubmitClick = (e) => {
        setOpenModal(true);
    };

    const modalAcceptHandler = (e) => {
        setOpenModal(false);

        submitQuiz();
    };

    const modalDeclineHandler = (e) => {
        setOpenModal(false);
    };

    return (
        <div className="mx-auto mt-3 col-10 col-lg-9">
            {(openModal) && (
                <Modal
                    title={'Quiz submission'}
                    body={'Are you sure you want to submit this quiz?'}
                    declineHandler={modalDeclineHandler}
                    acceptHandler={modalAcceptHandler}
                />
            )}
            <h2 className="text-center">Creating new quiz</h2>
            <nav className="d-flex flex-column flex-md-row justify-content-between my-3">
                <button className="btn btn-primary rounded-pill px-4 mb-3 mb-md-0" onClick={handleSubmitClick}>
                    Submit Quiz
                </button>
                <button
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={() => setDisplayQuizInfo((status) => !status)}
                >
                    {(displayQuizInfo) ? 'Go To Questions' : 'Return To Quiz Info'}
                </button>
            </nav>
            <div style={{ display: (displayQuizInfo) ? 'block' : 'none' }}>
                <p className="text-center d-none d-lg-block">
                    Hint: You can navigate the questions using
                    the <strong>left</strong> and <strong>right</strong> arrow keys
                    and switch between the quiz info and question pages using
                    the <strong>up</strong> and <strong>down</strong> arrow keys.
                </p>
                <CreationStartPage quizInfo={quizInfo} setQuizInfo={setQuizInfo} />
            </div>
            <div style={{ display: (displayQuizInfo) ? 'none' : 'block' }}>
                <CreationQuestionPagination
                    setCurrentQuestion={setCurrentQuestion}
                    questions={questions}
                />
                <CreationQuestionPage
                    questions={questions}
                    setQuestions={setQuestions}
                    addQuestion={addQuestion}
                    removeCurrentQuestion={removeCurrentQuestion}
                />
            </div>
        </div>
    );
};

export default CreationPage;