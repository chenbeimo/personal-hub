import { useState } from 'react';
import { Plus, Lightbulb, Search, Tag, Trash2, X } from 'lucide-react';
import useIdeaStore from '../stores/ideaStore';
import EmptyState from '../components/EmptyState';

export default function Inspiration() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const {
    addIdea,
    deleteIdea,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    getFilteredIdeas,
    getAllTags,
  } = useIdeaStore();

  const ideas = getFilteredIdeas();
  const allTags = getAllTags();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() || formData.content.trim()) {
      addIdea(formData);
      setFormData({ title: '', content: '', tags: [] });
      setShowForm(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              灵感记录
            </h3>
            <p className="text-sm text-gray-500">
              共 {ideas.length} 条灵感
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            记录灵感
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索灵感..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                !selectedTag
                  ? 'bg-purple-500/20 text-purple-700'
                  : 'bg-white/40 text-gray-600 hover:bg-white/60'
              }`}
            >
              全部标签
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 flex items-center gap-1 ${
                  selectedTag === tag
                    ? 'bg-purple-500/20 text-purple-700'
                    : 'bg-white/40 text-gray-600 hover:bg-white/60'
                }`}
              >
                <Tag size={12} />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-card p-6 animate-slide-in">
          <h4 className="font-medium text-gray-700 mb-4">记录新灵感</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="给灵感起个标题..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">内容</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="写下你的灵感..."
                className="input-field h-32 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">标签</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="添加标签..."
                  className="flex-1 input-field"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-secondary"
                >
                  添加
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-purple-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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

      {/* Ideas List */}
      <div className="space-y-3">
        {ideas.length > 0 ? (
          ideas.map((idea) => (
            <div
              key={idea.id}
              className="glass-card p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {idea.title && (
                    <h4 className="font-medium text-gray-800 mb-2">
                      {idea.title}
                    </h4>
                  )}
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {idea.content}
                  </p>
                  {idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {idea.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(idea.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8">
            <EmptyState
              icon={Lightbulb}
              title="暂无灵感记录"
              description="点击「记录灵感」捕捉你的创意想法"
            />
          </div>
        )}
      </div>
    </div>
  );
}
