import React, { useState, useRef, useEffect } from "react";
import { Button, ConfigProvider, Modal } from "antd";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

const Inspiration = ({ items }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 耳朵参数
  const leftEarRef = useRef(null) as any;
  const rightEarRef = useRef(null) as any;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = (e: any) => {
    e.stopPropagation();
    setIsModalVisible(false);
  };

  const customTheme = {
    components: {
      Modal: {
        contentBg: "#fbf7f2",
        headerBg: "#fbf7f2",
        footerBg: "#fbf7f2",
      },
    },
  };

  useEffect(() => {
    const setEars = () => {
      if (leftEarRef.current) {
        const width = leftEarRef.current.offsetWidth;
        leftEarRef.current.style.height = `${(width * 31) / 34}px`;
      }

      if (rightEarRef.current) {
        const width = rightEarRef.current.offsetWidth;
        rightEarRef.current.style.height = `${(width * 6) / 5}px`;
      }
    };
    if (isModalVisible) {
      setTimeout(setEars, 0);

      window.addEventListener("resize", setEars);
      return () => {
        window.removeEventListener("resize", setEars);
      };
    }
  }, [isModalVisible]);

  return (
    <ConfigProvider theme={customTheme}>
      <div
        className={styles.inspiration}
        onClick={(e) => {
          e.stopPropagation(); // 阻止事件冒泡
        }}
      >
        <Button
          type="text"
          size="small"
          className={styles["inspiration-button"]}
          onClick={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
            showModal();
          }}
        >
          灵感
        </Button>
        <Modal
          title="灵感"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          cancelText="取消"
          okText="确定"
        >
          <div>
            <p>{items}</p>
            <div ref={leftEarRef} className={styles["left-ear"]} />
            <div ref={rightEarRef} className={styles["right-ear"]} />
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

Inspiration.propTypes = {
  items: PropTypes.shape({
    color: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }),
};

export default Inspiration;
