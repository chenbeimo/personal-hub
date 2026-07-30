import confetti from 'canvas-confetti';

// 触发 confetti 庆祝效果
export const triggerConfetti = (options = {}) => {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#a855f7', '#6366f1', '#ec4899', '#f59e0b', '#10b981'],
  };

  confetti({ ...defaults, ...options });
};

// 金色粒子庆祝（用于 Offer）
export const triggerGoldConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#FFD700', '#FFA500', '#FF6347', '#FF8C00'],
    gravity: 0.8,
    scalar: 1.2,
    drift: 0,
  });
};

// 连续多次 confetti
export const triggerMultipleConfetti = (times = 3) => {
  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      triggerConfetti({
        origin: { x: Math.random(), y: Math.random() * 0.4 },
      });
    }, i * 300);
  }
};

// 检查是否是深夜（22:00 后）
export const isLateNight = () => {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
};

// 获取深夜提示
export const getLateNightMessage = () => {
  const hour = new Date().getHours();
  if (hour >= 22 && hour < 24) {
    return '🌙 夜深了，注意休息';
  } else if (hour >= 0 && hour < 6) {
    return '🌙 凌晨了，早点休息吧';
  }
  return null;
};

// 格式化数字动画
export const animateNumber = (start, end, duration, callback) => {
  const startTime = performance.now();
  const diff = end - start;

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // 使用 easeOutCubic 缓动函数
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + diff * easeOutCubic);

    callback(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

// 交错动画延迟计算
export const getStaggerDelay = (index, baseDelay = 50) => {
  return index * baseDelay;
};

// 生成随机 ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
