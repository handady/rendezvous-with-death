import React, { useState, useRef, useEffect } from "react";
import { Button, ConfigProvider, Modal, Tag, Tooltip } from "antd";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import { splitTheme, randomColor } from "../../../../../utils/functions";

const Inspiration = ({ appointmentContent, appointmentTheme }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [theme, setTheme] = useState([]) as any;
  const [themeColor, setThemeColor] = useState([]) as any;
  const [selectedTags, setSelectedTags] = useState([]) as any;
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

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter((selectedTag) => selectedTag !== tag);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
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

  useEffect(() => {
    if (appointmentTheme) {
      const result = splitTheme(appointmentTheme);
      setTheme(result);
      const colorArray = [] as any;
      for (let i = 0; i < result.length; i++) {
        colorArray.push(randomColor());
      }
      setThemeColor(colorArray);
    }
  }, [appointmentTheme]);

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
            <div className={styles["inspiration-content"]}>
              {theme.map((item, index) => (
                <Tooltip key={index} title={item}>
                  <Tag
                    className={`${styles.tag} ${
                      selectedTags.includes(item) ? styles.selected : ""
                    }`}
                    bordered={false}
                    color={themeColor[index]}
                    onClick={() => handleTagClick(item)}
                  >
                    {item}
                  </Tag>
                </Tooltip>
              ))}
            </div>
            <div ref={leftEarRef} className={styles["left-ear"]} />
            <div ref={rightEarRef} className={styles["right-ear"]} />
            <div className={styles["selected-tags"]}>
              {selectedTags.map((tag, index) => (
                <Tag key={index} color="pink">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

Inspiration.propTypes = {
  appointmentContent: PropTypes.string,
  appointmentTheme: PropTypes.string,
};

export default Inspiration;
