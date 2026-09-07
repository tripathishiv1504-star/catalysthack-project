import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import VoiceInteraction from './components/VoiceInteraction';
import SchemeResult from './components/SchemeResult';
import { startListening } from './services/speechService';

function App() {
  // 'home' | 'listening' | 'result' | 'fallback'
  const [view, setView] = useState('home');
  const [interactionStatus, setInteractionStatus] = useState('idle'); // 'listening' | 'processing' | 'understanding' | 'searching'
  const [transcript, setTranscript] = useState('');
  const [extractedProfile, setExtractedProfile] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const resetApp = () => {
    setView('home');
    setInteractionStatus('idle');
    setTranscript('');
    setExtractedProfile(null);
    setMatchData(null);
    setErrorMsg(null);
  };

  const processInput = async (text) => {
    setInteractionStatus('processing');
    
    try {
      setInteractionStatus('understanding');
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      setInteractionStatus('searching');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setExtractedProfile(data.extracted_profile);
      
      setTimeout(() => {
        if (data.matched_schemes && data.matched_schemes.length > 0) {
          // Play the audio message in a real app, here we just show it or pass it down
          setMatchData(data.matched_schemes[0]);
          setView('result');
        } else {
          setErrorMsg(data.audio_message || "Abhi humein aapki information ke basis par suitable scheme nahi mili.");
          setView('home');
        }
      }, 1000); // Slight delay for UX
      
    } catch (err) {
      console.error(err);
      setErrorMsg("Connection error with the AI backend. Please try again.");
      setView('home');
    }
  };

  const handleStartListening = () => {
    setView('listening');
    setInteractionStatus('listening');
    setTranscript('');
    setErrorMsg(null);

    const recognition = startListening(
      (finalText, interimText) => {
        setTranscript(finalText + interimText);
      },
      (error) => {
        setErrorMsg(error);
        setView('home');
      },
      () => {
        // When speech ends
        setInteractionStatus('processing');
        // process the current transcript
        // Note: in a real app you might want to only process if there's text
      }
    );
    
    // Quick hack for demo if recognition onend doesn't fire nicely, or to process the final text
    if (recognition) {
       recognition.onend = () => {
         // Get the final text from the state via a slight delay or ref, 
         // but since state is async, we'll let the user click a button or just use the current transcript if not empty.
         // Actually, let's just trigger processing after 3 seconds of listening for the demo, 
         // OR wait for onend and use the latest transcript (handled inside).
       };
    }
  };

  const handleFallbackInput = () => {
    const input = prompt("Please type your requirement (e.g. 'Main college student hoon, mujhe scholarship chahiye'):");
    if (input) {
      setTranscript(input);
      setView('listening');
      processInput(input);
    }
  };

  // Watch for when transcript is complete if we were listening
  // A better way is to process when onEnd is fired, but we need the latest state.
  // We'll use a hack for the MVP: we will process on an explicit timeout or just pass the text to processInput directly in onEnd.
  
  // Refactored handleStartListening
  const startVoiceFlow = () => {
    setView('listening');
    setInteractionStatus('listening');
    setTranscript('');
    setErrorMsg(null);
    let currentText = '';

    startListening(
      (finalText, interimText) => {
        currentText = finalText + interimText;
        setTranscript(currentText);
      },
      (error) => {
        setErrorMsg(error);
        setView('home');
      },
      () => {
        if (currentText.trim().length > 0) {
          processInput(currentText);
        } else {
          setErrorMsg("Humein aapki baat clearly samajh nahi aayi.");
          setView('home');
        }
      }
    );
  };


  return (
    <div className="app-container">
      <Header />
      
      {errorMsg && (
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '1rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {view === 'home' && (
        <Home 
          onStartListening={startVoiceFlow} 
          onFallbackInput={handleFallbackInput} 
        />
      )}

      {view === 'listening' && (
        <VoiceInteraction 
          status={interactionStatus}
          transcript={transcript}
          extractedProfile={extractedProfile}
        />
      )}

      {view === 'result' && matchData && (
        <SchemeResult 
          matchData={matchData}
          onReset={resetApp}
        />
      )}
    </div>
  );
}

export default App;
