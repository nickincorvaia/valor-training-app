import { NavLink } from 'react-router-dom';
import { Zap, ClipboardList, BookOpen, Settings as SettingsIcon } from 'lucide-react';

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            <NavLink
                to="/"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end
            >
                <Zap size={22} />
                <span>Build</span>
            </NavLink>
            <NavLink
                to="/history"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <ClipboardList size={22} />
                <span>History</span>
            </NavLink>
            <NavLink
                to="/exercises"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <BookOpen size={22} />
                <span>Library</span>
            </NavLink>
            <NavLink
                to="/settings"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <SettingsIcon size={22} />
                <span>Settings</span>
            </NavLink>
        </nav>
    );
}
