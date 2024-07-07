// src/utils/battle.js

const calculateHitChance = (attacker, defender) => {
  // 计算命中率
  return attacker.命中 - defender.闪避;
};

const calculateDamage = (attacker, defender) => {
  // 计算命中率
  const hitChance = calculateHitChance(attacker, defender);
  const isHit = Math.random() * 100 < hitChance;

  if (isHit) {
    // 物理抗性减免百分比，最大为 90%
    const reductionPercentage = Math.min(defender.物理抗性, 90) / 100;
    // 计算实际伤害
    const damage = attacker.物理攻击力 * (1 - reductionPercentage);
    return Math.max(Math.round(damage), 0); // 确保伤害不为负，并四舍五入
  } else {
    return 0; // 攻击未命中
  }
};

export const battle = (user, opponent, updateBattleLog, setWinner) => {
  let userHp = user.血量;
  let opponentHp = opponent.血量;
  let userInitiative = 0;
  let opponentInitiative = 0;
  const threshold = 50;
  const battleLog = [];

  const battleInterval = setInterval(() => {
    userInitiative += user.灵巧;
    opponentInitiative += opponent.灵巧;

    if (userInitiative >= threshold) {
      userInitiative -= threshold;
      const damage = calculateDamage(user, opponent);
      opponentHp -= damage;
      battleLog.push(`用户攻击，对手受到 ${damage} 点伤害`);
    }

    if (opponentInitiative >= threshold) {
      opponentInitiative -= threshold;
      const damage = calculateDamage(opponent, user);
      userHp -= damage;
      battleLog.push(`对手攻击，用户受到 ${damage} 点伤害`);
    }

    updateBattleLog([...battleLog]);

    if (userHp <= 0 || opponentHp <= 0) {
      clearInterval(battleInterval);
      setWinner(userHp > 0 ? "用户" : "对手");
      updateBattleLog([...battleLog, "战斗结束"]);
    }
  }, 500); // 每秒钟更新一次战斗状态
};
