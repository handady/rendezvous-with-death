import React, { useEffect, useState, useRef, useCallback } from "react";
import CircleDots from "./components/CircleDot/index.tsx";
import CircleContent from "./components/CircleContent/index.tsx";
import LineDots from "./components/LineDot/index.tsx";
import ExcalidrawComponent from "../../components/ExcalidrawComponent/index.tsx";
// import Sider from "./components/common/sider";
// import Add from "./components/common/add";
import styles from "./index.module.scss";

const Home = () => {
  const [items, setItems] = useState([
    { color: "rgba(255,105,180)", time: "2019-11-01", content: "content1" },
    { color: "green", time: "2019-11-02", content: "content2" },
    { color: "blue", time: "2019-11-03", content: "content3" },
    { color: "red", time: "2019-11-04", content: "content4" },
    { color: "green", time: "2019-11-05", content: "content5" },
    { color: "blue", time: "2019-11-06", content: "content6" },
    { color: "red", time: "2019-11-07", content: "content7" },
    { color: "green", time: "2019-11-08", content: "content8" },
    { color: "blue", time: "2019-11-09", content: "content9" },
    { color: "red", time: "2019-11-10", content: "content10" },
    { color: "green", time: "2019-11-11", content: "content11" },
    { color: "blue", time: "2019-11-12", content: "content12" },
  ]);

  const [lineItems, setLineItems] = useState([]) as any;
  const [currentItem, setCurrentItem] = useState({});
  const [dotDiameter, setDotDiameter] = useState(240);
  const [contentDiameter, setContentDiameter] = useState(330);
  const [dotSize, setDotSize] = useState(12);
  const [topDistance, setTopDistance] = useState(70);
  const [circleAngle, setCircleAngle] = useState(0);
  const [dotSpacing, setDotSpacing] = useState(50);
  const [excalidrawDialogVisible, setexcalidrawDialogVisible] = useState(false);

  const dotRadius = dotDiameter / 2;
  const contentRadius = contentDiameter / 2;
  const degreesPerPixel = 30 / (dotSize + dotSpacing);

  const updateItems = (item) => {
    console.log("updateItems", item);
  };

  const handleScrollDistance = (distance) => {
    const angle = distance * degreesPerPixel;
    setCircleAngle(angle);
  };

  const addCollection = () => {
    console.log("addCollection");
    setexcalidrawDialogVisible(true);
  };

  const closeDialog = () => {
    setexcalidrawDialogVisible(false);
  };

  const addCardSuccess = () => {
    console.log("addCardSuccess");
  };

  const handleClickItem = (item) => {
    setCurrentItem(item);
    addCollection();
  };

  const loadData = useCallback(() => {
    setTimeout(() => {
      setLineItems([
        {
          color: "rgba(255,105,180)",
          title: "测试标题1",
          time: "2020-01-02 00:00:00",
        },
        {
          color: "green",
          title: "测试标题2",
          time: "2020-01-03 00:00:00",
        },
      ]);
    }, 1000);
  }, []);

  useEffect(() => {
    loadData();
    return () => {
      // Cleanup if needed
    };
  }, [loadData]);

  return (
    <div id="index" className={styles.index}>
      <div
        className={styles["center-line"]}
        style={{
          top: `${topDistance}px`,
          height: `calc(100% - ${topDistance}px)`,
        }}
      ></div>
      <div
        className={styles.timeline}
        style={{
          height: `${dotDiameter}px`,
          width: `${dotDiameter}px`,
          top: `${topDistance}px`,
        }}
      >
        <div
          className={styles.circle}
          style={{ height: `${dotDiameter}px`, width: `${dotDiameter}px` }}
        ></div>
        <CircleDots
          items={items}
          radius={dotRadius}
          dotSize={dotSize}
          circleAngle={circleAngle}
        />
        <CircleContent
          items={items}
          radius={contentRadius}
          circleAngle={circleAngle}
        />
      </div>
      <LineDots
        items={lineItems}
        dotSize={dotSize}
        topDistance={contentDiameter + topDistance}
        dotSpacing={dotSpacing}
        onScrollDistance={handleScrollDistance}
        onClickItem={handleClickItem}
      />
      {/* <Sider onAddCollection={addCollection} />
      <Add
        dialogVisible={dialogVisible}
        currentItem={currentItem}
        onCloseDialog={closeDialog}
        onAddCardSuccess={addCardSuccess}
      /> */}
      {excalidrawDialogVisible && (
        <div className={styles["excalidraw-dialog"]}>
          <div
            className={styles["excalidraw-dialog-mask"]}
            onClick={closeDialog}
          ></div>
          <ExcalidrawComponent
            currentItem={currentItem}
            closeDialog={() => {
              closeDialog();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
