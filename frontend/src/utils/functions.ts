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
export const calculateDaysUntil72 = (birthDate:any) => {
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
