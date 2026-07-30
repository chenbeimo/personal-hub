import { useState } from 'react';
import { Utensils, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import useMealStore, { mealTypes, mealTags } from '../stores/mealStore';
import { getToday, addDays, getRelativeDate, isFuture } from '../utils/dateUtils';
import EmptyState from '../components/EmptyState';

export default function MealTracker() {
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [formData, setFormData] = useState({
    type: 'breakfast',
    content: '',
    tags: [],
    notes: '',
  });

  const {
    meals,
    selectedDate,
    setSelectedDate,
    addMeal,
    deleteMeal,
    getMealsByDate,
    getStats,
  } = useMealStore();

  const stats = getStats();
  const dayMeals = getMealsByDate(selectedDate);

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

  const handleAddMeal = (type) => {
    const existingMeal = dayMeals.find((m) => m.type === type);
    if (existingMeal) {
      setEditingMeal(existingMeal);
      setFormData({
        type: existingMeal.type,
        content: existingMeal.content,
        tags: existingMeal.tags,
        notes: existingMeal.notes,
      });
    } else {
      setEditingMeal(null);
      setFormData({
        type,
        content: '',
        tags: [],
        notes: '',
      });
    }
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.content.trim()) {
      addMeal(formData);
      setShowForm(false);
      setFormData({ type: 'breakfast', content: '', tags: [], notes: '' });
    }
  };

  const handleToggleTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const getMealByType = (type) => {
    return dayMeals.find((m) => m.type === type);
  };

  const getTagInfo = (tagId) => {
    return mealTags.find((t) => t.id === tagId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              🍱 好好吃饭
            </h3>
            <p className="text-sm text-gray-500">
              连续记录 {stats.streak} 天 · 今日 {stats.todayCount}/3 餐
            </p>
          </div>
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

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mealTypes.map((type) => {
          const meal = getMealByType(type.id);
          return (
            <div key={type.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-medium text-gray-800">{type.label}</span>
                </div>
                {meal && (
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {meal ? (
                <div>
                  <p className="text-gray-700 mb-2">{meal.content}</p>
                  {meal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {meal.tags.map((tagId) => {
                        const tag = getTagInfo(tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className={`text-xs px-2 py-1 rounded-full ${tag.color}`}
                          >
                            {tag.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                  {meal.notes && (
                    <p className="text-sm text-gray-500">{meal.notes}</p>
                  )}
                  <button
                    onClick={() => handleAddMeal(type.id)}
                    className="mt-3 w-full py-2 rounded-xl text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    编辑记录
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddMeal(type.id)}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-purple-200 text-purple-500 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  添加记录
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800">
                {editingMeal ? '编辑记录' : '添加记录'}
              </h4>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Meal Type */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  餐别
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: type.id })
                      }
                      className={`p-3 rounded-xl text-center transition-all ${
                        formData.type === type.id
                          ? 'bg-purple-500/20 border-2 border-purple-400'
                          : 'bg-white/40 border-2 border-transparent hover:bg-white/60'
                      }`}
                    >
                      <span className="text-xl">{type.icon}</span>
                      <p className="text-xs mt-1">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  吃了什么
                </label>
                <input
                  type="text"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="记录你的餐食..."
                  className="input-field"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {mealTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        formData.tags.includes(tag.id)
                          ? tag.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  备注
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="添加备注..."
                  className="input-field h-20 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  {editingMeal ? '更新' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {dayMeals.length === 0 && !showForm && (
        <div className="glass-card p-8">
          <EmptyState
            icon={Utensils}
            title="今天还没有记录"
            description="点击上方卡片开始记录你的餐食"
          />
        </div>
      )}
    </div>
  );
}
