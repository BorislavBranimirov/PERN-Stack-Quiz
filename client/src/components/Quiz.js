import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import QuizResultsPage from './QuizResultsPage';
import QuestionPagination from './QuestionPagination';
import QuizStartPage from './QuizStartPage';
import QuizQuestion from './QuizQuestion';
import Modal from './Modal';
import NotificationContext from '../NotificationContext';

const Quiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [quizLoaded, setQuizLoaded] = useState(false);
  // track current page: 0 (home page), 1 (first question), etc
  const [currentPage, setCurrentPage] = useState(0);
  const [answerArr, setAnswerArr] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [resultQuiz, setResultQuiz] = useState(null);
  const progressWrapper = useRef(null);
  const { setNotification } = useContext(NotificationContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch('/api/quiz/' + id, {
          method: 'GET',
        });

        const resJSON = await res.json();
        if (resJSON.err) {
          return setNotification({ body: resJSON.err });
        }

        setQuiz(resJSON);
        // initialise user's answer array
        setAnswerArr(Array(resJSON.questions.length).fill(null));
        setQuizLoaded(true);
      } catch (err) {
        return setNotification({ body: 'Failed to load quiz' });
      }
    };

    fetchQuiz();
  }, [id, setNotification]);

  useEffect(() => {
    const handleArrowNavigation = (e) => {
      if (quiz) {
        switch (e.key) {
          case 'ArrowLeft':
            setCurrentPage((oldPage) => {
              return oldPage <= 1 ? oldPage : oldPage - 1;
            });
            break;
          case 'ArrowRight':
            setCurrentPage((oldPage) => {
              return oldPage >= quiz.questions.length ? oldPage : oldPage + 1;
            });
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleArrowNavigation);
    return () => {
      document.removeEventListener('keydown', handleArrowNavigation);
    };
  }, [quiz]);

  useEffect(() => {
    // scroll top to the progress bar when changing between questions
    // so the user is always at the beginning of the new question
    if (progressWrapper.current) {
      progressWrapper.current.scrollIntoView();
    }
  }, [currentPage]);

  const answerChangeHandler = (e) => {
    const answerId = parseInt(e.target.closest('.answer').dataset.answerId, 10);
    setAnswerArr((arr) => {
      let newArr = [...arr];
      newArr[currentPage - 1] = answerId;
      return newArr;
    });
  };

  const submitClickHandler = () => {
    if (answerArr.includes(null)) {
      return setNotification({
        body: 'You must complete all questions before submitting the quiz!',
      });
    }
    return setOpenModal(true);
  };

  const modalDeclineHandler = () => {
    setOpenModal(false);
  };

  const modalAcceptHandler = async () => {
    setOpenModal(false);

    try {
      const res = await fetch('/api/quiz/' + id + '/submit', {
        method: 'POST',
        body: JSON.stringify({
          answers: answerArr,
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      const resJSON = await res.json();
      if (resJSON.err) {
        return setNotification({ body: resJSON.err });
      }

      setResultQuiz(resJSON.quiz);
    } catch (err) {
      return setNotification({ body: 'Failed to submit quiz' });
    }
  };

  if (!quizLoaded || !quiz) {
    return (
      <div className="d-flex mt-5 mx-auto spinner-border">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  // if results are received after submitting quiz, render results page
  if (resultQuiz) {
    return <QuizResultsPage resultQuiz={resultQuiz} answerArr={answerArr} />;
  }

  let completedQuestions = 0;
  for (let i = 0; i < answerArr.length; i++) {
    if (answerArr[i] !== null) completedQuestions++;
  }

  return (
    <div className="container-fluid mt-3">
      {openModal && (
        <Modal
          title={'Quiz submission'}
          body={'Are you sure you want to submit the quiz?'}
          declineHandler={modalDeclineHandler}
          acceptHandler={modalAcceptHandler}
        />
      )}
      {currentPage === 0 ? (
        <React.Fragment>
          <p className="text-center d-none d-lg-block">
            Hint: You can navigate the questions using the <strong>left</strong>{' '}
            and <strong>right</strong> arrow keys.
          </p>
          <QuizStartPage quiz={quiz} setCurrentPage={setCurrentPage} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h1 className="text-center text-break">{quiz.title}</h1>
          <div className="pt-3 pb-2" ref={progressWrapper}>
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{
                  width: `${(100 * completedQuestions) / answerArr.length}%`,
                }}
              >
                {completedQuestions}/{answerArr.length}
              </div>
            </div>
          </div>
          <QuestionPagination
            answerArr={answerArr}
            currentQuestionNumber={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <QuizQuestion
            currentQuestionNumber={currentPage}
            questionCount={quiz.questions.length}
            question={quiz.questions[currentPage - 1]}
            currentAnswerId={answerArr[currentPage - 1]}
            setCurrentPage={setCurrentPage}
            answerChangeHandler={answerChangeHandler}
            submitClickHandler={submitClickHandler}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default Quiz;
