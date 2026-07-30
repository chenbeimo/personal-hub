import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DailyPlan from './pages/DailyPlan';
import VideoIdeas from './pages/VideoIdeas';
import Inspiration from './pages/Inspiration';
import Exercise from './pages/Exercise';
import Reading from './pages/Reading';
import EnglishStudy from './pages/EnglishStudy';
import DailyReview from './pages/DailyReview';
import MealTracker from './pages/MealTracker';
import JobTracker from './pages/JobTracker';
import { ToastContainer, useToast } from './components/Toast';
import AchievementBadge, { useAchievements } from './components/AchievementBadge';

function App() {
  const { toasts, addToast, removeToast } = useToast();
  const { currentAchievement, clearCurrentAchievement } = useAchievements();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DailyPlan addToast={addToast} />} />
          <Route path="videos" element={<VideoIdeas />} />
          <Route path="ideas" element={<Inspiration />} />
          <Route path="exercise" element={<Exercise />} />
          <Route path="reading" element={<Reading />} />
          <Route path="english" element={<EnglishStudy />} />
          <Route path="review" element={<DailyReview />} />
          <Route path="meals" element={<MealTracker />} />
          <Route path="jobs" element={<JobTracker />} />
        </Route>
      </Routes>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Achievement Badge */}
      <AchievementBadge
        achievementId={currentAchievement}
        show={!!currentAchievement}
        onClose={clearCurrentAchievement}
      />
    </>
  );
}

export default App;
