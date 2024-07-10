import { applyBuffEffect } from "./buffs";

const calculateHitChance = (attacker, defender) => {
  return attacker.命中 - defender.闪避;
};

const calculateDamage = (attacker, defender) => {
  const hitChance = calculateHitChance(attacker, defender);
  const isHit = Math.random() * 100 < hitChance;

  if (isHit) {
    const reductionPercentage = Math.min(defender.物理抗性, 90) / 100;
    const damage = attacker.物理攻击力 * (1 - reductionPercentage);
    return { damage: Math.max(Math.round(damage), 0), isHit: true };
  } else {
    return { damage: 0, isHit: false };
  }
};

const applyBuffs = (
  buffs,
  character,
  opponent,
  damage,
  battleState,
  battleLog,
  trigger,
  name
) => {
  if (buffs) {
    buffs.forEach((buff) => {
      if (buff && buff.level.effects) {
        buff.level.effects.forEach((effect) => {
          if (effect.type === "passive" && effect.trigger === trigger) {
            damage = applyBuffEffect(
              effect,
              character,
              opponent,
              damage,
              battleState,
              battleLog,
              name
            );
          }
        });
      }
    });
  }
  return damage;
};

export const battle = (
  user,
  opponent,
  userBuff,
  opponentBuff,
  updateBattleLog,
  setWinner,
  updateUserStatus,
  updateOpponentStatus
) => {
  let userInitiative = 0;
  let opponentInitiative = 0;
  const threshold = 20;
  const battleLog = [];

  const battleInterval = setInterval(() => {
    userInitiative += user.灵巧;
    opponentInitiative += opponent.灵巧;

    const battleState = {
      nextAttackWillKill: (character, damage) => character.血量 <= damage,
    };

    if (userInitiative >= threshold) {
      userInitiative -= threshold;

      // 计算用户对对手的伤害
      let { damage, isHit } = calculateDamage(user, opponent);
      damage *= user.nextAttackDamageMultiplier || 1;
      delete user.nextAttackDamageMultiplier; // 重置伤害加成

      if (!isHit) {
        battleLog.push(`${opponent.name} 闪避了 ${user.name} 的攻击`);
      } else {
        // 应用我方攻击时触发的 Buff
        damage = applyBuffs(
          userBuff,
          user,
          opponent,
          damage,
          battleState,
          battleLog,
          "onAttack",
          user.name
        );

        // 应用对方防御时触发的 Buff
        damage = applyBuffs(
          opponentBuff,
          opponent,
          user,
          damage,
          battleState,
          battleLog,
          "onDefend",
          opponent.name
        );

        opponent.血量 -= damage;
        battleLog.push(
          `${user.name} 攻击，${opponent.name} 受到 ${damage} 点伤害`
        );
      }
    }

    if (opponentInitiative >= threshold) {
      opponentInitiative -= threshold;

      // 计算对手对用户的伤害
      let { damage, isHit } = calculateDamage(opponent, user);

      if (!isHit) {
        battleLog.push(`${user.name} 闪避了 ${opponent.name} 的攻击`);
      } else {
        // 应用对方攻击时触发的 Buff
        damage = applyBuffs(
          opponentBuff,
          opponent,
          user,
          damage,
          battleState,
          battleLog,
          "onAttack",
          opponent.name
        );

        // 应用我方防御时触发的 Buff
        damage = applyBuffs(
          userBuff,
          user,
          opponent,
          damage,
          battleState,
          battleLog,
          "onDefend",
          user.name
        );

        user.血量 -= damage;
        battleLog.push(
          `${opponent.name} 攻击，${user.name} 受到 ${damage} 点伤害`
        );
      }
    }

    // 更新外部状态
    updateUserStatus({ ...user });
    updateOpponentStatus({ ...opponent });

    // 每回合的分割符号
    battleLog.push("--------------------------------");

    updateBattleLog([...battleLog]);

    // 检查是否有一方胜利
    if (user.血量 <= 0 || opponent.血量 <= 0) {
      clearInterval(battleInterval);
      const winner = user.血量 > 0 ? user.name : opponent.name;
      setWinner(winner);
      updateBattleLog([...battleLog, "战斗结束", `胜者：${winner}`]);
    }
  }, 1500);
};
