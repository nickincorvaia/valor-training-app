import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WorkoutBuilder from './components/WorkoutBuilder';
import History from './components/History';
import ExerciseBrowser from './components/ExerciseBrowser';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* Ambient background effects */}
      <div className="app-bg" />

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<WorkoutBuilder />} />
        <Route path="/history" element={<History />} />
        <Route path="/exercises" element={<ExerciseBrowser />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      {/* Bottom Navigation */}
      <BottomNav />
    </BrowserRouter>
  );
}
