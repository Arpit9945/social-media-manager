'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ToolHeader from '@/components/Shared/ToolHeader';
import { getTemplateById } from './templates';
import { REEL_WIDTH, REEL_HEIGHT, renderStaticFrame, loadLogo } from '@/lib/reel/canvasEngine';
import styles from './Library.module.scss';

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
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// Locally-rendered preview thumbnail (uses the template + saved data)
function ItemThumbnail({ item }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !item.template_id || !item.template_data) return;

    const template = getTemplateById(item.template_id);
    if (!template) return;

    const ctx = canvas.getContext('2d');
    const data = item.template_data;

    const draw = () => {
      try {
        renderStaticFrame(ctx, template, data);
      } catch (err) {
        ctx.fillStyle = data?.primaryColor || '#8b5cf6';
        ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
      }
    };

    // Initial render (logo skipped if not cached yet)
    draw();

    // Preload logo if present, then re-render
    if (data.logoUrl && data.showLogo !== false) {
      let cancelled = false;
      loadLogo(data.logoUrl).then((img) => {
        if (cancelled || !img) return;
        draw();
      });
      return () => {
        cancelled = true;
      };
    }
  }, [item]);

  return (
    <canvas
      ref={canvasRef}
      width={REEL_WIDTH}
      height={REEL_HEIGHT}
      className={styles.thumbnail}
    />
  );
}

export default function Library({ user, profile, items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState('all'); // 'all' | 'reel' | 'static'
  const [deleting, setDeleting] = useState(null);

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.content_format === filter;
  });

  const handleDelete = async (item) => {
    if (!confirm('Yeh permanently delete ho jayega. Sure ho?')) return;

    try {
      setDeleting(item.id);
      const supabase = createClient();

      // Delete from storage if image_url exists
      if (item.image_url) {
        try {
          // Extract path from URL
          const url = new URL(item.image_url);
          const pathMatch = url.pathname.match(/\/generated-posts\/(.+)$/);
          if (pathMatch) {
            await supabase.storage.from('generated-posts').remove([pathMatch[1]]);
          }
        } catch (e) {
          // Storage delete failure shouldn't block DB delete
          console.warn('Storage delete failed:', e);
        }
      }

      // Delete from DB
      const { error } = await supabase
        .from('generated_posts')
        .delete()
        .eq('id', item.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(items.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error(err);
      alert('Delete nahi ho saka. Phir try karo.');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (item) => {
    if (!item.image_url) {
      alert('Download URL nahi mila. Generator se phir se export karo.');
      return;
    }
    // Open in new tab — browser will handle download
    window.open(item.image_url, '_blank');
  };

  const reelCount = items.filter((i) => i.content_format === 'reel').length;
  const staticCount = items.filter((i) => i.content_format === 'static').length;

  return (
    <div className={styles.page}>
      <ToolHeader
        user={user}
        profile={profile}
        breadcrumb={[
          { label: 'Generator', href: '/dashboard' },
          { label: 'My Library' },
        ]}
      />

      <main className={styles.main}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>My Library</h1>
          <p className={styles.subtitle}>
            {items.length} item{items.length !== 1 ? 's' : ''} generated • {reelCount} reel{reelCount !== 1 ? 's' : ''}, {staticCount} post{staticCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter tabs */}
        {items.length > 0 && (
          <div className={styles.filterTabs}>
            <button
              onClick={() => setFilter('all')}
              className={`${styles.filterTab} ${filter === 'all' ? styles.filterActive : ''}`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilter('reel')}
              className={`${styles.filterTab} ${filter === 'reel' ? styles.filterActive : ''}`}
            >
              Reels ({reelCount})
            </button>
            <button
              onClick={() => setFilter('static')}
              className={`${styles.filterTab} ${filter === 'static' ? styles.filterActive : ''}`}
            >
              Static posts ({staticCount})
            </button>
          </div>
        )}

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <div className={styles.empty}>
            {items.length === 0 ? (
              <>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 18h16M16 24h16M16 30h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>Library khali hai</h3>
                <p className={styles.emptyText}>
                  Pehla reel ya post generate karo — yahan automatically save ho jayega.
                </p>
                <div className={styles.emptyActions}>
                  <Link href="/generator/reel" className={styles.emptyBtn}>
                    Create a reel
                  </Link>
                  <Link href="/generator/post" className={styles.emptyBtnGhost}>
                    Create a post
                  </Link>
                </div>
              </>
            ) : (
              <p className={styles.emptyText}>Is filter mein kuch nahi mila. Different filter try karo.</p>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredItems.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardPreview}>
                  <ItemThumbnail item={item} />
                  <div className={styles.cardOverlay}>
                    <span className={`${styles.formatBadge} ${item.content_format === 'reel' ? styles.badgeReel : styles.badgeStatic}`}>
                      {item.content_format === 'reel' ? 'REEL' : 'POST'}
                    </span>
                    {item.file_format && (
                      <span className={styles.fileFormat}>.{item.file_format}</span>
                    )}
                  </div>
                </div>

                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{item.title || 'Untitled'}</h3>
                  {item.caption && (
                    <p className={styles.cardCaption}>{item.caption}</p>
                  )}
                  <span className={styles.cardDate}>{formatDate(item.created_at)}</span>

                  <div className={styles.cardActions}>
                    {item.image_url && (
                      <button
                        onClick={() => handleDownload(item)}
                        className={styles.downloadBtn}
                        aria-label="Download"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1v9M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deleting === item.id}
                      className={styles.deleteBtn}
                      aria-label="Delete"
                    >
                      {deleting === item.id ? (
                        <span className={styles.spinner}></span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 4h10M5 4V2h4v2M5 7v4M9 7v4M3 4l1 9h6l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
