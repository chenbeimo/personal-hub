import { useState, useEffect } from 'react';
import {
  Languages,
  Plus,
  Trash2,
  Check,
  BookOpen,
  ExternalLink,
  Star,
  Flame,
  Target,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import useHabitStore from '../stores/habitStore';
import { useEnglishData } from '../hooks/useEnglishData';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';

export default function EnglishStudy() {
  const [showWordForm, setShowWordForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [wordForm, setWordForm] = useState({
    word: '',
    meaning: '',
    example: '',
  });
  const [logMinutes, setLogMinutes] = useState(30);
  const [showMastered, setShowMastered] = useState(false);
  const [addedWords, setAddedWords] = useState(new Set());

  const {
    addWord,
    toggleWordMastered,
    deleteWord,
    addEnglishRecord,
    getEnglishStreak,
    getEnglishStats,
    habits,
  } = useHabitStore();

  const {
    dailyWords,
    loading: dailyWordsLoading,
    getSharedData,
    addToWordbook,
    getWordbook,
    openEnglishSite,
  } = useEnglishData();

  const streak = getEnglishStreak();
  const stats = getEnglishStats();
  const { words } = habits.english;
  const sharedData = getSharedData();

  // 合并统计数据（优先使用英语网站的数据）
  const displayStreak = sharedData.streak || streak;
  const displayTodayCount = sharedData.todayCount || 0;
  const displayTotalMastered = sharedData.totalMastered || stats.masteredWords;
  const displayAccuracy = sharedData.accuracy || 0;

  const filteredWords = showMastered
    ? words.filter((w) => w.mastered)
    : words.filter((w) => !w.mastered);

  const handleAddWord = (e) => {
    e.preventDefault();
    if (wordForm.word.trim()) {
      addWord(wordForm);
      setWordForm({ word: '', meaning: '', example: '' });
      setShowWordForm(false);
    }
  };

  const handleLogStudy = () => {
    addEnglishRecord(logMinutes);
    setShowLogForm(false);
  };

  const handleAddToWordbook = (word) => {
    const added = addToWordbook(word);
    if (added) {
      setAddedWords((prev) => new Set([...prev, word.word]));
    }
  };

  const handleRefreshWords = () => {
    window.location.reload();
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Stats Cards - 读取英语网站数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center card-hover">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Flame
                className={`text-orange-500 ${displayStreak > 0 ? 'animate-fire' : ''}`}
                size={24}
              />
            </div>
            <p className="text-2xl font-bold text-gray-800">{displayStreak}</p>
            <p className="text-xs text-gray-500">连续学习天数</p>
          </div>

          <div className="glass-card p-4 text-center card-hover">
            <div className="flex items-center justify-center gap-1 mb-2">
              <BookOpen className="text-blue-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {displayTodayCount}
            </p>
            <p className="text-xs text-gray-500">今日已学</p>
          </div>

          <div className="glass-card p-4 text-center card-hover">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="text-yellow-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {displayTotalMastered}
            </p>
            <p className="text-xs text-gray-500">累计掌握</p>
          </div>

          <div className="glass-card p-4 text-center card-hover">
            <div className="flex items-center justify-center gap-1 mb-2">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {displayAccuracy > 0 ? `${displayAccuracy}%` : '-'}
            </p>
            <p className="text-xs text-gray-500">正确率</p>
          </div>
        </div>

        {/* 每日推荐单词 */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              📋 今日推荐单词
              <button
                onClick={handleRefreshWords}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
                title="刷新单词"
              >
                <RefreshCw size={14} />
              </button>
            </h4>
            <button
              onClick={() => openEnglishSite()}
              className="btn-primary text-sm flex items-center gap-1 btn-press"
            >
              <ExternalLink size={14} />
              打开英语网站
            </button>
          </div>

          {dailyWordsLoading ? (
            <div className="text-center py-8 text-gray-400">
              <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
              <p className="text-sm">加载中...</p>
            </div>
          ) : dailyWords.length > 0 ? (
            <div className="space-y-3">
              {dailyWords.map((word, index) => (
                <div
                  key={word.word}
                  className="flex items-center justify-between p-4 bg-white/40 rounded-xl hover:bg-white/60 transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">
                        {word.word}
                      </span>
                      <span className="text-sm text-gray-500">
                        {word.phonetic}
                      </span>
                      {word.level && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                          {word.level}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{word.meaning}</p>
                    {word.example && (
                      <p className="text-xs text-gray-400 italic">
                        "{word.example}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEnglishSite(word.word)}
                      className="px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 text-sm transition-colors btn-press"
                    >
                      开始学习
                    </button>
                    <button
                      onClick={() => handleAddToWordbook(word)}
                      disabled={addedWords.has(word.word)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors btn-press ${
                        addedWords.has(word.word)
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {addedWords.has(word.word) ? '✓ 已添加' : '加入单词本'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Languages size={48} className="mx-auto mb-4 opacity-50 animate-breathe" />
              <p className="text-sm">暂无推荐单词</p>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowWordForm(true)}
            className="btn-primary flex items-center gap-2 btn-press"
          >
            <Plus size={18} />
            手动添加单词
          </button>
          <button
            onClick={() => setShowLogForm(true)}
            className="btn-secondary flex items-center gap-2 btn-press"
          >
            <BookOpen size={18} />
            记录学习
          </button>
        </div>

        {/* Add Word Form */}
        {showWordForm && (
          <div className="glass-card p-6 animate-slide-in">
            <h4 className="font-medium text-gray-700 mb-4">添加新单词</h4>
            <form onSubmit={handleAddWord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    单词
                  </label>
                  <input
                    type="text"
                    value={wordForm.word}
                    onChange={(e) =>
                      setWordForm({ ...wordForm, word: e.target.value })
                    }
                    placeholder="输入英文单词..."
                    className="input-field input-glow"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    中文释义
                  </label>
                  <input
                    type="text"
                    value={wordForm.meaning}
                    onChange={(e) =>
                      setWordForm({ ...wordForm, meaning: e.target.value })
                    }
                    placeholder="输入中文意思..."
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  例句（可选）
                </label>
                <input
                  type="text"
                  value={wordForm.example}
                  onChange={(e) =>
                    setWordForm({ ...wordForm, example: e.target.value })
                  }
                  placeholder="输入例句..."
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowWordForm(false)}
                  className="btn-secondary btn-press"
                >
                  取消
                </button>
                <button type="submit" className="btn-primary btn-press">
                  添加
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Log Study Form */}
        {showLogForm && (
          <div className="glass-card p-6 animate-slide-in">
            <h4 className="font-medium text-gray-700 mb-4">记录今日学习</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  学习时长（分钟）
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={logMinutes}
                    onChange={(e) => setLogMinutes(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-medium text-purple-700 w-20 text-center">
                    {logMinutes}分钟
                  </span>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogForm(false)}
                  className="btn-secondary btn-press"
                >
                  取消
                </button>
                <button
                  onClick={handleLogStudy}
                  className="btn-primary btn-press"
                >
                  确认记录
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Word List Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowMastered(false)}
            className={`px-4 py-2 rounded-xl text-sm transition-all btn-press ${
              !showMastered
                ? 'bg-purple-500/20 text-purple-700 font-medium'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            学习中 ({stats.totalWords - stats.masteredWords})
          </button>
          <button
            onClick={() => setShowMastered(true)}
            className={`px-4 py-2 rounded-xl text-sm transition-all btn-press ${
              showMastered
                ? 'bg-purple-500/20 text-purple-700 font-medium'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            已掌握 ({stats.masteredWords})
          </button>
        </div>

        {/* Word List */}
        <div className="space-y-3">
          {filteredWords.length > 0 ? (
            filteredWords.map((word, index) => (
              <div
                key={word.id}
                className="glass-card p-4 hover:shadow-lg transition-shadow duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {word.word}
                      </h4>
                      {word.mastered && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                          已掌握
                        </span>
                      )}
                    </div>
                    {word.meaning && (
                      <p className="text-gray-600 mb-1">{word.meaning}</p>
                    )}
                    {word.example && (
                      <p className="text-sm text-gray-500 italic">
                        "{word.example}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleWordMastered(word.id)}
                      className={`p-2 rounded-lg transition-colors btn-press ${
                        word.mastered
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => deleteWord(word.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors btn-press"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-8">
              <EmptyState
                icon={Languages}
                title={showMastered ? '暂无已掌握单词' : '暂无学习中的单词'}
                description={
                  showMastered
                    ? '继续学习，掌握更多单词！'
                    : '点击「添加单词」或从推荐单词中添加'
                }
              />
            </div>
          )}
        </div>

        {/* 快速访问英语网站 */}
        <div className="glass-card p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">
                🚀 去英语网站背单词
              </h4>
              <p className="text-sm text-gray-500">
                在英语网站学习后，数据会自动同步到这里
              </p>
            </div>
            <button
              onClick={() => openEnglishSite()}
              className="btn-primary flex items-center gap-2 btn-press"
            >
              <ExternalLink size={18} />
              打开英语网站
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
