import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

const ReturnButton = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.box}>
        <li>
          <Link to="/">
            <div>返回</div>
          </Link>
        </li>
      </div>
    </div>
  );
};

export default ReturnButton;
