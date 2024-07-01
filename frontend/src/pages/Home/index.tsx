import React, { useEffect, useState, useRef, useCallback } from "react";
import { message, Progress } from "antd";
import CircleDots from "./components/CircleDot/index.tsx";
import CircleContent from "./components/CircleContent/index.tsx";
import LineDots from "./components/LineDot/index.tsx";
import ExcalidrawComponent from "../../components/ExcalidrawComponent/index.tsx";
import Sidebar from "../../components/Sidebar/index.tsx";
import AddModal from "./components/AddModal/index.tsx";
import InfoModal from "./components/InfoModal/index.tsx";
import Appointment from "./components/Appointment/index.tsx";
import styles from "./index.module.scss";
import { Excalidraw } from "../../components/ExcalidrawComponent/excalidraw.development.js";
// import { Excalidraw } from "@excalidraw/excalidraw";
import { initData, initCircleItems } from "./initData.js";
import {
  calculateDaysUntil72,
  calculateDaysPassed,
} from "../../utils/functions.ts";

const Home = () => {
  const [items, setItems] = useState(initCircleItems);
  const [lineItems, setLineItems] = useState([]) as any; // 日记数据列表
  const [currentItem, setCurrentItem] = useState({}) as any;
  const [currentLineDotItem, setCurrentLineDotItem] = useState({});
  const [dotDiameter, setDotDiameter] = useState(240);
  const [contentDiameter, setContentDiameter] = useState(315);
  const [dotSize, setDotSize] = useState(12);
  const [topDistance, setTopDistance] = useState(70);
  const [circleAngle, setCircleAngle] = useState(0);
  const [dotSpacing, setDotSpacing] = useState(50);
  const [excalidrawDialogVisible, setexcalidrawDialogVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModal, setIsAddModal] = useState(true); // 是否是添加日记
  const [progress, setProgress] = useState(0); // 加载进度
  const [dayLeft, setDayLeft] = useState(0); // 剩余天数

  const dotRadius = dotDiameter / 2;
  const contentRadius = contentDiameter / 2;
  const degreesPerPixel = 30 / (dotSize + dotSpacing);

  // 耳朵数值
  const leftEarRef = useRef(null) as any;
  const rightEarRef = useRef(null) as any;

  const handleScrollDistance = (distance) => {
    // const angle = distance * degreesPerPixel;
    // setCircleAngle(angle);
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

  const loadUserInfo = () => {
    window.electronAPI.send("loadUserInfo");
    window.electronAPI.once("loadUserInfoResponse", (response) => {
      if (response.error) {
        console.error(response.error);
        message.error(response.error);
        return;
      } else {
        const birthdate = response.data.birthdate;
        setProgress(
          (calculateDaysPassed(birthdate) / calculateDaysUntil72(birthdate)) *
            100
        );
        console.log(
          calculateDaysUntil72(birthdate) - calculateDaysPassed(birthdate)
        );
        setDayLeft(
          calculateDaysUntil72(birthdate) - calculateDaysPassed(birthdate)
        );
      }
    });
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    const setEars = () => {
      if (leftEarRef.current) {
        const width = leftEarRef.current.offsetWidth;
        leftEarRef.current.style.height = `${(width * 22) / 29}px`;
      }

      if (rightEarRef.current) {
        const width = rightEarRef.current.offsetWidth;
        rightEarRef.current.style.height = `${width / 0.8}px`;
      }
    };

    if (excalidrawDialogVisible) {
      setEars();

      window.addEventListener("resize", setEars);
      return () => {
        window.removeEventListener("resize", setEars);
      };
    }
  }, [excalidrawDialogVisible]);

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
    //     title: "测试内容0613",
    //     color: "#FFA39E",
    //     time: "2024-06-13",
    //     appointmentTheme:
    //       "节流、防抖、输入框实时搜索、窗口大小调整事件、表单验证、滚动事件、高频率点击事件。",
    //     appointmentContent: "测试一下",
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
          top: `${topDistance + dotDiameter}px`,
          height: `calc(100% - ${topDistance + dotDiameter}px)`,
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
        <Progress
          style={{ position: "absolute", transform: "translate(-50%,-100%)" }}
          type="circle"
          percent={progress}
          strokeColor="#f783ac"
          size={dotDiameter + dotSize / 2}
          format={() => ""}
          strokeWidth={3}
        />
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
      <InfoModal loadUserInfo={loadUserInfo}></InfoModal>
      <Appointment loadData={loadData} dayLeft={dayLeft}></Appointment>
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
            className={styles["excalidraw-dialog-leftEar"]}
            ref={leftEarRef}
          ></div>
          <div
            className={styles["excalidraw-dialog-rightEar"]}
            ref={rightEarRef}
          ></div>
          <div className={styles["excalidraw-dialog-mask"]}></div>
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
