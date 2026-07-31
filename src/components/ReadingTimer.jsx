import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, BookOpen } from 'lucide-react';

export default function ReadingTimer({
  isTiming,
  isPaused,
  elapsedSeconds,
  bookName,
  onStart,
  onPause,
  onResume,
  onStop,
  onBookNameChange,
}) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [note, setNote] = useState('');
  const intervalRef = useRef(null);

  // 格式化时间显示
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  // 计时器逻辑
  useEffect(() => {
    if (isTiming && !isPaused) {
      intervalRef.current = setInterval(() => {
        // 由父组件更新
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTiming, isPaused]);

  const handleStop = () => {
    setShowSaveModal(true);
  };

  const handleSave = () => {
    onStop({ note, bookName });
    setShowSaveModal(false);
    setNote('');
  };

  const handleCancel = () => {
    setShowSaveModal(false);
  };

  // 计时状态显示
  if (isTiming) {
    return (
      <>
        <div className="glass-card p-6 text-center animate-fade-in">
          {/* 计时显示 */}
          <div className="mb-6">
            <div className="text-4xl font-mono font-bold text-purple-600 mb-2">
              {formatTime(elapsedSeconds)}
            </div>
            <p className="text-sm text-gray-500">
              {isPaused ? '已暂停' : '正在阅读...'}
            </p>
          </div>

          {/* 书名输入 */}
          <div className="mb-6">
            <input
              type="text"
              value={bookName}
              onChange={(e) => onBookNameChange(e.target.value)}
              placeholder="输入书名（可选）"
              className="input-field text-center"
            />
          </div>

          {/* 控制按钮 */}
          <div className="flex justify-center gap-4">
            {isPaused ? (
              <button
                onClick={onResume}
                className="btn-primary flex items-center gap-2 px-6 py-3 btn-press"
              >
                <Play size={20} />
                继续
              </button>
            ) : (
              <button
                onClick={onPause}
                className="btn-secondary flex items-center gap-2 px-6 py-3 btn-press"
              >
                <Pause size={20} />
                暂停
              </button>
            )}
            <button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors btn-press"
            >
              <Square size={20} />
              结束保存
            </button>
          </div>

          {/* 提示 */}
          <p className="text-xs text-gray-400 mt-4">
            💡 打开番茄小说后记得回来点计时哦～
          </p>
        </div>

        {/* 保存弹窗 */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card w-full max-w-md p-6 animate-slide-in">
              <h4 className="font-medium text-gray-800 mb-4">
                保存阅读记录
              </h4>

              <div className="space-y-4">
                {/* 阅读时长 */}
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">本次阅读时长</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatTime(elapsedSeconds)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.floor(elapsedSeconds / 60)} 分钟
                  </p>
                </div>

                {/* 书名 */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    书名
                  </label>
                  <input
                    type="text"
                    value={bookName}
                    onChange={(e) => onBookNameChange(e.target.value)}
                    placeholder="输入书名..."
                    className="input-field"
                  />
                </div>

                {/* 备注 */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    备注（可选）
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="记录一些感想..."
                    className="input-field h-20 resize-none"
                  />
                </div>

                {/* 超时提醒 */}
                {elapsedSeconds > 3600 && (
                  <div className="p-3 bg-yellow-50 rounded-xl text-sm text-yellow-700">
                    👀 已阅读超过 1 小时，注意休息眼睛哦！
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary btn-press"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary btn-press"
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 未计时状态
  return (
    <div className="glass-card p-6 text-center">
      <Clock size={48} className="mx-auto mb-4 text-purple-300" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">阅读计时器</h3>
      <p className="text-sm text-gray-500 mb-6">
        开始阅读时点击计时，结束时自动记录
      </p>
      <button
        onClick={() => onStart()}
        className="btn-primary flex items-center gap-2 mx-auto px-8 py-3 text-lg btn-press"
      >
        <Play size={24} />
        开始计时
      </button>
    </div>
  );
}
