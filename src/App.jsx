import React, { useState, useEffect } from 'react';
import { Users, Eye, EyeOff, RotateCcw, Copy, Check, ArrowRight, RefreshCw, Moon, Sun, UserX, UserCog } from 'lucide-react';

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, '?', 'No QA'];
const TSHIRT = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'];

const TSHIRT_TO_FIBONACCI = {
  'XS': 1,
  'S': 2,
  'M': 3,
  'L': 5,
  'XL': 8,
  'XXL': 13,
  '?': '?',
  'No QA': 'No QA'
};

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAQtXHpQQuS5-HNXzS_PL9yTcQofhVoMOM",
  authDomain: "pointing-poker-b7a24.firebaseapp.com",
  databaseURL: "https://pointing-poker-b7a24-default-rtdb.firebaseio.com",
  projectId: "pointing-poker-b7a24",
  storageBucket: "pointing-poker-b7a24.firebasestorage.app",
  messagingSenderId: "149415726941",
  appId: "1:149415726941:web:46bab0f7861e880d1ba2b4"
};

let firebaseApp = null;
let database = null;

const initializeFirebase = async () => {
  if (firebaseApp) return { app: firebaseApp, db: database };
  
  const firebase = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
  const dbModule = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js');
  
  firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
  database = dbModule.getDatabase(firebaseApp);
  
  return { app: firebaseApp, db: database, dbModule };
};

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
  const [votingScale, setVotingScale] = useState('fibonacci');
  const [darkMode, setDarkMode] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [db, setDb] = useState(null);
  const [dbModule, setDbModule] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { db: firebaseDb, dbModule: firebaseDbModule } = await initializeFirebase();
      setDb(firebaseDb);
      setDbModule(firebaseDbModule);
    };
    init();
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    if (sessionParam) {
      setSessionId(sessionParam.toUpperCase());
    }
    
    const savedName = localStorage.getItem('planningPokerUserName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  useEffect(() => {
    if (!sessionId || !db || !dbModule) return;

    const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
    
    const unsubscribe = dbModule.onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const newParticipants = Object.values(data.participants || {});
        const newRevealed = data.revealed || false;
        const newVotingScale = data.votingScale || 'fibonacci';
        
        setParticipants(newParticipants);
        setRevealed(newRevealed);
        setVotingScale(newVotingScale);
        
        if (currentUserId && data.participants && data.participants[currentUserId]) {
          setSelectedPoint(data.participants[currentUserId].points);
          setIsModerator(data.participants[currentUserId].isModerator || false);
          setIsObserver(data.participants[currentUserId].isObserver || false);
        }
        
        const votingParticipants = newParticipants.filter(p => !p.isModerator && !p.isObserver);
        const allVoted = votingParticipants.every(p => p.points !== null && p.points !== undefined && p.points !== '') && votingParticipants.length > 0;
        
        if (!newRevealed && allVoted && votingParticipants.length > 0) {
          handleReveal();
        }
        
        if (!revealed && newRevealed) {
          const votes = votingParticipants.map(p => p.points).filter(p => p !== null);
          
          if (votes.length > 1) {
            const uniqueVotes = new Set(votes);
            if (uniqueVotes.size === 1) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 4000);
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, [sessionId, currentUserId, revealed, db, dbModule]);

  useEffect(() => {
    if (sessionId) {
      const currentUrl = window.location.origin + window.location.pathname + '?session=' + sessionId;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!hasJoined || !isModerator) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - resetTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [hasJoined, isModerator, resetTime]);

  const generateSessionId = () => {
    const words = [
      'BANANA', 'CASTLE', 'DRAGON', 'FOREST', 'GALAXY', 'HAMMER',
      'ISLAND', 'JUNGLE', 'KITTEN', 'LEMON', 'MARBLE', 'ORANGE',
      'PLANET', 'RABBIT', 'SILVER', 'TIGER', 'VIOLET', 'WIZARD',
      'YELLOW', 'ANCHOR', 'BUCKET', 'CANDLE', 'DANCER', 'ENGINE',
      'FALCON', 'GARDEN', 'HELMET', 'INSECT', 'JACKET', 'KETTLE',
      'LADDER', 'MAGNET', 'NAPKIN', 'OCTAVE', 'PENCIL', 'ROCKET',
      'SADDLE', 'TIMBER', 'VELVET', 'WALNUT', 'ZIPPER'
    ];
    return words[Math.floor(Math.random() * words.length)];
  };

  const handleCreateSession = async () => {
    if (!db || !dbModule) return;
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    const sessionRef = dbModule.ref(db, `sessions/${newSessionId}`);
    await dbModule.set(sessionRef, { 
      votingScale: 'fibonacci',
      revealed: false,
      participants: {}
    });
  };

  const handleJoinSession = () => {
    if (sessionIdInput.trim()) {
      setSessionId(sessionIdInput.toUpperCase());
    }
  };

  const handleJoin = async () => {
    if (userName.trim() && sessionId && db && dbModule) {
      localStorage.setItem('planningPokerUserName', userName.trim());
      
      const userId = Date.now().toString();
      setCurrentUserId(userId);
      
      const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
      const sessionSnapshot = await dbModule.get(sessionRef);
      
      if (!sessionSnapshot.exists()) {
        await dbModule.set(sessionRef, {
          votingScale: 'fibonacci',
          revealed: false,
          participants: {}
        });
      }
      
      const newParticipant = {
        id: userId,
        name: userName.trim(),
        points: null,
        isModerator: isModerator,
        isObserver: isObserver
      };

      const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${userId}`);
      await dbModule.set(participantRef, newParticipant);
      
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
    if (!currentUserId || revealed || isModerator || isObserver || !db || !dbModule) return;
    
    const newPoint = selectedPoint === point ? null : point;
    setSelectedPoint(newPoint);
    
    const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
    await dbModule.update(participantRef, { points: newPoint });
  };

  const handleReveal = async () => {
    if (!db || !dbModule) return;
    const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
    await dbModule.update(sessionRef, { revealed: !revealed });
  };

  const handleReset = async () => {
    if (!db || !dbModule) return;
    setSelectedPoint(null);
    setResetTime(Date.now());
    setElapsedTime(0);
    
    const updates = {};
    participants.forEach(p => {
      updates[`sessions/${sessionId}/participants/${p.id}/points`] = null;
    });
    updates[`sessions/${sessionId}/revealed`] = false;
    
    await dbModule.update(dbModule.ref(db), updates);
  };

  const toggleVotingScale = async () => {
    if (!db || !dbModule) return;
    const newScale = votingScale === 'fibonacci' ? 'tshirt' : 'fibonacci';
    setVotingScale(newScale);
    
    const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
    await dbModule.update(sessionRef, { votingScale: newScale });
    
    const voteUpdates = {};
    participants.forEach(p => {
      voteUpdates[`sessions/${sessionId}/participants/${p.id}/points`] = null;
    });
    
    if (Object.keys(voteUpdates).length > 0) {
      await dbModule.update(dbModule.ref(db), voteUpdates);
    }
    
    setSelectedPoint(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const removeUser = async (userId) => {
    if (!isModerator || !db || !dbModule) return;
    
    const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${userId}`);
    await dbModule.remove(participantRef);
  };

  const changeUserType = async (newType) => {
    if (!currentUserId || isModerator || !db || !dbModule) return;
    
    const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
    
    if (newType === 'voter') {
      await dbModule.update(participantRef, { 
        isObserver: false,
        points: null
      });
      setIsObserver(false);
    } else if (newType === 'observer') {
      await dbModule.update(participantRef, { 
        isObserver: true,
        points: null
      });
      setIsObserver(true);
      setSelectedPoint(null);
    }
    
    setShowTypeMenu(false);
  };

  const copySessionId = () => {
    const sessionUrl = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
    navigator.clipboard.writeText(sessionUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartEditName = () => {
    setEditedName(userName);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (editedName.trim() && editedName.trim() !== userName && editedName.trim().length <= 30 && db && dbModule) {
      const newName = editedName.trim();
      setUserName(newName);
      localStorage.setItem('planningPokerUserName', newName);
      
      const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
      await dbModule.update(participantRef, { name: newName });
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
      .map(p => {
        if (votingScale === 'tshirt' && p.points && typeof p.points === 'string') {
          return TSHIRT_TO_FIBONACCI[p.points];
        }
        return p.points;
      })
      .filter(p => p !== null && p !== '?' && p !== 'No QA' && typeof p === 'number');
    
    if (numericVotes.length === 0) return null;
    
    const sum = numericVotes.reduce((acc, val) => acc + val, 0);
    const avg = sum / numericVotes.length;
    
    const fibonacciScale = FIBONACCI.filter(f => typeof f === 'number');
    const closest = fibonacciScale.reduce((prev, curr) =>
      Math.abs(curr - avg) < Math.abs(prev - avg) ? curr : prev
    );
    
    let displayClosest = closest;
    if (votingScale === 'tshirt') {
      const tshirtEntry = Object.entries(TSHIRT_TO_FIBONACCI).find(([_, val]) => val === closest);
      displayClosest = tshirtEntry ? tshirtEntry[0] : closest;
    }
    
    const allVotes = participants
      .filter(p => !p.isModerator && !p.isObserver)
      .map(p => p.points)
      .filter(p => p !== null);
    
    const uniqueVotes = new Set(allVotes);
    const consensus = uniqueVotes.size === 1 && allVotes.length > 1;
    
    const min = Math.min(...numericVotes);
    const max = Math.max(...numericVotes);
    const range = numericVotes.length > 1 ? { min, max } : null;
    const spread = max - min;
    
    let spreadType = 'tight';
    if (spread > 5) spreadType = 'wide';
    else if (spread > 2) spreadType = 'moderate';
    
    const avgIndex = fibonacciScale.findIndex(f => f === closest);
    const outliers = numericVotes.filter(vote => {
      const voteIndex = fibonacciScale.findIndex(f => f === vote);
      return Math.abs(voteIndex - avgIndex) > 2;
    });
    
    return { 
      average: avg.toFixed(1), 
      closest: displayClosest,
      consensus,
      range,
      spreadType,
      outliers: outliers.length > 0 ? outliers : null
    };
  };

  if (!db || !dbModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-slate-100'} flex items-center justify-center p-4`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 max-w-md w-full`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex-1 text-center`}>Planning Poker</h1>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Create a new session or join an existing one</p>
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
                <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>OR</span>
              </div>
            </div>
            <div>
              <input
                type="text"
                value={sessionIdInput}
                onChange={(e) => setSessionIdInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter Session ID (e.g., ROCKET)"
                className={`w-full px-4 py-3 border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3`}
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
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-slate-100'} flex items-center justify-center p-4`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 max-w-md w-full`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex-1 text-center`}>Planning Poker</h1>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Session ID:</p>
              <code className={`${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded font-mono text-lg font-bold`}>{sessionId}</code>
              <button
                onClick={copySessionId}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Copy Session ID"
              >
                {showCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />}
              </button>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Share this ID with your team</p>
            
            {qrCodeUrl && (
              <div className="mb-4 flex flex-col items-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Or scan QR code to join:</p>
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code to join session" 
                  className={`border-2 ${darkMode ? 'border-blue-700' : 'border-blue-200'} rounded-lg`}
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
              maxLength={30}
              className={`w-full px-4 py-3 border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4`}
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
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Observer</span>
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
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Moderator</span>
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
  const allVoted = votingParticipants.every(p => p.points !== null && p.points !== undefined && p.points !== '') && votingParticipants.length > 0;
  const currentScale = votingScale === 'fibonacci' ? FIBONACCI : TSHIRT;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-slate-100'} p-4`}>
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
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Planning Poker</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className={`flex items-center gap-2 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} px-3 py-2 rounded`}>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Session:</span>
                <code className={`font-mono font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>{sessionId}</code>
                <button
                  onClick={copySessionId}
                  className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-200'}`}
                  title="Copy Session ID"
                >
                  {showCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />}
                </button>
              </div>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <Users size={20} />
                <span className="font-semibold">{participants.length} participants</span>
              </div>
            </div>
          </div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Welcome, 
            {isEditingName ? (
              <span className="inline-flex items-center gap-2 ml-1">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  onBlur={handleSaveName}
                  maxLength={30}
                  className={`px-2 py-1 border ${
                    darkMode 
                      ? 'bg-gray-700 border-blue-500 text-white' 
                      : 'border-blue-500'
                  } rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  autoFocus
                />
              </span>
            ) : (
              <span 
                className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'} cursor-pointer hover:underline ml-1`}
                onClick={handleStartEditName}
                title="Click to edit name"
              >
                {userName}
              </span>
            )}
            {isModerator && <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded">Moderator</span>}
            {isObserver && <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">Observer</span>}
            {!isModerator && (
              <span className="relative inline-block ml-2">
                <button
                  onClick={() => setShowTypeMenu(!showTypeMenu)}
                  className={`px-2 py-1 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} text-sm rounded transition-colors flex items-center gap-1`}
                  title="Change user type"
                >
                  <UserCog size={14} />
                  Change Type
                </button>
                {showTypeMenu && (
                  <div className={`absolute left-0 mt-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'} py-1 z-10`}>
                    <button
                      onClick={() => changeUserType('voter')}
                      disabled={!isObserver}
                      className={`w-full px-4 py-2 text-left text-sm whitespace-nowrap ${
                        !isObserver 
                          ? darkMode ? 'text-gray-500' : 'text-gray-400 cursor-not-allowed'
                          : darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Switch to Voter
                    </button>
                    <button
                      onClick={() => changeUserType('observer')}
                      disabled={isObserver}
                      className={`w-full px-4 py-2 text-left text-sm whitespace-nowrap ${
                        isObserver 
                          ? darkMode ? 'text-gray-500' : 'text-gray-400 cursor-not-allowed'
                          : darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Switch to Observer
                    </button>
                  </div>
                )}
              </span>
            )}!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {!isModerator && !isObserver && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Select Your Estimate</h2>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {votingScale === 'fibonacci' ? 'Fibonacci' : 'T-Shirt Sizing'}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {currentScale.map((point) => (
                    <button
                      key={point}
                      onClick={() => handleSelectPoint(point)}
                      disabled={revealed}
                      className={`aspect-square rounded-lg font-bold text-xl transition-all ${
                        selectedPoint === point
                          ? 'bg-blue-700 text-white scale-105 shadow-lg'
                          : darkMode
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      } ${revealed ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {point}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 ${!isModerator && !isObserver ? 'mt-6' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Votes</h2>
                {isModerator && (
                  <div className="flex gap-2 items-center flex-wrap">
                    <button
                      onClick={toggleVotingScale}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                      title="Switch voting scale"
                    >
                      <RefreshCw size={16} />
                      {votingScale === 'fibonacci' ? 'Switch to T-Shirt' : 'Switch to Fibonacci'}
                    </button>
                    <div className={`text-sm ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'} px-3 py-2 rounded font-mono`}>
                      ⏱️ {formatTime(elapsedTime)}
                    </div>
                    <button
                      onClick={handleReveal}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                      {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
                      {revealed ? 'Hide' : 'Reveal'}
                    </button>
                    {revealed ? (
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        <ArrowRight size={18} />
                        Next Story
                      </button>
                    ) : (
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                      >
                        <RotateCcw size={18} />
                        Reset
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {participants.map((participant) => {
                  const hasVoted = participant.points !== null && 
                                   participant.points !== undefined && 
                                   participant.points !== '';
                  
                  const isOutlier = revealed && stats && stats.outliers && 
                                   typeof participant.points === 'number' &&
                                   stats.outliers.includes(participant.points);
                  
                  return (
                    <div
                      key={participant.id}
                      className={`rounded-lg p-4 text-center border-2 relative ${
                        participant.isModerator 
                          ? darkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'
                          : participant.isObserver
                          ? darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'
                          : isOutlier
                          ? darkMode ? 'bg-red-900 border-red-700 border-dashed' : 'bg-red-50 border-red-300 border-dashed'
                          : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {isModerator && participant.id !== currentUserId && (
                        <button
                          onClick={() => removeUser(participant.id)}
                          className={`absolute top-2 right-2 p-1 rounded ${
                            darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
                          } text-white transition-colors`}
                          title="Remove user"
                        >
                          <UserX size={14} />
                        </button>
                      )}
                      <p className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2 break-words ${
                        participant.name.length > 15 ? 'text-sm leading-tight' : ''
                      }`} style={{
                        fontSize: participant.name.length > 20 ? '0.75rem' : undefined
                      }}>
                        {participant.name}
                        {participant.isModerator && <span className={`text-xs block ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Moderator</span>}
                        {participant.isObserver && <span className={`text-xs block ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Observer</span>}
                        {isOutlier && <span className={`text-xs block ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Outlier</span>}
                      </p>
                      {!participant.isModerator && !participant.isObserver && (
                        <div className={`text-2xl font-bold ${
                          hasVoted ? darkMode ? 'text-blue-400' : 'text-blue-700' : darkMode ? 'text-gray-500' : 'text-gray-400'
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
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 sticky top-4`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Statistics</h2>
              <div className="space-y-4">
                <div className={darkMode ? 'bg-blue-900 rounded-lg p-4' : 'bg-blue-50 rounded-lg p-4'}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Voted</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    {votingParticipants.filter(p => p.points !== null && p.points !== undefined && p.points !== '').length} / {votingParticipants.length}
                  </p>
                </div>
                {revealed && stats && (
                  <>
                    <div className={`rounded-lg p-4 ${
                      stats.spreadType === 'tight' ? darkMode ? 'bg-green-900' : 'bg-green-50' :
                      stats.spreadType === 'moderate' ? darkMode ? 'bg-yellow-900' : 'bg-yellow-50' :
                      darkMode ? 'bg-red-900' : 'bg-red-50'
                    }`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Average</p>
                      <p className={`text-2xl font-bold ${
                        stats.spreadType === 'tight' ? darkMode ? 'text-green-400' : 'text-green-600' :
                        stats.spreadType === 'moderate' ? darkMode ? 'text-yellow-400' : 'text-yellow-600' :
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`}>{stats.average}</p>
                    </div>
                    <div className={darkMode ? 'bg-orange-900 rounded-lg p-4' : 'bg-orange-50 rounded-lg p-4'}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                        Closest {votingScale === 'fibonacci' ? 'Fibonacci' : 'T-Shirt'}
                      </p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{stats.closest}</p>
                    </div>
                    {stats.consensus && (
                      <div className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-lg p-4 border-2 ${darkMode ? 'border-green-600' : 'border-green-400'}`}>
                        <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'} mb-1`}>🎉 Status</p>
                        <p className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Consensus!</p>
                      </div>
                    )}
                    {stats.range && (
                      <div className={`rounded-lg p-4 ${
                        stats.spreadType === 'tight' ? darkMode ? 'bg-green-900' : 'bg-green-50' :
                        stats.spreadType === 'moderate' ? darkMode ? 'bg-yellow-900' : 'bg-yellow-50' :
                        darkMode ? 'bg-red-900' : 'bg-red-50'
                      }`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Range</p>
                        <p className={`text-lg font-bold ${
                          stats.spreadType === 'tight' ? darkMode ? 'text-green-400' : 'text-green-700' :
                          stats.spreadType === 'moderate' ? darkMode ? 'text-yellow-400' : 'text-yellow-700' :
                          darkMode ? 'text-red-400' : 'text-red-700'
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