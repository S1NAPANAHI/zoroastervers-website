import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
  showError?: boolean;
}

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  checked,
  onChange,
  title,
  description,
  showError = false
}) => {
  return (
    <div className={`border rounded-lg p-4 transition-colors ${
      checked 
        ? 'border-green-500/50 bg-green-900/20' 
        : showError 
          ? 'border-red-500/50 bg-red-900/20'
          : 'border-gray-600 bg-gray-800/50'
    }`}>
      <label className="flex items-start space-x-4 cursor-pointer">
        <div className="flex-shrink-0 mt-1">
          <div 
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
              checked
                ? 'bg-green-500 border-green-500'
                : showError
                  ? 'border-red-500'
                  : 'border-gray-500 hover:border-gray-400'
            }`}
          >
            {checked && <Check className="w-4 h-4 text-white" />}
          </div>
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${
            checked ? 'text-green-300' : showError ? 'text-red-300' : 'text-white'
          }`}>
            {title}
          </h4>
          <p className="text-sm text-gray-300">
            {description}
          </p>
          {showError && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              This consent is required to proceed
            </p>
          )}
        </div>
      </label>
    </div>
  );
};

export default ConsentCheckbox;
