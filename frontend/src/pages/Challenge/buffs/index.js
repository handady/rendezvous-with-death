import {
  minHpIfNextAttackKills,
  instantKill,
  healIfLowHp,
  increaseDamage,
} from "./ohMyDearDeath";

const buffEffects = {
  minHpIfNextAttackKills,
  instantKill,
  healIfLowHp,
  increaseDamage,
};

export const applyBuffEffect = (
  effect,
  character,
  opponent,
  damage,
  battleState,
  battleLog,
  name
) => {
  const applyEffect = buffEffects[effect.effect];
  if (applyEffect) {
    return applyEffect(
      effect,
      character,
      opponent,
      damage,
      battleState,
      battleLog,
      name
    );
  }
  return damage;
};
