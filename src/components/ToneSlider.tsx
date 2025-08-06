'use client';

import { useState, useEffect } from 'react';

interface ToneSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ToneSlider({ value, onChange }: ToneSliderProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setDisplayValue(newValue);
    onChange(newValue);
  };

  const getLeftEmojiSize = () => {
    if (displayValue < 33) return '2.5rem';
    if (displayValue < 67) return '2rem';
    return '1.5rem';
  };

  const getRightEmojiSize = () => {
    if (displayValue < 33) return '1.5rem';
    if (displayValue < 67) return '2rem';
    return '2.5rem';
  };

  const getToneDescription = () => {
    if (displayValue <= 33) return "순진한 감자";
    if (displayValue <= 66) return "보통 감자";
    return "당당한 감자";
  };

  const getToneSubDescription = () => {
    if (displayValue <= 33) return "귀엽고 어리숙한 변명을 만들어드려요 🥔";
    if (displayValue <= 66) return "적당히 솔직한 변명을 만들어드려요 😊";
    return "당당하고 자신감 넘치는 변명을 만들어드려요 ✨";
  };

  return (
    <div className="mb-8">
      <label className="block text-center font-bold text-amber-800 mb-4 text-lg">감자의 변명 스타일</label>
      <p className="text-sm text-center text-amber-600 mb-6">
        {getToneSubDescription()}
      </p>
      
      <div className="flex items-center justify-between gap-6 mb-4">
        <span 
          className="text-3xl transition-all duration-300"
          style={{ fontSize: getLeftEmojiSize() }}
        >
          🥺
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={displayValue}
          onChange={handleChange}
          className="flex-1 h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <span 
          className="text-3xl transition-all duration-300"
          style={{ fontSize: getRightEmojiSize() }}
        >
          😎
        </span>
      </div>
      
      <div className="flex justify-between text-sm text-amber-600 gap-4">
        <span>순진한 감자</span>
        <span>당당한 감자</span>
      </div>
    </div>
  );
}