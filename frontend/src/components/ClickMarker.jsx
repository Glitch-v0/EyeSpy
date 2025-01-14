import PropTypes from "prop-types";

export default function ClickMarker({ coordinates }) {
  return (
    <div
      className="clickMarker"
      style={{ position: "absolute", left: coordinates.x, top: coordinates.y }}
    />
  );
}

ClickMarker.propTypes = {
  coordinates: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};
