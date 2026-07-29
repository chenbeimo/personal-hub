import { useState } from 'react';
import { Plus, Trash2, ListTodo } from 'lucide-react';
import useTodoStore from '../stores/todoStore';
import TodoItem from '../components/TodoItem';
import ProgressRing from '../components/ProgressRing';
import EmptyState from '../components/EmptyState';

const defaultTasks = [
  { text: '运动', category: '默认' },
  { text: '阅读', category: '默认' },
  { text: '英语学习', category: '默认' },
  { text: '晚十点睡觉', category: '默认' },
];

export default function DailyPlan() {
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('默认');
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              今日待办清单
            </h3>
            <p className="text-sm text-gray-500">
              已完成 {stats.completed}/{stats.total}
            </p>
          </div>
          <ProgressRing percentage={stats.percentage} />
        </div>
      </div>

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
            className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
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
            className="ml-auto px-4 py-2 rounded-xl text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 flex items-center gap-1"
          >
            <Trash2 size={14} />
            清除已完成
          </button>
        )}
      </div>

      {/* Todo List */}
      <div className="glass-card p-4 space-y-2">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
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
              className="w-full py-3 rounded-xl border-2 border-dashed border-purple-200 text-purple-500 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 text-sm"
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
            className="flex-1 input-field"
          />
          <button
            onClick={handleAddTask}
            disabled={!newTask.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            添加
          </button>
        </div>
      </div>
    </div>
  );
}
