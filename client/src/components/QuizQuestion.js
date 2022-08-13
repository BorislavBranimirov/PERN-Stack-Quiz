import React, { useLayoutEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const QuizQuestion = (props) => {
  const [answerId, setAnswerId] = useState(null);
  const question = props.question;

  useLayoutEffect(() => {
    setAnswerId(props.currentAnswerId);
  }, [props.currentAnswerId]);

  const answerListItems = question.answers.map((answer) => {
    return (
      <div key={answer.id} className="col">
        <div
          className="answer card border-secondary p-3 h-100"
          data-answer-id={answer.id}
          onClick={props.answerChangeHandler}
        >
          <div className="form-check d-flex align-items-center my-auto">
            <input
              type="radio"
              name="answerOption"
              className="form-check-input me-2 my-auto flex-shrink-0"
              id={'check' + answer['pos_num']}
              onChange={() => {
                setAnswerId(answer.id);
              }}
              checked={answerId === answer.id}
            />
            <label
              htmlFor={'check' + answer['pos_num']}
              className="form-check-label text-break text-preline"
              style={{ minWidth: 0 }}
            >
              {answer.text}
            </label>
          </div>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div>
        <h3 className="text-break text-preline">
          <span className="fw-bold">{props.currentQuestionNumber}. </span>
          {question.text}
        </h3>
        {question.reports > 0 && (
          <div className="d-flex align-items-center justify-content-center mb-3">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              size="2x"
              className="me-2 text-danger"
            />
            <span>
              This question has been flagged as incorrect by some users
            </span>
          </div>
        )}
        <div className="row row-cols-1 row-cols-lg-2 g-3">
          {answerListItems}
        </div>
      </div>
      <div className="d-flex justify-content-between my-3">
        <button
          onClick={() => props.setCurrentPage((value) => value - 1)}
          className="btn btn-primary px-4 rounded-pill"
          disabled={props.currentQuestionNumber === 1}
        >
          Prev
        </button>
        {props.currentQuestionNumber === props.questionCount ? (
          <button
            onClick={props.submitClickHandler}
            className="btn btn-danger rounded-pill px-4"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => props.setCurrentPage((value) => value + 1)}
            className="btn btn-primary px-4 rounded-pill"
          >
            Next
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default QuizQuestion;
