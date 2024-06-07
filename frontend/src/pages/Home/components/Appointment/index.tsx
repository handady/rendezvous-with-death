import React, { useEffect, useState } from "react";
import { message } from "antd";
import styles from "./index.module.scss"; // 导入Sass文件

const Appointment = () => {
  const appointment = () => {
    window.electronAPI.send("appointment");
    window.electronAPI.once("appointmentResponse", (response) => {
      if (response.error) {
        console.error(response.error);
        message.error(response.error);
        return;
      } else {
        message.success("成功");
      }
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.box} onClick={appointment}>
        <li>
          <div>测试</div>
        </li>
      </div>
    </div>
  );
};

export default Appointment;
