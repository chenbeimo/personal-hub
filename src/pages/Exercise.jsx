import { useState } from 'react';
import { Dumbbell, Flame, Trophy, Plus, Check } from 'lucide-react';
import useHabitStore from '../stores/habitStore';
import EmptyState from '../components/EmptyState';

const exerciseTypes = [
  { id: 'running', label: '🏃 跑步', icon: '🏃' },
  { id: 'swimming', label: '🏊 游泳', icon: '🏊' },
  { id: 'gym', label: '💪 健身', icon: '💪' },
  { id: 'yoga', label: '🧘 瑜伽', icon: '🧘' },
  { id: 'walking', label: '🚶 散步', icon: '🚶' },
  { id: 'cycling', label: '🚴 骑行', icon: '🚴' },
];

export default function Exercise() {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('running');
  const [duration, setDuration] = useState(30);
  const {
    addExerciseRecord,
    getExerciseStreak,
    isExercisedToday,
    habits,
  } = useHabitStore();

  const streak = getExerciseStreak();
  const exercisedToday = isExercisedToday();
  const recentRecords = habits.exercise.records.slice(-7).reverse();

  const handleCheckIn = () => {
    const typeInfo = exerciseTypes.find((t) => t.id === selectedType);
    addExerciseRecord(typeInfo.label, duration);
    setShowForm(false);
  };

  const todayRecords = habits.exercise.records.filter(
    (r) => r.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <Flame className="mx-auto mb-2 text-orange-500" size={28} />
          <p className="text-2xl font-bold text-gray-800">{streak}</p>
          <p className="text-sm text-gray-500">连续打卡天数</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Trophy className="mx-auto mb-2 text-yellow-500" size={28} />
          <p className="text-2xl font-bold text-gray-800">
            {habits.exercise.records.length}
          </p>
          <p className="text-sm text-gray-500">总打卡次数</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Dumbbell className="mx-auto mb-2 text-purple-500" size={28} />
          <p className="text-2xl font-bold text-gray-800">
            {exercisedToday ? '✓' : '✗'}
          </p>
          <p className="text-sm text-gray-500">今日状态</p>
        </div>
      </div>

      {/* Check-in Button */}
      <div className="glass-card p-6">
        {exercisedToday ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              今日已打卡！
            </h3>
            <p className="text-sm text-gray-500">
              继续保持，明天也要加油哦～
            </p>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Dumbbell size={36} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-1">
              今日打卡
            </h3>
            <p className="text-sm text-gray-500">
              点击记录今天的运动
            </p>
          </div>
        )}
      </div>

      {/* Check-in Form */}
      {showForm && (
        <div className="glass-card p-6 animate-slide-in">
          <h4 className="font-medium text-gray-700 mb-4">记录运动</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                运动类型
              </label>
              <div className="grid grid-cols-3 gap-2">
                {exerciseTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-3 rounded-xl text-center transition-all duration-200 ${
                      selectedType === type.id
                        ? 'bg-purple-500/20 border-2 border-purple-400'
                        : 'bg-white/40 border-2 border-transparent hover:bg-white/60'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <p className="text-xs mt-1">{type.label.split(' ')[1]}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                运动时长（分钟）
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="10"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-medium text-purple-700 w-16 text-center">
                  {duration}分钟
                </span>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                取消
              </button>
              <button onClick={handleCheckIn} className="btn-primary">
                确认打卡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Records */}
      {todayRecords.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="font-medium text-gray-700 mb-3">今日运动记录</h4>
          <div className="space-y-2">
            {todayRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-white/40 rounded-xl"
              >
                <span className="text-gray-700">{record.type}</span>
                <span className="text-sm text-purple-600">
                  {record.duration}分钟
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Records */}
      {recentRecords.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="font-medium text-gray-700 mb-3">最近打卡记录</h4>
          <div className="space-y-2">
            {recentRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-white/40 rounded-xl"
              >
                <div>
                  <span className="text-gray-700">{record.type}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {record.date}
                  </span>
                </div>
                <span className="text-sm text-purple-600">
                  {record.duration}分钟
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {habits.exercise.records.length === 0 && !showForm && (
        <div className="glass-card p-8">
          <EmptyState
            icon={Dumbbell}
            title="开始你的运动之旅"
            description="点击上方按钮记录你的第一次运动"
          />
        </div>
      )}
    </div>
  );
}
