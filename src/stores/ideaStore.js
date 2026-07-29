import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useIdeaStore = create(
  persist(
    (set, get) => ({
      ideas: [],
      searchQuery: '',
      selectedTag: null,

      addIdea: (idea) => {
        const newIdea = {
          id: Date.now(),
          title: idea.title || '',
          content: idea.content || '',
          tags: idea.tags || [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          ideas: [newIdea, ...state.ideas],
        }));
      },

      updateIdea: (id, updates) => {
        set((state) => ({
          ideas: state.ideas.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        }));
      },

      deleteIdea: (id) => {
        set((state) => ({
          ideas: state.ideas.filter((i) => i.id !== id),
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTag: (tag) => set({ selectedTag: tag }),

      getFilteredIdeas: () => {
        const { ideas, searchQuery, selectedTag } = get();
        let filtered = ideas;

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (i) =>
              i.title.toLowerCase().includes(query) ||
              i.content.toLowerCase().includes(query)
          );
        }

        if (selectedTag) {
          filtered = filtered.filter((i) => i.tags.includes(selectedTag));
        }

        return filtered;
      },

      getAllTags: () => {
        const { ideas } = get();
        const tags = new Set();
        ideas.forEach((idea) => {
          idea.tags.forEach((tag) => tags.add(tag));
        });
        return Array.from(tags);
      },
    }),
    {
      name: 'ph_ideas',
    }
  )
);

export default useIdeaStore;
