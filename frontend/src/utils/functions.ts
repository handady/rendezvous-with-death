import dayjs from "dayjs";

// 格式化日期 年月日时分秒
export const formatDate = (date: any) => {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 格式化日期 年月日
export const formatDate2 = (date: any) => {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

// 计算出生日期到72岁有多少天
export const calculateDaysUntil72 = (birthDate: any) => {
  // 使用 moment 解析传入的日期字符串
  const birth = dayjs(birthDate, "YYYY-MM-DD");

  // 确保解析成功
  if (!birth.isValid()) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD.");
  }

  // 计算72岁生日
  const deathDate = birth.clone().add(72, "years");

  // 计算天数差异
  const days = deathDate.diff(birth, "days");

  return days;
};

// 计算从出生日期到当前日期已经过的天数
export const calculateDaysPassed = (birthDate: any) => {
  // 使用 moment 解析传入的日期字符串
  const birth = dayjs(birthDate, "YYYY-MM-DD");

  // 确保解析成功
  if (!birth.isValid()) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD.");
  }

  // 计算当前日期
  const now = dayjs();

  // 计算天数差异
  const days = now.diff(birth, "days");

  return days;
};

// 分割字符串提取主题
export const splitTheme = (theme: string) => {
  // 定义所有可能的分隔符
  const separators = /[-,，、。？！\s]/g;
  // 使用正则表达式分割字符串并过滤掉空字符串
  return theme
    .split(separators)
    .filter((item) => item !== "")
    .map((item) => item.trim());
};

// 随机生成颜色代码
export const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// 计算属性
export const calculateAttributes = (attributes) => {
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

// 计算属性1
export const calculateAttributes1 = (attributes) => {
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
