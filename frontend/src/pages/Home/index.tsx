import React, { useEffect, useState, useRef, useCallback } from "react";
import { message } from "antd";
import CircleDots from "./components/CircleDot/index.tsx";
import CircleContent from "./components/CircleContent/index.tsx";
import LineDots from "./components/LineDot/index.tsx";
import ExcalidrawComponent from "../../components/ExcalidrawComponent/index.tsx";
import Sidebar from "../../components/Sidebar/index.tsx";
import AddModal from "./components/AddModal/index.tsx";
import styles from "./index.module.scss";
import { Excalidraw } from "../../components/ExcalidrawComponent/excalidraw.development.js";
import { initData } from "./initData.js";

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
  const [lineItems, setLineItems] = useState([]) as any; // 日记数据列表
  const [currentItem, setCurrentItem] = useState({}) as any;
  const [currentLineDotItem, setCurrentLineDotItem] = useState({});
  const [dotDiameter, setDotDiameter] = useState(240);
  const [contentDiameter, setContentDiameter] = useState(330);
  const [dotSize, setDotSize] = useState(12);
  const [topDistance, setTopDistance] = useState(70);
  const [circleAngle, setCircleAngle] = useState(0);
  const [dotSpacing, setDotSpacing] = useState(50);
  const [excalidrawDialogVisible, setexcalidrawDialogVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModal, setIsAddModal] = useState(true); // 是否是添加日记

  const dotRadius = dotDiameter / 2;
  const contentRadius = contentDiameter / 2;
  const degreesPerPixel = 30 / (dotSize + dotSpacing);

  const handleScrollDistance = (distance) => {
    const angle = distance * degreesPerPixel;
    setCircleAngle(angle);
  };

  // 添加日记
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const addItem = () => {
    setIsAddModal(true);
    setIsModalVisible(true);
  };

  const addCollection = () => {
    setexcalidrawDialogVisible(true);
  };

  const closeDialog = () => {
    setexcalidrawDialogVisible(false);
  };

  // 编辑日记
  const handleEdit = (item) => {
    setCurrentLineDotItem(item);
    setIsAddModal(false);
    setIsModalVisible(true);
  };

  const handleClickItem = (item) => {
    setCurrentItem(item);
    addCollection();
  };

  const loadData = useCallback(() => {
    // 通过预加载脚本的API发送加载请求
    window.electronAPI.send("loadDiaryEntries");

    // 接收响应
    const handleLoadResponse = (response) => {
      if (response.error) {
        message.error(response.error);
      } else {
        setLineItems(response.data);
      }
    };

    window.electronAPI.once("loadDiaryEntriesResponse", handleLoadResponse);
  }, []);

  useEffect(() => {
    loadData();
    // setLineItems([
    //   {
    //     title: "death is waiting",
    //     color: "#f783ac",
    //     time: "0000-00-00",
    //     id: "a rendezous with death",
    //   },
    //   {
    //     title: "最爱的鸡鸡",
    //     color: "#f783ac",
    //     time: "2024-05-30",
    //   },
    //   {
    //     title: "最爱的坤坤",
    //     color: "#f783ac",
    //     time: "2024-05-31",
    //   },
    // ]);
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
        handleEdit={handleEdit}
      />
      <Sidebar onAddCollection={addItem} />
      <AddModal
        visible={isModalVisible}
        onCancel={handleCancel}
        loadData={loadData}
        isAddModal={isAddModal}
        currentLineDotItem={currentLineDotItem}
      />
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
      <div className={styles["excalidrawInit"]}>
        <Excalidraw
          initialData={{
            elements: (initData as any).elements,
            appState: (initData as any).appState,
            files: (initData as any).files,
            scrollToContent: true,
          }}
        ></Excalidraw>
      </div>
    </div>
  );
};

export default Home;
