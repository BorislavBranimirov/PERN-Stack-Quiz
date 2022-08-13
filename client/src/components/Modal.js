import React, { useEffect, useRef } from 'react';

const Modal = (props) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // close modal if user clicks outside of it
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        return props.declineHandler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, props]);

  return (
    <React.Fragment>
      <div className="modal fade show d-block">
        <div className="modal-dialog">
          <div ref={modalRef} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <button
                onClick={props.declineHandler}
                className="btn-close"
              ></button>
            </div>
            <div className="modal-body">{props.body}</div>
            <div className="modal-footer">
              <button
                onClick={props.declineHandler}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                onClick={props.acceptHandler}
                className="btn btn-primary"
                autoFocus
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </React.Fragment>
  );
};

export default Modal;
