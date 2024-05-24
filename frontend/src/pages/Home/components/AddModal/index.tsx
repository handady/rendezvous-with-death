import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  ColorPicker,
  theme,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import { generate, green, presetPalettes, red } from "@ant-design/colors";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import { formatDate2 } from "../../../../utils/functions";

const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
  }));

const AddModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [submitLoading, setSubmitLoading] = useState(false); // 提交按钮loading
  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
  });

  const customPanelRender = (_, { components: { Picker, Presets } }) => (
    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Presets />
      </Col>
      <Divider
        type="vertical"
        style={{
          height: "auto",
        }}
      />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setSubmitLoading(true);
        const params = {
          ...values,
          time: formatDate2(new Date()),
        };
        if (typeof values.color !== "string") {
          params.color = values.color.toHexString();
        }
        console.log("params", params);
        window.electronAPI.send("saveDiaryEntry", params);
        window.electronAPI.receive("saveDiaryEntryResponse", (response) => {
          if (response.success) {
            message.success("日记保存成功");
            setSubmitLoading(false);
          } else {
            message.error(response.error);
            setSubmitLoading(false);
          }
        });
        form.resetFields();
        onCancel();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // 每次Modal可见时，设置默认值
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ color: "#FFA39E" });
    }
  }, [visible, form]);

  return (
    <Modal
      className={styles["add-modal"]}
      title="添加日记"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      destroyOnClose
    >
      <Form form={form} name="add_item_form" labelCol={{ span: 4 }}>
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: "请输入标题" }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item
          name="color"
          label="选择颜色"
          rules={[{ required: true, message: "请选择颜色" }]}
        >
          <ColorPicker
            defaultValue={"#FFA39E"}
            styles={{
              popupOverlayInner: {
                width: 480,
              },
            }}
            presets={presets}
            panelRender={customPanelRender}
          />
        </Form.Item>
      </Form>
      <div className={styles["modal-footer"]}>
        <Button
          key="cancel"
          className={styles.closeBtn}
          onClick={() => {
            form.resetFields();
            onCancel();
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
  );
};

AddModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddModal;
