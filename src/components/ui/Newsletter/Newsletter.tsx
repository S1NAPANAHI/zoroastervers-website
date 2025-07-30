'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
  };

  if (isSubscribed) {
    return (
      <div className="glass-dark p-6 text-center">
        <span className="text-4xl mb-4 block">✨</span>
        <h3 className="text-xl font-bold text-[#dcddde] mb-2">Welcome to the Universe!</h3>
        <p className="text-[#b3b3b3]">
          You'll receive updates on new releases, exclusive content, and behind-the-scenes insights.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-dark p-6 glow-card">
      <h3 className="text-2xl font-bold text-[#dcddde] mb-2 flex items-center">
        📧 Stay Updated
      </h3>
      <p className="text-[#b3b3b3] mb-4">
        Get notified about new releases, exclusive content, and special offers!
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full glass border border-[#484848] px-4 py-3 rounded-lg bg-transparent text-[#dcddde] placeholder-[#b3b3b3] focus:border-[#a855f7] focus:outline-none"
          />
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-[#b3b3b3]">
          <input type="checkbox" required className="rounded" />
          <span>I agree to receive marketing emails and can unsubscribe at any time.</span>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${isLoading ? 'opacity-50' : 'neon-button'} py-3`}
        >
          {isLoading ? 'Subscribing...' : 'Join the Universe 🚀'}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-[#b3b3b3] text-center">
        📊 Join 15,000+ readers • 📬 Monthly updates • 🎁 Exclusive content
      </div>
    </div>
  );
}
