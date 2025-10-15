import React, { useState, useEffect } from 'react';
import { Users, Eye, EyeOff, RotateCcw, Copy, Check } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, '?', 'No QA'];

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAQtXHpQQuS5-HNXzS_PL9yTcQofhVoMOM",
  authDomain: "pointing-poker-b7a24.firebaseapp.com",
  databaseURL: "https://pointing-poker-b7a24-default-rtdb.firebaseio.com",
  projectId: "pointing-poker-b7a24",
  storageBucket: "pointing-poker-b7a24.firebasestorage.app",
  messagingSenderId: "149415726941",
  appId: "1:149415726941:web:46bab0f7861e880d1ba2b4"
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);

export default function App() {
  const [userName, setUserName] = useState('');
  const [isModerator, setIsModerator] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (!sessionId || !hasJoined) return;

    const sessionRef = ref(db, `sessions/${sessionId}`);
    
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParticipants(Object.values(data.participants || {}));
        setRevealed(data.revealed || false);
        
        // Sync local selectedPoint with Firebase data
        if (currentUserId && data.participants && data.participants[currentUserId]) {
          setSelectedPoint(data.participants[currentUserId].points);
        }
      }
    });

    return () => unsubscribe();
  }, [sessionId, hasJoined, currentUserId]);

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateSession = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  };

  const handleJoinSession = () => {
    if (sessionIdInput.trim()) {
      setSessionId(sessionIdInput.toUpperCase());
    }
  };

  const handleJoin = async () => {
    if (userName.trim() && sessionId) {
      const userId = Date.now().toString();
      setCurrentUserId(userId);
      
      const newParticipant = {
        id: userId,
        name: userName.trim(),
        points: null,
        isModerator: isModerator
      };

      const participantRef = ref(db, `sessions/${sessionId}/participants/${userId}`);
      await set(participantRef, newParticipant);
      
      setHasJoined(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!sessionId) {
        if (sessionIdInput) {
          handleJoinSession();
        }
      } else {
        handleJoin();
      }
    }
  };

  const handleSelectPoint = async (points) => {
    if (!currentUserId || revealed) return;
    
    // If clicking the same card, unselect it
    const newPoints = selectedPoint === points ? null : points;
    setSelectedPoint(newPoints);
    
    const participantRef = ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
    await update(participantRef, { points: newPoints });
  };

  const handleReveal = async () => {
    const sessionRef = ref(db, `sessions/${sessionId}`);
    await update(sessionRef, { revealed: true });
  };

  const handleReset = async () => {
    const sessionRef = ref(db, `sessions/${sessionId}`);
    const updates = {};
    
    participants.forEach(p => {
      updates[`participants/${p.id}/points`] = null;
    });
    updates.revealed = false;
    
    await update(sessionRef, updates);
    setSelectedPoint(null);
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const calculateAverage = () => {
    const validVotes = participants
      .map(p => p.points)
      .filter(p => p && !isNaN(p));
    
    if (validVotes.length === 0) return 'N/A';
    
    const sum = validVotes.reduce((a, b) => a + b, 0);
    return (sum / validVotes.length).toFixed(1);
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Planning Poker</h1>
          
          <div className="space-y-4">
            <button
              onClick={handleCreateSession}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Create New Session
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter Session ID"
                value={sessionIdInput}
                onChange={(e) => setSessionIdInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleJoinSession}
                disabled={!sessionIdInput.trim()}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Join Existing Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2 text-indigo-600">Planning Poker</h1>
          <p className="text-center text-gray-600 mb-6">Session: {sessionId}</p>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isModerator}
                onChange={(e) => setIsModerator(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700">Join as Moderator</span>
            </label>
            
            <button
              onClick={handleJoin}
              disabled={!userName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Join Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = participants.find(p => p.id === currentUserId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-indigo-600">Planning Poker</h1>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Session:</span>
              <code className="bg-gray-100 px-3 py-1 rounded">{sessionId}</code>
              <button
                onClick={copySessionId}
                className="p-2 hover:bg-gray-100 rounded transition duration-200"
                title="Copy session ID"
              >
                {showCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>{participants.length} participants</span>
            </div>
            
            {currentUser?.isModerator && (
              <div className="space-x-2">
                {!revealed ? (
                  <button
                    onClick={handleReveal}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Reveal Cards</span>
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition duration-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New Round</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Participants</h2>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{participant.name}</span>
                    {participant.isModerator && (
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        Moderator
                      </span>
                    )}
                  </div>
                  <div>
                    {revealed ? (
                      <span className="text-2xl font-bold text-indigo-600">
                        {participant.points || '—'}
                      </span>
                    ) : (
                      <div className="w-8 h-8 rounded flex items-center justify-center">
                        {participant.points ? (
                          <Eye className="w-5 h-5 text-green-600" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {revealed && (
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Results</h2>
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  {calculateAverage()}
                </div>
                <div className="text-gray-600">Average Points</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Select Your Estimate</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {FIBONACCI.map((value) => (
              <button
                key={value}
                onClick={() => handleSelectPoint(value)}
                disabled={revealed}
                className={`aspect-[2/3] rounded-lg font-bold text-xl transition-all duration-200 ${
                  selectedPoint === value
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 scale-105'
                    : 'bg-white border-2 border-gray-300 hover:border-indigo-400 hover:shadow-md'
                } ${revealed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}