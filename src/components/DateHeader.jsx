import { useState, useEffect } from 'react';

export default function DateHeader() {
  const [dateInfo, setDateInfo] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const weekDay = weekDays[now.getDay()];
      setDateInfo(`${year}-${month}-${day}  ${weekDay}`);
    };

    updateDate();
    const timer = setInterval(updateDate, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="px-6 py-4 bg-white/20 backdrop-blur-sm border-b border-white/30">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-700">每日计划</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{dateInfo}</span>
        </div>
      </div>
    </header>
  );
}
