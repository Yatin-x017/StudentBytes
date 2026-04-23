import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in">
      <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-text-muted">
        <p>Last updated: April 2026</p>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Local-First Data</h2>
          <p>Student Bytes is built with a privacy-first, local-first architecture. Most of your data, including chat history and notes, is stored locally in your browser's localStorage or a secure database instance that you control.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. AI API Keys</h2>
          <p>We do not store your AI API keys (Anthropic or Google Gemini) on our central servers. They are stored strictly in your browser and are used only to communicate directly with the respective AI providers.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Data Usage</h2>
          <p>We do not sell your data. We do not use your study sessions to train models. Your learning journey is yours alone.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
