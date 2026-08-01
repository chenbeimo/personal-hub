import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ListTodo, Trophy, Play } from 'lucide-react';
import useTodoStore from '../stores/todoStore';
import TodoItem from '../components/TodoItem';
import ProgressRing from '../components/ProgressRing';
import EmptyState from '../components/EmptyState';
import { triggerConfetti, isLateNight, getLateNightMessage } from '../utils/animations';
import { useAnimatedNumber, useStaggerAnimation } from '../hooks/useAnimations';
import PageTransition from '../components/PageTransition';

const BILIBILI_WEB_URL = 'https://www.bilibili.com';
const BILIBILI_APP_SCHEME = 'bilibili://';

const defaultTasks = [
  { text: '运动', category: '默认' },
  { text: '阅读', category: '默认' },
  { text: '英语学习', category: '默认' },
  { text: '晚十点睡觉', category: '默认' },
];

export default function DailyPlan() {
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('默认');
  const [showAllDone, setShowAllDone] = useState(false);
  const [lateNightMessage, setLateNightMessage] = useState(null);
  const prevCompletedRef = useRef(0);
  const {
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    filter,
    setFilter,
    getFilteredTodos,
    getTodayStats,
    clearCompleted,
  } = useTodoStore();

  const todos = getFilteredTodos();
  const stats = getTodayStats();
  const animatedPercentage = useAnimatedNumber(stats.percentage, 500);
  const visibleItems = useStaggerAnimation(todos.length, 50);

  // 检查深夜提示
  useEffect(() => {
    if (isLateNight()) {
      setLateNightMessage(getLateNightMessage());
    }
  }, []);

  // 检查是否全部完成
  useEffect(() => {
    if (stats.total > 0 && stats.completed === stats.total && !showAllDone) {
      setShowAllDone(true);
      triggerConfetti();
      setTimeout(() => setShowAllDone(false), 3000);
    }
    prevCompletedRef.current = stats.completed;
  }, [stats.completed, stats.total]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTodo(newTask.trim(), selectedCategory);
      setNewTask('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleAddDefaultTasks = () => {
    defaultTasks.forEach((task) => {
      addTodo(task.text, task.category);
    });
  };

  // 打开 B 站（移动端尝试打开 App，否则打开网页）
  const handleOpenBilibili = () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      // 移动端：尝试打开 App
      const startTime = Date.now();
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = BILIBILI_APP_SCHEME;
      document.body.appendChild(iframe);

      // 如果 2 秒后还在，说明 App 没打开，跳转网页
      setTimeout(() => {
        const endTime = Date.now();
        if (endTime - startTime < 2500) {
          window.location.href = BILIBILI_WEB_URL;
        }
        document.body.removeChild(iframe);
      }, 2000);
    } else {
      // 电脑端：直接打开网页
      window.open(BILIBILI_WEB_URL, '_blank');
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Late Night Warning */}
        {lateNightMessage && (
          <div className="glass-card p-4 bg-indigo-50/50 border-indigo-200 animate-fade-in">
            <p className="text-sm text-indigo-700 text-center">
              {lateNightMessage}
            </p>
          </div>
        )}

        {/* All Done Celebration */}
        {showAllDone && (
          <div className="glass-card p-6 bg-green-50/50 border-green-200 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="text-yellow-500" size={24} />
              <p className="text-lg font-semibold text-green-700">
                🎉 今日任务全部完成！
              </p>
            </div>
          </div>
        )}

        {/* Stats Card */}
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                今日待办清单
              </h3>
              <p className="text-sm text-gray-500">
                已完成 {stats.completed}/{stats.total}
              </p>
            </div>
            <ProgressRing percentage={animatedPercentage} />
          </div>
        </div>

        {/* Bilibili 快捷入口 */}
        <button
          onClick={handleOpenBilibili}
          className="w-full glass-card p-4 flex items-center justify-between group hover:shadow-lg transition-all duration-200 btn-press"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Play size={20} className="text-white ml-0.5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">想学习？来 B 站！</p>
              <p className="text-xs text-gray-500">点击打开哔哩哔哩</p>
            </div>
          </div>
          <div className="text-pink-500 group-hover:translate-x-1 transition-transform">
            →
          </div>
        </button>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'active', label: '进行中' },
            { key: 'completed', label: '已完成' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 btn-press ${
                filter === tab.key
                  ? 'bg-purple-500/20 text-purple-700 font-medium'
                  : 'bg-white/40 text-gray-600 hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="ml-auto px-4 py-2 rounded-xl text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center gap-1 btn-press"
            >
              <Trash2 size={14} />
              清除已完成
            </button>
          )}
        </div>

        {/* Todo List */}
        <div className="glass-card p-4 space-y-2">
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                index={index}
              />
            ))
          ) : (
            <EmptyState
              icon={ListTodo}
              title="暂无待办事项"
              description="添加一些任务开始你的一天吧！"
            />
          )}

          {/* Quick add default tasks if empty */}
          {stats.total === 0 && (
            <div className="pt-4 border-t border-white/40">
              <button
                onClick={handleAddDefaultTasks}
                className="w-full py-3 rounded-xl border-2 border-dashed border-purple-200 text-purple-500 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 text-sm btn-press"
              >
                + 添加默认任务（运动、阅读、英语学习、晚十点睡觉）
              </button>
            </div>
          )}
        </div>

        {/* Add Task Input */}
        <div className="glass-card p-4">
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-sm"
            >
              <option value="默认">默认</option>
              <option value="工作">工作</option>
              <option value="学习">学习</option>
              <option value="生活">生活</option>
            </select>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="添加自定义任务..."
              className="flex-1 input-field input-glow"
            />
            <button
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-press"
            >
              <Plus size={18} />
              添加
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
