import React from 'react';
import { Mic, GraduationCap, Tractor, Store } from 'lucide-react';

const Home = ({ onStartListening, onFallbackInput }) => {
  return (
    <div className="main-content">
      <div className="text-center mb-4">
        <h1 className="text-primary mb-1">सरकारी योजनाएँ, आपकी आवाज़ में।</h1>
        <p style={{ fontSize: '1.125rem' }}>
          बस बोलिए कि आपको किस मदद की जरूरत है। VaaniAccess आपके लिए सही योजना खोजने में मदद करेगा।
        </p>
      </div>

      <div className="mic-button-container">
        <button className="btn-mic" onClick={onStartListening} title="बोलकर पूछें">
          <Mic size={48} />
        </button>
        <h2 className="mt-4 text-primary">🎙 बोलकर पूछें</h2>
        <p className="mt-2 text-center" style={{ maxWidth: '400px' }}>
          "उदाहरण: Main college student hoon, mujhe scholarship chahiye."
        </p>
      </div>

      <div className="mt-4" style={{ width: '100%', maxWidth: '600px' }}>
        <h3 className="mb-2">Quick examples</h3>
        <div className="grid-2">
          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <GraduationCap className="text-primary" />
              <strong>Scholarship</strong>
            </div>
            <p>"Mujhe scholarship chahiye."</p>
          </div>
          
          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Tractor className="text-success" />
              <strong>Farmer</strong>
            </div>
            <p>"Main kisan hoon."</p>
          </div>
          
          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Store style={{ color: '#e37400' }} />
              <strong>Small Business</strong>
            </div>
            <p>"Main chhota business karta hoon."</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button className="btn btn-outline" onClick={onFallbackInput}>
          बोलने में परेशानी हो रही है? Type instead
        </button>
      </div>
    </div>
  );
};

export default Home;
