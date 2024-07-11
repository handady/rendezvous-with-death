import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Image, Tooltip, Progress } from "antd";
import styles from "./index.module.scss";

const Buffs = ({ buffs }) => {
  const [visible, setVisible] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.5);

  useEffect(() => {
    console.log(buffs);
  }, [buffs]);

  return (
    <div className={styles["buffs-container"]}>
      {buffs.map((buff) => (
        <div className={styles.buff} key={buff.name}>
          <Tooltip
            placement="bottom"
            color="#f5347f"
            overlayStyle={{ maxWidth: 340 }}
            title={
              buff.level ? (
                <div>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "48px" }}>名称：</div>
                    <div>{buff.name}</div>
                  </div>
                  {buff.level.effects.map((effect, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <div style={{ width: "48px", flexShrink: 0 }}>
                        {effect.type === "passive" ? "被动：" : "主动："}
                      </div>
                      <div>{effect.description}</div>
                    </div>
                  ))}
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "60px", textAlign: "center" }}>
                      {buff.level.level + "级"}
                    </div>
                    <Progress
                      percent={
                        (buff.experience / buff.nextLevelExperience) * 100
                      }
                      strokeColor={"#34aef5"}
                    />
                  </div>
                </div>
              ) : null
            }
          >
            <Image
              className={styles["buff-image"]}
              src={buff.imagePath}
              width={50}
              preview={false}
              onClick={() => {
                setVisible(true);
              }}
            />
          </Tooltip>
          <Image
            className={styles["buff-image"]}
            style={{ display: "none" }}
            src={buff.imagePath}
            width={50}
            preview={{
              visible,
              scaleStep,
              src: buff.imagePath,
              onVisibleChange: (visible) => setVisible(visible),
            }}
          />
        </div>
      ))}
    </div>
  );
};

Buffs.propTypes = {
  buffs: PropTypes.array,
};

export default Buffs;
