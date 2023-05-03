import React, { useState, useEffect } from "react";
import "./modal.css";

function Modal(props) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (event.target.className === "modal") {
        setShowModal(false);
      }
    };

    window.addEventListener("click", handleClickOutsideModal);

    return () => {
      window.removeEventListener("click", handleClickOutsideModal);
    };
  }, []);

  return (
    <>
      <button className="modal-btn" onClick={handleOpenModal}>Xem chi tiết</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content-outer">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <div dangerouslySetInnerHTML={{ __html: props.content}}></div>
            </div>
          </div>
          
        </div>
      )}
    </>
  );
}

export default Modal;