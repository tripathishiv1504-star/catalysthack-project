import React from 'react';
import { Mic, Loader2, CheckCircle2 } from 'lucide-react';

const VoiceInteraction = ({ status, transcript, extractedProfile }) => {
  // status: 'listening' | 'processing' | 'understanding' | 'searching'

  return (
    <div className="main-content" style={{ justifyContent: 'center' }}>
      
      {status === 'listening' && (
        <div className="text-center">
          <div className="mic-button-container" style={{ margin: '1rem 0' }}>
            <button className="btn-mic listening">
              <Mic size={48} />
            </button>
          </div>
          <h2 className="text-danger mb-2">सुन रहे हैं...</h2>
          <p>“अपनी बात सामान्य तरीके से बोलें।”</p>
        </div>
      )}

      {(status === 'processing' || status === 'searching') && (
        <div className="text-center" style={{ margin: '3rem 0' }}>
          <Loader2 size={48} className="text-primary" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
          <h2 className="text-primary">
            {status === 'processing' ? 'समझ रहे हैं...' : 'आपके लिए योजना खोज रहे हैं...'}
          </h2>
        </div>
      )}

      {transcript && (
        <div className="mt-4" style={{ width: '100%', maxWidth: '600px' }}>
          <div className="transcript-box">
            "{transcript}"
          </div>
        </div>
      )}

      {(status === 'understanding' || status === 'searching') && extractedProfile && (
        <div className="card mt-4" style={{ maxWidth: '600px' }}>
          <h3 className="mb-2">आपने बताया:</h3>
          <ul className="check-list">
            {extractedProfile.occupation && (
              <li><CheckCircle2 className="icon" size={20} /> <strong>{extractedProfile.occupation}</strong></li>
            )}
            {extractedProfile.education && (
              <li><CheckCircle2 className="icon" size={20} /> <strong>{extractedProfile.education} education</strong></li>
            )}
            {extractedProfile.intent && (
              <li><CheckCircle2 className="icon" size={20} /> <strong>Looking for {extractedProfile.intent}</strong></li>
            )}
            {Object.values(extractedProfile).every(v => v === null) && (
              <li>No specific details extracted.</li>
            )}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VoiceInteraction;
