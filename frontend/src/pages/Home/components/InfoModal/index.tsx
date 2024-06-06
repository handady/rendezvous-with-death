import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, DatePicker, Radio, message } from "antd";
import styles from "./index.module.scss"; // 导入Sass文件
import dayjs from "dayjs";

const InfoModal = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const editInfo = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        values.birthdate = dayjs(values.birthdate).format("YYYY-MM-DD");
        // 转化为Json存储到本地
        const json = JSON.stringify(values);
        window.electronAPI.send("saveOrUpdateUserInfo", json);
        window.electronAPI.once("saveOrUpdateUserInfoResponse", (response) => {
          if (response.error) {
            console.error(response.error);
            message.error(response.error);
            return;
          }
          message.success("保存成功");
        });
        setVisible(false);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  useEffect(() => {
    window.electronAPI.send("loadUserInfo");
    window.electronAPI.once("loadUserInfoResponse", (response) => {
      if (response.error) {
        console.error(response.error);
        message.error(response.error);
        return;
      } else {
        form.setFieldsValue({
          name: response.data.name,
          gender: response.data.gender,
          birthdate: dayjs(response.data.birthdate, "YYYY-MM-DD"),
        });
      }
    });
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.box} onClick={editInfo}>
        <li>
          <div>档案</div>
        </li>
      </div>
      <Modal
        title="编辑信息"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} labelCol={{ span: 5 }}>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="birthdate"
            label="出生日期"
            rules={[{ required: true, message: "请选择出生日期" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="选择日期"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: "请选择性别" }]}
          >
            <Radio.Group>
              <Radio value="male">男</Radio>
              <Radio value="female">女</Radio>
              <Radio value="other">其他</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InfoModal;
