import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  ConfigProvider,
  Modal,
  Tag,
  Tooltip,
  message,
  Form,
  Input,
  Popconfirm,
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import { splitTheme, randomColor } from "../../../../../utils/functions";

const { TextArea } = Input;

const Inspiration = ({
  appointmentContent,
  appointmentTheme,
  inspirationContent,
  appointmentTime,
  loadData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [theme, setTheme] = useState([]) as any;
  const [themeColor, setThemeColor] = useState([]) as any;
  const [selectedTags, setSelectedTags] = useState([]) as any;
  const [inspirationArray, setInspirationArray] = useState([]) as any;
  // 耳朵参数
  const leftEarRef = useRef(null) as any;
  const rightEarRef = useRef(null) as any;
  // 添加灵感列表
  const [form] = Form.useForm();
  const [inspirationTable, setInspirationTable] = useState([]) as any;

  const addInspiration = () => {
    setInspirationTable([
      ...inspirationTable,
      { inspiration: "", inspirationSource: "" },
    ]);
  };

  const removeInspiration = (index) => {
    const newLogistics = inspirationTable.filter((_, i) => i !== index);
    setInspirationTable(newLogistics);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log("Form Values:", form.getFieldsValue());
    form
      .validateFields()
      .then((values) => {
        window.electronAPI.send("saveInspiration", {
          time: appointmentTime,
          content: values.inspirationTable,
        });
        window.electronAPI.once("saveInspirationResponse", (response) => {
          if (response.error) {
            message.error(response.error);
            return;
          } else {
            message.success("保存成功");
            setIsModalVisible(false);
            loadData();
          }
        });
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
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
      Form: {
        itemMarginBottom: 0,
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

  // 生成灵感标签
  const generateInspiration = (tags: any) => {
    window.electronAPI.send("generateInspiration", tags);
    window.electronAPI.once("generateInspirationResponse", (response) => {
      if (response.error) {
        message.error(response.error);
        return;
      } else {
        setInspirationArray(response.data);
        setInspirationTable([
          ...inspirationTable,
          { inspiration: "", inspirationSource: response.data.join(",") },
        ]);
        form.setFieldsValue({
          inspirationTable: [
            ...inspirationTable,
            { inspiration: "", inspirationSource: response.data.join(",") },
          ],
        });
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

      if (inspirationContent) {
        form.setFieldsValue({ inspirationTable: inspirationContent });
        setInspirationTable(inspirationContent);
      } else {
        form.setFieldsValue({ inspirationTable: [] });
        setInspirationTable([]);
      }

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

  const columns = [
    {
      title: "灵感",
      dataIndex: "inspiration",
      key: "inspiration",
      render: (text, record, index) => (
        <Form.Item
          name={["inspirationTable", index, "inspiration"]}
          rules={[{ required: true, message: "请填写灵感" }]}
        >
          <TextArea />
        </Form.Item>
      ),
    },
    {
      title: "灵感来源",
      dataIndex: "inspirationSource",
      key: "inspirationSource",
      render: (text, record, index) => (
        <Form.Item
          name={["inspirationTable", index, "inspirationSource"]}
          rules={[{ required: true, message: "请填写灵感来源" }]}
        >
          <TextArea />
        </Form.Item>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (text, record, index) => (
        <Popconfirm
          title="确定删除该条灵感?"
          onConfirm={() => removeInspiration(index)}
        >
          <Button type="primary" danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <ConfigProvider theme={customTheme}>
      <div
        className={styles.inspiration}
        onClick={(e) => {
          e.stopPropagation(); // 阻止事件冒泡
        }}
      >
        <Tooltip
          title={
            inspirationContent && inspirationContent.length > 0
              ? inspirationContent.map((item, index) => (
                  <div key={index}>
                    {index + 1}. {item.inspiration}
                  </div>
                ))
              : null
          }
          color="#34aef5"
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
        </Tooltip>

        <Modal
          title="灵感"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          cancelText="取消"
          okText="确定"
          width={"40%"}
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
            {selectedTags.length > 0 && (
              <div className={styles["selected-tags-container"]}>
                <div className={styles["selected-tags"]}>
                  {selectedTags.map((tag, index) => (
                    <Tag key={index} color="pink" style={{ margin: "3px 5px" }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                {/* 生成灵感按钮 */}
                <div
                  className={styles["inspiration-button"]}
                  onClick={() => generateInspiration(selectedTags)}
                >
                  <div>生成</div>
                  <div>灵感</div>
                </div>
              </div>
            )}
            <div className={styles["inspiration-result"]}>
              {inspirationArray.map((item, index) => (
                <div key={index} className={styles["inspiration-item"]}>
                  {item}
                </div>
              ))}
            </div>
            <Form form={form} initialValues={{ inspirationTable }}>
              <Table
                columns={columns}
                dataSource={inspirationTable}
                pagination={false}
                rowKey={(record: any, index: any) => index}
                bordered
              />
              <Form.Item style={{ marginTop: "6px" }}>
                <Button onClick={addInspiration} icon={<PlusOutlined />}>
                  添加灵感
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

Inspiration.propTypes = {
  appointmentContent: PropTypes.string,
  appointmentTheme: PropTypes.string,
  inspirationContent: PropTypes.array,
  appointmentTime: PropTypes.string,
  loadData: PropTypes.func,
};

export default Inspiration;
