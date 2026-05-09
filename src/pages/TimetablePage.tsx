import React, { useState, useEffect } from 'react';
import { Plus, Clock, MapPin, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DAYS, CLASS_COLORS } from '@/lib/constants';
import type { ClassSlot } from '@/lib/types';
import { cn } from '@/lib/utils';

export function getTodayClasses(slots: ClassSlot[]): ClassSlot[] {
  const today = new Date().getDay();
  return slots
    .filter(s => s.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getCurrentClass(slots: ClassSlot[]): ClassSlot | null {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const today = getTodayClasses(slots);
  return today.find(s => s.startTime <= timeStr && s.endTime > timeStr) || null;
}

const TimetablePage: React.FC = () => {
  const [slots, setSlots] = useState<ClassSlot[]>(() => {
    const saved = localStorage.getItem('sb_timetable');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ClassSlot | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ClassSlot>>({
    day: 1,
    color: CLASS_COLORS[0]
  });

  useEffect(() => {
    localStorage.setItem('sb_timetable', JSON.stringify(slots));
  }, [slots]);

  const handleAddClick = (day?: number) => {
    setEditingSlot(null);
    setFormData({
      subject: '',
      instructor: '',
      room: '',
      day: (day !== undefined ? day : 1) as any,
      startTime: '09:00',
      endTime: '10:00',
      color: CLASS_COLORS[0]
    });
    setShowModal(true);
  };

  const handleEditClick = (slot: ClassSlot) => {
    setEditingSlot(slot);
    setFormData(slot);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.subject || !formData.startTime || !formData.endTime) return;

    if (editingSlot) {
      setSlots(prev => prev.map(s => s.id === editingSlot.id ? { ...formData as ClassSlot } : s));
    } else {
      const newSlot: ClassSlot = {
        ...formData as ClassSlot,
        id: `slot_${Date.now()}`
      };
      setSlots(prev => [...prev, newSlot]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (editingSlot) {
      setSlots(prev => prev.filter(s => s.id !== editingSlot.id));
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Timetable</h1>
          <p className="text-text-muted">Plan your week and stay on top of your classes.</p>
        </div>
        <Button onClick={() => handleAddClick()} className="gap-2 shadow-xl shadow-primary/20 font-black uppercase tracking-widest px-8 py-6 rounded-2xl">
          <Plus size={20} /> Add Class
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map(day => (
          <div key={day} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">
                {DAYS[day]}
              </h3>
              <button
                onClick={() => handleAddClick(day)}
                className="text-text-muted hover:text-primary transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-3 min-h-[100px]">
              {slots
                .filter(s => s.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(slot => (
                  <motion.div
                    key={slot.id}
                    layoutId={slot.id}
                    onClick={() => handleEditClick(slot)}
                    className={cn(
                      "p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group",
                      slot.color
                    )}
                  >
                    <p className="font-black text-sm truncate mb-1">{slot.subject}</p>
                    <div className="space-y-1 opacity-70 font-bold text-[10px] uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Clock size={10} /> {slot.startTime} – {slot.endTime}
                      </div>
                      {slot.room && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={10} /> {slot.room}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              }
              {slots.filter(s => s.day === day).length === 0 && (
                <div className="h-24 rounded-2xl border border-dashed border-border flex items-center justify-center">
                   <p className="text-[10px] font-bold text-text-muted/30 uppercase">Free Day</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          title={editingSlot ? "Edit Class" : "Add New Class"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Subject Name"
                placeholder="e.g. Operating Systems"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                autoFocus
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Instructor"
                  placeholder="e.g. Dr. Smith"
                  value={formData.instructor}
                  onChange={e => setFormData({...formData, instructor: e.target.value})}
                />
                <Input
                  label="Room / Link"
                  placeholder="e.g. Lab 402"
                  value={formData.room}
                  onChange={e => setFormData({...formData, room: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Day</label>
                    <select
                      value={formData.day}
                      onChange={e => setFormData({...formData, day: parseInt(e.target.value) as any})}
                      className="w-full bg-surface-2 border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
                    >
                      {[1,2,3,4,5,6].map(d => (
                        <option key={d} value={d}>{DAYS[d]}</option>
                      ))}
                    </select>
                 </div>
                 <Input
                   label="Starts"
                   type="time"
                   value={formData.startTime}
                   onChange={e => setFormData({...formData, startTime: e.target.value})}
                 />
                 <Input
                   label="Ends"
                   type="time"
                   value={formData.endTime}
                   onChange={e => setFormData({...formData, endTime: e.target.value})}
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Pill Color</label>
                 <div className="flex flex-wrap gap-3">
                   {CLASS_COLORS.map(color => (
                     <button
                       key={color}
                       onClick={() => setFormData({...formData, color})}
                       className={cn(
                         "w-10 h-10 rounded-full border-4 transition-all",
                         color.split(' ')[0], // bg class
                         formData.color === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                       )}
                     />
                   ))}
                 </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {editingSlot && (
                <Button variant="danger" onClick={handleDelete} className="px-6">
                  <Trash2 size={18} />
                </Button>
              )}
              <Button onClick={handleSave} className="flex-1 py-6 text-sm font-black uppercase tracking-widest">
                <Save size={18} className="mr-2" /> {editingSlot ? 'Update Class' : 'Add to Schedule'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TimetablePage;
