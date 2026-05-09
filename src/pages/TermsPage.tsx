import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in">
      <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-text-muted">
        <p>Last updated: April 2026</p>
        <section>
          <h2 className="text-2xl font-bold text-text mb-4">1. Acceptance of Terms</h2>
          <p>By using Student Bytes, you agree to these terms. Student Bytes is a platform designed to assist in learning Computer Science concepts.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text mb-4">2. AI Disclaimer</h2>
          <p>Student Bytes uses large language models. AI can hallucinate or provide incorrect code. Always verify important information and academic work.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text mb-4">3. Personal Use</h2>
          <p>This instance is for personal, educational use. You are responsible for your own API usage and costs associated with third-party AI providers.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
