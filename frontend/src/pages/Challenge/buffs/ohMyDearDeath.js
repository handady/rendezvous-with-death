export const minHpIfNextAttackKills = (
  effect,
  character,
  opponent,
  damage,
  battleState,
  battleLog,
  name
) => {
  if (
    Math.random() < 0.01 &&
    battleState.nextAttackWillKill(character, damage)
  ) {
    character.血量 = 1;
    battleLog.push(`${name} 的生命值降至 1 点，触发了 ${effect.name} 效果`);
    return 0; // 阻止进一步伤害
  }
  return damage;
};

export const instantKill = (
  effect,
  character,
  opponent,
  damage,
  battleState,
  battleLog,
  name
) => {
  if (Math.random() < 0.00001) {
    opponent.血量 = 0;
    battleLog.push(
      `${name} 触发了 ${effect.name} 效果，${opponent.name} 被直接杀死`
    );
    return 0; // 阻止进一步伤害
  }
  return damage;
};

export const healIfLowHp = (
  effect,
  character,
  opponent,
  damage,
  battleState,
  battleLog,
  name
) => {
  if (character.血量 / character.最大血量 < 0.1) {
    character.血量 += character.最大血量 * 0.05;
    battleLog.push(`${name} 触发了 ${effect.name} 效果，恢复了一部分生命值`);
  }
  return damage;
};

export const increaseDamage = (
  effect,
  character,
  opponent,
  damage,
  battleState,
  battleLog,
  name
) => {
  character.nextAttackDamageMultiplier = 1.1;
  battleLog.push(`${name} 触发了 ${effect.name} 效果，下一次攻击伤害增加 10%`);
  return damage;
};
