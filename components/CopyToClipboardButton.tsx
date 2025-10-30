
import React, { useState } from 'react';

interface CopyToClipboardButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ textToCopy, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-2 right-2 px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
        copied
          ? 'bg-green-600 text-white'
          : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
      } ${className}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyToClipboardButton;
