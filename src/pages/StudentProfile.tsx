import React from 'react';

const StudentProfile: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-8 pt-12 pb-32">
      {/* Hero Section */}
      <section className="relative mb-24 flex flex-col md:flex-row items-center gap-12">
        <div className="relative group">
          <div className="absolute inset-0 ai-pulse-gradient blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
          <div className="relative h-48 w-48 rounded-full border-[6px] border-surface-container-lowest ambient-shadow overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUzeEhbuGygnzS_xWtX80Lenl6Oa-rqerbAafRIouol0M_UptZWQBk2y1EfmQCkBGR-8z_uH6RMqIvWZfxO6eLmRic9Dr-2sZVPY1QnX4X95um95Mgv8L7mULVIGt5I15_cdQF5ZfYcf8GrYpQi87cbKMJf5m0oXVqFNPOyOnBFLvEinA4wsfT23eCiBTJJw36Kwfp4YAxxlFg23rf3ylIJeWH9wq1q9G47envAwG9R5FUDE14neaHr1M8DDUq9uk7jIIGmDpxDInZ"
              className="w-full h-full object-cover"
              alt="Alex Johnson"
            />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 ai-pulse-gradient px-6 py-2 rounded-full rim-light whitespace-nowrap">
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.15em]">Level 12 Architect</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <span className="text-primary font-bold tracking-[0.1em] uppercase text-xs">Student Identity</span>
          <h1 className="text-[clamp(3rem,8vw,5rem)] font-extrabold tracking-[-0.04em] leading-[1.1] text-on-surface">Alex Johnson</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Visual Intelligence & Algorithm Design student focused on the intersection of human-centric AI and architectural planning.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <button className="ai-pulse-gradient text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all rim-light">Launch AI Lab</button>
            <button className="bg-surface-container-high text-on-surface px-8 py-3 rounded-xl font-semibold hover:bg-surface-container-highest transition-all">Export Resume</button>
          </div>
        </div>
      </section>

      {/* Bento Grid: Achievements */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-outline tracking-widest uppercase text-xs">Intellectual Growth</span>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">Achievements & Badges</h2>
          </div>
          <button className="text-primary font-bold text-sm hover:underline">View All Records</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded-[2rem] p-10 ambient-shadow rim-light relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8">
              <span className="material-symbols-outlined text-6xl text-primary/10" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-on-surface">Structural Mastermind</h3>
                <p className="text-on-surface-variant mt-2 leading-relaxed">Completed 45 advanced modules in generative spatial design with a 98% accuracy rate.</p>
              </div>
            </div>
            <div className="pt-8">
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="h-full ai-pulse-gradient w-[85%] rounded-full"></div>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">Milestone Progress</span>
                <span className="text-xs font-bold text-primary">85% Complete</span>
              </div>
            </div>
          </div>

          <Badge icon="psychology" label="AI Mentor Lite" color="secondary" />
          <Badge icon="verified_user" label="Verified Peer" color="tertiary-container" />
          <Badge icon="local_fire_department" label="30 Day Streak" color="error" />
          <Badge icon="hub" label="Network Node" color="primary" />
        </div>
      </section>

      {/* Projects */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-outline tracking-widest uppercase text-xs">Output & Production</span>
            <h2 className="text-4xl font-black tracking-tighter text-on-surface">Public Portfolio</h2>
          </div>
          <div className="flex gap-2 p-1 bg-surface-container-high rounded-lg">
            <button className="px-4 py-2 bg-surface-container-lowest rounded-md text-sm font-bold shadow-sm">All Projects</button>
            <button className="px-4 py-2 text-sm font-medium text-outline">Published</button>
            <button className="px-4 py-2 text-sm font-medium text-outline">Drafts</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProjectCard
            title="Neo-Atelier Concept"
            tag="Architecture"
            tagColor="secondary"
            date="May 2024"
            description="Exploration of modular learning spaces that adapt to biological circadian rhythms using real-time sensor data."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCF8xLvja_iZUMICtxI2uxOploVt9sXVRpQ_dpvO0YrocD-yOWJ7N53jNCnogclxPHsesbG9OrYJirpRcvis3c6UGt9PBYYHPHweUCjEKFDaBM_MGT-gQ1Cnx8_XRKpqwp6QWU4d61QjB86VOyhPaJ1eCsTq21hSESJkABJoJy4FgYtMEB0JeByV1HaaMZMV9q0U1WD_UIyKf9Mu8tQ3E5de8nD2KXWhn0-mDEsP91Xiv4req8ixkxRiOemhvoWpEyBDoY9extbOLdQ"
          />
          <ProjectCard
            title="Cognitive Mapping v2"
            tag="Data Science"
            tagColor="tertiary-container"
            date="Mar 2024"
            description="Visualizing information retention paths for students using the EduAdapt LLM infrastructure."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDXLbBJubkaeeQ95mlcUq5BauT4R8ztFoMTNp-QgixGUdeEfo-F5nAdLdyCbEHfPr9oAw0NufF3kYkkxPJs9_YNWAU7bmxi-x6IRLJV2CAbDkRLi09csiH9a5MCMq5VhPQolFBmT74MVQlupk1B9BqtNB8otbdW7DYWpKjU5SwovImjkTLeiQsMmzEYVVHJgWspA-87sGqQtmvEfEsADKT1yBqVg4nRW19xSz7vIGKtQ2LgBsXl54u8V8gXRlGsYOChA7-M4lHjJELt"
          />
          <ProjectCard
            title="Neural Interface UI"
            tag="Development"
            tagColor="primary"
            date="Jan 2024"
            description="Prototyping a 3D interface for rapid navigation through dense academic citation graphs."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAKx1F1Ns-DxUVux2WhxnNHDXO4pFhw6kuEdn9j65EecjnXgNfps2gj0ml6aoR4_wb0ko5wa3KE1RxTWDQyLESZIY5F_pq5NPO_aYA17xeSCglJfpMRHUrV_pdtwASqEtbayIiCUcyRgCmlxLSscphxCf2XRIbeZqihr7i7gB-uJZkZKZzvsPOHl7v-YLRNA-FGqmqd8_jfUTWBmwB3L7DjRFTEAHWBCMu3_fbvaSCWZEe3GD4BU_fowQK6T5Kai8nXGrsn22jJP21I"
          />
        </div>
      </section>

      {/* Curriculum Timeline */}
      <section>
        <div className="mb-12">
          <span className="text-outline tracking-widest uppercase text-xs">Academic Journey</span>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Curriculum Timeline</h2>
        </div>
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-12 ambient-shadow rim-light relative">
          <div className="absolute left-[3.25rem] top-16 bottom-16 w-0.5 bg-surface-container-highest"></div>
          <div className="space-y-12">
            <TimelineStep title="Advanced Generative Systems" subtitle="Module 08: Parametric Logic & Recursive Design" status="Current Focus" active />
            <TimelineStep title="Human-Computer Interaction" subtitle="Module 07: Ergonomics in Virtual Spaces" status="Completed" />
            <TimelineStep title="Ethics of Autonomous Agency" subtitle="Module 06: Moral Alignment in LLMs" status="Completed" />
            <TimelineStep title="Project: Sovereign Systems" subtitle="Capstone: Designing a Decentralized Learning Model" status="Locked" locked />
          </div>
        </div>
      </section>
    </div>
  );
};

