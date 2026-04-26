import React, { useState, useEffect } from 'react';
import { GraduationCap, AlertCircle, FileText, Bell, ExternalLink, LogOut, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
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
        // Fetch assignments from ALL courses for a complete picture
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

  const studyWithByte = (content: string) => {
    navigate(ROUTES.STUDY, { state: { prefillMessage: content } });
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Canvas</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="success" className="bg-success/10 text-success border-success/20">
                <CheckCircle2 size={10} className="mr-1" /> Connected
              </Badge>
              <span className="text-xs text-text-muted truncate max-w-[200px]">{domain}</span>
            </div>
          </div>
        </div>
        <Button variant="secondary" onClick={handleDisconnect} className="w-fit flex items-center gap-2 text-xs font-bold px-4">
          <LogOut size={14} /> Disconnect
        </Button>
      </header>

      <div className="space-y-4">
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide no-scrollbar">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourse(course);
                // Filter already-loaded assignments by course instead of re-fetching
                setAssignments(prev => {
                  // If we have assignments with courseName, filter; otherwise re-fetch
                  const filtered = prev.filter(a => (a as any).courseName === course.name);
                  return filtered.length > 0 ? filtered : prev;
                });
                loadCourseData(course);
              }}
              className={cn(
                "flex-shrink-0 px-5 py-3 rounded-2xl border transition-all text-sm font-bold whitespace-nowrap",
                selectedCourse?.id === course.id
                  ? "bg-primary/10 border-primary text-white shadow-lg shadow-primary/10"
                  : "bg-surface border-white/5 text-text-muted hover:border-white/10 hover:text-white"
              )}
            >
              <span className="text-[10px] block opacity-60 uppercase mb-0.5 tracking-tighter">{course.course_code}</span>
              {course.name.length > 25 ? course.name.substring(0, 25) + '...' : course.name}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataLoading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
              <div className="pt-4 flex gap-2">
                <div className="h-10 bg-white/5 rounded w-full" />
                <div className="h-10 bg-white/5 rounded w-full" />
              </div>
            </Card>
          ))
        ) : activeTab === 'assignments' ? (
          assignments.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="p-4 bg-white/5 rounded-full w-fit mx-auto text-text-muted">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">No upcoming assignments</h3>
                <p className="text-text-muted">You're all caught up! Nice job.</p>
              </div>
            </div>
          ) : (
            assignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 h-full flex flex-col hover:border-primary/30 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-1">
                    <Badge variant="outline" className={cn("text-[10px] font-black border-none", dueDateColor(assignment.due_at))}>
                      {formatDueDate(assignment.due_at)}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate pr-8">
                      {assignment.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 truncate">
                      {(assignment as any).courseName || selectedCourse?.name}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black text-text-muted uppercase tracking-tighter">
                      <span>{assignment.points_possible} points</span>
                      <span>{assignment.submission_types.join(', ')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        className="text-[10px] font-black uppercase tracking-widest gap-1 py-4"
                        onClick={() => studyWithByte(`Help me understand this assignment: "${assignment.name}". ${stripHtml(assignment.description).slice(0, 300)}`)}
                      >
                        Study
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-[10px] font-black uppercase tracking-widest gap-1 py-4"
                        onClick={() => window.open(assignment.html_url, '_blank')}
                      >
                        Canvas <ExternalLink size={10} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )
        ) : (
          announcements.length === 0 ? (
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
                    onClick={() => studyWithByte(`Summarize and explain this announcement from my professor: "${announcement.title}". ${stripHtml(announcement.message).slice(0, 500)}`)}
                  >
                    Explain this <ChevronRight size={14} />
                  </Button>
                </Card>
              </motion.div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default CanvasPage;
