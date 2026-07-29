import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all', // 'all', 'active', 'completed'

      addTodo: (text, category = '默认') => {
        const newTodo = {
          id: Date.now(),
          text,
          completed: false,
          category,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      editTodo: (id, newText) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: newText } : todo
          ),
        }));
      },

      setFilter: (filter) => set({ filter }),

      getFilteredTodos: () => {
        const { todos, filter } = get();
        const today = new Date().toISOString().split('T')[0];
        const todayTodos = todos.filter((t) => t.createdAt === today);

        switch (filter) {
          case 'active':
            return todayTodos.filter((t) => !t.completed);
          case 'completed':
            return todayTodos.filter((t) => t.completed);
          default:
            return todayTodos;
        }
      },

      getTodayStats: () => {
        const { todos } = get();
        const today = new Date().toISOString().split('T')[0];
        const todayTodos = todos.filter((t) => t.createdAt === today);
        const completed = todayTodos.filter((t) => t.completed).length;
        return {
          total: todayTodos.length,
          completed,
          percentage: todayTodos.length > 0 ? Math.round((completed / todayTodos.length) * 100) : 0,
        };
      },

      clearCompleted: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          todos: state.todos.filter(
            (t) => !(t.createdAt === today && t.completed)
          ),
        }));
      },
    }),
    {
      name: 'ph_todos',
    }
  )
);

export default useTodoStore;
