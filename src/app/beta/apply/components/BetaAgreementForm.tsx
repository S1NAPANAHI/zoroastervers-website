'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, FileText, Shield, Clock } from 'lucide-react';
import ConsentCheckbox from './ConsentCheckbox';
import AgreementContent from './AgreementContent';

interface BetaAgreementFormProps {
  onAccept: (agreementData: AgreementData) => void;
  onReject: () => void;
}

interface AgreementData {
  fullName: string;
  email: string;
  digitalSignature: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  agreementVersion: string;
  consentGiven: boolean;
  specificConsents: {
    nda: boolean;
    intellectualProperty: boolean;
    platformUsage: boolean;
    feedbackRequirement: boolean;
    legalCompliance: boolean;
  };
}

const BetaAgreementForm: React.FC<BetaAgreementFormProps> = ({ onAccept, onReject }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agreementData, setAgreementData] = useState<AgreementData>({
    fullName: '',
    email: '',
    digitalSignature: '',
    timestamp: '',
    ipAddress: '',
    userAgent: '',
    agreementVersion: '1.0.0',
    consentGiven: false,
    specificConsents: {
      nda: false,
      intellectualProperty: false,
      platformUsage: false,
      feedbackRequirement: false,
      legalCompliance: false
    }
  });
  
  const [hasReadAgreement, setHasReadAgreement] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Track reading progress for legal compliance
  useEffect(() => {
    const handleScroll = () => {
      const agreementElement = document.getElementById('agreement-content');
      if (agreementElement) {
        const scrollTop = agreementElement.scrollTop;
        const scrollHeight = agreementElement.scrollHeight - agreementElement.clientHeight;
        const progress = Math.min((scrollTop / scrollHeight) * 100, 100);
        setReadingProgress(progress);
        
        if (progress >= 90) {
          setHasReadAgreement(true);
        }
      }
    };

    const agreementElement = document.getElementById('agreement-content');
    agreementElement?.addEventListener('scroll', handleScroll);
    return () => agreementElement?.removeEventListener('scroll', handleScroll);
  }, []);

  // Collect technical data for legal compliance
  useEffect(() => {
    setAgreementData(prev => ({
      ...prev,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ipAddress: 'Will be collected server-side' // Collected on backend for privacy
    }));
  }, []);

  // Validate form completion
  useEffect(() => {
    const { fullName, email, digitalSignature, specificConsents } = agreementData;
    const allConsentsGiven = Object.values(specificConsents).every(consent => consent);
    
    setIsFormValid(
      fullName.trim() !== '' &&
      email.trim() !== '' &&
      digitalSignature.trim() !== '' &&
      hasReadAgreement &&
      allConsentsGiven
    );
  }, [agreementData, hasReadAgreement]);

  const handleInputChange = (field: keyof AgreementData, value: any) => {
    setAgreementData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConsentChange = (consentType: keyof typeof agreementData.specificConsents) => {
    setAgreementData(prev => ({
      ...prev,
      specificConsents: {
        ...prev.specificConsents,
        [consentType]: !prev.specificConsents[consentType]
      }
    }));
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      setShowValidationErrors(true);
      return;
    }

    const finalAgreementData = {
      ...agreementData,
      consentGiven: true,
      timestamp: new Date().toISOString()
    };

    onAccept(finalAgreementData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'border-gray-600 text-gray-400'
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-gray-300">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Read Agreement' :
              currentStep === 2 ? 'Personal Information' :
              'Digital Signature & Consent'
            }
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Agreement Reading */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gray-800/80 backdrop-blur-md rounded-lg p-8"
            >
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-cyan-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">
                  ZOROASTER Beta Reader Agreement
                </h2>
              </div>

              {/* Reading Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Reading Progress</span>
                  <span className="text-sm text-cyan-400">{Math.round(readingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                {!hasReadAgreement && (
                  <p className="text-sm text-amber-400 mt-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Please scroll through the entire agreement to continue
                  </p>
                )}
              </div>

              {/* Agreement Content */}
              <div 
                id="agreement-content"
                className="bg-gray-900 rounded-lg p-6 h-96 overflow-y-auto border border-gray-700"
              >
                <AgreementContent />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={onReject}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Decline Agreement
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!hasReadAgreement}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    hasReadAgreement
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Personal Information
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gray-800/80 backdrop-blur-md rounded-lg p-8"
            >
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-cyan-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Personal Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={agreementData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter your full legal name as it appears on official documents"
                  />
                  {showValidationErrors && !agreementData.fullName.trim() && (
                    <p className="text-red-400 text-sm mt-1">Full name is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={agreementData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                  {showValidationErrors && !agreementData.email.trim() && (
                    <p className="text-red-400 text-sm mt-1">Email address is required</p>
                  )}
                </div>

                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Data Collection Notice</h3>
                  <p className="text-sm text-gray-300">
                    For legal compliance, we will automatically collect technical information including:
                    your IP address, browser information, and timestamp. This data is used solely 
                    for agreement verification and legal protection.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Back to Agreement
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!agreementData.fullName.trim() || !agreementData.email.trim()}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    agreementData.fullName.trim() && agreementData.email.trim()
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Signature
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Digital Signature & Specific Consents */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gray-800/80 backdrop-blur-md rounded-lg p-8"
            >
              <div className="flex items-center mb-6">
                <CheckCircle className="w-8 h-8 text-cyan-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Digital Signature & Final Consent</h2>
              </div>

              {/* Specific Consent Checkboxes */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Specific Consent Requirements</h3>
                <div className="space-y-4">
                  {[
                    {
                      key: 'nda' as const,
                      title: 'Non-Disclosure Agreement',
                      description: 'I agree to maintain absolute confidentiality regarding all ZOROASTER materials'
                    },
                    {
                      key: 'intellectualProperty' as const,
                      title: 'Intellectual Property Protection',
                      description: 'I acknowledge that all materials remain the property of S1NAPANAHI'
                    },
                    {
                      key: 'platformUsage' as const,
                      title: 'Platform Usage Terms',
                      description: 'I agree to use only the designated ZOROASTER platform and follow all security protocols'
                    },
                    {
                      key: 'feedbackRequirement' as const,
                      title: 'Feedback Obligations',
                      description: 'I agree to provide constructive feedback by specified deadlines'
                    },
                    {
                      key: 'legalCompliance' as const,
                      title: 'Legal Compliance',
                      description: 'I understand the legal consequences of breach and agree to all terms'
                    }
                  ].map((consent) => (
                    <ConsentCheckbox
                      key={consent.key}
                      checked={agreementData.specificConsents[consent.key]}
                      onChange={() => handleConsentChange(consent.key)}
                      title={consent.title}
                      description={consent.description}
                      showError={showValidationErrors && !agreementData.specificConsents[consent.key]}
                    />
                  ))}
                </div>
              </div>

              {/* Digital Signature */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Digital Signature *
                </label>
                <input
                  type="text"
                  value={agreementData.digitalSignature}
                  onChange={(e) => handleInputChange('digitalSignature', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Type your full legal name as your digital signature"
                />
                <p className="text-sm text-gray-400 mt-1">
                  By typing your name, you are providing a legally binding digital signature
                </p>
                {showValidationErrors && !agreementData.digitalSignature.trim() && (
                  <p className="text-red-400 text-sm mt-1">Digital signature is required</p>
                )}
              </div>

              {/* Agreement Summary */}
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Agreement Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <strong>Signatory:</strong> {agreementData.fullName || 'Not provided'}
                  </div>
                  <div>
                    <strong>Email:</strong> {agreementData.email || 'Not provided'}
                  </div>
                  <div>
                    <strong>Agreement Version:</strong> {agreementData.agreementVersion}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Validation Errors */}
              {showValidationErrors && !isFormValid && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
                  <p className="text-red-300 font-medium mb-2">Please complete all required fields:</p>
                  <ul className="text-sm text-red-400 space-y-1">
                    {!agreementData.fullName.trim() && <li>• Full legal name</li>}
                    {!agreementData.email.trim() && <li>• Email address</li>}
                    {!agreementData.digitalSignature.trim() && <li>• Digital signature</li>}
                    {!Object.values(agreementData.specificConsents).every(v => v) && <li>• All consent requirements</li>}
                  </ul>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Back to Personal Info
                </button>
                <div className="space-x-4">
                  <button
                    onClick={onReject}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Decline Agreement
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                      isFormValid
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Accept Agreement & Submit Application
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BetaAgreementForm;

