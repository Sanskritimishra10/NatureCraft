import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="px-6 md:px-10 pt-5 bg-gray-50">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
      >
        <FaArrowLeft />
        Back
      </button>
    </div>
  );
}

export default BackButton;
