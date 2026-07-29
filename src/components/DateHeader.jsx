import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': '每日计划',
  '/videos': '爆款视频',
  '/ideas': '灵感记录',
  '/exercise': '锻炼身体',
  '/reading': '每日阅读',
  '/english': '英语学习',
};

export default function DateHeader() {
  const [dateInfo, setDateInfo] = useState('');
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || '个人工作台';

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
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="px-4 md:px-6 py-3 md:py-4 bg-white/20 backdrop-blur-sm border-b border-white/30 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="md:hidden text-lg">🟣</span>
          <h2 className="text-base md:text-lg font-medium text-gray-700">
            {pageTitle}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-gray-500">{dateInfo}</span>
        </div>
      </div>
    </header>
  );
}
