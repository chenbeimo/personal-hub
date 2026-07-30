import { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Zap } from 'lucide-react';

const achievements = {
  firstTask: {
    id: 'firstTask',
    title: '初次体验',
    description: '完成第一个任务',
    icon: Star,
    color: 'bg-yellow-500',
  },
  allTasksDone: {
    id: 'allTasksDone',
    title: '今日全勤',
    description: '完成今日所有任务',
    icon: Trophy,
    color: 'bg-purple-500',
  },
  streak3: {
    id: 'streak3',
    title: '三天坚持',
    description: '连续打卡 3 天',
    icon: Flame,
    color: 'bg-orange-500',
  },
  streak7: {
    id: 'streak7',
    title: '一周达人',
    description: '连续打卡 7 天',
    icon: Zap,
    color: 'bg-red-500',
  },
  mealMaster: {
    id: 'mealMaster',
    title: '干饭达人',
    description: '连续 7 天记录三餐',
    icon: Trophy,
    color: 'bg-green-500',
  },
  offerReceived: {
    id: 'offerReceived',
    title: 'Offer 到手',
    description: '收到第一个 Offer',
    icon: Star,
    color: 'bg-yellow-500',
  },
};

export default function AchievementBadge({ achievementId, show = false, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const achievement = achievements[achievementId];

  useEffect(() => {
    if (show && achievement) {
      setIsVisible(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, achievement, onClose]);

  if (!isVisible || !achievement) return null;

  const Icon = achievement.icon;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[100] pointer-events-none ${
        isExiting ? 'opacity-0' : 'opacity-100'
      } transition-opacity duration-500`}
    >
      <div
        className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm mx-4 transform transition-all duration-500 ${
          isExiting ? 'scale-75 translate-y-10' : 'scale-100 translate-y-0'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full ${achievement.color} text-white mb-4 animate-bounce`}>
            <Icon size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            🎉 解锁成就！
          </h3>
          <p className="text-xl font-semibold text-purple-600 mb-2">
            {achievement.title}
          </p>
          <p className="text-sm text-gray-500">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook for managing achievements
export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem('ph_achievements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentAchievement, setCurrentAchievement] = useState(null);

  useEffect(() => {
    localStorage.setItem('ph_achievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const unlockAchievement = (achievementId) => {
    if (!unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements((prev) => [...prev, achievementId]);
      setCurrentAchievement(achievementId);
    }
  };

  const isUnlocked = (achievementId) => {
    return unlockedAchievements.includes(achievementId);
  };

  const clearCurrentAchievement = () => {
    setCurrentAchievement(null);
  };

  return {
    unlockedAchievements,
    currentAchievement,
    unlockAchievement,
    isUnlocked,
    clearCurrentAchievement,
  };
}

export { achievements };
