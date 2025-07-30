'use client';

import React, { useState } from 'react';
import BetaAgreementForm from './components/BetaAgreementForm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const BetaApplicationPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAgreementAccept = async (agreementData: any) => {
    setIsSubmitting(true);
    
    try {
      // Submit agreement data to backend
      const response = await fetch('/api/beta/agreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agreementData),
      });

      if (response.ok) {
        toast.success('Agreement accepted successfully!');
        router.push('/beta/application-form');
      } else {
        throw new Error('Failed to submit agreement');
      }
    } catch (error) {
      toast.error('Failed to submit agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgreementReject = () => {
    toast.error('Agreement declined. You cannot proceed with the beta reader application.');
    router.push('/');
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Submitting your agreement...</p>
        </div>
      </div>
    );
  }

  return (
    <BetaAgreementForm
      onAccept={handleAgreementAccept}
      onReject={handleAgreementReject}
    />
  );
};

export default BetaApplicationPage;
