import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToday } from '../utils/dateUtils';

const mealTypes = [
  { id: 'breakfast', label: '早餐', icon: '🌅', time: '07:00-09:00' },
  { id: 'lunch', label: '中餐', icon: '☀️', time: '11:30-13:00' },
  { id: 'dinner', label: '晚餐', icon: '🌙', time: '17:30-19:30' },
];

const mealTags = [
  { id: 'healthy', label: '健康', color: 'bg-green-100 text-green-700' },
  { id: 'light', label: '清淡', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'simple', label: '简单', color: 'bg-blue-100 text-blue-700' },
  { id: 'rich', label: '丰盛', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'takeout', label: '外卖', color: 'bg-orange-100 text-orange-700' },
  { id: 'oily', label: '油腻', color: 'bg-red-100 text-red-700' },
];

const useMealStore = create(
  persist(
    (set, get) => ({
      meals: [],
      selectedDate: getToday(),

      setSelectedDate: (date) => set({ selectedDate: date }),

      addMeal: (meal) => {
        const { meals, selectedDate } = get();
        const existingIndex = meals.findIndex(
          (m) => m.date === selectedDate && m.type === meal.type
        );

        if (existingIndex >= 0) {
          // 更新已存在的记录
          const updatedMeals = [...meals];
          updatedMeals[existingIndex] = {
            ...updatedMeals[existingIndex],
            content: meal.content,
            tags: meal.tags,
            notes: meal.notes,
            updatedAt: new Date().toISOString(),
          };
          set({ meals: updatedMeals });
        } else {
          // 新增记录
          const newMeal = {
            id: Date.now(),
            date: selectedDate,
            type: meal.type,
            content: meal.content || '',
            tags: meal.tags || [],
            notes: meal.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set({ meals: [...meals, newMeal] });
        }
      },

      updateMeal: (id, updates) => {
        set((state) => ({
          meals: state.meals.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      deleteMeal: (id) => {
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
        }));
      },

      getMealsByDate: (date) => {
        const { meals } = get();
        return meals.filter((m) => m.date === date);
      },

      getTodayMeals: () => {
        const { meals } = get();
        const today = getToday();
        return meals.filter((m) => m.date === today);
      },

      getMealByDateAndType: (date, type) => {
        const { meals } = get();
        return meals.find((m) => m.date === date && m.type === type);
      },

      getStats: () => {
        const { meals } = get();
        const today = getToday();
        const todayMeals = meals.filter((m) => m.date === today);

        return {
          total: meals.length,
          todayCount: todayMeals.length,
          healthyCount: meals.filter((m) => m.tags.includes('healthy')).length,
          streak: calculateStreak(meals),
        };
      },
    }),
    {
      name: 'ph_meals',
    }
  )
);

// 计算连续记录天数
function calculateStreak(meals) {
  if (meals.length === 0) return 0;

  const dates = [...new Set(meals.map((m) => m.date))].sort().reverse();
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedStr = expectedDate.toISOString().split('T')[0];

    if (dates[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export { mealTypes, mealTags };
export default useMealStore;
