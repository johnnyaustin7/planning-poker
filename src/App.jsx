const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };  // Timer for moderator
  useEffect(() => {
    if (!isModerator) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - resetTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isModerator, resetTime]);import React, { useState, useEffect } from 'react';
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
  const [isObserver, setIsObserver] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [resetTime, setResetTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!sessionId || !hasJoined) return;

    const sessionRef = ref(db, `sessions/${sessionId}`);
    
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParticipants(Object.values(data.participants || {}));
        setRevealed(data.revealed || false);
      }
    });

    return () => unsubscribe();
  }, [sessionId, hasJoined]);

  useEffect(() => {
    if (sessionId) {
      const currentUrl = window.location.origin + window.location.pathname + '?session=' + sessionId;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [sessionId]);

  const generateSessionId = () => {
    // List of 6-letter words that are easy to remember and spell
    const words = [
      'BANANA', 'CASTLE', 'DRAGON', 'FOREST', 'GALAXY', 'HAMMER',
      'ISLAND', 'JUNGLE', 'KITTEN', 'LEMON', 'MARBLE', 'ORANGE',
      'PLANET', 'RABBIT', 'SILVER', 'TIGER', 'VIOLET', 'WIZARD',
      'YELLOW', 'ANCHOR', 'BUCKET', 'CANDLE', 'DANCER', 'ENGINE',
      'FALCON', 'GARDEN', 'HELMET', 'INSECT', 'JACKET', 'KETTLE',
      'LADDER', 'MAGNET', 'NAPKIN', 'OCTAVE', 'PENCIL', 'ROCKET',
      'SADDLE', 'TIMBER', 'UNICORN', 'VELVET', 'WALNUT', 'ZIPPER',
      'ARTIST', 'BOTTLE', 'COFFEE', 'DESERT', 'ELEVEN', 'FLOWER',
      'GOLDEN', 'HOCKEY', 'IGUANA', 'JOSTLE', 'KERNEL', 'LOBSTER',
      'METEOR', 'NEEDLE', 'OYSTER', 'PIRATE', 'QUIVER', 'RAISIN',
      'SALMON', 'TEMPLE', 'UMPIRE', 'VALLEY', 'WAFFLE', 'YOGURT'
    ];
    
    return words[Math.floor(Math.random() * words.length)];
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

  // Check URL for session parameter on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    if (sessionParam) {
      setSessionId(sessionParam.toUpperCase());
    }
  }, []);

  const handleJoin = async () => {
    if (userName.trim() && sessionId) {
      const userId = Date.now().toString();
      setCurrentUserId(userId);
      
      const newParticipant = {
        id: userId,
        name: userName.trim(),
        points: null,
        isModerator: isModerator,
        isObserver: isObserver
      };

      const participantRef = ref(db, `sessions/${sessionId}/participants/${userId}`);
      await set(participantRef, newParticipant);
      
      setHasJoined(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!sessionId) {
        if (sessionIdInput.trim()) {
          handleJoinSession();
        } else {
          handleCreateSession();
        }
      } else if (!hasJoined) {
        handleJoin();
      }
    }
  };

  const handleSelectPoint = async (point) => {
    setSelectedPoint(point);
    
    const participantRef = ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
    await update(participantRef, { points: point });
  };

  const handleReveal = async () => {
    const sessionRef = ref(db, `sessions/${sessionId}`);
    await update(sessionRef, { revealed: !revealed });
    
    // Check for consensus when revealing
    if (!revealed) {
      const votingParticipants = participants.filter(p => !p.isModerator && !p.isObserver);
      const votes = votingParticipants.map(p => p.points).filter(p => p !== null);
      
      if (votes.length > 1) {
        const uniqueVotes = new Set(votes);
        if (uniqueVotes.size === 1) {
          // Consensus reached - trigger confetti!
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }
      }
    }
  };

  const handleReset = async () => {
    setSelectedPoint(null);
    setResetTime(Date.now());
    setElapsedTime(0);
    
    const updates = {};
    participants.forEach(p => {
      updates[`sessions/${sessionId}/participants/${p.id}/points`] = null;
    });
    updates[`sessions/${sessionId}/revealed`] = false;
    
    await update(ref(db), updates);
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleStartEditName = () => {
    setEditedName(userName);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (editedName.trim() && editedName.trim() !== userName) {
      const newName = editedName.trim();
      setUserName(newName);
      
      const participantRef = ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
      await update(participantRef, { name: newName });
    }
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEditName();
    }
  };

  const calculateAverage = () => {
    const numericVotes = participants
      .filter(p => !p.isModerator && !p.isObserver)
      .map(p => p.points)
      .filter(p => p !== null && p !== '?' && p !== 'No QA' && typeof p === 'number');
    
    if (numericVotes.length === 0) return null;
    
    const sum = numericVotes.reduce((acc, val) => acc + val, 0);
    const avg = sum / numericVotes.length;
    
    const closest = FIBONACCI.filter(f => typeof f === 'number').reduce((prev, curr) =>
      Math.abs(curr - avg) < Math.abs(prev - avg) ? curr : prev
    );
    
    // Check for consensus
    const allVotes = participants
      .filter(p => !p.isModerator && !p.isObserver)
      .map(p => p.points)
      .filter(p => p !== null);
    
    const uniqueVotes = new Set(allVotes);
    const consensus = uniqueVotes.size === 1 && allVotes.length > 1;
    
    // Calculate range and spread
    const min = Math.min(...numericVotes);
    const max = Math.max(...numericVotes);
    const range = numericVotes.length > 1 ? { min, max } : null;
    const spread = max - min;
    
    // Determine spread type: tight (0-2), moderate (3-5), wide (6+)
    let spreadType = 'tight';
    if (spread > 5) spreadType = 'wide';
    else if (spread > 2) spreadType = 'moderate';
    
    // Find outliers (values more than 2 Fibonacci steps away from average)
    const avgIndex = FIBONACCI.findIndex(f => f === closest);
    const outliers = numericVotes.filter(vote => {
      const voteIndex = FIBONACCI.findIndex(f => f === vote);
      return Math.abs(voteIndex - avgIndex) > 2;
    });
    
    return { 
      average: avg.toFixed(1), 
      closest,
      consensus,
      range,
      spreadType,
      outliers: outliers.length > 0 ? outliers : null
    };
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Planning Poker</h1>
            <p className="text-gray-600">Create a new session or join an existing one</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleCreateSession}
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Create New Session
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            <div>
              <input
                type="text"
                value={sessionIdInput}
                onChange={(e) => setSessionIdInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter Session ID (e.g., ROCKET)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
                maxLength={6}
              />
              <button
                onClick={handleJoinSession}
                disabled={!sessionIdInput.trim()}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Planning Poker</h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-gray-600">Session ID:</p>
              <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-lg font-bold">{sessionId}</code>
              <button
                onClick={copySessionId}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Copy Session ID"
              >
                {showCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-600" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Share this ID with your team</p>
            
            {qrCodeUrl && (
              <div className="mb-4 flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-2">Or scan QR code to join:</p>
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code to join session" 
                  className="border-2 border-teal-200 rounded-lg"
                />
              </div>
            )}
          </div>
          <div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4"
              autoFocus
            />
            <div className="mb-4 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isObserver}
                  onChange={(e) => {
                    setIsObserver(e.target.checked);
                    if (e.target.checked) setIsModerator(false);
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">Observer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isModerator}
                  onChange={(e) => {
                    setIsModerator(e.target.checked);
                    if (e.target.checked) setIsObserver(false);
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">Moderator</span>
              </label>
            </div>
            <button
              onClick={handleJoin}
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Join Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateAverage();
  const votingParticipants = participants.filter(p => !p.isModerator && !p.isObserver);
  const allVoted = votingParticipants.every(p => p.points !== null) && votingParticipants.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Planning Poker</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded">
                <span className="text-sm text-gray-600">Session:</span>
                <code className="font-mono font-bold text-blue-800">{sessionId}</code>
                <button
                  onClick={copySessionId}
                  className="p-1 hover:bg-blue-200 rounded transition-colors"
                  title="Copy Session ID"
                >
                  {showCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-blue-600" />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={20} />
                <span className="font-semibold">{participants.length} participants</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Welcome, 
            {isEditingName ? (
              <span className="inline-flex items-center gap-2 ml-1">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  onBlur={handleSaveName}
                  className="px-2 py-1 border border-blue-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </span>
            ) : (
              <span 
                className="font-semibold text-blue-700 cursor-pointer hover:underline ml-1"
                onClick={handleStartEditName}
                title="Click to edit name"
              >
                {userName}
              </span>
            )}
            {isModerator && <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded">Moderator</span>}
            {isObserver && <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">Observer</span>}!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {!isModerator && !isObserver && (
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Estimate</h2>
                <div className="grid grid-cols-6 gap-3">
                  {FIBONACCI.map((point) => (
                    <button
                      key={point}
                      onClick={() => handleSelectPoint(point)}
                      className={`aspect-square rounded-lg font-bold text-xl transition-all ${
                        selectedPoint === point
                          ? 'bg-blue-700 text-white scale-105 shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {point}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={`bg-white rounded-lg shadow-xl p-6 ${!isModerator && !isObserver ? 'mt-6' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Votes</h2>
                {isModerator && (
                  <div className="flex gap-2 items-center">
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded font-mono">
                      ⏱️ {formatTime(elapsedTime)}
                    </div>
                    <button
                      onClick={handleReveal}
                      disabled={!allVoted}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        allVoted
                          ? 'bg-blue-700 text-white hover:bg-blue-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
                      {revealed ? 'Hide' : 'Reveal'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {participants.map((participant) => {
                  // Check if points is truly set (not null, undefined, or empty string)
                  const hasVoted = participant.points !== null && 
                                   participant.points !== undefined && 
                                   participant.points !== '';
                  
                  // Check if this vote is an outlier
                  const isOutlier = revealed && stats && stats.outliers && 
                                   typeof participant.points === 'number' &&
                                   stats.outliers.includes(participant.points);
                  
                  return (
                    <div
                      key={participant.id}
                      className={`rounded-lg p-4 text-center border-2 ${
                        participant.isModerator 
                          ? 'bg-orange-50 border-orange-200'
                          : participant.isObserver
                          ? 'bg-purple-50 border-purple-200'
                          : isOutlier
                          ? 'bg-red-50 border-red-300 border-dashed'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <p className="font-semibold text-gray-800 mb-2 truncate">
                        {participant.name}
                        {participant.isModerator && <span className="text-xs block text-orange-600">Moderator</span>}
                        {participant.isObserver && <span className="text-xs block text-purple-600">Observer</span>}
                        {isOutlier && <span className="text-xs block text-red-600">Outlier</span>}
                      </p>
                      {!participant.isModerator && !participant.isObserver && (
                        <div className={`text-2xl font-bold ${
                          hasVoted ? 'text-blue-700' : 'text-gray-400'
                        }`}>
                          {revealed
                            ? (hasVoted ? participant.points : '—')
                            : (hasVoted ? '✓' : '—')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Voted</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {votingParticipants.filter(p => p.points !== null).length} / {votingParticipants.length}
                  </p>
                </div>
                {revealed && stats && (
                  <>
                    <div className={`rounded-lg p-4 ${
                      stats.spreadType === 'tight' ? 'bg-green-50' :
                      stats.spreadType === 'moderate' ? 'bg-yellow-50' :
                      'bg-red-50'
                    }`}>
                      <p className="text-sm text-gray-600 mb-1">Average</p>
                      <p className={`text-2xl font-bold ${
                        stats.spreadType === 'tight' ? 'text-green-600' :
                        stats.spreadType === 'moderate' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>{stats.average}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Closest Fibonacci</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.closest}</p>
                    </div>
                    {stats.consensus && (
                      <div className="bg-green-100 rounded-lg p-4 border-2 border-green-400">
                        <p className="text-sm text-green-700 mb-1">🎉 Status</p>
                        <p className="text-lg font-bold text-green-700">Consensus!</p>
                      </div>
                    )}
                    {stats.range && (
                      <div className={`rounded-lg p-4 ${
                        stats.spreadType === 'tight' ? 'bg-green-50' :
                        stats.spreadType === 'moderate' ? 'bg-yellow-50' :
                        'bg-red-50'
                      }`}>
                        <p className="text-sm text-gray-600 mb-1">Range</p>
                        <p className={`text-lg font-bold ${
                          stats.spreadType === 'tight' ? 'text-green-700' :
                          stats.spreadType === 'moderate' ? 'text-yellow-700' :
                          'text-red-700'
                        }`}>{stats.range.min} - {stats.range.max}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}