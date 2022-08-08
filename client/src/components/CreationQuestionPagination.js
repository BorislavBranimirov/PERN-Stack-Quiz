import React, { useRef, useMemo } from 'react';

// checks if all information in a question is filled in and submittion-ready
const isQuestionFilled = (question) => {
    if ((!question.text) ||
        (!question.answers || question.answers.length === 0) ||
        (typeof question.correctIndex !== 'number')) {
        return false;
    }
    for (let i = 0; i < question.answers.length; i++) {
        if (!question.answers[i])
            return false;
    }

    return true;
};

const CreationQuestionPagination = (props) => {
    const paginationWrapper = useRef(null);

    // every time the user moves to a different questions or adds/deletes a questions, perform validation
    const pageBtns = useMemo(() => {
        return props.questions.arr.map((question, index) => {
            let bgColor = 'secondary';
            if (isQuestionFilled(question))
                bgColor = 'primary';
            if (props.questions.current === index)
                bgColor = 'danger';

            return (
                <button
                    key={index}
                    onClick={() => props.setCurrentQuestion(index)}
                    className={`btn btn-${bgColor} btn-sm m-2 rounded-2`}
                    style={{
                        width: '3em',
                        height: '2.5em'
                    }}
                >
                    {index + 1}
                </button>
            );
        })
    }, [props.questions.current, props.questions.arr.length]);

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