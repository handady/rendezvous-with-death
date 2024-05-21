import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import { Excalidraw, serializeAsJSON, restore } from "@excalidraw/excalidraw";

const ExcalidrawComponent = ({ closeDialog, currentItem }) => {
  const [elements, setElements] = useState([]) as any;
  const [appState, setAppState] = useState({}) as any;
  const [files, setFiles] = useState({});
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

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

  const saveToFile = () => {
    const json = serializeAsJSON(elements, appState, files, "local");
    window.electronAPI.send("saveData", currentItem.time, json);
    window.electronAPI.receive("saveDataResponse", (response) => {
      if (response.error) {
        console.error(response.error);
      } else {
        console.log("File saved successfully");
      }
    });
  };

  const handleBack = () => {
    setElements([]);
    setAppState({});
    setFiles({});
    closeDialog(); // 确保在清除状态后调用 closeDialog
  };

  useEffect(() => {
    if (currentItem.time) {
      window.electronAPI.send("loadData", currentItem.time);
      window.electronAPI.receive("loadDataResponse", (data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          const importedData = restore(
            data.elements,
            data.appState,
            data.files
          );
          setElements(importedData.elements);
          setAppState(importedData.appState);
          setFiles(importedData.files);
          setInitialDataLoaded(true);
        }
      });
    }
  }, [currentItem.time]);

  return (
    <div className={styles.container}>
      {initialDataLoaded && (
        <Excalidraw
          initialData={{
            elements,
            appState,
            files,
          }}
          onChange={handleChange}
          langCode="zh-CN"
        />
      )}
      <button className={styles["close-btn"]} onClick={handleBack}>
        返回
      </button>
      <button className={styles["export-btn"]} onClick={saveToFile}>
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
