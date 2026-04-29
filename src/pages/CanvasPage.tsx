import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  AlertCircle,
  FileText,
  Bell,
  ExternalLink,
  LogOut,
  ChevronRight,
  Loader2,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { STORAGE_KEYS, ROUTES } from '@/lib/constants';
import { fetchCourses, fetchAssignments, fetchAnnouncements, formatDueDate, dueDateColor } from '@/lib/canvas';
import type { CanvasCourse, CanvasAssignment, CanvasAnnouncement } from '@/lib/types';
import { cn } from '@/lib/utils';

const CanvasPage: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.CANVAS_TOKEN) || '');
  const [domain, setDomain] = useState(localStorage.getItem(STORAGE_KEYS.CANVAS_DOMAIN) || '');
  const [courses, setCourses] = useState<CanvasCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CanvasCourse | null>(null);
  const [assignments, setAssignments] = useState<CanvasAssignment[]>([]);
  const [announcements, setAnnouncements] = useState<CanvasAnnouncement[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(!!localStorage.getItem(STORAGE_KEYS.CANVAS_TOKEN));
  const [activeTab, setActiveTab] = useState<'assignments' | 'announcements'>('assignments');

  useEffect(() => {
    if (connected && domain && token) {
      handleConnect();
    }
  }, []);

  const handleConnect = async () => {
    if (!domain.trim() || !token.trim()) {
      setError('Enter both your Canvas domain and access token.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fetchedCourses = await fetchCourses(domain.trim(), token.trim());
      if (!Array.isArray(fetchedCourses) || fetchedCourses.length === 0) {
        throw new Error('No active courses found. Check your domain and token.');
      }
      localStorage.setItem(STORAGE_KEYS.CANVAS_TOKEN, token.trim());
      localStorage.setItem(STORAGE_KEYS.CANVAS_DOMAIN, domain.trim());
      setCourses(fetchedCourses);
      setConnected(true);
      if (fetchedCourses.length > 0) {
        setSelectedCourse(fetchedCourses[0]);
        loadCourseData(fetchedCourses[0], fetchedCourses);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect. Check your domain and token.');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseData = async (course: CanvasCourse, allCourses?: CanvasCourse[]) => {
    setDataLoading(true);
    try {
      const coursesToFetch = allCourses || [course];
      const [assns, anns] = await Promise.all([
        Promise.allSettled(
          coursesToFetch.map(c => fetchAssignments(domain || localStorage.getItem(STORAGE_KEYS.CANVAS_DOMAIN) || '', token || localStorage.getItem(STORAGE_KEYS.CANVAS_TOKEN) || '', c.id)
            .then(a => a.map(assignment => ({ ...assignment, courseName: c.name })))
          )
        ).then(results =>
          results
            .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
            .flatMap(r => r.value)
            .sort((a, b) => {
              if (!a.due_at) return 1;
              if (!b.due_at) return -1;
              return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
            })
        ),
        fetchAnnouncements(domain || localStorage.getItem(STORAGE_KEYS.CANVAS_DOMAIN) || '', token || localStorage.getItem(STORAGE_KEYS.CANVAS_TOKEN) || '', course.id)
      ]);
      setAssignments(assns);
      setAnnouncements(anns);
    } catch (err) {
      console.error('Failed to load course data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem(STORAGE_KEYS.CANVAS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CANVAS_DOMAIN);
    setConnected(false);
    setCourses([]);
    setSelectedCourse(null);
    setAssignments([]);
    setAnnouncements([]);
  };

  const handleHelp = async (assignment: any) => {
    navigate(ROUTES.STUDY, {
      state: { prefillMessage:
        `Help me with this assignment: "${assignment.name}"\n\n` +
        `Course: ${(assignment as any).courseName || selectedCourse?.name}\n` +
        `Description: ${stripHtml(assignment.description).slice(0, 500)}\n\n` +
        `Please analyze this and suggest how I should start.`
      }
    });
  };

  const stripHtml = (html: string | null) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  if (!connected) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-fade-in">
        <Card className="p-8 text-center space-y-8 border-white/10 shadow-2xl bg-surface">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
            <GraduationCap size={40} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Connect Canvas</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              Link your Canvas LMS account to see assignments, deadlines,
              and announcements — then study them with Byte.
            </p>
          </div>

          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                Canvas Domain
              </label>
              <Input
                placeholder="yourschool.instructure.com"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="bg-black/40 border-white/10"
              />
              <p className="text-[10px] text-text-muted ml-1 italic">
                Your university's Canvas URL, e.g. canvas.rishihood.edu.in
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                Access Token
              </label>
              <Input
                type="password"
                placeholder="Canvas access token"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="bg-black/40 border-white/10"
              />
              <p className="text-[10px] text-text-muted ml-1 italic leading-tight">
                In Canvas: Account → Settings → "New Access Token" → copy and paste here.
                Stored only on your device.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button className="w-full py-7 text-base font-black shadow-xl shadow-primary/20" onClick={handleConnect} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Connect Canvas
            </Button>
            <p className="text-[10px] text-text-muted mt-4 font-medium opacity-60">
              For personal use only. Never share your access token.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-center gap-2"
            >
              <AlertCircle size={14} className="shrink-0" /> {error}
            </motion.div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in px-4">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center
                          justify-center border border-primary/20">
            <GraduationCap size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black tracking-tight">Canvas</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] text-success font-bold">CONNECTED</span>
              <span className="text-[11px] text-text-muted">· {domain}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-error/20
                     hover:bg-error/10 text-error text-xs font-bold transition-all"
        >
          <LogOut size={14} />
          Disconnect
        </button>
      </div>

      <div className="space-y-4">
        {/* Course Selector redesign */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {courses.map(course => (
            <button
              key={course.id}
              onClick={() => { setSelectedCourse(course); loadCourseData(course, courses); }}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold
                          transition-all border ${
                selectedCourse?.id === course.id
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'bg-surface border-border text-text-muted hover:text-white hover:border-white/10'
              }`}
            >
              <div className="font-black text-[10px] uppercase tracking-widest opacity-60 mb-0.5">
                {course.course_code}
              </div>
              <div className="truncate max-w-[140px]">{course.name}</div>
            </button>
          ))}
        </div>

        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTab('assignments')}
            className={cn(
              "px-6 py-4 text-sm font-black uppercase tracking-widest transition-all relative",
              activeTab === 'assignments' ? "text-white" : "text-text-muted hover:text-white"
            )}
          >
            Assignments
            {activeTab === 'assignments' && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={cn(
              "px-6 py-4 text-sm font-black uppercase tracking-widest transition-all relative",
              activeTab === 'announcements' ? "text-white" : "text-text-muted hover:text-white"
            )}
          >
            Announcements
            {activeTab === 'announcements' && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'assignments' ? (
        <div className="grid grid-cols-1 gap-3">
          {dataLoading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="p-6 h-24 animate-pulse bg-surface/50 border-white/5"> </Card>
            ))
          ) : assignments.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="p-4 bg-white/5 rounded-full w-fit mx-auto text-text-muted">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">No upcoming assignments</h3>
                <p className="text-text-muted">You're all caught up! Nice job.</p>
              </div>
            </div>
          ) : (
            assignments.map((assignment, i) => {
              const dueColor = dueDateColor(assignment.due_at);
              const dueLabel = formatDueDate(assignment.due_at);
              const isUrgent = dueLabel.includes('today') || dueLabel.includes('tomorrow')
                            || dueLabel.includes('1 day') || dueLabel.includes('2 day');
              const isOverdue = dueLabel === 'Overdue';

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`group relative p-5 rounded-2xl border transition-all
                              hover:border-white/10 cursor-default ${
                    isOverdue
                      ? 'bg-red-950/20 border-red-500/20'
                      : isUrgent
                      ? 'bg-amber-950/10 border-amber-500/15'
                      : 'bg-surface border-border hover:bg-surface-2'
                  }`}
                >
                  {/* Urgency indicator bar */}
                  {(isUrgent || isOverdue) && (
                    <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${
                      isOverdue ? 'bg-error' : 'bg-warning'
                    }`} />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Assignment icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                    shrink-0 mt-0.5 ${
                      isOverdue ? 'bg-red-500/10' :
                      isUrgent  ? 'bg-amber-500/10' : 'bg-primary/10'
                    }`}>
                      <FileText size={18} className={
                        isOverdue ? 'text-error' : isUrgent ? 'text-warning' : 'text-primary'
                      } />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-bold text-sm leading-snug line-clamp-2">
                          {assignment.name}
                        </h3>
                        <span className={`text-xs font-black shrink-0 ${dueColor}`}>
                          {dueLabel}
                        </span>
                      </div>

                      <p className="text-[11px] text-text-muted truncate mb-3">
                        {(assignment as any).courseName || selectedCourse?.name}
                        {assignment.points_possible > 0 &&
                          ` · ${assignment.points_possible} pts`}
                      </p>

                      {/* Actions row */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleHelp(assignment)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                     bg-amber-500/10 hover:bg-amber-500/20
                                     border border-amber-500/20 hover:border-amber-500/40
                                     text-amber-400 text-[11px] font-bold transition-all"
                        >
                          <Lightbulb size={12} />
                          Help
                        </button>

                        <button
                          onClick={() => navigate(ROUTES.STUDY, {
                            state: { prefillMessage:
                              `Help me with: "${assignment.name}" from ${
                                (assignment as any).courseName || selectedCourse?.name
                              }` }
                          })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                     bg-primary/10 hover:bg-primary/20
                                     border border-primary/20 hover:border-primary/40
                                     text-primary text-[11px] font-bold transition-all"
                        >
                          <Sparkles size={12} />
                          Study
                        </button>

                        <a
                          href={assignment.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                     bg-white/5 hover:bg-white/10 border border-white/10
                                     text-text-muted hover:text-white text-[11px] font-bold
                                     transition-all ml-auto"
                        >
                          <ExternalLink size={12} />
                          Canvas
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataLoading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="p-6 h-48 animate-pulse bg-surface/50 border-white/5"> </Card>
            ))
          ) : announcements.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="p-4 bg-white/5 rounded-full w-fit mx-auto text-text-muted">
                <Bell size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">No announcements</h3>
                <p className="text-text-muted">Everything is quiet for now.</p>
              </div>
            </div>
          ) : (
            announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 h-full flex flex-col hover:border-accent/30 transition-all group">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-accent transition-colors">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 italic">
                      {new Date(announcement.posted_at).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>

                  <p className="text-sm text-text-muted line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {stripHtml(announcement.message)}
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-[10px] font-black uppercase tracking-widest gap-1 py-5 border-white/10 hover:border-accent hover:text-accent"
                    onClick={() => navigate(ROUTES.STUDY, { state: { prefillMessage: `Summarize and explain this announcement from my professor: "${announcement.title}". ${stripHtml(announcement.message).slice(0, 500)}` } })}
                  >
                    Explain this <ChevronRight size={14} />
                  </Button>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default CanvasPage;
