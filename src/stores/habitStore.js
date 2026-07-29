import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useHabitStore = create(
  persist(
    (set, get) => ({
      habits: {
        exercise: {
          records: [],
          types: ['跑步', '游泳', '健身', '瑜伽', '散步'],
        },
        reading: {
          records: [],
          books: [],
        },
        english: {
          records: [],
          words: [],
        },
      },

      // Exercise methods
      addExerciseRecord: (type, duration) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          habits: {
            ...state.habits,
            exercise: {
              ...state.habits.exercise,
              records: [
                ...state.habits.exercise.records,
                { date: today, type, duration, id: Date.now() },
              ],
            },
          },
        }));
      },

      getExerciseStreak: () => {
        const { habits } = get();
        const records = habits.exercise.records;
        if (records.length === 0) return 0;

        const dates = [...new Set(records.map((r) => r.date))].sort().reverse();
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
      },

      isExercisedToday: () => {
        const { habits } = get();
        const today = new Date().toISOString().split('T')[0];
        return habits.exercise.records.some((r) => r.date === today);
      },

      // Reading methods
      addBook: (book) => {
        const newBook = {
          id: Date.now(),
          title: book.title,
          author: book.author || '',
          totalPages: book.totalPages || 0,
          currentPage: 0,
          status: 'reading', // reading, completed, want-to-read
          addedAt: new Date().toISOString(),
        };
        set((state) => ({
          habits: {
            ...state.habits,
            reading: {
              ...state.habits.reading,
              books: [...state.habits.reading.books, newBook],
            },
          },
        }));
      },

      updateReadingProgress: (bookId, currentPage) => {
        set((state) => ({
          habits: {
            ...state.habits,
            reading: {
              ...state.habits.reading,
              books: state.habits.reading.books.map((b) =>
                b.id === bookId
                  ? {
                      ...b,
                      currentPage,
                      status: currentPage >= b.totalPages ? 'completed' : 'reading',
                    }
                  : b
              ),
            },
          },
        }));
      },

      addReadingRecord: (minutes) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          habits: {
            ...state.habits,
            reading: {
              ...state.habits.reading,
              records: [
                ...state.habits.reading.records,
                { date: today, minutes, id: Date.now() },
              ],
            },
          },
        }));
      },

      getReadingStreak: () => {
        const { habits } = get();
        const records = habits.reading.records;
        if (records.length === 0) return 0;

        const dates = [...new Set(records.map((r) => r.date))].sort().reverse();
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
      },

      // English methods
      addWord: (word) => {
        const newWord = {
          id: Date.now(),
          word: word.word,
          meaning: word.meaning || '',
          example: word.example || '',
          mastered: false,
          addedAt: new Date().toISOString(),
        };
        set((state) => ({
          habits: {
            ...state.habits,
            english: {
              ...state.habits.english,
              words: [newWord, ...state.habits.english.words],
            },
          },
        }));
      },

      toggleWordMastered: (wordId) => {
        set((state) => ({
          habits: {
            ...state.habits,
            english: {
              ...state.habits.english,
              words: state.habits.english.words.map((w) =>
                w.id === wordId ? { ...w, mastered: !w.mastered } : w
              ),
            },
          },
        }));
      },

      deleteWord: (wordId) => {
        set((state) => ({
          habits: {
            ...state.habits,
            english: {
              ...state.habits.english,
              words: state.habits.english.words.filter((w) => w.id !== wordId),
            },
          },
        }));
      },

      addEnglishRecord: (minutes) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          habits: {
            ...state.habits,
            english: {
              ...state.habits.english,
              records: [
                ...state.habits.english.records,
                { date: today, minutes, id: Date.now() },
              ],
            },
          },
        }));
      },

      getEnglishStreak: () => {
        const { habits } = get();
        const records = habits.english.records;
        if (records.length === 0) return 0;

        const dates = [...new Set(records.map((r) => r.date))].sort().reverse();
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
      },

      getEnglishStats: () => {
        const { habits } = get();
        return {
          totalWords: habits.english.words.length,
          masteredWords: habits.english.words.filter((w) => w.mastered).length,
          todayMinutes: habits.english.records
            .filter((r) => r.date === new Date().toISOString().split('T')[0])
            .reduce((sum, r) => sum + r.minutes, 0),
        };
      },
    }),
    {
      name: 'ph_habits',
    }
  )
);

export default useHabitStore;
