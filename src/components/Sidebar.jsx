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
  { path: '/', icon: Calendar, label: '每日计划' },
  { path: '/videos', icon: Video, label: '爆款视频' },
  { path: '/ideas', icon: Lightbulb, label: '灵感记录' },
  { path: '/exercise', icon: Dumbbell, label: '锻炼身体' },
  { path: '/reading', icon: BookOpen, label: '每日阅读' },
  { path: '/english', icon: Languages, label: '英语学习' },
  { path: '/review', icon: FileText, label: '每日复盘' },
  { path: '/jobs', icon: Briefcase, label: '求职追踪' },
  { path: '/meals', icon: Utensils, label: '好好吃饭' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white/30 backdrop-blur-lg border-r border-white/40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/40">
        <h1 className="text-xl font-bold text-purple-800 flex items-center gap-2">
          <span className="text-2xl">🟣</span>
          个人工作台
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : 'text-gray-600'}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/40">
        <p className="text-xs text-gray-500 text-center">
          Personal Hub v1.0
        </p>
      </div>
    </aside>
  );
}
