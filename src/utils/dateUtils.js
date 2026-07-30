// 获取今天日期字符串 YYYY-MM-DD
export const getToday = () => new Date().toISOString().split('T')[0];

// 日期加减
export const addDays = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// 格式化显示：07月30日 星期三
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekDay = weekDays[date.getDay()];
  return `${month}月${day}日 ${weekDay}`;
};

// 格式化为完整日期：2026年07月30日 星期三
export const formatFullDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekDay = weekDays[date.getDay()];
  return `${year}年${month}月${day}日 ${weekDay}`;
};

// 判断是否是今天
export const isToday = (dateStr) => {
  return dateStr === getToday();
};

// 判断是否是未来日期
export const isFuture = (dateStr) => {
  return dateStr > getToday();
};

// 获取相对日期描述
export const getRelativeDate = (dateStr) => {
  const today = getToday();
  if (dateStr === today) return '今天';

  const yesterday = addDays(today, -1);
  if (dateStr === yesterday) return '昨天';

  const tomorrow = addDays(today, 1);
  if (dateStr === tomorrow) return '明天';

  return formatDate(dateStr);
};

// 格式化时间：14:30
export const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 格式化日期时间：07-30 14:30
export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
};

// 获取本周起止日期
export const getWeekRange = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
};

// 获取本月起止日期
export const getMonthRange = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    start: firstDay.toISOString().split('T')[0],
    end: lastDay.toISOString().split('T')[0],
  };
};
