import React, { useEffect, useState } from "react";
import { message, Modal, Form, Input, Button, Collapse } from "antd";
import styles from "./index.module.scss"; // 导入Sass文件

const { TextArea } = Input;

const Appointment = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [collapseText, setCollapseText] = useState([]);

  const appointment = () => {
    window.electronAPI.send("appointment");
    window.electronAPI.once("appointmentResponse", (response) => {
      if (response.error) {
        console.error(response.error);
        message.error(response.error);
        return;
      } else {
        setVisible(true);
        setCollapseText(response.data.content);
        if (response.data.diary[0].appointmentTheme) {
          form.setFieldsValue({
            theme: response.data.diary[0].appointmentTheme,
          });
        }
        if (response.data.diary[0].appointmentContent) {
          form.setFieldsValue({
            content: response.data.diary[0].appointmentContent,
          });
        }
      }
    });
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setVisible(true);
        window.electronAPI.send("saveAppointment", {
          appointmentTheme: values.theme,
          appointmentContent: values.content,
        });
        window.electronAPI.once("saveAppointmentResponse", (response) => {
          if (response.error) {
            console.error(response.error);
            message.error(response.error);
            setVisible(false);
            return;
          }
          message.success("保存成功");
          setVisible(false);
        });
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
        setVisible(false);
      });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.box} onClick={appointment}>
        <li>
          <div>约会</div>
        </li>
      </div>
      <Modal
        className={styles["appointment-modal"]}
        title="约会"
        open={visible}
        onCancel={() => {
          form.resetFields();
          setVisible(false);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          colon={false}
          layout="vertical"
        >
          <Form.Item name="today">
            <Collapse
              size="small"
              items={[
                {
                  key: "1",
                  label: "今日内容",
                  children: (
                    <>
                      {collapseText.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </>
                  ),
                },
              ]}
            ></Collapse>
          </Form.Item>
          <Form.Item name="theme" label="约会主题:">
            <TextArea placeholder="请书写约会主题，用逗号分隔" autoSize />
          </Form.Item>
          <Form.Item name="content" label="约会内容:">
            <TextArea placeholder="请书写约会内容" autoSize={{ minRows: 3 }} />
          </Form.Item>
        </Form>
        <div className={styles["modal-footer"]}>
          <Button
            key="cancel"
            className={styles.closeBtn}
            onClick={() => {
              form.resetFields();
              setVisible(false);
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

export default Appointment;
