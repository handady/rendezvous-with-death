import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

const CircleContent = ({ items, radius, circleAngle = 0 }) => {
  const dotSize = 30;

  const calculateDotStyle = (index) => {
    const radian = ((index * 30 - 15) * Math.PI) / 180;
    const x = radius * Math.cos(radian) - (dotSize * 3) / 2;
    const y = radius * Math.sin(radian) - dotSize / 2;
    return {
      width: `${dotSize * 3}px`,
      height: `${dotSize}px`,
      transform: `translateX(${x}px) translateY(${y}px)`,
    };
  };

  return (
    <div className={styles["dot-container"]}>
      {items.map((item, index) => (
        <div
          key={index}
          className={styles.dot}
          style={calculateDotStyle(index)}
        >
          <div className={styles.content}>{item.content}</div>
          <div className={styles.time}>{item.time}</div>
        </div>
      ))}
    </div>
  );
};

CircleContent.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
  radius: PropTypes.number.isRequired,
  circleAngle: PropTypes.number,
};

export default CircleContent;
