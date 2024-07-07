import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Radio,
  message,
  Descriptions,
} from "antd";
import PropTypes from "prop-types";
import styles from "./index.module.scss"; // 导入Sass文件
import dayjs from "dayjs";

const calculateAttributes = (attributes) => {
  const calculated = {
    血量: 0,
    精力: 0,
    专注值: 0,
    物理攻击力: 0,
    属性攻击力: 0,
    物理抗性: 0,
    属性抗性: 0,
    闪避: 0,
  };

  // 生命力
  calculated.血量 += attributes.生命力 * 10;
  calculated.物理抗性 += attributes.生命力 * 1;

  // 集中力
  calculated.专注值 += attributes.集中力 * 10;
  calculated.属性攻击力 += attributes.集中力 * 2;

  // 耐力
  calculated.精力 += attributes.耐力 * 10;
  calculated.物理抗性 += attributes.耐力 * 1;
  calculated.属性抗性 += attributes.耐力 * 0.5;

  // 力气
  calculated.物理攻击力 += attributes.力气 * 2;

  // 灵巧
  calculated.闪避 += attributes.灵巧 * 1;

  // 智力
  calculated.属性攻击力 += attributes.智力 * 2;

  // 信仰
  calculated.属性抗性 += attributes.信仰 * 1;

  // 感应
  calculated.物理抗性 += attributes.感应 * 0.5;
  calculated.物理攻击力 += attributes.感应 * 0.5;
  calculated.闪避 += attributes.感应 * 0.5;

  return calculated;
};

const calculateAttributes1 = (attributes) => {
  const calculated = {
    命中: 0,
  };

  // 生命力

  // 集中力

  // 耐力

  // 力气

  // 灵巧
  calculated.命中 += attributes.灵巧 * 5;

  // 智力
  calculated.命中 += attributes.智力 * 2;

  // 信仰

  // 感应
  calculated.命中 += attributes.感应 * 3;

  return calculated;
};

const InfoModal = ({ loadUserInfo }) => {
  const [visible, setVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false); // 提交按钮loading
  const [userInfo, setUserInfo] = useState({
    attributes: {},
  }); // 用户信息
  const [calculateAttributesInfo, setCalculateAttributesInfo] = useState({}); // 计算后的属性
  const [calculateAttributesInfo1, setCalculateAttributesInfo1] = useState({}); // 计算后的属性
  const [form] = Form.useForm();

  const editInfo = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setSubmitLoading(true);
        // 转化为Json存储到本地
        const json = {
          ...userInfo,
          name: values.name,
          gender: values.gender,
          birthdate: dayjs(values.birthdate).format("YYYY-MM-DD"),
        };
        window.electronAPI.send("saveOrUpdateUserInfo", json);
        window.electronAPI.once("saveOrUpdateUserInfoResponse", (response) => {
          if (response.error) {
            console.error(response.error);
            message.error(response.error);
            return;
          }
          message.success("保存成功");
          loadUserInfo();
        });
        setVisible(false);
        setSubmitLoading(false);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
        setSubmitLoading(false);
      });
  };

  useEffect(() => {
    if (visible) {
      window.electronAPI.send("loadUserInfo");
      window.electronAPI.once("loadUserInfoResponse", (response) => {
        if (response.error) {
          message.error(response.error);
          return;
        } else {
          setUserInfo(response.data);
          setCalculateAttributesInfo(
            calculateAttributes(response.data.attributes)
          );
          setCalculateAttributesInfo1(
            calculateAttributes1(response.data.attributes)
          );
          form.setFieldsValue({
            name: response.data.name,
            gender: response.data.gender,
            birthdate: dayjs(response.data.birthdate, "YYYY-MM-DD"),
          });
        }
      });
    }
  }, [visible]);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.box} onClick={editInfo}>
        <li>
          <div>状态</div>
        </li>
      </div>
      <Modal
        title="编辑信息"
        open={visible}
        onOk={handleOk}
        footer={null}
        onCancel={() => {
          handleCancel();
        }}
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
          <Form.Item name="description" label="属性">
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1, marginRight: 16 }}>
                {userInfo.attributes &&
                  Object.keys(userInfo.attributes).length > 0 && (
                    <Descriptions column={1} style={{ marginTop: 4 }}>
                      {Object.keys(userInfo.attributes).map((key) => (
                        <Descriptions.Item label={key} key={key}>
                          {userInfo.attributes[key]}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  )}
              </div>
              <div style={{ flex: 1 }}>
                <Descriptions column={1}>
                  {Object.keys(calculateAttributesInfo).map((key) => (
                    <Descriptions.Item label={key} key={key}>
                      {calculateAttributesInfo[key]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
              <div style={{ flex: 1 }}>
                <Descriptions column={1}>
                  {Object.keys(calculateAttributesInfo1).map((key) => (
                    <Descriptions.Item label={key} key={key}>
                      {calculateAttributesInfo1[key]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            </div>
          </Form.Item>
        </Form>
        <div className={styles["modal-footer"]}>
          <Button
            key="cancel"
            className={styles.closeBtn}
            onClick={() => {
              form.resetFields();
              handleCancel();
            }}
          >
            取消
          </Button>
          <Button
            loading={submitLoading}
            key="submit"
            className={styles.submitBtn}
            onClick={handleOk}
          >
            确定
          </Button>
        </div>
      </Modal>
    </div>
  );
};

InfoModal.propTypes = {
  loadUserInfo: PropTypes.func,
};

export default InfoModal;
