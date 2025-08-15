import React, { useState, useEffect } from "react";
import "./style.scss";

function Counter({ selectedZikir }) {
  const [count, setCount] = useState(0);

  // LocalStorage'dan veriyi yükle
  useEffect(() => {
    if (selectedZikir) {
      const savedCount = localStorage.getItem(`zikir_${selectedZikir.id}`);
      setCount(savedCount ? parseInt(savedCount) : 0);
    }
  }, [selectedZikir]);

  // Count değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (selectedZikir) {
      localStorage.setItem(`zikir_${selectedZikir.id}`, count.toString());
    }
  }, [count, selectedZikir]);

  const incrementCount = () => {
    if (count < selectedZikir.toplam) {
      setCount(count + 1);
    }
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const resetCount = () => {
    setCount(0);
    if (selectedZikir) {
      localStorage.setItem(`zikir_${selectedZikir.id}`, "0");
    }
  };

  // Progress yüzdesini hesapla
  const progressPercentage = selectedZikir ? (count / selectedZikir.toplam) * 100 : 0;

  if (!selectedZikir) {
    return <div className="counter-container">Bir zikir seçin...</div>;
  }

  return (
    <div className="counter-container">
      <div className="counter-header">
        <h2 className="counter-title">{selectedZikir.isim}</h2>
        <p className="counter-subtitle">Hedef: {selectedZikir.toplam.toLocaleString()} kez</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {progressPercentage.toFixed(1)}% tamamlandı
        </span>
      </div>

      {/* Counter Display */}
      <div className="counter-display">
        <span className="current-count">{count.toLocaleString()}</span>
        <span className="total-count">/ {selectedZikir.toplam.toLocaleString()}</span>
      </div>

      {/* Counter Controls */}
      <div className="counter-controls">
        <button 
          className="counter-btn counter-btn--decrement" 
          onClick={decrementCount}
          disabled={count <= 0}
        >
          -1
        </button>
        
        <button 
          className="counter-btn counter-btn--increment" 
          onClick={incrementCount}
          disabled={count >= selectedZikir.toplam}
        >
          +1
        </button>
      </div>

      <div className="counter-actions">
        <button 
          className="reset-btn" 
          onClick={resetCount}
          disabled={count === 0}
        >
          Sıfırla
        </button>
      </div>

      {/* Completion Message */}
      {count >= selectedZikir.toplam && (
        <div className="completion-message">
          🎉 Tebrikler! Bu zikri tamamladınız!
        </div>
      )}
    </div>
  );
}

export default Counter;
