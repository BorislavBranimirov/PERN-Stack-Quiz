import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faMinusCircle,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import NotificationContext from '../NotificationContext';

const QuizResultsPage = (props) => {
  const quiz = props.resultQuiz;
  const { answerArr } = props;
  const [openModal, setOpenModal] = useState(false);
  // keep track of which ids were already reported
  const [reportedQuestionIds, setReportedQuestionIds] = useState({});
  const questionIdToReport = useRef(null);
  const { setNotification } = useContext(NotificationContext);

  useEffect(() => {
    // scroll to top on first page render
    // to reset scroll if last question page was longer than screen height
    window.scrollTo(0, 0);
  }, []);

  const reportQuestion = async () => {
    const questionId = questionIdToReport.current;
    questionIdToReport.current = null;

    try {
      const res = await fetch(
        '/api/quiz/' + quiz.id + '/report/' + questionId,
        {
          method: 'POST',
        }
      );

      const resJSON = await res.json();
      if (resJSON.err) {
        return setNotification({ body: resJSON.err });
      }

      setReportedQuestionIds((idMap) => {
        let newMap = { ...idMap };
        newMap[questionId] = true;
        return newMap;
      });
      return setNotification({ body: 'Question successfully reported' });
    } catch (err) {
      return setNotification({ body: 'Failed to report quiz question' });
    }
  };

  const handleReportClick = (e) => {
    questionIdToReport.current = parseInt(e.target.dataset.id, 10);
    setOpenModal(true);
  };

  const modalAcceptHandler = () => {
    setOpenModal(false);

    reportQuestion();
  };

  const modalDeclineHandler = () => {
    setOpenModal(false);
  };

  const questions = useMemo(() => {
    return quiz.questions.map((question, index) => {
      const questionAnswers = question.answers.map((answer) => {
        const percentOfTotal = (
          (100 * answer.times_picked) /
          quiz.times_finished
        ).toFixed(1);

        let answerColor = 'border-secondary answer-default';
        let progressColor = 'bg-secondary';
        let resultIcon = (
          <FontAwesomeIcon
            icon={faMinusCircle}
            size="2x"
            className="me-2 text-secondary"
          />
        );
        if (answer.is_correct) {
          answerColor = 'border-success answer-correct';
          progressColor = 'bg-success';
          resultIcon = (
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="2x"
              className="me-2 text-success"
            />
          );
        }
        if (answerArr[index] === answer.id && !answer.is_correct) {
          answerColor = 'border-danger answer-wrong';
          progressColor = 'bg-danger';
          resultIcon = (
            <FontAwesomeIcon
              icon={faTimesCircle}
              size="2x"
              className="me-2 text-danger"
            />
          );
        }

        return (
          <div
            key={answer.id}
            className={`card p-3 my-3 ${answerColor} rounded-2`}
            style={{ borderWidth: '0.2em' }}
          >
            <div className="d-flex align-items-center">
              <small className="text-center me-2" style={{ width: '3.5em' }}>
                {percentOfTotal}%
              </small>
              <div className="progress w-100">
                <div
                  className={`progress-bar ${progressColor} progress-bar-striped`}
                  style={{ width: `${percentOfTotal}%` }}
                ></div>
              </div>
            </div>
            <div className="d-flex align-items-center mt-3">
              {resultIcon}
              <h5 className="m-0 text-break text-preline">
                {answerArr[index] === answer.id && (
                  <span className="fw-bold">You answered: </span>
                )}
                {answer.text}
              </h5>
            </div>
          </div>
        );
      });

      return (
        <div key={question.id} className="my-4">
          <h3 className="text-break text-preline">
            <span className="fw-bold">{question.pos_num}. </span>
            {question.text}
          </h3>
          <div className="d-flex justify-content-end">
            <button
              onClick={handleReportClick}
              data-id={question.id}
              className="btn btn-primary rounded-pill px-4 py-2"
              disabled={reportedQuestionIds[question.id]}
            >
              <FontAwesomeIcon icon={faFlag} className="me-2" />
              Flag Question As Incorrect
            </button>
          </div>
          {questionAnswers}
        </div>
      );
    });
  }, [answerArr, quiz, reportedQuestionIds]);

  return (
    <div className="mx-auto mt-3 col-10 col-lg-9">
      {openModal && (
        <Modal
          title={'Question report'}
          body={'Are you sure you want to report this question?'}
          declineHandler={modalDeclineHandler}
          acceptHandler={modalAcceptHandler}
        />
      )}
      <header className="text-center">
        <h1 className="text-break">{quiz.title}</h1>
        <h3>Results</h3>
        <small>
          *% shows how many times an answer was picked compared to all answers
          to the question
        </small>
      </header>
      <div className="my-4">{questions}</div>
      <div className="d-flex justify-content-end">
        <Link to={'/'} className="btn btn-primary rounded-pill px-5 mb-3">
          To Home Page
        </Link>
      </div>
    </div>
  );
};

export default QuizResultsPage;
