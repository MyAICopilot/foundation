import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

function Navbar({
  handleLearn,
  handleQuiz,
  handleApply,
  mode,
  loading,
  isWaitingForResponse,
}) {
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState({
    name: "",
    background: "",
    objectives: "",
    other: "",

    // etc...
  });
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // handleAccount(settings);
    handleCloseModal();
  };

  const handleLinkClick = (e, handler) => {
    e.preventDefault();
    if (!loading) handler();
  };

  return (
    <>
      <nav className="navbar">
        <a
          href="#"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            handleOpenModal();
          }}
        >
          Help
        </a>

        <a
          href="#"
          className={`nav-item ${mode === "Learn" ? "active" : ""} ${
            isWaitingForResponse ? "link-disabled" : ""
          }`}
          onClick={(e) => handleLinkClick(e, handleLearn)}
        >
          Learn Frameworks
        </a>
        {/* <a
          href="#"
          className={`nav-item ${mode === "Quiz" ? "active" : ""} ${
            isWaitingForResponse ? "link-disabled" : ""
          }`}
          onClick={(e) => handleLinkClick(e, handleQuiz)}
        >
          Quiz
        </a> */}

        <a
          href="#"
          className={`nav-item ${mode === "Apply" ? "active" : ""} ${
            isWaitingForResponse ? "link-disabled" : ""
          }`}
          onClick={(e) => handleLinkClick(e, handleApply)}
        >
          Apply Frameworks
        </a>

        <a
          href="#"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            handleOpenModal();
          }}
        >
          Account
        </a>
      </nav>
      <Modal
        className="account-modal"
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title>Work in progress...</Modal.Title>
          </div>{" "}
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Navbar;
