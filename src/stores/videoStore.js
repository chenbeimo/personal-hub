import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVideoStore = create(
  persist(
    (set) => ({
      videos: [],
      filter: 'all',

      addVideo: (video) => {
        const newVideo = {
          id: Date.now(),
          title: video.title || '',
          platform: video.platform || '抖音',
          status: video.status || 'idea', // idea, filming, editing, published
          link: video.link || '',
          notes: video.notes || '',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          videos: [...state.videos, newVideo],
        }));
      },

      updateVideo: (id, updates) => {
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        }));
      },

      deleteVideo: (id) => {
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== id),
        }));
      },

      setFilter: (filter) => set({ filter }),

      getFilteredVideos: () => {
        const { videos, filter } = get();
        if (filter === 'all') return videos;
        return videos.filter((v) => v.status === filter);
      },

      getStats: () => {
        const { videos } = get();
        return {
          total: videos.length,
          idea: videos.filter((v) => v.status === 'idea').length,
          filming: videos.filter((v) => v.status === 'filming').length,
          editing: videos.filter((v) => v.status === 'editing').length,
          published: videos.filter((v) => v.status === 'published').length,
        };
      },
    }),
    {
      name: 'ph_videos',
    }
  )
);

export default useVideoStore;
