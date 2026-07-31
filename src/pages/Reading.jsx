import { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Clock,
  Flame,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Timer,
  Trophy,
} from 'lucide-react';
import useReadingStore from '../stores/readingStore';
import ReadingTimer from '../components/ReadingTimer';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
import { triggerConfetti } from '../utils/animations';

const FANQIE_URL = 'https://fanqienovel.com/';

export default function Reading() {
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState({
    bookName: '',
    duration: 30,
    note: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showAchievement, setShowAchievement] = useState(null);
  const timerRef = useRef(null);

  const {
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateElapsedSeconds,
    setTimerBookName,
    saveRecord,
    addManualRecord,
    deleteRecord,
    getTodayRecords,
    getTodayDuration,
    getTodayCount,
    getStreak,
    getBookNames,
  } = useReadingStore();

  const todayRecords = getTodayRecords();
  const todayDuration = getTodayDuration();
  const todayCount = getTodayCount();
  const streak = getStreak();
  const bookNames = getBookNames();

  // 计时器更新
  useEffect(() => {
    if (timer.isTiming && !timer.isPaused) {
      timerRef.current = setInterval(() => {
        updateElapsedSeconds();
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer.isTiming, timer.isPaused]);

  // 检查成就
  useEffect(() => {
    // 单日阅读满 30 分钟
    if (todayDuration >= 30 && !showAchievement) {
      const savedAchievements = JSON.parse(
        localStorage.getItem('ph_reading_achievements') || '{}'
      );
      const today = new Date().toISOString().split('T')[0];
      if (!savedAchievements[`daily_${today}`]) {
        setShowAchievement('daily');
        savedAchievements[`daily_${today}`] = true;
        localStorage.setItem(
          'ph_reading_achievements',
          JSON.stringify(savedAchievements)
        );
        setTimeout(() => setShowAchievement(null), 3000);
      }
    }

    // 连续 7 天阅读
    if (streak >= 7) {
      const savedAchievements = JSON.parse(
        localStorage.getItem('ph_reading_achievements') || '{}'
      );
      if (!savedAchievements['streak_7']) {
        setShowAchievement('streak');
        savedAchievements['streak_7'] = true;
        localStorage.setItem(
          'ph_reading_achievements',
          JSON.stringify(savedAchievements)
        );
        triggerConfetti();
        setTimeout(() => setShowAchievement(null), 3000);
      }
    }
  }, [todayDuration, streak]);

  // 打开番茄小说
  const handleOpenFanqie = () => {
    window.open(FANQIE_URL, '_blank');
    // 自动开始计时（可选）
    if (!timer.isTiming) {
      startTimer('');
    }
  };

  // 开始计时
  const handleStart = () => {
    startTimer('');
  };

  // 暂停计时
  const handlePause = () => {
    pauseTimer();
  };

  // 继续计时
  const handleResume = () => {
    resumeTimer();
  };

  // 结束计时并保存
  const handleStop = ({ note, bookName }) => {
    const duration = Math.floor(timer.elapsedSeconds / 60);
    const now = new Date();
    const startTime = new Date(timer.startTime);
    const endTime = now;

    if (duration > 0) {
      saveRecord({
        bookName: bookName || '未命名',
        duration,
        startTime: `${startTime.getHours().toString().padStart(2, '0')}:${startTime
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
        endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
        note,
        source: '番茄小说',
      });
    }
  };

  // 手动添加记录
  const handleAddManual = (e) => {
    e.preventDefault();
    if (manualForm.bookName.trim() && manualForm.duration > 0) {
      addManualRecord({
        ...manualForm,
        startTime: '',
        endTime: '',
        source: '手动记录',
      });
      setManualForm({
        bookName: '',
        duration: 30,
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowManualForm(false);
    }
  };

  // 格式化时间
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* 成就提示 */}
        {showAchievement === 'daily' && (
          <div className="glass-card p-4 bg-green-50/50 border-green-200 animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              <p className="text-sm font-medium text-green-700">
                今日阅读达标 ✓ 已阅读 30 分钟！
              </p>
            </div>
          </div>
        )}

        {showAchievement === 'streak' && (
          <div className="glass-card p-4 bg-orange-50/50 border-orange-200 animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <Flame className="text-orange-500 animate-fire" size={20} />
              <p className="text-sm font-medium text-orange-700">
                🎉 解锁「书虫」成就！连续阅读 7 天！
              </p>
            </div>
          </div>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center card-hover">
            <Clock className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{todayDuration}</p>
            <p className="text-xs text-gray-500">今日分钟</p>
          </div>
          <div className="glass-card p-4 text-center card-hover">
            <BookOpen className="mx-auto mb-2 text-green-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{todayCount}</p>
            <p className="text-xs text-gray-500">今日次数</p>
          </div>
          <div className="glass-card p-4 text-center card-hover">
            <Flame
              className={`mx-auto mb-2 text-orange-500 ${streak > 0 ? 'animate-fire' : ''}`}
              size={24}
            />
            <p className="text-2xl font-bold text-gray-800">{streak}</p>
            <p className="text-xs text-gray-500">连续天数</p>
          </div>
        </div>

        {/* 快捷按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleOpenFanqie}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 btn-press"
          >
            <span className="text-lg">🍅</span>
            打开番茄小说
            <ExternalLink size={16} />
          </button>
          {!timer.isTiming && (
            <button
              onClick={handleStart}
              className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3 btn-press"
            >
              <Timer size={18} />
              开始计时
            </button>
          )}
        </div>

        {/* 计时器 */}
        <ReadingTimer
          isTiming={timer.isTiming}
          isPaused={timer.isPaused}
          elapsedSeconds={timer.elapsedSeconds}
          bookName={timer.bookName}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          onBookNameChange={setTimerBookName}
        />

        {/* 阅读记录 */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              📋 阅读记录
            </h4>
            <button
              onClick={() => setShowManualForm(true)}
              className="btn-secondary text-sm flex items-center gap-1 btn-press"
            >
              <Plus size={14} />
              手动添加
            </button>
          </div>

          {todayRecords.length > 0 ? (
            <div className="space-y-3">
              {todayRecords.map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-white/40 rounded-xl hover:bg-white/60 transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">
                        📖 《{record.bookName}》
                      </span>
                      <span className="text-sm text-purple-600">
                        {record.duration} 分钟
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {record.startTime && record.endTime && (
                        <span>
                          {record.startTime} - {record.endTime}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {record.source}
                      </span>
                    </div>
                    {record.note && (
                      <p className="text-sm text-gray-500 mt-1">
                        📝 {record.note}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteRecord(new Date().toISOString().split('T')[0], record.id)}
                    className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 btn-press"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="今日暂无阅读记录"
              description="打开番茄小说开始阅读，或手动添加记录"
            />
          )}
        </div>

        {/* 手动添加表单 */}
        {showManualForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card w-full max-w-md p-6 animate-slide-in">
              <h4 className="font-medium text-gray-800 mb-4">
                手动添加阅读记录
              </h4>
              <form onSubmit={handleAddManual} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    书名 *
                  </label>
                  <input
                    type="text"
                    value={manualForm.bookName}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, bookName: e.target.value })
                    }
                    placeholder="输入书名..."
                    className="input-field"
                    required
                    list="book-names"
                  />
                  <datalist id="book-names">
                    {bookNames.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    阅读时长（分钟）*
                  </label>
                  <input
                    type="number"
                    value={manualForm.duration}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    className="input-field"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    日期
                  </label>
                  <input
                    type="date"
                    value={manualForm.date}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, date: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    备注（可选）
                  </label>
                  <textarea
                    value={manualForm.note}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, note: e.target.value })
                    }
                    placeholder="记录一些感想..."
                    className="input-field h-20 resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(false)}
                    className="btn-secondary btn-press"
                  >
                    取消
                  </button>
                  <button type="submit" className="btn-primary btn-press">
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
