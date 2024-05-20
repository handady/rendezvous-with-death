import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import {
  Excalidraw,
  exportToSvg,
  exportToBlob,
  exportToCanvas,
} from "@excalidraw/excalidraw";

const ExcalidrawComponent = ({ closeDialog, currentItem }) => {
  const [elements, setElements] = useState([]);
  const [appState, setAppState] = useState({});
  const [files, setFiles] = useState({});

  const handleChange = useCallback((newElements, newAppState, newFiles) => {
    setElements((prevElements) => {
      if (prevElements !== newElements) {
        return newElements;
      }
      return prevElements;
    });

    setAppState((prevAppState) => {
      if (prevAppState !== newAppState) {
        return newAppState;
      }
      return prevAppState;
    });

    setFiles((prevFiles) => {
      if (prevFiles !== newFiles) {
        return newFiles;
      }
      return prevFiles;
    });
  }, []);

  const handleExport = async () => {
    const exportOpts = {
      elements,
      appState,
      files,
    };

    const svg = await exportToSvg(exportOpts);
    console.log(svg);

    const blob = await exportToBlob(exportOpts);
    const canvas = await exportToCanvas(exportOpts);

    console.log(blob);
    console.log(canvas);
  };

  const handleBack = () => {
    setElements([]);
    setAppState({});
    setFiles({});
    closeDialog(); // 确保在清除状态后调用 closeDialog
  };

  useEffect(() => {
    // 如果需要，可以在此执行某些操作
  }, [elements, appState, files]);

  return (
    <div className={styles.container}>
      <Excalidraw onChange={handleChange} langCode="zh-CN" />
      <button className={styles["close-btn"]} onClick={handleBack}>
        返回
      </button>
      <button className={styles["export-btn"]} onClick={handleExport}>
        保存
      </button>
    </div>
  );
};

ExcalidrawComponent.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  currentItem: PropTypes.object.isRequired,
};

export default ExcalidrawComponent;