const Badge = ({ icon, label, color }: any) => (
  <div className="bg-surface-container-low rounded-[1.5rem] p-8 flex flex-col items-center text-center space-y-4 hover:bg-surface-container-lowest transition-colors border border-transparent hover:border-outline-variant/20">
    <div className={`h-14 w-14 rounded-full bg-${color}/10 flex items-center justify-center`}>
      <span className={`material-symbols-outlined text-${color} text-2xl`}>{icon}</span>
    </div>
    <div className="text-sm font-bold text-on-surface uppercase tracking-tighter">{label}</div>
  </div>
);

const ProjectCard = ({ title, tag, tagColor, date, description, image }: any) => (
  <div className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden ambient-shadow rim-light">
    <div className="h-56 overflow-hidden">
      <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
    </div>
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-black text-${tagColor} tracking-widest uppercase bg-${tagColor}/5 px-2 py-1 rounded`}>{tag}</span>
        <span className="text-xs text-outline">{date}</span>
      </div>
      <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-on-surface-variant line-clamp-2">{description}</p>
      <div className="flex items-center gap-4 pt-4">
        <div className="flex -space-x-2">
          {[1, 2].map(i => <div key={i} className="w-6 h-6 rounded-full border border-surface-container-lowest bg-slate-200"></div>)}
        </div>
        <span className="text-xs font-medium text-outline">+12 collaborators</span>
      </div>
    </div>
  </div>
);

const TimelineStep = ({ title, subtitle, status, active = false, locked = false }: any) => (
  <div className={`relative pl-16 ${locked ? 'opacity-40' : active ? '' : 'opacity-70'}`}>
    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${active ? 'ai-pulse-gradient ring-8 ring-white' : locked ? 'border-2 border-outline-variant bg-white' : 'bg-outline-variant ring-4 ring-white'}`}></div>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h4 className={`text-lg font-bold text-on-surface ${!active && !locked ? 'font-semibold' : ''}`}>{title}</h4>
        <p className="text-on-surface-variant">{subtitle}</p>
      </div>
      <div className={`px-4 py-1.5 rounded-full ${active ? 'bg-primary/10' : locked ? 'flex items-center gap-2' : 'bg-surface-container-high'}`}>
        {locked && <span className="material-symbols-outlined text-sm">lock</span>}
        <span className={`text-xs font-bold uppercase ${active ? 'text-primary' : 'text-outline'}`}>{status}</span>
      </div>
    </div>
  </div>
);

export default StudentProfile;
