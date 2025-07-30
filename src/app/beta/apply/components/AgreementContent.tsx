import React from 'react';

const AgreementContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none text-sm leading-relaxed">
      <h1 className="text-2xl font-bold text-cyan-400 mb-6">
        ZOROASTER UNIVERSE BETA READER NON-DISCLOSURE & PARTICIPATION AGREEMENT
      </h1>
      
      <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded">
        <p className="text-blue-300 font-semibold mb-2">Agreement Parties:</p>
        <p><strong>S1NAPANAHI</strong> (Author/Creator) - ZOROASTER Novel Worldbuilding Hub</p>
        <p><strong>You</strong> (Beta Reader) - Participant in the Beta Reader Program</p>
        <p><strong>Executed on:</strong> {new Date().toLocaleDateString()}</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">1. PURPOSE AND SCOPE</h2>
        <p className="text-gray-300 mb-4">
          This Agreement governs your participation in the ZOROASTER Universe Beta Reader Program, 
          including access to unpublished manuscripts, worldbuilding materials, character information, 
          timeline events, and related confidential content.
        </p>
        <p className="text-gray-300">
          The Confidential Materials include but are not limited to: draft manuscripts, character profiles, 
          world-building documents, timeline events, plot outlines, and author communications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">2. NON-DISCLOSURE OBLIGATIONS</h2>
        <div className="bg-red-900/20 border border-red-500/50 rounded p-4 mb-4">
          <h3 className="text-lg font-semibold text-red-300 mb-2">Critical Confidentiality Requirements</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong>No Sharing:</strong> You shall not share, distribute, or transmit any materials by any means</li>
            <li><strong>No Public Discussion:</strong> No social media posts, forum discussions, or personal conversations about the materials</li>
            <li><strong>Secure Storage:</strong> Materials must be stored securely and not uploaded to external services</li>
            <li><strong>Platform Only:</strong> Access materials only through the designated ZOROASTER platform</li>
          </ul>
        </div>
        <p className="text-amber-300 font-semibold">
          These obligations remain in effect indefinitely, even after official publication.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">3. INTELLECTUAL PROPERTY PROTECTION</h2>
        <div className="bg-amber-900/20 border border-amber-500/50 rounded p-4">
          <p className="text-gray-300 mb-2">
            <strong>All materials remain the exclusive intellectual property of S1NAPANAHI.</strong>
          </p>
          <p className="text-gray-300">
            You gain no ownership rights and may not create derivative works or use any elements 
            from the ZOROASTER universe in your own creative works.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">4. BETA READER OBLIGATIONS</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Complete assigned reading materials by specified deadlines</li>
          <li>Provide detailed, constructive feedback through designated channels</li>
          <li>Maintain respectful, professional communication</li>
          <li>Report technical issues promptly</li>
          <li>Follow all platform security protocols</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">5. PROHIBITED ACTIVITIES</h2>
        <div className="bg-red-900/20 border border-red-500/50 rounded p-4">
          <p className="text-red-300 font-semibold mb-2">You explicitly agree NOT to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Share content with anyone (family, friends, other writers)</li>
            <li>Post reviews before official publication</li>
            <li>Reference materials on social media</li>
            <li>Take screenshots or create copies</li>
            <li>Use AI tools to analyze the content</li>
            <li>Translate or summarize for others</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">6. LEGAL REMEDIES AND DAMAGES</h2>
        <div className="bg-purple-900/20 border border-purple-500/50 rounded p-4">
          <p className="text-purple-300 font-semibold mb-2">Breach Consequences:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong>Immediate Injunctive Relief:</strong> Court orders to stop violations immediately</li>
            <li><strong>Monetary Damages:</strong> All actual damages plus legal fees</li>
            <li><strong>Liquidated Damages:</strong> Minimum $10,000 USD per breach incident</li>
            <li><strong>Copyright Enforcement:</strong> Full protection under international copyright laws</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">7. PROGRAM TERMS</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Participation is voluntary and unpaid</li>
          <li>No employment relationship is created</li>
          <li>S1NAPANAHI may terminate participation at any time</li>
          <li>You may withdraw with 48-hour written notice</li>
          <li>Approved readers may receive acknowledgment in published works</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">8. GOVERNING LAW</h2>
        <p className="text-gray-300">
          This Agreement is governed by applicable copyright and contract laws. 
          Disputes will be resolved through direct communication, mediation, and if necessary, 
          binding arbitration or court proceedings.
        </p>
      </section>

      <div className="mt-12 p-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/50 rounded">
        <h3 className="text-lg font-semibold text-cyan-300 mb-3">Agreement Acknowledgment</h3>
        <p className="text-gray-300">
          By proceeding with this application, you acknowledge that you have read, understood, 
          and agree to be bound by all terms of this Agreement. You understand the serious 
          legal consequences of any breach and confirm your commitment to maintaining the 
          confidentiality and integrity of the ZOROASTER universe materials.
        </p>
      </div>
    </div>
  );
};

export default AgreementContent;
