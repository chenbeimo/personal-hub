import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToday } from '../utils/dateUtils';

const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: [],
      selectedDate: getToday(),
      draft: null,
      isEditing: false,

      setSelectedDate: (date) => set({ selectedDate: date }),
      setIsEditing: (isEditing) => set({ isEditing }),

      // 保存复盘
      saveReview: (review) => {
        const { reviews, selectedDate } = get();
        const existingIndex = reviews.findIndex((r) => r.date === selectedDate);

        const reviewData = {
          date: selectedDate,
          summary: review.summary || '',
          gains: review.gains || '',
          improvements: review.improvements || '',
          tomorrowPlan: review.tomorrowPlan || '',
          updatedAt: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          const updatedReviews = [...reviews];
          updatedReviews[existingIndex] = reviewData;
          set({ reviews: updatedReviews, draft: null, isEditing: false });
        } else {
          set({
            reviews: [reviewData, ...reviews],
            draft: null,
            isEditing: false,
          });
        }

        // 清除草稿
        localStorage.removeItem('ph_review_draft');
      },

      // 保存草稿
      saveDraft: (draft) => {
        set({ draft });
        localStorage.setItem('ph_review_draft', JSON.stringify(draft));
      },

      // 加载草稿
      loadDraft: () => {
        try {
          const draftStr = localStorage.getItem('ph_review_draft');
          if (draftStr) {
            const draft = JSON.parse(draftStr);
            set({ draft });
            return draft;
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
        return null;
      },

      // 清除草稿
      clearDraft: () => {
        set({ draft: null });
        localStorage.removeItem('ph_review_draft');
      },

      // 获取指定日期的复盘
      getReviewByDate: (date) => {
        const { reviews } = get();
        return reviews.find((r) => r.date === date);
      },

      // 获取今日复盘
      getTodayReview: () => {
        const { reviews } = get();
        const today = getToday();
        return reviews.find((r) => r.date === today);
      },

      // 获取历史复盘列表
      getHistory: () => {
        const { reviews } = get();
        return [...reviews].sort((a, b) => b.date.localeCompare(a.date));
      },

      // 删除复盘
      deleteReview: (date) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.date !== date),
        }));
      },

      // 获取统计数据
      getStats: () => {
        const { reviews } = get();
        const thisMonth = getToday().substring(0, 7);
        const thisMonthReviews = reviews.filter((r) =>
          r.date.startsWith(thisMonth)
        );

        return {
          total: reviews.length,
          thisMonth: thisMonthReviews.length,
          streak: calculateStreak(reviews),
        };
      },
    }),
    {
      name: 'ph_reviews',
    }
  )
);

// 计算连续复盘天数
function calculateStreak(reviews) {
  if (reviews.length === 0) return 0;

  const dates = reviews.map((r) => r.date).sort().reverse();
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

export default useReviewStore;
