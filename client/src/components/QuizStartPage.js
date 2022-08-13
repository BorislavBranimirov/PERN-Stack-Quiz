import React from 'react';

const QuizStartPage = (props) => {
  const quiz = props.quiz;
  const imageURL =
    `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/` +
    quiz.image;

  return (
    <div className="quiz-start-page card">
      <img
        src={quiz.image ? imageURL : '/imgplaceholder.png'}
        alt="quiz"
        className="card-img-top"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/imgplaceholder.png';
        }}
      />
      <div className="card-body">
        <h1 className="card-title">{quiz.title}</h1>
        <p className="card-text text-preline">{quiz.description}</p>
        <div className="text-end">
          <button
            onClick={() => props.setCurrentPage((value) => value + 1)}
            className="btn btn-primary px-5 rounded-pill"
          >
            Start
          </button>
        </div>
      </div>
      <div className="card-footer text-muted text-center">
        Taken {quiz['times_finished']}{' '}
        {quiz['times_finished'] === 1 ? 'time' : 'times'}
      </div>
    </div>
  );
};

export default QuizStartPage;
