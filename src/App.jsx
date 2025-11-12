import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPunchline, setShowPunchline] = useState(false);
  const [isDrumRoll, setIsDrumRoll] = useState(false);
  const [error, setError] = useState(null);
  
  const drumRollAudioRef = useRef(null);
  const rimshotAudioRef = useRef(null);

  const fetchJoke = async () => {
    try {
      setLoading(true);
      setShowPunchline(false);
      setIsDrumRoll(false);
      setError(null);
      
      const response = await axios.get('/api/jokes/random');
      setJoke(response.data);
      
      // Start the progressive reveal sequence
      setTimeout(() => {
        setIsDrumRoll(true);
        // Play drum roll sound
        if (drumRollAudioRef.current) {
          drumRollAudioRef.current.currentTime = 0;
          drumRollAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
        
        // Show punchline after 2 seconds
        setTimeout(() => {
          setIsDrumRoll(false);
          setShowPunchline(true);
          // Play rimshot sound
          if (rimshotAudioRef.current) {
            rimshotAudioRef.current.currentTime = 0;
            rimshotAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }
        }, 2000);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching joke:', error);
      setError('Failed to fetch joke. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  if (loading && !joke) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading jokes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <p className="text-xl font-semibold text-red-600 mb-4">⚠️ {error}</p>
          <button
            onClick={fetchJoke}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Audio elements for sound effects */}
      <audio ref={drumRollAudioRef} preload="auto">
        <source src="/sounds/drumroll.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={rimshotAudioRef} preload="auto">
        <source src="/sounds/rimshot.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-black text-center">
            🐳 ContainerComedy Club 😄
          </h1>
          <p className="text-center text-gray-600 mt-2 text-lg">
            Featuring MongoDB MCP, Mongo Atlas with local developer experience by MCP Gateway
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Joke Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            {joke && (
              <div className="space-y-8">
                {/* Setup */}
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 leading-relaxed">
                    {joke.setup}
                  </p>
                </div>

                {/* Drum Roll Animation */}
                {isDrumRoll && (
                  <div className="text-center py-8">
                    <span className="text-6xl drum-roll inline-block">🥁</span>
                    <p className="text-xl text-gray-600 mt-4 animate-pulse">
                      Drum roll please...
                    </p>
                  </div>
                )}

                {/* Punchline */}
                {showPunchline && (
                  <div className="text-center fade-in">
                    <p className="text-2xl md:text-3xl font-semibold text-blue-600 leading-relaxed">
                      {joke.punchline}
                    </p>
                    <div className="mt-6 text-gray-500 text-sm">
                      <p>🎯 Times displayed: <span className="font-bold text-gray-700">{joke.times_displayed}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Joke Button */}
            <div className="text-center mt-10">
              <button
                onClick={fetchJoke}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 button-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  '🎭 Next Joke 🎭'
                )}
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700 text-lg">
              Made with <span className="text-red-500">❤️</span>, containers <span className="text-blue-500">🐳</span>, and MongoDB <span className="text-green-500">🍃</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p className="text-sm">
          Powered by React, Express, MongoDB, and Redis
        </p>
        <p className="text-xs mt-2 text-gray-500">
          © 2024 ContainerComedy Club | All jokes are containerized for your enjoyment
        </p>
      </footer>
    </div>
  );
}

export default App;
