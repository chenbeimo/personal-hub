import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToday } from '../utils/dateUtils';

const useReadingStore = create(
  persist(
    (set, get) => ({
      // 阅读记录按日期分组
      records: {},

      // 计时器状态
      timer: {
        isTiming: false,
        isPaused: false,
        startTime: null,
        elapsedSeconds: 0,
        bookName: '',
      },

      // 计时器控制
      startTimer: (bookName = '') => {
        const now = Date.now();
        set({
          timer: {
            isTiming: true,
            isPaused: false,
            startTime: now,
            elapsedSeconds: 0,
            bookName: bookName || get().timer.bookName,
          },
        });
      },

      pauseTimer: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            isPaused: true,
          },
        }));
      },

      resumeTimer: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            isPaused: false,
          },
        }));
      },

      stopTimer: () => {
        const { timer } = get();
        const duration = Math.floor(timer.elapsedSeconds / 60);

        set({
          timer: {
            isTiming: false,
            isPaused: false,
            startTime: null,
            elapsedSeconds: 0,
            bookName: timer.bookName,
          },
        });

        return duration;
      },

      updateElapsedSeconds: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            elapsedSeconds: state.timer.elapsedSeconds + 1,
          },
        }));
      },

      setTimerBookName: (name) => {
        set((state) => ({
          timer: {
            ...state.timer,
            bookName: name,
          },
        }));
      },

      // 保存阅读记录
      saveRecord: (record) => {
        const today = getToday();
        const { records } = get();
        const todayRecords = records[today] || [];

        const newRecord = {
          id: `rd_${Date.now()}`,
          bookName: record.bookName || '未命名',
          duration: record.duration || 0,
          startTime: record.startTime || '',
          endTime: record.endTime || '',
          note: record.note || '',
          source: record.source || '番茄小说',
          createdAt: new Date().toISOString(),
        };

        set({
          records: {
            ...records,
            [today]: [newRecord, ...todayRecords],
          },
        });
      },

      // 手动添加记录
      addManualRecord: (record) => {
        const date = record.date || getToday();
        const { records } = get();
        const dateRecords = records[date] || [];

        const newRecord = {
          id: `rd_${Date.now()}`,
          bookName: record.bookName || '未命名',
          duration: record.duration || 0,
          startTime: record.startTime || '',
          endTime: record.endTime || '',
          note: record.note || '',
          source: record.source || '手动记录',
          createdAt: new Date().toISOString(),
        };

        set({
          records: {
            ...records,
            [date]: [newRecord, ...dateRecords],
          },
        });
      },

      // 删除记录
      deleteRecord: (date, recordId) => {
        const { records } = get();
        const dateRecords = records[date] || [];

        set({
          records: {
            ...records,
            [date]: dateRecords.filter((r) => r.id !== recordId),
          },
        });
      },

      // 获取今日记录
      getTodayRecords: () => {
        const { records } = get();
        const today = getToday();
        return records[today] || [];
      },

      // 获取今日阅读时长
      getTodayDuration: () => {
        const { records } = get();
        const today = getToday();
        const todayRecords = records[today] || [];
        return todayRecords.reduce((sum, r) => sum + r.duration, 0);
      },

      // 获取今日阅读次数
      getTodayCount: () => {
        const { records } = get();
        const today = getToday();
        return (records[today] || []).length;
      },

      // 获取连续阅读天数
      getStreak: () => {
        const { records } = get();
        let streak = 0;
        let date = new Date();

        while (true) {
          const dateStr = date.toISOString().split('T')[0];
          if (records[dateStr] && records[dateStr].length > 0) {
            streak++;
            date.setDate(date.getDate() - 1);
          } else {
            break;
          }
        }

        return streak;
      },

      // 获取历史书名列表
      getBookNames: () => {
        const { records } = get();
        const names = new Set();
        Object.values(records).forEach((dateRecords) => {
          dateRecords.forEach((r) => {
            if (r.bookName && r.bookName !== '未命名') {
              names.add(r.bookName);
            }
          });
        });
        return Array.from(names);
      },

      // 获取总阅读时长
      getTotalDuration: () => {
        const { records } = get();
        let total = 0;
        Object.values(records).forEach((dateRecords) => {
          dateRecords.forEach((r) => {
            total += r.duration;
          });
        });
        return total;
      },

      // 获取总阅读次数
      getTotalCount: () => {
        const { records } = get();
        let total = 0;
        Object.values(records).forEach((dateRecords) => {
          total += dateRecords.length;
        });
        return total;
      },
    }),
    {
      name: 'ph_reading',
    }
  )
);

export default useReadingStore;
