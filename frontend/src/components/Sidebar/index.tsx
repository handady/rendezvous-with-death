import React from "react";
import styles from "./index.module.scss"; // 导入Sass文件
import PropTypes from "prop-types";

const Sidebar = ({ onAddCollection }) => {
  const addCollection = () => {
    if (onAddCollection) {
      onAddCollection();
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.box} onClick={addCollection}>
        <li>
          <div>添加</div>
        </li>
        <img src={require("../../assets/images/sidebar.png")} alt="" />
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onAddCollection: PropTypes.func,
};

export default Sidebar;
