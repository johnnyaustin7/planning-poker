import React, { useState, useEffect } from 'react';
import { Users, Eye, EyeOff, RotateCcw, Copy, Check, ArrowRight, RefreshCw, Moon, Sun, UserX, UserCog, History, Download, FileText } from 'lucide-react';

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, '?', 'No QA'];
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

const RETRO_FORMATS = {
  'start-stop-continue': {
    name: 'Start/Stop/Continue',
    columns: [
      { id: 'start', label: 'Start', color: '#10b981', icon: '▶️', prompt: 'What should we start doing?' },
      { id: 'stop', label: 'Stop', color: '#ef4444', icon: '⏹️', prompt: 'What should we stop doing?' },
      { id: 'continue', label: 'Continue', color: '#3b82f6', icon: '➡️', prompt: 'What should we keep doing?' }
    ]
  },
  'www-wdgw': {
    name: 'What Went Well / What Didn\'t Go Well',
    columns: [
      { id: 'well', label: 'What Went Well', color: '#10b981', icon: '✅', prompt: 'What went well?' },
      { id: 'notwell', label: 'What Didn\'t Go Well', color: '#f59e0b', icon: '⚠️', prompt: 'What didn\'t go well?' },
      { id: 'actions', label: 'Action Items', color: '#8b5cf6', icon: '🎯', prompt: 'What actions should we take?' }
    ]
  },
  'sailboat': {
    name: 'Sailboat',
    columns: [
      { id: 'wind', label: 'Wind (Helping)', color: '#3b82f6', icon: '💨', prompt: 'What\'s propelling us forward?' },
      { id: 'anchor', label: 'Anchor (Holding Back)', color: '#f59e0b', icon: '⚓', prompt: 'What\'s slowing us down?' },
      { id: 'rocks', label: 'Rocks (Risks)', color: '#ef4444', icon: '🪨', prompt: 'What risks do we need to avoid?' },
      { id: 'island', label: 'Island (Goal)', color: '#10b981', icon: '🏝️', prompt: 'Where are we headed?' }
    ]
  },
  '4qs': {
    name: '4Qs Retrospective',
    columns: [
      { id: 'wins', label: 'Wins', color: '#10b981', icon: '🏆', prompt: 'What did we do well that we should discuss so we don\'t forget?' },
      { id: 'learnings', label: 'Learnings', color: '#3b82f6', icon: '💡', prompt: 'What did we learn?' },
      { id: 'improvements', label: 'Improvements', color: '#f59e0b', icon: '📈', prompt: 'What should we do differently next time?' },
      { id: 'questions', label: 'Questions', color: '#8b5cf6', icon: '❓', prompt: 'What questions do we have?' }
    ]
  }
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

const APP_VERSION = "2.9.0";
const RELEASE_NOTES = {
  "2.9.0": {
    date: "October 23, 2025",
    type: "Minor Release",
    changes: [
      "🔄 Added Retrospective functionality",
      "🎨 Rebranded to 'Scrumptious' - unified agile ceremony toolkit",
      "📋 Four retrospective formats: Start/Stop/Continue, WWW/WDGW, Sailboat, 4Qs",
      "🎯 Unified session creation - choose ceremony type from landing page",
      "🔗 Auto-detection of session type when joining"
    ]
  },
  "2.8.3": {
    date: "October 23, 2025",
    type: "Patch Release",
    changes: [
      "Fixed session persistence behavior on browser refresh",
      "Always show home screen with 'Create' and 'Join' options after refresh",
      "QR code and session links still work to auto-join sessions",
      "Improved user control over session joining"
    ]
  },
  "2.8.2": {
    date: "October 22, 2025",
    type: "Patch Release",
    changes: [
      "Added automated end-to-end testing with Playwright",
      "Configured GitHub Actions for continuous integration",
      "Tests run automatically on every code push",
      "Multi-browser testing across Chrome, Firefox, and Safari",
      "Critical user flows now validated before deployment"
    ]
  },
  "2.8.1": {
    date: "October 22, 2025",
    type: "Patch Release",
    changes: [
      "Fixed console error when confidence voting is disabled",
      "Improved confidence field handling in vote submissions"
    ]
  },
  "2.8.0": {
    date: "October 22, 2025",
    type: "Minor Release",
    changes: [
      "🎴 Added card flip animations when votes are revealed",
      "🌙 Enhanced dark mode with better contrast and brighter accent colors",
      "❄️ Added glassmorphism effects to modals (frosted glass blur)",
      "✨ Smooth fade-in transitions for all screens",
      "🎬 Modal slide-up animations for polished interactions",
      "🎨 Improved gradient backgrounds in both light and dark modes"
    ]
  },
  "2.7.3": {
    date: "October 22, 2025",
    type: "Patch Release",
    changes: [
      "Expanded session ID pool from 42 to 100 unique words",
      "Added collision detection - checks if session exists before creating",
      "Auto-cleanup: Sessions older than 24 hours are automatically deleted",
      "Prevents accidental overwriting of active sessions"
    ]
  },
  "2.7.2": {
    date: "October 21, 2025",
    type: "Patch Release",
    changes: [
      "Removed '55' card from Fibonacci scale (now 10 cards)",
      "Confidence buttons can now be toggled on/off by clicking (like vote buttons)",
      "Added hover scale effect to confidence buttons for consistency",
      "Toggling confidence off now clears the vote if already submitted"
    ]
  },
  "2.7.1": {
    date: "October 17, 2025",
    type: "Patch Release",
    changes: [
      "Fixed duplicate variable declaration causing build failure",
      "Fixed flicker animation to stop once user has voted",
      "Adjusted flicker thresholds: 60% for 3 or fewer voters, 75% for 4+ voters",
      "Flicker now respects confidence voting state"
    ]
  },
  "2.7.0": {
    date: "October 17, 2025",
    type: "Minor Release",
    changes: [
      "⚖️ Enhanced confidence weighting - low confidence now 0.25x (was 0.5x)",
      "📊 Added median calculation and display for more robust estimates",
      "⚠️ Smart warnings: Team Uncertainty, High Disagreement, Limited Confidence",
      "🎯 Suggested estimate uses median when spread is very high (>8)",
      "💡 Warnings appear automatically to guide moderator decisions",
      "🎓 More accurate estimates with diverse team experience levels"
    ]
  },
  "2.6.0": {
    date: "October 17, 2025",
    type: "Minor Release",
    changes: [
      "🎚️ Added Confidence-Weighted Voting system (moderator can enable/disable)",
      "💭 Voters can indicate High/Medium/Low confidence in their estimates",
      "⚖️ Weighted average calculation gives more weight to high-confidence votes",
      "📈 Shows both traditional and confidence-weighted averages when enabled",
      "🏷️ Confidence indicators displayed on participant cards after reveal",
      "📊 Confidence breakdown in statistics panel",
      "💾 Setting persists throughout session"
    ]
  },
  "2.5.0": {
    date: "October 17, 2025",
    type: "Minor Release",
    changes: [
      "📊 Added Vote Distribution Chart in statistics panel",
      "📉 Visual bar chart shows vote clustering and patterns",
      "👀 Helps identify consensus and outliers at a glance",
      "🔢 Automatically sorts votes from lowest to highest",
      "🎬 Animated bars with vote counts displayed"
    ]
  },
  "2.4.1": {
    date: "October 17, 2025",
    type: "Patch Release",
    changes: [
      "Fixed Leave Session button - no longer shows 'removed by moderator' warning",
      "Fixed ticket ID clearing - now syncs removal across all participants",
      "Moved ticket display to 'Select Your Estimate' section header",
      "Cleaned up duplicate ticket displays",
      "Fixed beforeunload handler performance issue"
    ]
  },
  "2.4.0": {
    date: "October 17, 2025",
    type: "Minor Release",
    changes: [
      "📊 Enhanced average display with consensus strength indicators (tight/moderate/wide)",
      "🎯 Renamed 'Closest' to 'Suggested Estimate' with improved prominence",
      "💾 Added session persistence - automatically resume session on page refresh",
      "🔗 Updated tooltip from 'Copy Session ID' to 'Copy Session Link'",
      "📱 Optimized voting cards for mobile - 4 columns on small screens, 6 on desktop",
      "⚠️ Added warning to prevent accidental close during active voting (moderators)",
      "📳 Added haptic feedback on mobile devices for votes, reveals, resets, and consensus"
    ]
  },
  "2.3.0": {
    date: "October 17, 2025",
    type: "Minor Release",
    changes: [
      "✨ Added flickering animation when 75% of voters have cast their vote",
      "✏️ Made ticket names editable in session history (click to edit)",
      "🎯 Added 'Final Estimate' field for moderators to set determined points",
      "🔒 First round now requires manual reveal (prevents late joiners from seeing votes)",
      "⏱️ Timer now stops when all votes are cast or reveal is clicked",
      "✏️ Final estimates in history are now editable (click to edit)",
      "🎫 Ticket number now visible to all participants (not just moderator)",
      "📊 Removed voting scale column from CSV export",
      "📋 Added clickable release notes - click version number to view",
      "📄 Release notes accessible from all screens"
    ]
  },
  "2.2.0": {
    date: "October 16, 2025",
    type: "Minor Release",
    changes: [
      "📱 Added QR code generation for easy session joining",
      "🌙 Implemented dark mode with system preference detection",
      "👕 Added T-shirt sizing scale (XS, S, M, L, XL, XXL)",
      "🔄 Added ability to switch between Fibonacci and T-shirt sizing",
      "🎉 Consensus detection with confetti animation",
      "👁️ Added Observer role alongside Moderator and Voter",
      "🔀 Users can switch between voter and observer roles",
      "✨ Click-outside-to-close for dropdowns and modals"
    ]
  },
  "2.1.0": {
    date: "October 16, 2025",
    type: "Minor Release",
    changes: [
      "🎫 Added ticket number input for moderators",
      "📜 Automatic voting history tracking",
      "🗂️ Session history viewer modal",
      "📥 CSV export functionality",
      "📋 Copy history to clipboard feature",
      "⏱️ Duration tracking per voting round",
      "💾 History persists in Firebase throughout session"
    ]
  },
  "2.0.0": {
    date: "October 16, 2025",
    type: "Major Release",
    changes: [
      "🔢 Added version display on login and session screens",
      "📊 User cards now sorted by role and alphabetically",
      "🗳️ Added Voter badge display",
      "🚪 Users auto-removed when closing tab/browser",
      "🔄 Users can rejoin with same ID using same name",
      "❌ Moderators can remove users with X button",
      "⚠️ Removal notification when kicked by moderator",
      "📱 Mobile-responsive header layout"
    ]
  }
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
  const [wasRemoved, setWasRemoved] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [shouldFlicker, setShouldFlicker] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const [editingTicketValue, setEditingTicketValue] = useState('');
  const [editingEstimateId, setEditingEstimateId] = useState(null);
  const [editingEstimateValue, setEditingEstimateValue] = useState('');
  const [determinedPoints, setDeterminedPoints] = useState('');
  const [isFirstRound, setIsFirstRound] = useState(true);
  const [timerRunning, setTimerRunning] = useState(true);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedConfidence, setSelectedConfidence] = useState(null);
  const [confidenceVotingEnabled, setConfidenceVotingEnabled] = useState(false);
  
  // NEW STATE VARIABLES FOR RETROSPECTIVE
  const [sessionType, setSessionType] = useState(null); // 'estimation' or 'retrospective'
  const [retroFormat, setRetroFormat] = useState(null);
  const [showFormatSelector, setShowFormatSelector] = useState(false);
  const [retroItems, setRetroItems] = useState({});
  const [newItemText, setNewItemText] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(null);
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

  // UPDATED: This useEffect now handles both estimation and retrospective sessions
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
        
        // Load session type
        if (data.sessionType) {
          setSessionType(data.sessionType);
        }
        
        // Load retrospective data
        if (data.sessionType === 'retrospective') {
          if (data.retroFormat) {
            setRetroFormat(data.retroFormat);
          }
          if (data.retroItems) {
            setRetroItems(data.retroItems);
          }
        }
        
        // Load confidence voting setting
        if (data.confidenceVotingEnabled !== undefined) {
          setConfidenceVotingEnabled(data.confidenceVotingEnabled);
        }
        
        // Load history
        if (data.history) {
          const historyArray = Object.values(data.history).sort((a, b) => b.timestamp - a.timestamp);
          setSessionHistory(historyArray);
        }
        
        // Load current ticket number
        if (data.currentTicket !== undefined) {
          setTicketNumber(data.currentTicket);
        } else {
          setTicketNumber('');
        }
        
        // Load determined points
        if (data.determinedPoints) {
          setDeterminedPoints(data.determinedPoints);
        }
        
        // Check if this is the first round
        if (data.isFirstRound !== undefined) {
          setIsFirstRound(data.isFirstRound);
        }
        
        // Check if current user still exists in session
        if (currentUserId && hasJoined) {
          if (!data.participants || !data.participants[currentUserId]) {
            if (!wasRemoved) {
              setWasRemoved(true);
            }
            setHasJoined(false);
            setSelectedPoint(null);
            return;
          }
          
          setSelectedPoint(data.participants[currentUserId].points);
          setSelectedConfidence(confidenceVotingEnabled ? data.participants[currentUserId].confidence : null);
          setIsModerator(data.participants[currentUserId].isModerator || false);
          setIsObserver(data.participants[currentUserId].isObserver || false);
        }
        
        // Only run estimation-specific logic if this is an estimation session
        if (data.sessionType === 'estimation' || !data.sessionType) {
          const votingParticipants = newParticipants.filter(p => !p.isModerator && !p.isObserver);
          const allVoted = votingParticipants.every(p => p.points !== null && p.points !== undefined && p.points !== '') && votingParticipants.length > 0;
          
          if (allVoted || newRevealed) {
            setTimerRunning(false);
          }
          
          if (currentUserId && hasJoined && !isModerator && !isObserver) {
            const votedCount = votingParticipants.filter(p => p.points !== null && p.points !== undefined && p.points !== '').length;
            const totalVoters = votingParticipants.length;
            const currentUserVoted = data.participants[currentUserId]?.points !== null && 
                                     data.participants[currentUserId]?.points !== undefined && 
                                     data.participants[currentUserId]?.points !== '';
            
            const threshold = totalVoters <= 3 ? 0.60 : 0.75;
            
            if (totalVoters > 0 && votedCount / totalVoters >= threshold && !currentUserVoted) {
              setShouldFlicker(true);
            } else {
              setShouldFlicker(false);
            }
          }
          
          const checkIsFirstRound = data.isFirstRound !== undefined ? data.isFirstRound : true;
          if (!newRevealed && allVoted && votingParticipants.length > 0 && !checkIsFirstRound) {
            handleReveal();
          }
          
          if (!revealed && newRevealed) {
            const votes = votingParticipants.map(p => p.points).filter(p => p !== null);
            
            if (votes.length > 1) {
              const uniqueVotes = new Set(votes);
              if (uniqueVotes.size === 1) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);
                
                if (navigator.vibrate) {
                  navigator.vibrate([50, 100, 50, 100, 50]);
                }
              }
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, [sessionId, currentUserId, revealed, db, dbModule, hasJoined]);

  useEffect(() => {
    if (sessionId) {
      const currentUrl = window.location.origin + window.location.pathname + '?session=' + sessionId;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!hasJoined || !currentUserId || !db || !dbModule || !sessionId) return;
    
    const handleBeforeUnload = (e) => {
      const votingParticipants = participants.filter(p => !p.isModerator && !p.isObserver);
      const hasVotes = votingParticipants.some(p => p.points !== null && p.points !== undefined && p.points !== '');
      
      if (isModerator && !revealed && hasVotes) {
        e.preventDefault();
        e.returnValue = 'Voting is in progress. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasJoined, currentUserId, db, dbModule, sessionId, isModerator, revealed, participants]);

  useEffect(() => {
    if (!hasJoined || !isModerator || !timerRunning) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - resetTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [hasJoined, isModerator, resetTime, timerRunning]);
  const generateSessionId = () => {
    const words = [
      'BANANA', 'CASTLE', 'DRAGON', 'FOREST', 'GALAXY', 'HAMMER',
      'ISLAND', 'JUNGLE', 'KITTEN', 'LEMON', 'MARBLE', 'ORANGE',
      'PLANET', 'RABBIT', 'SILVER', 'TIGER', 'VIOLET', 'WIZARD',
      'YELLOW', 'ANCHOR', 'BUCKET', 'CANDLE', 'DANCER', 'ENGINE',
      'FALCON', 'GARDEN', 'HELMET', 'INSECT', 'JACKET', 'KETTLE',
      'LADDER', 'MAGNET', 'NAPKIN', 'OCTAVE', 'PENCIL', 'ROCKET',
      'SADDLE', 'TIMBER', 'VELVET', 'WALNUT', 'ZIPPER','ARROW', 
      'BRIDGE', 'COBRA', 'DELTA', 'EMBER', 'FROST', 'ZODIAC',
      'GHOST', 'HAWK', 'IVORY', 'JADE', 'KITE', 'LOTUS',
      'MANGO', 'NEXUS', 'OPAL', 'PHOENIX', 'QUARTZ', 'RAVEN',
      'SPARK', 'THUNDER', 'UNITY', 'VIPER', 'WAVE', 'XENON',
      'YOUTH', 'ZENITH', 'APPLE', 'BEAR', 'CLOUD', 'DAWN',
      'EAGLE', 'FLAME', 'GLACIER', 'HYDRA', 'IRON', 'JAGUAR',
      'KNIGHT', 'LYNX', 'METEOR', 'NOVA', 'OMEGA', 'PRISM',
      'QUEST', 'RUSH', 'STORM', 'TITAN', 'ULTRA', 'VERTEX',
      'WARDEN', 'XEROX', 'YETI'
    ];
    return words[Math.floor(Math.random() * words.length)];
  };

  // UPDATED: Now accepts type parameter and handles retrospective format selection
  const handleCreateSession = async (type) => {
    if (!db || !dbModule) return;

    // If retrospective, show format selector first
    if (type === 'retrospective') {
      setSessionType('retrospective');
      setShowFormatSelector(true);
      return;
    }

    // For estimation, create immediately
    cleanupOldSessions();
    
    let newSessionId;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      newSessionId = generateSessionId();
      const sessionRef = dbModule.ref(db, `sessions/${newSessionId}`);
      const snapshot = await dbModule.get(sessionRef);
      
      if (!snapshot.exists()) {
        break;
      }
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      newSessionId = generateSessionId() + '-' + Date.now().toString().slice(-3);
    }
    
    setSessionId(newSessionId);
    setSessionType(type);
    
    const sessionRef = dbModule.ref(db, `sessions/${newSessionId}`);
    await dbModule.set(sessionRef, { 
      sessionType: type,
      votingScale: 'fibonacci',
      revealed: false,
      participants: {},
      isFirstRound: true,
      confidenceVotingEnabled: false,
      createdAt: Date.now()
    });
  };

  // NEW: Function to create retrospective session with selected format
  const handleCreateRetroSession = async (format) => {
    if (!db || !dbModule) return;

    cleanupOldSessions();
    
    let newSessionId;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      newSessionId = generateSessionId();
      const sessionRef = dbModule.ref(db, `sessions/${newSessionId}`);
      const snapshot = await dbModule.get(sessionRef);
      
      if (!snapshot.exists()) {
        break;
      }
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      newSessionId = generateSessionId() + '-' + Date.now().toString().slice(-3);
    }
    
    setSessionId(newSessionId);
    setSessionType('retrospective');
    setRetroFormat(format);
    setShowFormatSelector(false);
    
    const sessionRef = dbModule.ref(db, `sessions/${newSessionId}`);
    await dbModule.set(sessionRef, { 
      sessionType: 'retrospective',
      retroFormat: format,
      revealed: false,
      participants: {},
      retroItems: {},
      createdAt: Date.now()
    });
  };

  const cleanupOldSessions = async () => {
    if (!db || !dbModule) return;
    
    const sessionsRef = dbModule.ref(db, 'sessions');
    const snapshot = await dbModule.get(sessionsRef);
    
    if (snapshot.exists()) {
      const sessions = snapshot.val();
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      Object.entries(sessions).forEach(async ([sessionId, sessionData]) => {
        if (sessionData.createdAt && (now - sessionData.createdAt) > twentyFourHours) {
          const oldSessionRef = dbModule.ref(db, `sessions/${sessionId}`);
          await dbModule.remove(oldSessionRef);
          console.log(`Cleaned up old session: ${sessionId}`);
        }
      });
    }
  };

  const handleJoinSession = () => {
    if (sessionIdInput.trim()) {
      setSessionId(sessionIdInput.toUpperCase());
    }
  };

  const handleJoin = async () => {
    if (userName.trim() && sessionId && db && dbModule) {
      localStorage.setItem('planningPokerUserName', userName.trim());
      localStorage.setItem('planningPokerSessionId', sessionId);
      
      const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
      const sessionSnapshot = await dbModule.get(sessionRef);
      
      let userId = null;
      
      if (sessionSnapshot.exists() && sessionSnapshot.val().participants) {
        const existingUser = Object.entries(sessionSnapshot.val().participants).find(
          ([id, participant]) => participant.name === userName.trim()
        );
        
        if (existingUser) {
          userId = existingUser[0];
        }
      }
      
      if (!userId) {
        userId = currentUserId || Date.now().toString();
      }
      
      setCurrentUserId(userId);
      localStorage.setItem('planningPokerUserId', userId);
      setWasRemoved(false);
      
      if (!sessionSnapshot.exists()) {
        await dbModule.set(sessionRef, {
          sessionType: 'estimation',
          votingScale: 'fibonacci',
          revealed: false,
          participants: {},
          isFirstRound: true,
          confidenceVotingEnabled: false
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
          handleCreateSession('estimation');
        }
      } else if (!hasJoined) {
        handleJoin();
      }
    }
  };
  const handleSelectPoint = async (point) => {
    if (!currentUserId || isModerator || isObserver || !db || !dbModule) return;
    
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    const newPoint = selectedPoint === point ? null : point;
    setSelectedPoint(newPoint);
    
    if (!confidenceVotingEnabled) {
      const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
      await dbModule.update(participantRef, { points: newPoint });
    } else if (newPoint !== null && selectedConfidence !== null) {
      const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
      const updates = { points: newPoint };
      if (selectedConfidence) {
        updates.confidence = selectedConfidence;
      }
      await dbModule.update(participantRef, updates);
    }
  };

  const handleSelectConfidence = async (confidence) => {
    if (!currentUserId || isModerator || isObserver || !db || !dbModule) return;
    
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    const newConfidence = selectedConfidence === confidence ? null : confidence;
    setSelectedConfidence(newConfidence);
    
    if (selectedPoint !== null && newConfidence !== null) {
      const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
      const updates = { 
        points: selectedPoint,
        confidence: newConfidence
      };
      
      await dbModule.update(participantRef, updates);
    } else if (selectedPoint !== null && newConfidence === null) {
      const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
      await dbModule.update(participantRef, { 
        points: null,
        confidence: null
      });
      setSelectedPoint(null);
    }
  };

  const handleSubmitVote = async () => {
    if (!currentUserId || isModerator || isObserver || !db || !dbModule) return;
    if (selectedPoint === null || (confidenceVotingEnabled && selectedConfidence === null)) return;
    
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
    const updates = { points: selectedPoint };
    
    if (confidenceVotingEnabled) {
      updates.confidence = selectedConfidence;
    }
    
    await dbModule.update(participantRef, updates);
  };

  const handleReveal = async () => {
    if (!db || !dbModule) return;
    
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
    
    const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
    const updates = { revealed: !revealed };
    
    if (isFirstRound && !revealed) {
      updates.isFirstRound = false;
    }
    
    await dbModule.update(sessionRef, updates);
  };

  const handleReset = async () => {
    if (!db || !dbModule) return;
    
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
    
    if (revealed && votingParticipants.length > 0) {
      const votedParticipants = votingParticipants.filter(p => p.points !== null && p.points !== undefined && p.points !== '');
      
      if (votedParticipants.length > 0) {
        const finalEstimate = determinedPoints || stats?.closest || 'N/A';
        
        const historyEntry = {
          ticketId: ticketNumber || 'No ticket',
          timestamp: Date.now(),
          votes: votedParticipants.map(p => ({
            name: p.name,
            vote: p.points
          })),
          finalEstimate: finalEstimate,
          duration: elapsedTime,
          votingScale: votingScale,
          participantCount: votedParticipants.length
        };
        
        const historyRef = dbModule.ref(db, `sessions/${sessionId}/history/${Date.now()}`);
        await dbModule.set(historyRef, historyEntry);
      }
    }
    
    setSelectedPoint(null);
    setSelectedConfidence(null);
    setResetTime(Date.now());
    setElapsedTime(0);
    setTicketNumber('');
    setDeterminedPoints('');
    setTimerRunning(true);
    
    const updates = {};
    participants.forEach(p => {
      updates[`sessions/${sessionId}/participants/${p.id}/points`] = null;
      updates[`sessions/${sessionId}/participants/${p.id}/confidence`] = null;
    });
    updates[`sessions/${sessionId}/revealed`] = false;
    updates[`sessions/${sessionId}/currentTicket`] = '';
    updates[`sessions/${sessionId}/determinedPoints`] = '';
    
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

  const toggleConfidenceVoting = async () => {
    if (!isModerator || !db || !dbModule) return;
    
    const newValue = !confidenceVotingEnabled;
    setConfidenceVotingEnabled(newValue);
    
    const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
    await dbModule.update(sessionRef, { confidenceVotingEnabled: newValue });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  // NEW: Add retrospective item
  const handleAddRetroItem = async (columnId) => {
    if (!newItemText.trim() || !db || !dbModule || !currentUserId) return;
    
    const itemId = Date.now().toString();
    const item = {
      id: itemId,
      text: newItemText.trim(),
      authorId: currentUserId,
      authorName: userName,
      columnId: columnId,
      timestamp: Date.now(),
      votes: 0
    };
    
    const itemRef = dbModule.ref(db, `sessions/${sessionId}/retroItems/${itemId}`);
    await dbModule.set(itemRef, item);
    
    setNewItemText('');
    setSelectedColumn(null);
  };

  // NEW: Delete retrospective item
  const handleDeleteRetroItem = async (itemId) => {
    if (!db || !dbModule) return;
    
    const itemRef = dbModule.ref(db, `sessions/${sessionId}/retroItems/${itemId}`);
    await dbModule.remove(itemRef);
  };

  // NEW: Vote on retrospective item
  const handleVoteRetroItem = async (itemId) => {
    if (!db || !dbModule) return;
    
    const item = retroItems[itemId];
    if (!item) return;
    
    const newVotes = (item.votes || 0) + 1;
    
    const itemRef = dbModule.ref(db, `sessions/${sessionId}/retroItems/${itemId}`);
    await dbModule.update(itemRef, { votes: newVotes });
  };
  const removeUser = async (userId) => {
    if (!isModerator || !db || !dbModule) return;
    
    const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${userId}`);
    await dbModule.remove(participantRef);
  };

  const handleLeaveSession = async () => {
    if (!db || !dbModule || !currentUserId) return;
    
    const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
    await dbModule.remove(participantRef);
    
    localStorage.removeItem('planningPokerSessionId');
    localStorage.removeItem('planningPokerUserId');
    
    setHasJoined(false);
    setSessionId('');
    setSelectedPoint(null);
    setShowLeaveConfirm(false);
    setWasRemoved(false);
    setCurrentUserId(null);
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

  const updateTicketNumber = async (value) => {
    setTicketNumber(value);
    if (db && dbModule) {
      const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
      await dbModule.update(sessionRef, { currentTicket: value });
    }
  };

  const updateDeterminedPoints = async (value) => {
    setDeterminedPoints(value);
    if (db && dbModule) {
      const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
      await dbModule.update(sessionRef, { determinedPoints: value });
    }
  };

  const updateHistoryTicket = async (timestamp, newTicketId) => {
    if (!db || !dbModule) return;
    
    const historyRef = dbModule.ref(db, `sessions/${sessionId}/history/${timestamp}`);
    await dbModule.update(historyRef, { ticketId: newTicketId });
    
    setEditingHistoryId(null);
    setEditingTicketValue('');
  };

  const updateHistoryEstimate = async (timestamp, newEstimate) => {
    if (!db || !dbModule) return;
    
    const historyRef = dbModule.ref(db, `sessions/${sessionId}/history/${timestamp}`);
    await dbModule.update(historyRef, { finalEstimate: newEstimate });
    
    setEditingEstimateId(null);
    setEditingEstimateValue('');
  };

  const exportToCSV = () => {
    if (sessionHistory.length === 0) {
      alert('No history to export yet!');
      return;
    }

    const headers = ['Ticket ID', 'Final Estimate', 'Participants', 'All Votes', 'Duration', 'Timestamp'];
    const rows = sessionHistory.map(entry => {
      const votes = entry.votes.map(v => `${v.name}:${v.vote}`).join('; ');
      const allVotes = entry.votes.map(v => v.vote).join(',');
      const date = new Date(entry.timestamp).toLocaleString();
      const duration = `${Math.floor(entry.duration / 60)}:${(entry.duration % 60).toString().padStart(2, '0')}`;
      
      return [
        entry.ticketId,
        entry.finalEstimate,
        entry.participantCount,
        allVotes,
        duration,
        date
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planning-poker-${sessionId}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyHistoryToClipboard = () => {
    if (sessionHistory.length === 0) {
      alert('No history to copy yet!');
      return;
    }

    const text = sessionHistory.map(entry => {
      const votes = entry.votes.map(v => `${v.name}: ${v.vote}`).join(', ');
      const date = new Date(entry.timestamp).toLocaleString();
      const duration = `${Math.floor(entry.duration / 60)}:${(entry.duration % 60).toString().padStart(2, '0')}`;
      
      return `${entry.ticketId} | Estimate: ${entry.finalEstimate} | Votes: ${votes} | Duration: ${duration} | ${date}`;
    }).join('\n');

    navigator.clipboard.writeText(text);
    alert('History copied to clipboard!');
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
    const votingParticipants = participants.filter(p => !p.isModerator && !p.isObserver);
    
    const numericVotes = votingParticipants
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
    
    let weightedAvg = avg;
    let totalWeight = 0;
    const confidenceWeights = { 'low': 0.25, 'medium': 1.0, 'high': 2.0 };
    
    if (confidenceVotingEnabled) {
      let totalWeightedPoints = 0;
      
      votingParticipants.forEach(p => {
        const point = votingScale === 'tshirt' && p.points && typeof p.points === 'string' 
          ? TSHIRT_TO_FIBONACCI[p.points] 
          : p.points;
        
        if (point !== null && point !== '?' && point !== 'No QA' && typeof point === 'number') {
          const weight = confidenceWeights[p.confidence] || 1.0;
          totalWeightedPoints += point * weight;
          totalWeight += weight;
        }
      });
      
      if (totalWeight > 0) {
        weightedAvg = totalWeightedPoints / totalWeight;
      }
    }
    
    const fibonacciScale = FIBONACCI.filter(f => typeof f === 'number');
    const closest = fibonacciScale.reduce((prev, curr) =>
      Math.abs(curr - weightedAvg) < Math.abs(prev - weightedAvg) ? curr : prev
    );
    
    let displayClosest = closest;
    let weightedClosest = null;
    
    if (votingScale === 'tshirt') {
      const tshirtEntry = Object.entries(TSHIRT_TO_FIBONACCI).find(([_, val]) => val === closest);
      displayClosest = tshirtEntry ? tshirtEntry[0] : closest;
    }
    
    if (confidenceVotingEnabled && totalWeight > 0) {
      weightedClosest = fibonacciScale.reduce((prev, curr) =>
        Math.abs(curr - weightedAvg) < Math.abs(prev - weightedAvg) ? curr : prev
      );
      
      if (votingScale === 'tshirt') {
        const tshirtEntry = Object.entries(TSHIRT_TO_FIBONACCI).find(([_, val]) => val === weightedClosest);
        weightedClosest = tshirtEntry ? tshirtEntry[0] : weightedClosest;
      }
    }
    
    const allVotes = participants
      .filter(p => !p.isModerator && !p.isObserver)
      .map(p => p.points)
      .filter(p => p !== null && p !== undefined && p !== '');
    
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
    
    const distribution = {};
    allVotes.forEach(vote => {
      distribution[vote] = (distribution[vote] || 0) + 1;
    });
    
    const sortedDistribution = Object.entries(distribution).sort((a, b) => {
      if (a[0] === '?') return 1;
      if (b[0] === '?') return 1;
      if (a[0] === 'No QA') return 1;
      if (b[0] === 'No QA') return 1;
      
      let aVal = a[0];
      let bVal = b[0];
      
      if (votingScale === 'tshirt') {
        aVal = TSHIRT_TO_FIBONACCI[a[0]] || 0;
        bVal = TSHIRT_TO_FIBONACCI[b[0]] || 0;
      }
      
      return Number(aVal) - Number(bVal);
    });
    
    const maxCount = Math.max(...Object.values(distribution));
    
    const sortedNumericVotes = [...numericVotes].sort((a, b) => a - b);
    const mid = Math.floor(sortedNumericVotes.length / 2);
    const median = sortedNumericVotes.length % 2 === 0
      ? (sortedNumericVotes[mid - 1] + sortedNumericVotes[mid]) / 2
      : sortedNumericVotes[mid];
    
    let medianClosest = fibonacciScale.reduce((prev, curr) =>
      Math.abs(curr - median) < Math.abs(prev - median) ? curr : prev
    );
    
    if (votingScale === 'tshirt') {
      const tshirtEntry = Object.entries(TSHIRT_TO_FIBONACCI).find(([_, val]) => val === medianClosest);
      medianClosest = tshirtEntry ? tshirtEntry[0] : medianClosest;
    }
    
    let confidenceBreakdown = null;
    let warnings = [];
    
    if (confidenceVotingEnabled) {
      confidenceBreakdown = {
        high: votingParticipants.filter(p => p.confidence === 'high').length,
        medium: votingParticipants.filter(p => p.confidence === 'medium').length,
        low: votingParticipants.filter(p => p.confidence === 'low').length
      };
      
      const totalVoters = votingParticipants.length;
      const confidentVoters = confidenceBreakdown.high + confidenceBreakdown.medium;
      
      if (confidenceBreakdown.low / totalVoters > 0.5) {
        warnings.push({
          type: 'uncertainty',
          icon: '⚠️',
          message: 'Team Uncertainty',
          detail: 'Majority voted low confidence - consider refining story'
        });
      }
      
      const confidentVotes = votingParticipants
        .filter(p => p.confidence === 'high')
        .map(p => {
          if (votingScale === 'tshirt' && p.points && typeof p.points === 'string') {
            return TSHIRT_TO_FIBONACCI[p.points];
          }
          return p.points;
        })
        .filter(p => p !== null && typeof p === 'number');
      
      if (confidentVotes.length >= 2) {
        const confidentSpread = Math.max(...confidentVotes) - Math.min(...confidentVotes);
        if (confidentSpread > 5) {
          warnings.push({
            type: 'disagreement',
            icon: '🔄',
            message: 'High Disagreement',
            detail: 'Confident voters disagree - discussion recommended'
          });
        }
      }
      
      if (confidentVoters < 2) {
        warnings.push({
          type: 'limited',
          icon: 'ℹ️',
          message: 'Limited Confidence',
          detail: 'Few confident estimates available'
        });
      }
    }
    
    let suggestedEstimate = confidenceVotingEnabled && weightedClosest ? weightedClosest : displayClosest;
    if (spread > 8 && median) {
      suggestedEstimate = medianClosest;
    }
    
    return { 
      average: avg.toFixed(1),
      weightedAverage: confidenceVotingEnabled ? weightedAvg.toFixed(1) : null,
      weightedClosest: confidenceVotingEnabled ? weightedClosest : null,
      median: median ? median.toFixed(1) : null,
      medianClosest: medianClosest,
      closest: displayClosest,
      suggestedEstimate,
      consensus,
      range,
      spreadType,
      outliers: outliers.length > 0 ? outliers : null,
      distribution: sortedDistribution,
      maxCount,
      confidenceBreakdown,
      warnings
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
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 max-w-md w-full fade-in`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex-1 text-center`}>Scrumptious</h1>
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
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Your agile ceremony toolkit</p>
          </div>
          <div className="space-y-4">
            {/* Session Type Selection Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCreateSession('estimation')}
                className={`${darkMode ? 'bg-gray-700 hover:border-blue-400' : 'bg-white hover:border-blue-500'} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent text-center`}
              >
                <div className="text-4xl mb-2">🃏</div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Planning Poker
                </h3>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Estimate stories
                </p>
              </button>

              <button
                onClick={() => handleCreateSession('retrospective')}
                className={`${darkMode ? 'bg-gray-700 hover:border-purple-400' : 'bg-white hover:border-purple-500'} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent text-center`}
              >
                <div className="text-4xl mb-2">🔄</div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Retrospective
                </h3>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Reflect & improve
                </p>
              </button>
            </div>
            
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
          <div className="mt-6 text-center">
            <p 
              className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} cursor-pointer underline`}
              onClick={() => setShowReleaseNotes(true)}
              title="View release notes"
            >
              Scrumptious v{APP_VERSION}
            </p>
          </div>
        </div>

        {/* Format Selector Modal for Retrospective */}
        {showFormatSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => setShowFormatSelector(false)}
            />
            <div className={`${darkMode ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'} rounded-lg shadow-2xl max-w-2xl w-full relative z-10 modal-enter border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Choose Retrospective Format
                  </h2>
                  <button
                    onClick={() => setShowFormatSelector(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(RETRO_FORMATS).map(([key, format]) => (
                    <button
                      key={key}
                      onClick={() => handleCreateRetroSession(key)}
                      className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg p-4 text-left transition-all border-2 border-transparent hover:border-purple-500`}
                    >
                      <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {format.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {format.columns.map(col => (
                          <span
                            key={col.id}
                            className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-white text-gray-700'}`}
                          >
                            {col.icon} {col.label}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Release Notes Modal - keep existing */}
        {showReleaseNotes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => setShowReleaseNotes(false)}
            />
            <div className={`${darkMode ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'} rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col relative z-10 border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Release Notes
                  </h2>
                  <button
                    onClick={() => setShowReleaseNotes(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {Object.entries(RELEASE_NOTES).map(([version, notes]) => (
                    <div
                      key={version}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Version {version}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notes.date} • {notes.type}
                          </p>
                        </div>
                        {version === APP_VERSION && (
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {notes.changes.map((change, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  if (!hasJoined) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-slate-100'} flex items-center justify-center p-4`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 max-w-md w-full fade-in`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex-1 text-center`}>Scrumptious</h1>
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
                title="Copy Session Link"
              >
                {showCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />}
              </button>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Share this ID with your team</p>
            
            {wasRemoved && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">
                  ⚠️ You have been removed from the session by the moderator.
                </p>
                <p className="text-red-600 text-xs mt-1">
                  You can rejoin if you wish by entering your name below.
                </p>
              </div>
            )}
            
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              Join Session
            </button>
          </div>
          <div className="mt-6 text-center">
            <p 
              className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} cursor-pointer underline`}
              onClick={() => setShowReleaseNotes(true)}
              title="View release notes"
            >
              Scrumptious v{APP_VERSION}
            </p>
          </div>
        </div>

        {/* Release Notes Modal - Same as landing page */}
        {showReleaseNotes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => setShowReleaseNotes(false)}
            />
            <div className={`${darkMode ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'} rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col relative z-10 modal-enter border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Release Notes
                  </h2>
                  <button
                    onClick={() => setShowReleaseNotes(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {Object.entries(RELEASE_NOTES).map(([version, notes]) => (
                    <div
                      key={version}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Version {version}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notes.date} • {notes.type}
                          </p>
                        </div>
                        {version === APP_VERSION && (
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {notes.changes.map((change, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  // Calculate stats for estimation sessions
  const stats = sessionType === 'estimation' ? calculateAverage() : null;
  const votingParticipants = participants.filter(p => !p.isModerator && !p.isObserver);
  const allVoted = votingParticipants.every(p => p.points !== null && p.points !== undefined && p.points !== '') && votingParticipants.length > 0;
  const currentScale = votingScale === 'fibonacci' ? FIBONACCI : TSHIRT;

  // Sort participants
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.isModerator && !b.isModerator) return -1;
    if (!a.isModerator && b.isModerator) return 1;
    if (!a.isModerator && !a.isObserver && (b.isModerator || b.isObserver)) return -1;
    if ((a.isModerator || a.isObserver) && !b.isModerator && !b.isObserver) return 1;
    if (a.isObserver && !b.isObserver && !b.isModerator) return 1;
    if (!a.isObserver && b.isObserver && !a.isModerator) return -1;
    
    return a.name.localeCompare(b.name);
  });

  // Get current retro format if in retrospective session
  const currentRetroFormat = retroFormat ? RETRO_FORMATS[retroFormat] : null;
  // NEW: Retrospective Session View
  if (sessionType === 'retrospective' && retroFormat && currentRetroFormat) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} p-4`}>
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .modal-enter {
            animation: slideUp 0.3s ease-out;
          }
        `}</style>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-purple-50'} rounded-lg shadow-xl p-4 sm:p-6 mb-6`}>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Retrospective: {currentRetroFormat.name}
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Session: <code className={`font-mono ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{sessionId}</code>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Toggle dark mode"
                  >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    <Users size={18} />
                    <span className="font-semibold">{participants.length}</span>
                  </div>
                  <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    Leave Session
                  </button>
                </div>
              </div>
              <div className={`${darkMode ? 'text-gray-100' : 'text-gray-600'} text-sm sm:text-base`}>
                <span>Welcome, </span>
                {isEditingName ? (
                  <span className="inline-flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={handleNameKeyPress}
                      onBlur={handleSaveName}
                      maxLength={30}
                      className={`px-2 py-1 border ${
                        darkMode 
                          ? 'bg-gray-700 border-purple-500 text-white' 
                          : 'border-purple-500'
                      } rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm`}
                      autoFocus
                    />
                  </span>
                ) : (
                  <span 
                    className={`font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-600'} cursor-pointer hover:underline`}
                    onClick={handleStartEditName}
                    title="Click to edit name"
                  >
                    {userName}
                  </span>
                )}!
                <div className="inline-flex items-center gap-2 ml-2">
                  {isModerator && <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded shadow-sm">Moderator</span>}
                  {isObserver && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Observer</span>}
                  {!isModerator && !isObserver && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Participant</span>}
                  {!isModerator && (
                    <span className="relative inline-block">
                      <button
                        onClick={() => setShowTypeMenu(!showTypeMenu)}
                        className={`px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} text-xs rounded transition-colors flex items-center gap-1`}
                        title="Change user type"
                      >
                        <UserCog size={12} />
                        <span className="hidden sm:inline">Change Type</span>
                      </button>
                      {showTypeMenu && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowTypeMenu(false)}
                          />
                          <div className={`absolute left-0 mt-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'} py-1 z-20`}>
                            <button
                              onClick={() => changeUserType('voter')}
                              disabled={!isObserver}
                              className={`w-full px-4 py-2 text-left text-sm whitespace-nowrap ${
                                !isObserver 
                                  ? darkMode ? 'text-gray-500' : 'text-gray-400 cursor-not-allowed'
                                  : darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Switch to Participant
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
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Retrospective Columns */}
          <div className={`grid grid-cols-1 md:grid-cols-${currentRetroFormat.columns.length >= 4 ? '2' : currentRetroFormat.columns.length} gap-4 mb-6`}>
            {currentRetroFormat.columns.map(column => {
              const columnItems = Object.values(retroItems).filter(item => item.columnId === column.id);
              const sortedItems = columnItems.sort((a, b) => (b.votes || 0) - (a.votes || 0));
              
              return (
                <div
                  key={column.id}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-4 min-h-[300px]`}
                  style={{ borderTop: `4px solid ${column.color}` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{column.icon}</span>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {column.label}
                    </h3>
                  </div>
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 italic`}>
                    {column.prompt}
                  </p>

                  {/* Add Item Button */}
                  {!isObserver && (
                    <button
                      onClick={() => setSelectedColumn(column.id)}
                      className={`w-full mb-4 py-2 px-4 rounded-lg border-2 border-dashed transition-colors ${
                        darkMode 
                          ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      + Add Item
                    </button>
                  )}

                  {/* Items List */}
                  <div className="space-y-2">
                    {sortedItems.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        } border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`flex-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {item.text}
                          </p>
                          {(isModerator || item.authorId === currentUserId) && (
                            <button
                              onClick={() => handleDeleteRetroItem(item.id)}
                              className={`p-1 rounded ${
                                darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                              }`}
                              title="Delete"
                            >
                              <UserX size={14} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {item.authorName}
                          </span>
                          <button
                            onClick={() => handleVoteRetroItem(item.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              darkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            👍 {item.votes || 0}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Participants List */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
              Participants ({participants.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {sortedParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className={`rounded-lg p-3 text-center border-2 relative ${
                    participant.isModerator 
                      ? darkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'
                      : participant.isObserver
                      ? darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'
                      : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {isModerator && participant.id !== currentUserId && (
                    <button
                      onClick={() => removeUser(participant.id)}
                      className={`absolute top-1 right-1 p-1 rounded ${
                        darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
                      } text-white transition-colors`}
                      title="Remove user"
                    >
                      <UserX size={12} />
                    </button>
                  )}
                  <p className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} text-sm break-words`}>
                    {participant.name}
                  </p>
                  {participant.isModerator && <span className={`text-xs block ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Moderator</span>}
                  {participant.isObserver && <span className={`text-xs block ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Observer</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Item Modal */}
        {selectedColumn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => {
                setSelectedColumn(null);
                setNewItemText('');
              }}
            />
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full relative z-10 modal-enter`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Add Item
              </h3>
              <textarea
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Enter your thoughts..."
                rows={4}
                className={`w-full px-4 py-3 border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none mb-4`}
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setSelectedColumn(null);
                    setNewItemText('');
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddRetroItem(selectedColumn)}
                  disabled={!newItemText.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Leave Confirmation Modal */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => setShowLeaveConfirm(false)}
            />
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full relative z-10`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Leave Session?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Are you sure you want to leave this session? You'll be removed from the participant list.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveSession}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Leave Session
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-6 text-center">
          <p 
            className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} cursor-pointer underline`}
            onClick={() => setShowReleaseNotes(true)}
            title="View release notes"
          >
            Scrumptious v{APP_VERSION}
          </p>
        </footer>

        {/* Release Notes Modal */}
        {showReleaseNotes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => setShowReleaseNotes(false)}
            />
            <div className={`${darkMode ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'} rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col relative z-10 modal-enter border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Release Notes
                  </h2>
                  <button
                    onClick={() => setShowReleaseNotes(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {Object.entries(RELEASE_NOTES).map(([version, notes]) => (
                    <div
                      key={version}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Version {version}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notes.date} • {notes.type}
                          </p>
                        </div>
                        {version === APP_VERSION && (
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {notes.changes.map((change, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  // Main Planning Poker Session View
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} p-4`}>
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
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .animate-flicker {
    animation: flicker 0.5s ease-in-out infinite;
  }
  /* Card flip animation */
  @keyframes flipIn {
    from {
      transform: rotateY(90deg);
      opacity: 0;
    }
    to {
      transform: rotateY(0deg);
      opacity: 1;
    }
  }
  .card-flip-enter {
    animation: flipIn 0.6s ease-out forwards;
  }
        /* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Modal slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-enter {
  animation: slideUp 0.3s ease-out;
}
`}</style>
      
      <div className="max-w-6xl mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-blue-50'} rounded-lg shadow-xl p-4 sm:p-6 mb-6`}>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Scrumptious: Planning Poker</h1>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Toggle dark mode"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className={`flex items-center gap-2 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} px-2 sm:px-3 py-2 rounded text-sm`}>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} hidden sm:inline`}>Session:</span>
                  <code className={`font-mono font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>{sessionId}</code>
                  <button
                    onClick={copySessionId}
                    className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-200'}`}
                    title="Copy Session Link"
                  >
                    {showCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />}
                  </button>
                </div>
                <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                  <Users size={18} />
                  <span className="font-semibold">{participants.length}</span>
                </div>
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  title="Leave session"
                >
                  Leave Session
                </button>
              </div>
            </div>
            <div className={`${darkMode ? 'text-gray-100' : 'text-gray-600'} text-sm sm:text-base`}>
              <span>Welcome, </span>
              {isEditingName ? (
                <span className="inline-flex items-center gap-2">
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
                    } rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm`}
                    autoFocus
                  />
                </span>
              ) : (
                <span 
                  className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-600'} cursor-pointer hover:underline`}
                  onClick={handleStartEditName}
                  title="Click to edit name"
                >
                  {userName}
                </span>
              )}!
              <div className="inline-flex items-center gap-2 ml-2">
                {isModerator && <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded shadow-sm">Moderator</span>}
                {isObserver && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Observer</span>}
                {!isModerator && !isObserver && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Voter</span>}
                {!isModerator && (
                  <span className="relative inline-block">
                    <button
                      onClick={() => setShowTypeMenu(!showTypeMenu)}
                      className={`px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} text-xs rounded transition-colors flex items-center gap-1`}
                      title="Change user type"
                    >
                      <UserCog size={12} />
                      <span className="hidden sm:inline">Change Type</span>
                    </button>
                    {showTypeMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowTypeMenu(false)}
                        />
                        <div className={`absolute left-0 mt-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'} py-1 z-20`}>
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
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {!isModerator && !isObserver && (
              <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white'} rounded-lg shadow-xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Select Your Estimate</h2>
                  <div className="flex items-center gap-3">
                    {ticketNumber && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ticket:</span>
                        <span className={`px-2 py-1 text-xs font-mono ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'} rounded font-semibold`}>
                          {ticketNumber}
                        </span>
                      </div>
                    )}
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {votingScale === 'fibonacci' ? 'Fibonacci' : 'T-Shirt Sizing'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {currentScale.map((point) => (
                    <button
                      key={point}
                      onClick={() => handleSelectPoint(point)}
                      className={`aspect-square rounded-lg font-bold text-xl transition-all ${
                        selectedPoint === point
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-105 shadow-lg'
                          : darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      } ${shouldFlicker && selectedPoint === null && (confidenceVotingEnabled ? selectedConfidence === null : true) ? 'animate-flicker' : ''}`}
                    >
                      {point}
                    </button>
                  ))}
                </div>
                
                {confidenceVotingEnabled && (
                  <div className="mt-6">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>
                      How confident are you?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleSelectConfidence('high')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          selectedConfidence === 'high'
                            ? 'bg-green-600 text-white scale-105 shadow-lg'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                        }`}
                      >
                        🟢 High
                      </button>
                      <button
                        onClick={() => handleSelectConfidence('medium')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          selectedConfidence === 'medium'
                            ? 'bg-yellow-600 text-white scale-105 shadow-lg'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                        }`}
                      >
                        🟡 Medium
                      </button>
                      <button
                        onClick={() => handleSelectConfidence('low')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          selectedConfidence === 'low'
                            ? 'bg-red-600 text-white scale-105 shadow-lg'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                        }`}
                      >
                        🔴 Low
                      </button>
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      High: Very familiar • Medium: Some uncertainty • Low: Just guessing
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 ${!isModerator && !isObserver ? 'mt-6' : ''}`}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Votes</h2>
                {isModerator && (
                  <div className="flex gap-2 items-center flex-wrap">
                    <input
                      type="text"
                      value={ticketNumber}
                      onChange={(e) => updateTicketNumber(e.target.value)}
                      placeholder="Ticket # (optional)"
                      className={`px-3 py-2 border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-40`}
                    />
                    <input
                      type="text"
                      value={determinedPoints}
                      onChange={(e) => updateDeterminedPoints(e.target.value)}
                      placeholder="Final Estimate"
                      className={`px-3 py-2 border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-32`}
                    />
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                      title="View history"
                    >
                      <History size={16} />
                      History ({sessionHistory.length})
                    </button>
                    <button
                      onClick={toggleVotingScale}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                      title="Switch voting scale"
                    >
                      <RefreshCw size={16} />
                      {votingScale === 'fibonacci' ? 'Switch to T-Shirt' : 'Switch to Fibonacci'}
                    </button>
                    <button
                      onClick={toggleConfidenceVoting}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        confidenceVotingEnabled
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-400 text-white hover:bg-gray-500'
                      }`}
                      title="Toggle confidence voting"
                    >
                      {confidenceVotingEnabled ? '✓ Confidence: ON' : 'Confidence: OFF'}
                    </button>
                    <div className={`text-sm ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'} px-3 py-2 rounded font-mono`}>
                      ⏱️ {formatTime(elapsedTime)}
                    </div>
                    <button
                      onClick={handleReveal}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
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
                {sortedParticipants.map((participant) => {
                  const hasVoted = participant.points !== null && 
                                   participant.points !== undefined && 
                                   participant.points !== '';
                  
                  const isOutlier = revealed && stats && stats.outliers && 
                                   typeof participant.points === 'number' &&
                                   stats.outliers.includes(participant.points);
                  
                  return (
                    <div
                      key={participant.id}
                      className={`rounded-lg p-4 text-center border-2 relative ${revealed ? 'card-flip-enter' : ''} ${
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
                          hasVoted ? darkMode ? 'text-blue-400' : 'text-blue-600' : darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {revealed
                            ? (
                              <div className="flex flex-col items-center gap-1">
                                <span>{hasVoted ? participant.points : '—'}</span>
                                {hasVoted && confidenceVotingEnabled && participant.confidence && (
                                  <span className="text-xs">
                                    {participant.confidence === 'high' ? '🟢' : 
                                     participant.confidence === 'medium' ? '🟡' : '🔴'}
                                  </span>
                                )}
                              </div>
                            )
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
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-white to-slate-50'} rounded-lg shadow-xl p-4 sticky top-4`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Statistics</h2>
              <div className="space-y-3">
                <div className={darkMode ? 'bg-blue-900 rounded-lg p-3 shadow-md' : 'bg-blue-50 rounded-lg p-3 shadow-md'}>
                  <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-600'} mb-1`}>Voted</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {votingParticipants.filter(p => p.points !== null && p.points !== undefined && p.points !== '').length} / {votingParticipants.length}
                  </p>
                </div>
                {revealed && stats && (
                  <>
                    <div className={`rounded-lg p-3 shadow-md ${
                      stats.spreadType === 'tight' ? darkMode ? 'bg-green-900' : 'bg-green-50' :
                      stats.spreadType === 'moderate' ? darkMode ? 'bg-yellow-900' : 'bg-yellow-50' :
                      darkMode ? 'bg-red-900' : 'bg-red-50'
                    }`}>
                      <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-600'} mb-1`}>
                        {confidenceVotingEnabled && stats.weightedAverage ? 'Traditional Avg' : 'Average'}
                      </p>
                      <p className={`text-xl font-bold ${
                        stats.spreadType === 'tight' ? darkMode ? 'text-green-400' : 'text-green-600' :
                        stats.spreadType === 'moderate' ? darkMode ? 'text-yellow-400' : 'text-yellow-600' :
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`}>{stats.average}</p>
                    </div>
                    {confidenceVotingEnabled && stats.weightedAverage && (
                      <div className={`rounded-lg p-3 shadow-md ${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'}`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-600'} mb-1`}>Weighted Avg</p>
                        <p className={`text-xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          {stats.weightedAverage} → {stats.weightedClosest}
                        </p>
                      </div>
                    )}
                    {stats.median && (
                      <div className={`rounded-lg p-3 shadow-md ${darkMode ? 'bg-teal-900' : 'bg-teal-50'}`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-600'} mb-1`}>Median</p>
                        <p className={`text-xl font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                          {stats.median} → {stats.medianClosest}
                        </p>
                      </div>
                    )}
                    <div className={darkMode ? 'bg-orange-900 rounded-lg p-3 shadow-md' : 'bg-orange-50 rounded-lg p-3'}>
                      <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-600'} mb-1`}>Suggested</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                        {stats.suggestedEstimate}
                      </p>
                    </div>
                    {stats.consensus && (
                      <div className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-lg p-2 shadow-md border ${darkMode ? 'border-green-600' : 'border-green-400'}`}>
                        <p className={`text-xs text-center font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>🎉 Consensus!</p>
                      </div>
                    )}
                    {stats.warnings && stats.warnings.length > 0 && (
                      <div className="space-y-1">
                        {stats.warnings.map((warning, idx) => (
                          <div 
                            key={idx}
                            className={`rounded-lg p-2 shadow-md border ${
                              warning.type === 'uncertainty' ? 
                                darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-300' :
                              warning.type === 'disagreement' ?
                                darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-300' :
                                darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-300'
                            }`}
                          >
                            <p className={`text-xs font-semibold ${
                              warning.type === 'uncertainty' ? 
                                darkMode ? 'text-yellow-300' : 'text-yellow-700' :
                              warning.type === 'disagreement' ?
                                darkMode ? 'text-red-300' : 'text-red-700' :
                                darkMode ? 'text-blue-300' : 'text-blue-600'
                            }`}>
                              {warning.icon} {warning.message}
                            </p>
                            <p className={`text-xs mt-0.5 ${
                              warning.type === 'uncertainty' ? 
                                darkMode ? 'text-yellow-200' : 'text-yellow-600' :
                              warning.type === 'disagreement' ?
                                darkMode ? 'text-red-200' : 'text-red-600' :
                                darkMode ? 'text-blue-200' : 'text-blue-600'
                            }`}>
                              {warning.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {stats.range && (
                      <div className={`rounded-lg p-2 shadow-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Range: <span className="font-bold">{stats.range.min} - {stats.range.max}</span></p>
                      </div>
                    )}
                    {confidenceVotingEnabled && stats.confidenceBreakdown && (
                      <div className={`rounded-lg p-2 shadow-md ${darkMode ? 'bg-cyan-900' : 'bg-cyan-50'}`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-600'} mb-1`}>Confidence</p>
                        <div className={`flex justify-between text-xs font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                          <span>🟢 {stats.confidenceBreakdown.high}</span>
                          <span>🟡 {stats.confidenceBreakdown.medium}</span>
                          <span>🔴 {stats.confidenceBreakdown.low}</span>
                        </div>
                      </div>
                    )}
                    {stats.distribution && stats.distribution.length > 0 && (
                      <div className={`rounded-lg p-2 shadow-md ${darkMode ? 'bg-purple-900' : 'bg-purple-50'}`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-600'} mb-2 font-semibold`}>Distribution</p>
                        <div className="space-y-1">
                          {stats.distribution.map(([vote, count]) => {
                            const barWidth = (count / stats.maxCount) * 100;
                            return (
                              <div key={vote} className="flex items-center gap-1">
                                <span className={`text-xs font-bold w-6 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                  {vote}
                                </span>
                                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                  <div 
                                    className={`h-full ${darkMode ? 'bg-purple-500' : 'bg-purple-400'} transition-all duration-300 flex items-center justify-end pr-1`}
                                    style={{ width: `${barWidth}%` }}
                                  >
                                    <span className="text-xs font-semibold text-white">{count}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => setShowHistory(false)}
            />
            <div className={`${darkMode ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'} rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col relative z-10 modal-enter border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Session History
                  </h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button
                    onClick={copyHistoryToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                  >
                    <FileText size={16} />
                    Copy to Clipboard
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {sessionHistory.length === 0 ? (
                  <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} py-8`}>
                    No voting history yet. Complete a round to see it here!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {sessionHistory.map((entry, index) => (
                      <div
                        key={entry.timestamp}
                        className={`p-4 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 mr-4">
                            {editingHistoryId === entry.timestamp ? (
                              <input
                                type="text"
                                value={editingTicketValue}
                                onChange={(e) => setEditingTicketValue(e.target.value)}
                                onBlur={() => updateHistoryTicket(entry.timestamp, editingTicketValue)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateHistoryTicket(entry.timestamp, editingTicketValue);
                                  } else if (e.key === 'Escape') {
                                    setEditingHistoryId(null);
                                    setEditingTicketValue('');
                                  }
                                }}
                                className={`font-bold text-lg px-2 py-1 border ${
                                  darkMode 
                                    ? 'bg-gray-600 border-blue-500 text-white' 
                                    : 'bg-white border-blue-500 text-gray-800'
                                } rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full`}
                                autoFocus
                              />
                            ) : (
                              <h3 
                                className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'} cursor-pointer hover:text-blue-500`}
                                onClick={() => {
                                  setEditingHistoryId(entry.timestamp);
                                  setEditingTicketValue(entry.ticketId);
                                }}
                                title="Click to edit ticket"
                              >
                                {entry.ticketId}
                              </h3>
                            )}
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(entry.timestamp).toLocaleString()} • Duration: {Math.floor(entry.duration / 60)}:{(entry.duration % 60).toString().padStart(2, '0')}
                            </p>
                          </div>
                          {editingEstimateId === entry.timestamp ? (
                            <input
                              type="text"
                              value={editingEstimateValue}
                              onChange={(e) => setEditingEstimateValue(e.target.value)}
                              onBlur={() => updateHistoryEstimate(entry.timestamp, editingEstimateValue)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateHistoryEstimate(entry.timestamp, editingEstimateValue);
                                } else if (e.key === 'Escape') {
                                  setEditingEstimateId(null);
                                  setEditingEstimateValue('');
                                }
                              }}
                              className={`font-bold text-lg px-2 py-1 border ${
                                darkMode 
                                  ? 'bg-gray-600 border-blue-500 text-white' 
                                  : 'bg-white border-blue-500 text-gray-800'
                              } rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center w-20`}
                              autoFocus
                            />
                          ) : (
                            <div 
                              className={`px-3 py-1 rounded font-bold text-lg cursor-pointer hover:ring-2 hover:ring-blue-500 ${
                                darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                              }`}
                              onClick={() => {
                                setEditingEstimateId(entry.timestamp);
                                setEditingEstimateValue(entry.finalEstimate);
                              }}
                              title="Click to edit estimate"
                            >
                              {entry.finalEstimate}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {entry.votes.map((vote, vIndex) => (
                            <span
                              key={vIndex}
                              className={`px-3 py-1 rounded text-sm ${
                                darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {vote.name}: <strong>{vote.vote}</strong>
                            </span>
                          ))}
                        </div>
                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {entry.participantCount} participants • {entry.votingScale}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-6 text-center">
        <p 
          className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} cursor-pointer underline`}
          onClick={() => setShowReleaseNotes(true)}
          title="View release notes"
        >
          Scrumptious v{APP_VERSION}
        </p>
      </footer>

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowLeaveConfirm(false)}
          />
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full relative z-10`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
              Leave Session?
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Are you sure you want to leave this session? You'll be removed from the participant list.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveSession}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Leave Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Release Notes Modal */}
      {showReleaseNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowReleaseNotes(false)}
          />
          <div className={`${darkMode ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'} rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col relative z-10 modal-enter border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Release Notes
                </h2>
                <button
                  onClick={() => setShowReleaseNotes(false)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {Object.entries(RELEASE_NOTES).map(([version, notes]) => (
                  <div
                    key={version}
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Version {version}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notes.date} • {notes.type}
                        </p>
                      </div>
                      {version === APP_VERSION && (
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {notes.changes.map((change, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}