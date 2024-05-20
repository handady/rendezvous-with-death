import React from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

const CircleDot = ({ items, radius, dotSize = 10, circleAngle = 0 }) => {
  const calculateDotStyle = (item, index) => {
    const radian = ((circleAngle + index * 30) * Math.PI) / 180;
    const x = radius * Math.cos(radian) - dotSize / 2;
    const y = radius * Math.sin(radian) - dotSize / 2;
    return {
      backgroundColor: item.color,
      width: `${dotSize}px`,
      height: `${dotSize}px`,
      transform: `translate(${x}px, ${y}px)`,
    };
  };

  return (
    <div className={styles['dot-container']}>
      {items.map((item, index) => (
        <div
          key={index}
          className={styles.dot}
          style={calculateDotStyle(item, index)}
        ></div>
      ))}
    </div>
  );
};

CircleDot.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  radius: PropTypes.number.isRequired,
  dotSize: PropTypes.number,
  circleAngle: PropTypes.number,
};

export default CircleDot;
