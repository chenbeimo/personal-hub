import { useState } from 'react';
import { Plus, Video, ExternalLink, Trash2, Edit2 } from 'lucide-react';
import useVideoStore from '../stores/videoStore';
import EmptyState from '../components/EmptyState';

const statusOptions = [
  { value: 'idea', label: '💡 灵感', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'filming', label: '🎬 拍摄中', color: 'bg-blue-100 text-blue-700' },
  { value: 'editing', label: '✂️ 剪辑中', color: 'bg-purple-100 text-purple-700' },
  { value: 'published', label: '✅ 已发布', color: 'bg-green-100 text-green-700' },
];

const platformOptions = ['抖音', 'B站', '小红书', 'YouTube', '快手', '视频号'];

export default function VideoIdeas() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    platform: '抖音',
    status: 'idea',
    link: '',
    notes: '',
  });
  const { videos, addVideo, updateVideo, deleteVideo, filter, setFilter } =
    useVideoStore();

  const filteredVideos =
    filter === 'all' ? videos : videos.filter((v) => v.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addVideo(formData);
      setFormData({
        title: '',
        platform: '抖音',
        status: 'idea',
        link: '',
        notes: '',
      });
      setShowForm(false);
    }
  };

  const getStatusInfo = (status) =>
    statusOptions.find((s) => s.value === status) || statusOptions[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              爆款视频库
            </h3>
            <p className="text-sm text-gray-500">
              共 {videos.length} 个视频创意
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            新建创意
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
            filter === 'all'
              ? 'bg-purple-500/20 text-purple-700 font-medium'
              : 'bg-white/40 text-gray-600 hover:bg-white/60'
          }`}
        >
          全部
        </button>
        {statusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
              filter === status.value
                ? 'bg-purple-500/20 text-purple-700 font-medium'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-card p-6 animate-slide-in">
          <h4 className="font-medium text-gray-700 mb-4">新建视频创意</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  视频标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="输入视频标题..."
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  发布平台
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                  className="input-field"
                >
                  {platformOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  当前状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="input-field"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  视频链接
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
              <label className="block text-sm text-gray-600 mb-1">备注</label>
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
                保存
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Video List */}
      <div className="space-y-3">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => {
            const statusInfo = getStatusInfo(video.status);
            return (
              <div
                key={video.id}
                className="glass-card p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-800">
                        {video.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📱 {video.platform}</span>
                      {video.link && (
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-purple-500 hover:text-purple-700"
                        >
                          <ExternalLink size={14} />
                          查看链接
                        </a>
                      )}
                    </div>
                    {video.notes && (
                      <p className="mt-2 text-sm text-gray-600">
                        {video.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card p-8">
            <EmptyState
              icon={Video}
              title="暂无视频创意"
              description="点击「新建创意」开始记录你的爆款视频灵感"
            />
          </div>
        )}
      </div>
    </div>
  );
}
