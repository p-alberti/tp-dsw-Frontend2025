import React from 'react';
import './ContadorIter.css';

interface ContadorProps {
  count: number;
  onCountChange: (newCount: number) => void;
  disabled: boolean;
}

function ContadorIter({ count, onCountChange, disabled }: ContadorProps) {
  const handleIncrement = () => onCountChange(count + 1);
  const handleDecrement = () => onCountChange(Math.max(1, count - 1)); // No permitir menos de 1 iteración

  return (
    <div className={`ContadorIter ${disabled ? 'disabled' : ''}`}>
      <button onClick={handleDecrement} disabled={disabled}>-</button>
      <span className="CountDisplay">x{count}</span>
      <button onClick={handleIncrement} disabled={disabled}>+</button>
    </div>
  );
}

export default ContadorIter;