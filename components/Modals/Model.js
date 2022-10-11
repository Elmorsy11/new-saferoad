import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";

const Model = ({
  header,
  onHide,
  onUpdate,
  children,
  show,
  disabled,
  updateButton,
  footer = true,
}) => {
  const darkMode = useSelector((state) => state.config.darkMode);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={`modal${darkMode ? "-dark" : ""}`}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer && (
        <Modal.Footer>
          <Button disabled={disabled} className="p-2" onClick={onUpdate}>
            {updateButton}
          </Button>
          <Button className="p-2" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default Model;
