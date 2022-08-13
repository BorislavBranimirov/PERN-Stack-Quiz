import React, { useRef, useEffect, useState } from 'react';

// checks if all information in a question is filled in and submittion-ready
const isQuestionFilled = (question) => {
  if (
    !question.text ||
    !question.answers ||
    question.answers.length === 0 ||
    typeof question.answerIndex !== 'number'
  ) {
    return false;
  }

  for (let i = 0; i < question.answers.length; i++) {
    if (!question.answers[i]) return false;
  }

  return true;
};

const CreationQuestionPagination = (props) => {
  const [questionsFilled, setQuestionsFilled] = useState([false]);
  const paginationWrapper = useRef(null);
  const currentQuestion = useRef();
  const questionCount = useRef();

  useEffect(() => {
    // perform validation every time the user moves to a different question
    // (includes changes to the number of questions since deleting non-last
    // question (changes question count and) keeps currentQuestion the same
    // but now it refers to question that followed after the deleted one)
    if (
      currentQuestion.current !== props.questions.currentQuestion ||
      questionCount.current !== props.questions.arr.length
    ) {
      setQuestionsFilled(
        props.questions.arr.map((question) => {
          return isQuestionFilled(question);
        })
      );
      currentQuestion.current = props.questions.currentQuestion;
      questionCount.current = props.questions.arr.length;
    }
  }, [props]);

  const pageBtns = props.questions.arr.map((question, index) => {
    let bgColor = 'secondary';
    if (questionsFilled[index]) bgColor = 'primary';
    if (props.questions.currentQuestion === index) bgColor = 'danger';

    return (
      <button
        key={index}
        onClick={() => props.setCurrentQuestion(index)}
        className={`btn btn-${bgColor} btn-sm m-2 rounded-2`}
        style={{
          width: '3em',
          height: '2.5em',
        }}
      >
        {index + 1}
      </button>
    );
  });

  return (
    <React.Fragment>
      <button
        onClick={() => paginationWrapper.current.classList.toggle('d-none')}
        className="btn btn-primary w-100 d-lg-none rounded-pill px-4 mb-2"
      >
        Toggle Quiz Navigation
      </button>
      <div ref={paginationWrapper} className="d-lg-block">
        <div className="d-flex flex-wrap justify-content-center">
          {pageBtns}
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreationQuestionPagination;
