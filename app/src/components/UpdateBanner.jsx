import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { onUpdateAvailable, applyPendingUpdate } from '../pwa';

/**
 * Surfaces a waiting service worker. Dismissing only hides the banner — the
 * update still installs on the next cold start, so a new deploy always reaches
 * the user whether or not they tap anything.
 */
export default function UpdateBanner() {
    const [available, setAvailable] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => onUpdateAvailable(() => setAvailable(true)), []);

    if (!available || dismissed) return null;

    return (
        <div className="update-banner animate-fade-in" role="status">
            <RefreshCw size={16} className={applying ? 'spin' : undefined} />
            <div className="update-banner-text">
                <strong>New version available</strong>
                <span>Applies automatically next time you open the app.</span>
            </div>
            <button
                className="btn btn-primary update-banner-btn"
                onClick={() => {
                    setApplying(true);
                    applyPendingUpdate();
                }}
                disabled={applying}
            >
                {applying ? 'Updating…' : 'Update now'}
            </button>
            <button
                className="btn btn-ghost btn-icon update-banner-close"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss update notice"
            >
                <X size={18} />
            </button>
        </div>
    );
}
