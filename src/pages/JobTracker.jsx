import { useState } from 'react';
import {
  Briefcase,
  Plus,
  X,
  ChevronRight,
  ExternalLink,
  Trash2,
  Edit2,
  Archive,
  RotateCcw,
} from 'lucide-react';
import useJobStore, { jobStatuses, statusFlow, jobSources } from '../stores/jobStore';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import EmptyState from '../components/EmptyState';

export default function JobTracker() {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [showDetail, setShowDetail] = useState(null);

  const {
    filter,
    setFilter,
    showForm,
    setShowForm,
    editingJob,
    setEditingJob,
    addJob,
    updateJob,
    deleteJob,
    advanceStatus,
    getNextStatuses,
    getFilteredJobs,
    getStats,
    getStatusInfo,
  } = useJobStore();

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    source: '',
    salary: '',
    location: '',
    link: '',
    notes: '',
  });

  const stats = getStats();
  const filteredJobs = getFilteredJobs();

  const handleAddNew = () => {
    setEditingJob(null);
    setFormData({
      company: '',
      position: '',
      source: '',
      salary: '',
      location: '',
      link: '',
      notes: '',
    });
    setShowForm(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company,
      position: job.position,
      source: job.source,
      salary: job.salary,
      location: job.location,
      link: job.link,
      notes: job.notes,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.company.trim() && formData.position.trim()) {
      if (editingJob) {
        updateJob(editingJob.id, formData);
      } else {
        addJob(formData);
      }
    }
  };

  const handleAdvanceStatus = (job) => {
    setSelectedJob(job);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  const handleConfirmAdvance = (newStatus) => {
    if (selectedJob) {
      advanceStatus(selectedJob.id, newStatus, statusNotes);
      setShowStatusModal(false);
      setSelectedJob(null);
    }
  };

  const handleArchiveToggle = (job) => {
    if (job.isArchived) {
      // 取消归档，恢复到上一个状态
      const lastStatus = job.statusHistory[job.statusHistory.length - 2];
      if (lastStatus) {
        updateJob(job.id, { isArchived: false, status: lastStatus.status });
      }
    } else {
      updateJob(job.id, { isArchived: true });
    }
  };

  // 进度时间线组件
  const ProgressTimeline = ({ job }) => {
    const allStatuses = ['pending', 'applied', 'written', 'interview', 'offer'];
    const currentIndex = allStatuses.indexOf(job.status);
    const isTerminal = job.status === 'accepted' || job.status === 'rejected';

    return (
      <div className="flex items-center gap-1 overflow-x-auto py-2">
        {allStatuses.map((status, index) => {
          const statusInfo = getStatusInfo(status);
          const isCompleted = isTerminal
            ? index < allStatuses.length - 1
            : index <= currentIndex;
          const isCurrent = !isTerminal && index === currentIndex;
          const historyItem = job.statusHistory.find((h) => h.status === status);

          return (
            <div key={status} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCurrent
                      ? 'bg-purple-500 text-white animate-pulse'
                      : isCompleted
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted && !isCurrent ? '✓' : statusInfo.label[0]}
                </div>
                <span className="text-[10px] text-gray-500 mt-1">
                  {statusInfo.label}
                </span>
                {historyItem && (
                  <span className="text-[10px] text-gray-400">
                    {historyItem.date.substring(5)}
                  </span>
                )}
              </div>
              {index < allStatuses.length - 1 && (
                <div
                  className={`w-6 h-0.5 mx-1 ${
                    isCompleted ? 'bg-purple-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
        {isTerminal && (
          <div className="flex items-center ml-2">
            <div className="w-0.5 h-6 bg-gray-300 mx-1 rotate-90" />
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                job.status === 'accepted'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {job.status === 'accepted' ? '已接受' : '已拒绝'}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 状态详情弹窗
  const StatusUpdateModal = () => {
    if (!selectedJob) return null;

    const nextStatuses = getNextStatuses(selectedJob.id);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="glass-card w-full max-w-md p-6 animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-800">推进状态</h4>
            <button
              onClick={() => setShowStatusModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {selectedJob.company} - {selectedJob.position}
            </p>
            <p className="text-sm text-gray-500">
              当前状态：
              <span className="font-medium">
                {getStatusInfo(selectedJob.status)?.label}
              </span>
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <label className="block text-sm text-gray-600">
              选择新状态
            </label>
            {nextStatuses.map((status) => (
              <button
                key={status.id}
                onClick={() => handleConfirmAdvance(status.id)}
                className={`w-full p-3 rounded-xl text-left transition-all ${status.color} hover:opacity-80`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              备注（可选）
            </label>
            <textarea
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="添加备注..."
              className="input-field h-20 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowStatusModal(false)}
              className="btn-secondary"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              💼 求职追踪
            </h3>
            <p className="text-sm text-gray-500">
              进行中 {stats.active} · 已归档 {stats.archived}
            </p>
          </div>
          <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            新增投递
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'active', label: '进行中' },
          { key: 'archived', label: '已归档' },
          { key: 'all', label: '全部' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              filter === tab.key
                ? 'bg-purple-500/20 text-purple-700 font-medium'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const statusInfo = getStatusInfo(job.status);
            const nextStatuses = getNextStatuses(job.id);
            const isDetailOpen = showDetail === job.id;

            return (
              <div key={job.id} className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">
                        🏢 {job.company}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusInfo?.color}`}
                      >
                        {statusInfo?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {job.position}
                      {job.source && ` | ${job.source}`}
                      {job.location && ` | ${job.location}`}
                    </p>
                    {job.salary && (
                      <p className="text-sm text-green-600 mt-1">
                        💰 {job.salary}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleArchiveToggle(job)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                      title={job.isArchived ? '取消归档' : '归档'}
                    >
                      {job.isArchived ? (
                        <RotateCcw size={16} />
                      ) : (
                        <Archive size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress Timeline */}
                <ProgressTimeline job={job} />

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {nextStatuses.length > 0 && !job.isArchived && (
                    <button
                      onClick={() => handleAdvanceStatus(job)}
                      className="btn-primary text-sm flex items-center gap-1"
                    >
                      推进下一阶段
                      <ChevronRight size={14} />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setShowDetail(isDetailOpen ? null : job.id)
                    }
                    className="btn-secondary text-sm"
                  >
                    {isDetailOpen ? '收起详情' : '查看详情'}
                  </button>
                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      链接
                    </a>
                  )}
                </div>

                {/* Detail Panel */}
                {isDetailOpen && (
                  <div className="mt-4 pt-4 border-t border-white/40">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      状态时间线
                    </h5>
                    <div className="space-y-3">
                      {job.statusHistory.map((history, index) => {
                        const historyStatus = getStatusInfo(history.status);
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${historyStatus?.color}`}
                            >
                              {historyStatus?.label[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {historyStatus?.label}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {history.date}
                                </span>
                              </div>
                              {history.notes && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {history.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {job.notes && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">
                          备注
                        </h5>
                        <p className="text-sm text-gray-500">{job.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass-card p-8">
            <EmptyState
              icon={Briefcase}
              title="暂无投递记录"
              description="点击「新增投递」开始追踪你的求职进度"
            />
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md p-6 animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800">
                {editingJob ? '编辑投递' : '新增投递'}
              </h4>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  公司名称 *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="输入公司名称..."
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  岗位名称 *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="输入岗位名称..."
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    投递渠道
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">选择渠道</option>
                    {jobSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    薪资范围
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    placeholder="如：15-25K"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    工作地点
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="如：北京"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    职位链接
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="https://..."
                    className="input-field"
                  />
                </div>
              </div>

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

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  {editingJob ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && <StatusUpdateModal />}
    </div>
  );
}
