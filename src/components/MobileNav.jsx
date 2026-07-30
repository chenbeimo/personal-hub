import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Video,
  Lightbulb,
  Dumbbell,
  BookOpen,
  Languages,
  FileText,
  Briefcase,
  Utensils,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Calendar, label: '计划' },
  { path: '/videos', icon: Video, label: '视频' },
  { path: '/ideas', icon: Lightbulb, label: '灵感' },
  { path: '/exercise', icon: Dumbbell, label: '锻炼' },
  { path: '/reading', icon: BookOpen, label: '阅读' },
  { path: '/english', icon: Languages, label: '英语' },
  { path: '/review', icon: FileText, label: '复盘' },
  { path: '/jobs', icon: Briefcase, label: '求职' },
  { path: '/meals', icon: Utensils, label: '吃饭' },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-purple-100 z-50 safe-area-bottom">
      <div className="flex items-center h-16 px-1 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[60px] h-full transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? 'text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={isActive ? 'text-purple-600' : ''}
                />
                <span className="text-[10px] mt-0.5 font-medium">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-purple-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
