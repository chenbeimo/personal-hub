import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToday } from '../utils/dateUtils';

// 状态定义
const jobStatuses = [
  { id: 'pending', label: '待投递', color: 'bg-gray-100 text-gray-700' },
  { id: 'applied', label: '已投递', color: 'bg-blue-100 text-blue-700' },
  { id: 'written', label: '笔试', color: 'bg-purple-100 text-purple-700' },
  { id: 'interview', label: '面试', color: 'bg-orange-100 text-orange-700' },
  { id: 'offer', label: 'Offer', color: 'bg-green-100 text-green-700' },
  { id: 'accepted', label: '接受', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'rejected', label: '拒绝', color: 'bg-red-100 text-red-700' },
];

// 状态流转规则
const statusFlow = {
  pending: ['applied'],
  applied: ['written', 'interview'],
  written: ['interview'],
  interview: ['offer'],
  offer: ['accepted', 'rejected'],
  accepted: [], // 终态
  rejected: [], // 终态
};

// 来源选项
const jobSources = [
  'Boss直聘',
  '拉勾',
  '智联招聘',
  '前程无忧',
  '猎聘',
  '官网',
  '内推',
  '校园招聘',
  '其他',
];

const useJobStore = create(
  persist(
    (set, get) => ({
      jobs: [],
      filter: 'active', // 'all', 'active', 'archived'
      showForm: false,
      editingJob: null,

      setFilter: (filter) => set({ filter }),
      setShowForm: (show) => set({ showForm: show }),
      setEditingJob: (job) => set({ editingJob: job }),

      addJob: (job) => {
        const newJob = {
          id: Date.now(),
          company: job.company || '',
          position: job.position || '',
          source: job.source || '',
          salary: job.salary || '',
          location: job.location || '',
          link: job.link || '',
          notes: job.notes || '',
          status: 'pending',
          isArchived: false,
          statusHistory: [
            {
              status: 'pending',
              date: getToday(),
              notes: '创建记录',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          jobs: [newJob, ...state.jobs],
          showForm: false,
        }));
      },

      updateJob: (id, updates) => {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j
          ),
          showForm: false,
          editingJob: null,
        }));
      },

      deleteJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((j) => j.id !== id),
        }));
      },

      // 推进状态
      advanceStatus: (id, newStatus, notes = '') => {
        const { jobs } = get();
        const job = jobs.find((j) => j.id === id);

        if (!job) return;

        // 验证状态流转
        const allowedNext = statusFlow[job.status];
        if (!allowedNext || !allowedNext.includes(newStatus)) {
          console.error('Invalid status transition');
          return;
        }

        const newHistory = [
          ...job.statusHistory,
          {
            status: newStatus,
            date: getToday(),
            notes: notes,
          },
        ];

        // 判断是否归档
        const isArchived = newStatus === 'accepted' || newStatus === 'rejected';

        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === id
              ? {
                  ...j,
                  status: newStatus,
                  isArchived,
                  statusHistory: newHistory,
                  updatedAt: new Date().toISOString(),
                }
              : j
          ),
        }));
      },

      // 获取下一状态选项
      getNextStatuses: (id) => {
        const { jobs } = get();
        const job = jobs.find((j) => j.id === id);
        if (!job) return [];

        const nextStatusIds = statusFlow[job.status] || [];
        return jobStatuses.filter((s) => nextStatusIds.includes(s.id));
      },

      // 获取筛选后的列表
      getFilteredJobs: () => {
        const { jobs, filter } = get();
        switch (filter) {
          case 'active':
            return jobs.filter((j) => !j.isArchived);
          case 'archived':
            return jobs.filter((j) => j.isArchived);
          default:
            return jobs;
        }
      },

      // 获取统计
      getStats: () => {
        const { jobs } = get();
        const active = jobs.filter((j) => !j.isArchived);
        const archived = jobs.filter((j) => j.isArchived);

        return {
          total: jobs.length,
          active: active.length,
          archived: archived.length,
          byStatus: {
            pending: jobs.filter((j) => j.status === 'pending').length,
            applied: jobs.filter((j) => j.status === 'applied').length,
            written: jobs.filter((j) => j.status === 'written').length,
            interview: jobs.filter((j) => j.status === 'interview').length,
            offer: jobs.filter((j) => j.status === 'offer').length,
            accepted: jobs.filter((j) => j.status === 'accepted').length,
            rejected: jobs.filter((j) => j.status === 'rejected').length,
          },
        };
      },

      // 获取状态信息
      getStatusInfo: (statusId) => {
        return jobStatuses.find((s) => s.id === statusId);
      },
    }),
    {
      name: 'ph_jobs',
    }
  )
);

export { jobStatuses, statusFlow, jobSources };
export default useJobStore;
