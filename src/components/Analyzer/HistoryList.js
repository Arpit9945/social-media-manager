'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ToolHeader from '@/components/Shared/ToolHeader';
import AnalysisReport from './AnalysisReport';
import AuditReport from './AuditReport';
import styles from './HistoryList.module.scss';

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function HistoryList({ user, profile, history: initialHistory }) {
  const router = useRouter();
  const [history, setHistory] = useState(initialHistory);
  const [filter, setFilter] = useState('all'); // 'all' | 'reels' | 'profile'
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filteredHistory = history.filter((item) => {
    const isProfileAudit = item.metrics?.type === 'profile_audit';
    const matchesFilter =
      filter === 'all' ||
      (filter === 'reels' && !isProfileAudit) ||
      (filter === 'profile' && isProfileAudit);

    const matchesSearch =
      !search ||
      item.caption?.toLowerCase().includes(search.toLowerCase()) ||
      item.analysis?.verdict?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id) => {
    if (!confirm('Sure delete karna hai? Yeh action wapas nahi hoga.')) return;

    try {
      setDeleting(id);
      const supabase = createClient();
      const { error } = await supabase
        .from('analyzed_reels')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory(history.filter((h) => h.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
      alert('Delete nahi ho saka. Phir try karo.');
    } finally {
      setDeleting(null);
    }
  };

  if (selectedItem) {
    const isProfileAudit = selectedItem.metrics?.type === 'profile_audit';
    return (
      <div className={styles.page}>
        <ToolHeader
          user={user}
          profile={profile}
          breadcrumb={[
            { label: 'Analyzer', href: '/dashboard' },
            { label: 'History', href: '/analyzer/history' },
            { label: 'Details' },
          ]}
        />
        <main className={styles.main}>
          <button onClick={() => setSelectedItem(null)} className={styles.backBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to history
          </button>

          {isProfileAudit ? (
            <AuditReport audit={selectedItem.analysis} onNewAudit={() => router.push('/analyzer/profile')} />
          ) : (
            <AnalysisReport
              analysis={selectedItem.analysis}
              originalCaption={selectedItem.caption}
              originalHashtags={selectedItem.hashtags}
              onNewAnalysis={() => router.push('/analyzer/reel')}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ToolHeader
        user={user}
        profile={profile}
        breadcrumb={[
          { label: 'Analyzer', href: '/dashboard' },
          { label: 'History' },
        ]}
      />

      <main className={styles.main}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Analysis History</h1>
          <p className={styles.subtitle}>
            All your past reel analyses and profile audits — {history.length} total
          </p>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.searchIcon}>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search analyses..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterTabs}>
            <button
              onClick={() => setFilter('all')}
              className={`${styles.filterTab} ${filter === 'all' ? styles.filterActive : ''}`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilter('reels')}
              className={`${styles.filterTab} ${filter === 'reels' ? styles.filterActive : ''}`}
            >
              Reels ({history.filter((h) => h.metrics?.type !== 'profile_audit').length})
            </button>
            <button
              onClick={() => setFilter('profile')}
              className={`${styles.filterTab} ${filter === 'profile' ? styles.filterActive : ''}`}
            >
              Profile ({history.filter((h) => h.metrics?.type === 'profile_audit').length})
            </button>
          </div>
        </div>

        {/* List */}
        {filteredHistory.length === 0 ? (
          <div className={styles.empty}>
            {history.length === 0 ? (
              <>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="6" y="6" width="36" height="36" rx="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 24h16M16 16h10M16 32h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>No analyses yet</h3>
                <p className={styles.emptyText}>
                  Analyze your first reel or audit your profile to get started.
                </p>
                <div className={styles.emptyActions}>
                  <Link href="/analyzer/reel" className={styles.emptyBtn}>
                    Analyze a reel
                  </Link>
                  <Link href="/analyzer/profile" className={styles.emptyBtnGhost}>
                    Audit profile
                  </Link>
                </div>
              </>
            ) : (
              <p className={styles.emptyText}>No matches found. Try a different filter or search.</p>
            )}
          </div>
        ) : (
          <div className={styles.list}>
            {filteredHistory.map((item) => {
              const isProfile = item.metrics?.type === 'profile_audit';
              const score = item.overall_score || 0;
              const scoreColor = score >= 8 ? 'green' : score >= 6 ? 'yellow' : 'red';

              return (
                <article key={item.id} className={styles.itemCard}>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={styles.itemMain}
                    aria-label={`View ${isProfile ? 'audit' : 'analysis'} details`}
                  >
                    <div className={styles.itemLeft}>
                      <div className={`${styles.itemType} ${isProfile ? styles.typeProfile : styles.typeReel}`}>
                        {isProfile ? 'AUDIT' : 'REEL'}
                      </div>
                      <div className={styles.itemContent}>
                        <h3 className={styles.itemTitle}>
                          {isProfile
                            ? `Profile audit: ${item.metrics?.handle ? `@${item.metrics.handle}` : 'Profile'}`
                            : item.analysis?.verdict || 'Reel analysis'}
                        </h3>
                        {!isProfile && item.caption && (
                          <p className={styles.itemPreview}>
                            {item.caption.substring(0, 120)}
                            {item.caption.length > 120 && '...'}
                          </p>
                        )}
                        {isProfile && item.analysis?.niche_identified && (
                          <p className={styles.itemPreview}>
                            Niche: {item.analysis.niche_identified}
                          </p>
                        )}
                        <span className={styles.itemDate}>{formatDate(item.created_at)}</span>
                      </div>
                    </div>

                    <div className={styles.itemRight}>
                      <div className={`${styles.scoreChip} ${styles[`score_${scoreColor}`]}`}>
                        <span className={styles.scoreNum}>{score?.toFixed?.(1) || score}</span>
                        <span className={styles.scoreOf}>/10</span>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={styles.itemArrow}>
                        <path d="M6 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className={styles.deleteBtn}
                    aria-label="Delete analysis"
                  >
                    {deleting === item.id ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 4h10M5 4V2h4v2M5 7v4M9 7v4M3 4l1 9h6l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
