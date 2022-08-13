import React, { useState, useEffect } from 'react';

const CreationStartPage = (props) => {
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    // on unmount or image change, remove old object url from memory
    return () => {
      if (previewImg) {
        URL.revokeObjectURL(previewImg);
      }
    };
  }, [previewImg]);

  const handleFileChange = (e) => {
    const { files } = e.target;

    // https://bugs.chromium.org/p/chromium/issues/detail?id=2508
    // some versions of chrome remove the selected file if window is cancelled
    // ignore this behaviour to be consistent with other browsers and versions
    if (files.length === 0) {
      return;
    }

    setPreviewImg(URL.createObjectURL(files[0]));

    props.setQuizInfo((prev) => ({
      ...prev,
      image: files[0],
    }));
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-center">
      <div className="flex-fill me-md-5">
        <h3>Quiz info:</h3>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={props.quizInfo.title}
            onChange={(e) => {
              const value = e.target.value;
              props.setQuizInfo((prev) => ({
                ...prev,
                title: value,
              }));
            }}
            maxLength="150"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description (optional):
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="3"
            value={props.quizInfo.description}
            onChange={(e) => {
              const value = e.target.value;
              props.setQuizInfo((prev) => ({
                ...prev,
                description: value,
              }));
            }}
            maxLength="200"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Quiz image (optional):
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-control"
            onChange={handleFileChange}
            accept=".png, .jpg, .jpeg"
          />
          <small className="d-block text-muted mt-2">
            Supported formats: PNG, JPEG
          </small>
        </div>
      </div>

      <div className="col-12 col-md-6 col-xl-4 col-xxl-3">
        <h3>Preview:</h3>
        <div className="mb-3">
          <div className="card h-100">
            <img
              src={previewImg || '/imgplaceholder.png'}
              className="card-img-top"
              alt="quiz"
            />
            <div className="card-body">
              <h4 className="card-title">{props.quizInfo.title}</h4>
              {props.quizInfo.description && (
                <p className="card-text text-preline mb-1">
                  {props.quizInfo.description}
                </p>
              )}
              <small className="d-block text-muted mb-2">Taken 0 times</small>
              <div className="btn btn-primary rounded-pill px-5 disabled">
                Open
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationStartPage;
