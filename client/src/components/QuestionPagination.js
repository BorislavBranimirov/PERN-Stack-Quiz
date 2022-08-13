import React, { useRef } from 'react';

const QuestionPagination = (props) => {
  const paginationWrapper = useRef(null);

  const answers = props.answerArr.map((answer, index) => {
    let bgColor = 'secondary';
    if (answer) bgColor = 'primary';
    if (props.currentQuestionNumber === index + 1) bgColor = 'danger';

    return (
      <button
        key={index}
        onClick={() => props.setCurrentPage(index + 1)}
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
        className="btn btn-primary w-100 d-lg-none my-2"
      >
        Toggle Quiz Navigation
      </button>
      <div ref={paginationWrapper} className="d-none d-lg-block">
        <div className="d-flex flex-wrap justify-content-center">{answers}</div>
      </div>
    </React.Fragment>
  );
};

export default QuestionPagination;
