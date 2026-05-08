import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileByUsername } from '@/lib/profile';
import { supabase } from '@/lib/supabase';
import {
  GraduationCap, Zap, Brain, BookOpen
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const TwitterIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    Promise.all([
      getProfileByUsername(username),
      supabase?.from('leaderboard_entries')
        .select('*')
        .eq('username', username)
        .single()
        .then(r => r.data),
    ]).then(([p, lb]) => {
      if (!p || !p.is_public) {
        navigate('/community');
        return;
      }
      setProfile(p);
      setLeaderboard(lb);
    }).finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={32} />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-muted">Profile not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">

        {/* Profile header */}
        <Card className="p-8">
          <div className="flex items-start gap-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-24 h-24 rounded-3xl object-cover ring-4
                           ring-primary/20 shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br
                              from-primary to-accent flex items-center
                              justify-center text-white text-4xl font-black shrink-0">
                {profile.display_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-display font-black gradient-text mb-1">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-text-muted text-sm mb-3">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-sm leading-relaxed mb-3">{profile.bio}</p>
              )}
              {(profile.college || profile.branch) && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <GraduationCap size={13} />
                  {profile.branch && <span>{profile.branch}</span>}
                  {profile.college && <span>@ {profile.college}</span>}
                  {profile.year && <span>· Year {profile.year}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Social links */}
          {(profile.github_url || profile.linkedin_url || profile.twitter_url) && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-border">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-4 py-2 rounded-xl
                              bg-surface-2 border border-border hover:border-border-hover
                              text-xs font-bold text-text-muted hover:text-text
                              transition-all">
                  <GithubIcon size={14} /> GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-4 py-2 rounded-xl
                              bg-surface-2 border border-border hover:border-border-hover
                              text-xs font-bold text-text-muted hover:text-text
                              transition-all">
                  <LinkedinIcon size={14} /> LinkedIn
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-4 py-2 rounded-xl
                              bg-surface-2 border border-border hover:border-border-hover
                              text-xs font-bold text-text-muted hover:text-text
                              transition-all">
                  <TwitterIcon size={14} /> Twitter
                </a>
              )}
            </div>
          )}
        </Card>

        {/* Stats */}
        {leaderboard && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total XP', value: leaderboard.total_xp?.toLocaleString(), icon: Zap, color: 'text-primary' },
              { label: 'Quizzes', value: leaderboard.quizzes_taken, icon: Brain, color: 'text-accent' },
              { label: 'Sessions', value: leaderboard.study_sessions, icon: BookOpen, color: 'text-accent-2' },
            ].map(stat => (
              <Card key={stat.label} className="p-4 text-center">
                <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-black">{stat.value ?? 0}</p>
                <p className="text-[11px] text-text-muted uppercase font-bold tracking-wider">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Language badge */}
        {profile.preferred_language && (
          <Card className="p-5 flex items-center gap-4">
            <div className="text-2xl">
              {profile.preferred_language === 'Python' ? '🐍' :
               profile.preferred_language === 'JavaScript' ? '🟨' :
               profile.preferred_language === 'Java' ? '☕' :
               profile.preferred_language === 'C++' ? '⚡' :
               profile.preferred_language === 'TypeScript' ? '🔷' : '🐹'}
            </div>
            <div>
              <p className="font-black text-sm">{profile.preferred_language}</p>
              <p className="text-[11px] text-text-muted">Preferred language</p>
            </div>
          </Card>
        )}

        {/* CTA footer */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                       bg-primary hover:bg-primary-hover text-white font-bold
                       text-sm transition-all shadow-lg shadow-primary/25"
          >
            <Zap size={16} />
            Join Student Bytes
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
