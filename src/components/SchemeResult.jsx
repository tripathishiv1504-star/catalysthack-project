import React, { useState } from 'react';
import { CheckCircle2, FileText, Volume2, ArrowLeft, Info } from 'lucide-react';
import { speakText } from '../services/speechService';

const SchemeResult = ({ matchData, onReset }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { scheme, score, matchedCriteria } = matchData;

  const handleSpeak = () => {
    setIsSpeaking(true);
    // Construct the Hindi speech string
    const speechText = `Aapke liye ${scheme.name} yojana relevant ho sakti hai. 
    Pehla step hai, ${scheme.steps[0]} 
    Doosra step hai, ${scheme.steps[1]} 
    Teesra step hai, ${scheme.steps[2]}`;

    speakText(speechText, () => setIsSpeaking(false));
  };

  return (
    <div className="main-content">
      <button className="btn btn-outline mb-4" onClick={onReset} style={{ alignSelf: 'flex-start' }}>
        <ArrowLeft size={20} /> Go Back
      </button>

      <div className="card text-center" style={{ borderTop: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 className="text-primary" style={{ margin: 0, fontSize: '1.75rem' }}>🎓 {scheme.name}</h1>
          <span className="badge badge-success" style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}>
            {score}% Match
          </span>
        </div>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-main)', textAlign: 'left' }}>
          {scheme.description}
        </p>
      </div>

      <div className="grid-2 mt-4" style={{ width: '100%' }}>
        <div className="card">
          <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info className="text-primary" size={20} />
            क्यों सही है? (Why this matches)
          </h3>
          <ul className="check-list">
            {matchedCriteria.map((criteria, index) => (
              <li key={index}>
                <CheckCircle2 className="icon" size={18} />
                {criteria}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText className="text-primary" size={20} />
            जरूरी दस्तावेज (Documents)
          </h3>
          <div className="grid-2">
            {scheme.documents.map((doc, index) => (
              <div key={index} className="doc-card">
                <FileText size={16} className="text-muted" />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-4" style={{ width: '100%' }}>
        <h3 className="mb-4">अब क्या करें? (What to do next)</h3>
        
        <ol className="step-list">
          {scheme.steps.map((step, index) => (
            <li key={index}><strong>{step}</strong></li>
          ))}
        </ol>

        <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button 
            className={`btn btn-primary ${isSpeaking ? 'pulse' : ''}`} 
            onClick={handleSpeak}
            style={{ fontSize: '1.25rem', padding: '1rem 2rem', width: '100%', maxWidth: '300px' }}
          >
            <Volume2 size={24} />
            {isSpeaking ? 'सुना रहे हैं...' : '🔊 सुनें (Listen)'}
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-center" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        यह जानकारी आपकी दी गई जानकारी के आधार पर है। अंतिम पात्रता संबंधित सरकारी विभाग द्वारा निर्धारित की जाएगी।
      </div>
    </div>
  );
};

export default SchemeResult;
