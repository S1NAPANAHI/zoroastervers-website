'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BetaApplicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [applicationsClosed, setApplicationsClosed] = useState(false);

  // Check if beta program is enabled
  const betaEnabled = process.env.NEXT_PUBLIC_BETA_ENABLED === 'true';

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    whyInterested: '',
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    referralSource: '',
    additionalInfo: ''
  });

  // Check beta application status on mount
  useEffect(() => {
    const checkBetaStatus = async () => {
      try {
        const response = await fetch('/api/beta/status');
        const data = await response.json();
        setApplicationsClosed(data.closed);
      } catch (error) {
        console.error('Failed to check beta status:', error);
        setApplicationsClosed(true);
      }
    };

    checkBetaStatus();
  }, []);

  // Show disabled state if beta is disabled or applications are closed
  if (!betaEnabled || applicationsClosed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Beta Program</h1>
          <p className="text-gray-300">
            {!betaEnabled 
              ? "The beta program is currently not available."
              : "We have reached our maximum number of beta applications. Thank you for your interest!"}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Add timestamp to submission
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString()
      };

      const response = await fetch('/api/beta/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(result.message || 'Failed to submit application');
      }
    } catch (error) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of the component remains the same ...
  // (keeping the existing JSX for submitted state and form UI)
}