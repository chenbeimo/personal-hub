import { useState } from 'react';
import { Languages, Plus, Trash2, Check, BookOpen } from 'lucide-react';
import useHabitStore from '../stores/habitStore';
import EmptyState from '../components/EmptyState';

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
  const {
    addWord,
    toggleWordMastered,
    deleteWord,
    addEnglishRecord,
    getEnglishStreak,
    getEnglishStats,
    habits,
  } = useHabitStore();

  const streak = getEnglishStreak();
  const stats = getEnglishStats();
  const { words } = habits.english;

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-5 text-center">
          <Languages className="mx-auto mb-2 text-indigo-500" size={28} />
          <p className="text-2xl font-bold text-gray-800">{streak}</p>
          <p className="text-sm text-gray-500">连续学习天数</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalWords}
          </p>
          <p className="text-sm text-gray-500">总单词数</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-green-600">
            {stats.masteredWords}
          </p>
          <p className="text-sm text-gray-500">已掌握</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {stats.todayMinutes}
          </p>
          <p className="text-sm text-gray-500">今日学习分钟</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowWordForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          添加单词
        </button>
        <button
          onClick={() => setShowLogForm(true)}
          className="btn-secondary flex items-center gap-2"
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
                  className="input-field"
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
                className="btn-secondary"
              >
                取消
              </button>
              <button type="submit" className="btn-primary">
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
                className="btn-secondary"
              >
                取消
              </button>
              <button onClick={handleLogStudy} className="btn-primary">
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
          className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
            !showMastered
              ? 'bg-purple-500/20 text-purple-700 font-medium'
              : 'bg-white/40 text-gray-600 hover:bg-white/60'
          }`}
        >
          学习中 ({stats.totalWords - stats.masteredWords})
        </button>
        <button
          onClick={() => setShowMastered(true)}
          className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
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
          filteredWords.map((word) => (
            <div
              key={word.id}
              className="glass-card p-4 hover:shadow-lg transition-shadow duration-200"
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
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      word.mastered
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => deleteWord(word.id)}
                    className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors duration-200"
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
                  : '点击「添加单词」开始学习'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
