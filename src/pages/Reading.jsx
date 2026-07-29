import { useState } from 'react';
import { BookOpen, Plus, Trash2, Check } from 'lucide-react';
import useHabitStore from '../stores/habitStore';
import EmptyState from '../components/EmptyState';

export default function Reading() {
  const [showForm, setShowForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    totalPages: '',
  });
  const [logMinutes, setLogMinutes] = useState(30);
  const {
    addBook,
    updateReadingProgress,
    addReadingRecord,
    getReadingStreak,
    habits,
  } = useHabitStore();

  const streak = getReadingStreak();
  const { books, records } = habits.reading;
  const readingBooks = books.filter((b) => b.status === 'reading');
  const completedBooks = books.filter((b) => b.status === 'completed');

  const handleAddBook = (e) => {
    e.preventDefault();
    if (bookForm.title.trim()) {
      addBook({
        title: bookForm.title,
        author: bookForm.author,
        totalPages: parseInt(bookForm.totalPages) || 0,
      });
      setBookForm({ title: '', author: '', totalPages: '' });
      setShowForm(false);
    }
  };

  const handleLogReading = () => {
    addReadingRecord(logMinutes);
    setShowLogForm(false);
  };

  const handleUpdateProgress = (bookId, currentPage) => {
    updateReadingProgress(bookId, currentPage);
  };

  const todayMinutes = records
    .filter((r) => r.date === new Date().toISOString().split('T')[0])
    .reduce((sum, r) => sum + r.minutes, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <BookOpen className="mx-auto mb-2 text-blue-500" size={28} />
          <p className="text-2xl font-bold text-gray-800">{streak}</p>
          <p className="text-sm text-gray-500">连续阅读天数</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-gray-800">{todayMinutes}</p>
          <p className="text-sm text-gray-500">今日阅读分钟</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-gray-800">
            {completedBooks.length}
          </p>
          <p className="text-sm text-gray-500">已完成书籍</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          添加书籍
        </button>
        <button
          onClick={() => setShowLogForm(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <BookOpen size={18} />
          记录阅读
        </button>
      </div>

      {/* Add Book Form */}
      {showForm && (
        <div className="glass-card p-6 animate-slide-in">
          <h4 className="font-medium text-gray-700 mb-4">添加新书</h4>
          <form onSubmit={handleAddBook} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  书名
                </label>
                <input
                  type="text"
                  value={bookForm.title}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, title: e.target.value })
                  }
                  placeholder="输入书名..."
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  作者
                </label>
                <input
                  type="text"
                  value={bookForm.author}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, author: e.target.value })
                  }
                  placeholder="输入作者..."
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                总页数
              </label>
              <input
                type="number"
                value={bookForm.totalPages}
                onChange={(e) =>
                  setBookForm({ ...bookForm, totalPages: e.target.value })
                }
                placeholder="输入总页数..."
                className="input-field"
                min="1"
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
                添加
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log Reading Form */}
      {showLogForm && (
        <div className="glass-card p-6 animate-slide-in">
          <h4 className="font-medium text-gray-700 mb-4">记录今日阅读</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                阅读时长（分钟）
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
              <button onClick={handleLogReading} className="btn-primary">
                确认记录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reading Books */}
      {readingBooks.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="font-medium text-gray-700 mb-3">正在阅读</h4>
          <div className="space-y-3">
            {readingBooks.map((book) => {
              const progress =
                book.totalPages > 0
                  ? Math.round((book.currentPage / book.totalPages) * 100)
                  : 0;
              return (
                <div key={book.id} className="p-4 bg-white/40 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-800">
                        {book.title}
                      </h5>
                      {book.author && (
                        <p className="text-sm text-gray-500">{book.author}</p>
                      )}
                    </div>
                    <span className="text-sm text-purple-600">{progress}%</span>
                  </div>
                  {book.totalPages > 0 && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>第 {book.currentPage} 页</span>
                        <span>共 {book.totalPages} 页</span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateProgress(
                          book.id,
                          Math.min(book.currentPage + 10, book.totalPages)
                        )
                      }
                      className="text-xs px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                    >
                      +10页
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateProgress(
                          book.id,
                          Math.min(book.currentPage + 20, book.totalPages)
                        )
                      }
                      className="text-xs px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                    >
                      +20页
                    </button>
                    {book.totalPages > 0 && (
                      <button
                        onClick={() =>
                          handleUpdateProgress(book.id, book.totalPages)
                        }
                        className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                      >
                        读完了
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Books */}
      {completedBooks.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="font-medium text-gray-700 mb-3">已读完</h4>
          <div className="space-y-2">
            {completedBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-3 p-3 bg-white/40 rounded-xl"
              >
                <Check size={16} className="text-green-500" />
                <div>
                  <span className="text-gray-700">{book.title}</span>
                  {book.author && (
                    <span className="text-sm text-gray-400 ml-2">
                      - {book.author}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {books.length === 0 && !showForm && (
        <div className="glass-card p-8">
          <EmptyState
            icon={BookOpen}
            title="开始阅读之旅"
            description="点击「添加书籍」开始记录你的阅读"
          />
        </div>
      )}
    </div>
  );
}
