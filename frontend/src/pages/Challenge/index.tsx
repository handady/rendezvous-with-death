import React, { useState, useCallback, useEffect } from "react";
import { message, Modal, Descriptions } from "antd";
import PropTypes from "prop-types";
import ReturnButton from "./components/ReturnButton";
import styles from "./index.module.scss";
import {
  calculateAttributes,
  calculateAttributes1,
} from "../../utils/functions";
import opponents from "./opponents.json";
import { battle } from "./battle.js";

const Challenge = () => {
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    attributes: {},
  });
  const [buffs, setBuffs] = useState([]) as any;
  const [opponentBuffs, setOpponentBuffs] = useState([]) as any;
  const [calculateAttributesInfo, setCalculateAttributesInfo] = useState({});
  const [calculateAttributesInfo1, setCalculateAttributesInfo1] = useState({});
  const [opponentUserInfo, setOpponentUserInfo] = useState({
    name: "",
    attributes: {},
  });
  const [opponentCalculateAttributesInfo, setOpponentCalculateAttributesInfo] =
    useState({});
  const [
    opponentCalculateAttributesInfo1,
    setOpponentCalculateAttributesInfo1,
  ] = useState({});

  const [battleLog, setBattleLog] = useState([]);
  const [winner, setWinner] = useState("");

  const getOpponents = (opponent) => () => {
    setOpponentUserInfo(opponents[opponent]);
    setOpponentCalculateAttributesInfo(
      calculateAttributes(opponents[opponent].attributes)
    );
    setOpponentCalculateAttributesInfo1(
      calculateAttributes1(opponents[opponent].attributes)
    );
    setVisible(true);
  };

  const updateUserStatus = (newStatus) => {
    setCalculateAttributesInfo((prevState) => ({
      ...prevState,
      血量: newStatus.血量,
    }));
  };

  const updateOpponentStatus = (newStatus) => {
    setOpponentCalculateAttributesInfo((prevState) => ({
      ...prevState,
      血量: newStatus.血量,
    }));
  };

  const startBattle = () => {
    setBattleLog([]);
    battle(
      {
        name: userInfo.name,
        ...userInfo.attributes,
        ...calculateAttributesInfo,
        ...calculateAttributesInfo1,
      },
      {
        name: opponentUserInfo.name,
        ...opponentUserInfo.attributes,
        ...opponentCalculateAttributesInfo,
        ...opponentCalculateAttributesInfo1,
      },
      buffs,
      opponentBuffs,
      setBattleLog,
      setWinner,
      updateUserStatus,
      updateOpponentStatus
    );
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
        }
      });
      window.electronAPI.send("getBuffs");
      window.electronAPI.once("getBuffsResponse", (response) => {
        if (response.error) {
          message.error(response.error);
          return;
        } else {
          setBuffs(response.data);
        }
      });
    }
  }, [visible]);

  return (
    <div className={styles.container}>
      <ReturnButton />
      <div className={styles.opponent} onClick={getOpponents("BadGuy")}>
        强壮的恶棍
      </div>
      <Modal
        title="挑战"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={"90%"}
      >
        <div className={styles.challengContent}>
          <div className={styles.us}>
            <div>{userInfo.name}</div>
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
          </div>
          <div className={styles.vs}>
            <div>对战记录</div>
            <div className={styles.vsBattle} onClick={startBattle}>
              开始挑战
            </div>
            <div className={styles.battleLog}>
              {battleLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
          <div className={styles.opponent}>
            <div>{opponentUserInfo.name}</div>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1, marginRight: 16 }}>
                {opponentUserInfo.attributes &&
                  Object.keys(opponentUserInfo.attributes).length > 0 && (
                    <Descriptions column={1} style={{ marginTop: 4 }}>
                      {Object.keys(opponentUserInfo.attributes).map((key) => (
                        <Descriptions.Item label={key} key={key}>
                          {opponentUserInfo.attributes[key]}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  )}
              </div>
              <div style={{ flex: 1 }}>
                <Descriptions column={1}>
                  {Object.keys(opponentCalculateAttributesInfo).map((key) => (
                    <Descriptions.Item label={key} key={key}>
                      {opponentCalculateAttributesInfo[key]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
              <div style={{ flex: 1 }}>
                <Descriptions column={1}>
                  {Object.keys(opponentCalculateAttributesInfo1).map((key) => (
                    <Descriptions.Item label={key} key={key}>
                      {opponentCalculateAttributesInfo1[key]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Challenge;
