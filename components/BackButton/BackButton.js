import React from "react";

const BackButton = () => {
  function goBack() {
    history.back();
  }

  return (
    <div onClick={goBack} className="floating-back-button">
      <i className="fa fa-arrow-left" aria-hidden="true">
        {" "}
        Back{" "}
      </i>
    </div>
  );
};

export default BackButton;
