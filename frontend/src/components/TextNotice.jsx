import propTypes from "prop-types";
import { useState } from "react";

TextNotice.propTypes = {
  text: propTypes.string.isRequired,
  setIndex: propTypes.func.isRequired,
};

export default function TextNotice({ text, setIndex }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = () => {
    setIsOpen(false);
    setIndex(1);
  };
  return (
    <div id="textNoticeContainer">
      <dialog id="textNotice" open={isOpen}>
        <p>{text}</p>
        <button onClick={handleClick}>Close</button>
      </dialog>
    </div>
  );
}
