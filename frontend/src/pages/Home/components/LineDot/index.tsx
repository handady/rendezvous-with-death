import React, { useEffect, useState, useRef } from "react";
import { Button, Tooltip } from "antd";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";
import styles from "./index.module.scss";
import Inspiration from "./inspiration";

const LineDots = ({
  items,
  dotSize = 10,
  topDistance = 100,
  dotSpacing = 50,
  onClickItem,
  onScrollDistance,
  handleEdit,
  loadData,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollStartY, setScrollStartY] = useState(0);
  const containerRef = useRef(null) as any;
  const isLoading = useRef(false);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartY(event.clientY);
    setScrollStartY(containerRef.current.scrollTop);
  };

  const handleMouseMove = (event) => {
    if (isDragging && !isLoading.current) {
      const deltaY = event.clientY - startY;
      containerRef.current.scrollTop = scrollStartY - deltaY;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScroll = () => {
    if (containerRef.current && !isLoading.current) {
      const currentScrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight;
      const clientHeight = containerRef.current.clientHeight;
      const distanceToBottom = scrollHeight - currentScrollTop - clientHeight;
      onScrollDistance(distanceToBottom);

      if (currentScrollTop <= 50) {
        isLoading.current = true;
        prependItems().then(() => {
          isLoading.current = false;
        });
      }
    }
  };

  const throttledHandleScroll = throttle(handleScroll, 20);

  const prependItems = async () => {
    const oldScrollTop = containerRef.current.scrollTop;
    const oldScrollHeight = containerRef.current.scrollHeight;
    await new Promise((resolve) => setTimeout(resolve, 0)); // 使用 timeout 模拟 nextTick
    containerRef.current.scrollTop =
      oldScrollTop + (containerRef.current.scrollHeight - oldScrollHeight);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", throttledHandleScroll);
      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", throttledHandleScroll);
        container.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [throttledHandleScroll]);

  useEffect(() => {
    if (items.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [items]);

  const handleClick = (item, index) => {
    onClickItem(item);
  };

  return (
    <div className={styles["line-dots"]}>
      <div
        className={styles["dot-container"]}
        style={{
          top: `${topDistance}px`,
          height: `calc(95% - ${topDistance}px)`,
        }}
        ref={containerRef}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.dot}
            style={{
              transform: `translateY(${index * (dotSize + dotSpacing)}px)`,
            }}
            onClick={() => handleClick(item, index)}
          >
            <div
              className={styles.left}
              style={{
                backgroundColor: item.color,
                width: `${dotSize}px`,
                height: `${dotSize}px`,
              }}
            ></div>
            <div
              className={`${styles.operationBasic} ${
                index % 2 === 0 ? styles.operation : styles.operationOdd
              }`}
            >
              <Button
                type="text"
                size="small"
                className={styles.edit}
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  handleEdit(item);
                }}
              >
                编辑
              </Button>
            </div>
            <div
              className={`${styles.operationBasic} ${
                index % 2 === 0 ? styles.inspiration : styles.inspirationOdd
              }`}
            >
              <Inspiration
                appointmentTheme={item.appointmentTheme}
                appointmentContent={item.appointmentContent}
                inspirationContent={item.inspirationContent}
                appointmentTime={item.time}
                loadData={loadData}
              />
            </div>
            <div className={index % 2 === 0 ? styles.right : styles.rightOdd}>
              <Tooltip title={item.appointmentContent} color="#f5347f">
                <div className={styles.content}>{item.title}</div>
                <div className={styles.time}>{item.time}</div>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

LineDots.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
  dotSize: PropTypes.number,
  topDistance: PropTypes.number,
  dotSpacing: PropTypes.number,
  onClickItem: PropTypes.func.isRequired,
  onScrollDistance: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  loadData: PropTypes.func.isRequired,
};

export default LineDots;
