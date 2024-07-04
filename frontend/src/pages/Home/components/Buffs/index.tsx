import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Image, Tooltip, Progress } from "antd";
import styles from "./index.module.scss";

const Buffs = ({ buffs }) => {
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
            overlayStyle={{ maxWidth: 800 }}
            title={
              buff.level ? (
                <div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ width: "40px" }}>
                      {buff.level.level + "级"}
                    </div>
                    <Progress
                      percent={
                        (buff.experience / buff.nextLevelExperience) * 100
                      }
                      strokeColor={"#34aef5"}
                    />
                  </div>
                  {buff.level.effects.map((effect, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <div>
                        {effect.type === "passive" ? "被动：" : "主动："}
                      </div>
                      <div>{effect.description}</div>
                    </div>
                  ))}
                </div>
              ) : null
            }
          >
            <Image
              className={styles["buff-image"]}
              src={buff.imagePath}
              preview={false}
              width={50}
            />
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

Buffs.propTypes = {
  buffs: PropTypes.array,
};

export default Buffs;
