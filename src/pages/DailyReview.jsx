import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Save,
  Edit2,
  Trash2,
  History,
  Flame,
  Check,
} from 'lucide-react';
import useReviewStore from '../stores/reviewStore';
import {
  getToday,
  addDays,
  getRelativeDate,
  isToday,
  isFuture,
  formatDate,
} from '../utils/dateUtils';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';

export default function DailyReview() {
  const [formData, setFormData] = useState({
    summary: '',
    gains: '',
    improvements: '',
    tomorrowPlan: '',
  });
  const [showHistory, setShowHistory] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    selectedDate,
    setSelectedDate,
    isEditing,
    setIsEditing,
    saveReview,
    saveDraft,
    loadDraft,
    clearDraft,
    getReviewByDate,
    getHistory,
    deleteReview,
    getStats,
  } = useReviewStore();

  const stats = getStats();
  const currentReview = getReviewByDate(selectedDate);
  const history = getHistory();
  const canEdit = isToday(selectedDate);

  // 加载数据
  useEffect(() => {
    if (canEdit) {
      // 优先加载草稿
      const draft = loadDraft();
      if (draft && draft.date === selectedDate) {
        setFormData(draft);
        setIsEditing(true);
      } else if (currentReview) {
        setFormData({
          summary: currentReview.summary,
          gains: currentReview.gains,
          improvements: currentReview.improvements,
          tomorrowPlan: currentReview.tomorrowPlan,
        });
        setIsEditing(false);
      } else {
        setFormData({
          summary: '',
          gains: '',
          improvements: '',
          tomorrowPlan: '',
        });
        setIsEditing(true);
      }
    } else if (currentReview) {
      setFormData({
        summary: currentReview.summary,
        gains: currentReview.gains,
        improvements: currentReview.improvements,
        tomorrowPlan: currentReview.tomorrowPlan,
      });
      setIsEditing(false);
    } else {
      setFormData({
        summary: '',
        gains: '',
        improvements: '',
        tomorrowPlan: '',
      });
      setIsEditing(false);
    }
  }, [selectedDate, currentReview]);

  // 自动保存草稿
  const autoSaveDraft = useCallback(() => {
    if (canEdit && isEditing) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      const timer = setTimeout(() => {
        saveDraft({ ...formData, date: selectedDate });
      }, 3000);
      setAutoSaveTimer(timer);
    }
  }, [formData, canEdit, isEditing, selectedDate]);

  useEffect(() => {
    autoSaveDraft();
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [formData]);

  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    if (!isFuture(nextDay)) {
      setSelectedDate(nextDay);
    }
  };

  const handleToday = () => {
    setSelectedDate(getToday());
  };

  const handleSave = () => {
    saveReview(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // 计算字数
  useEffect(() => {
    const total = Object.values(formData).reduce((sum, text) => sum + text.length, 0);
    setCharCount(total);
  }, [formData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (confirm('确定要删除这篇复盘吗？')) {
      deleteReview(selectedDate);
      setFormData({
        summary: '',
        gains: '',
        improvements: '',
        tomorrowPlan: '',
      });
    }
  };

  const handleSelectHistory = (date) => {
    setSelectedDate(date);
    setShowHistory(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Streak Badge */}
        {stats.streak >= 3 && (
          <div className="glass-card p-4 bg-orange-50/50 border-orange-200 animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <Flame className="text-orange-500 animate-fire" size={20} />
              <p className="text-sm font-medium text-orange-700">
                连续复盘 {stats.streak} 天！继续保持 🔥
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                📝 每日复盘
              </h3>
              <p className="text-sm text-gray-500">
                已记录 {stats.total} 篇 · 连续 {stats.streak} 天
              </p>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="btn-secondary flex items-center gap-2 btn-press"
            >
              <History size={18} />
              历史
            </button>
          </div>
        </div>

      {/* Date Switcher */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl hover:bg-white/60 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-2 rounded-xl hover:bg-white/60 transition-colors"
          >
            <span className="font-medium text-gray-800">
              📅 {getRelativeDate(selectedDate)}
            </span>
          </button>
          <button
            onClick={handleNextDay}
            disabled={isFuture(addDays(selectedDate, 1))}
            className="p-2 rounded-xl hover:bg-white/60 transition-colors disabled:opacity-50"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Review Editor */}
      <div className="glass-card p-6">
        {canEdit || isEditing ? (
          // 编辑模式
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📋 今日总结：今天做了什么？
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                placeholder="记录今天的工作和生活..."
                className="input-field h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💡 今日收获：有什么收获？
              </label>
              <textarea
                value={formData.gains}
                onChange={(e) => handleChange('gains', e.target.value)}
                placeholder="学到了什么新知识或技能..."
                className="input-field h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔧 改进空间：哪里可以改进？
              </label>
              <textarea
                value={formData.improvements}
                onChange={(e) => handleChange('improvements', e.target.value)}
                placeholder="有哪些不足和改进点..."
                className="input-field h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 明日计划：明天要做什么？
              </label>
              <textarea
                value={formData.tomorrowPlan}
                onChange={(e) => handleChange('tomorrowPlan', e.target.value)}
                placeholder="规划明天的任务..."
                className="input-field h-24 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {charCount > 0 ? `已输入 ${charCount} 字` : ''}
              </span>
              <div className="flex gap-3">
                {!canEdit && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary btn-press"
                  >
                    取消
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className={`btn-primary flex items-center gap-2 btn-press ${
                    saveSuccess ? 'bg-green-500 animate-success-flash' : ''
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check size={18} />
                      已保存
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      保存复盘
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : currentReview ? (
          // 查看模式
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                📋 今日总结
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap bg-white/40 p-4 rounded-xl">
                {currentReview.summary || '未填写'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                💡 今日收获
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap bg-white/40 p-4 rounded-xl">
                {currentReview.gains || '未填写'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                🔧 改进空间
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap bg-white/40 p-4 rounded-xl">
                {currentReview.improvements || '未填写'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                📅 明日计划
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap bg-white/40 p-4 rounded-xl">
                {currentReview.tomorrowPlan || '未填写'}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDelete}
                className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={18} />
                删除
              </button>
              <button
                onClick={handleEdit}
                className="btn-primary flex items-center gap-2"
              >
                <Edit2 size={18} />
                编辑
              </button>
            </div>
          </div>
        ) : (
          // 空状态
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              这天还没有复盘
            </h3>
            <p className="text-sm text-gray-500">
              {canEdit ? '开始记录今天吧！' : '切换到今天开始记录'}
            </p>
          </div>
        )}
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className="glass-card p-5">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <History size={18} />
            历史复盘
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.length > 0 ? (
              history.map((review) => (
                <button
                  key={review.date}
                  onClick={() => handleSelectHistory(review.date)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    review.date === selectedDate
                      ? 'bg-purple-500/20'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(review.date)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {isToday(review.date) ? '今天' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {review.summary || '未填写总结'}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                暂无历史记录
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentReview && !isEditing && (
        <div className="glass-card p-8">
          <EmptyState
            icon={FileText}
            title="开始你的每日复盘"
            description="记录每天的收获与成长，成为更好的自己"
          />
        </div>
      )}
      </div>
    </PageTransition>
  );
}
