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
  const birth = new Date(birthDate) as any;
  const deathDate = new Date(birth) as any;
  deathDate.setFullYear(deathDate.getFullYear() + 72);

  const timeDiff = deathDate - birth;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return days;
};

// 计算从出生日期到当前日期已经过的天数
export const calculateDaysPassed = (birthDate: any) => {
  const birth = new Date(birthDate) as any;
  const currentDate = new Date() as any;

  const timeDiff = currentDate - birth;
  const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysPassed;
};
