import React, { useState, useEffect, useRef } from 'react';
import { Users, Eye, EyeOff, RotateCcw, Copy, Check, ArrowRight, RefreshCw, Moon, Sun, UserX, UserCog, History, Download, FileText, Share2, Clock, MessageSquare, ChevronRight, X, ThumbsUp } from 'lucide-react';

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
  'glad-sad-mad': {
    name: 'Glad/Sad/Mad',
    columns: [
      { id: 'glad', label: 'Glad', color: '#10b981', icon: '😊', prompt: 'What made you happy?' },
      { id: 'sad', label: 'Sad', color: '#3b82f6', icon: '😢', prompt: 'What disappointed you?' },
      { id: 'mad', label: 'Mad', color: '#ef4444', icon: '😠', prompt: 'What frustrated you?' }
    ]
  },
  'www-wdgw': {
    name: 'Went Well / To Improve',
    columns: [
      { id: 'well', label: 'Went Well', color: '#10b981', icon: '✅', prompt: 'What went well?' },
      { id: 'improve', label: 'To Improve', color: '#f59e0b', icon: '📈', prompt: 'What can we improve?' }
    ]
  },
  '4ls': {
    name: '4Ls (Liked/Learned/Lacked/Longed For)',
    columns: [
      { id: 'liked', label: 'Liked', color: '#10b981', icon: '❤️', prompt: 'What did you like?' },
      { id: 'learned', label: 'Learned', color: '#3b82f6', icon: '💡', prompt: 'What did you learn?' },
      { id: 'lacked', label: 'Lacked', color: '#f59e0b', icon: '⚠️', prompt: 'What was missing?' },
      { id: 'longed', label: 'Longed For', color: '#8b5cf6', icon: '✨', prompt: 'What did you wish for?' }
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

const APP_VERSION = "3.2.0";
const RELEASE_NOTES = {
  "3.2.0": {
    date: "October 27, 2025",
    type: "Minor Release",
    changes: [
      "🎯 Phase 2 now uses drag-and-drop for intuitive grouping",
      "🗳️ Vote on both individual items and groups in Phase 2",
      "✏️ Click group names to rename them (anyone can edit)",
      "↩️ Drag items out of groups to separate them",
      "🔄 Drag groups onto each other to merge them",
      "🎨 Groups stay organized within their original columns",
      "👆 Items from different columns can be grouped together"
    ]
  },
  "3.1.0": {
    date: "October 27, 2025",
    type: "Minor Release",
    changes: [
      "✨ Phase 1 now displays retro format columns (Start/Stop/Continue, etc.)",
      "🎨 Column colors persist through all 3 phases for easy tracking",
      "🏷️ Items maintain their column identity with color-coded borders and icons",
      "📍 Visual indicators show which column each item originated from"
    ]
  },
  "3.0.0": {
    date: "October 23, 2025",
    type: "Major Release",
    changes: [
      "🔄 Added Phased Retrospective with 3 phases: Input → Grouping → Discussion",
      "⏱️ Moderator-controlled countdown timer (1-15 minutes)",
      "🔗 Session sharing with QR codes and copy link",
      "🗳️ Anonymous inputs with voting capability",
      "👥 Collaborative grouping - anyone can create or add to groups",
      "💬 Discussion phase with comments on grouped items",
      "📊 CSV export of complete retrospective data",
      "🎨 Four retrospective formats available"
    ]
  },
  "2.9.0": {
    date: "October 23, 2025",
    type: "Minor Release",
    changes: [
      "🔄 Added Retrospective functionality",
      "🎨 Rebranded to 'Scrumptious: Agile Ceremonies, Simplified",
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

const PieChart = ({ stats, darkMode }) => {
  if (!stats || !stats.distribution) return null;
  
  const total = stats.distribution.reduce((sum, [_, count]) => sum + count, 0);
  let currentAngle = -90; // Start at top
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
  
  return (
    <div className="flex flex-col items-center gap-6">
      <svg width="320" height="320" viewBox="0 0 200 200" className="drop-shadow-lg pie-chart-grow">
        {stats.distribution.map(([vote, count], index) => {
          const percentage = (count / total) * 100;
          const angle = (percentage / 100) * 360;
          
          // Special case: if this is 100% (consensus), draw a full circle
          if (angle >= 359.9) {
            return (
              <g key={vote}>
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:opacity-80"
                />
                <text
                  x="100"
                  y="100"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                >
                  {vote}
                </text>
              </g>
            );
          }
          
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = 100 + 80 * Math.cos(startRad);
          const y1 = 100 + 80 * Math.sin(startRad);
          const x2 = 100 + 80 * Math.cos(endRad);
          const y2 = 100 + 80 * Math.sin(endRad);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
          
          // Calculate label position
          const midAngle = (startAngle + endAngle) / 2;
          const midRad = (midAngle * Math.PI) / 180;
          const labelX = 100 + 50 * Math.cos(midRad);
          const labelY = 100 + 50 * Math.sin(midRad);
          
          currentAngle = endAngle;
          
          return (
            <g key={vote}>
              <path
                d={path}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 hover:opacity-80"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="16"
                fontWeight="bold"
              >
                {vote}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {stats.distribution.map(([vote, count], index) => (
          <div key={vote} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {vote}: {count} ({((count / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HowItWorks = ({ darkMode, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className={`${darkMode ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'} rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col relative z-10 modal-enter border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              How It Works
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Overview Section */}
            <section>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Overview
              </h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Scrumptious is your all-in-one agile ceremony toolkit. Whether you're running Planning Poker estimation sessions or facilitating team retrospectives, Scrumptious provides a collaborative, real-time environment that works seamlessly across devices.
              </p>
              <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-1">1️⃣</div>
                  <div className="font-semibold">Create a session</div>
                  <div className="text-sm">Choose your ceremony type</div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-1">2️⃣</div>
                  <div className="font-semibold">Share instantly</div>
                  <div className="text-sm">QR codes or links</div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-1">3️⃣</div>
                  <div className="font-semibold">Facilitate</div>
                  <div className="text-sm">Real-time collaboration</div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-1">4️⃣</div>
                  <div className="font-semibold">Export</div>
                  <div className="text-sm">Save your results</div>
                </div>
              </div>
            </section>

            {/* Planning Poker Section */}
            <section className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🃏 Planning Poker
              </h3>
              
              <div className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <h4 className="font-semibold mb-2">What is Planning Poker?</h4>
                <p className="text-sm">
                  Planning Poker is a consensus-based estimation technique where team members simultaneously reveal their estimates to avoid anchoring bias. Scrumptious adds confidence weighting and analytics to help teams reach better consensus faster.
                </p>
              </div>

              <details className={`mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <summary className={`font-semibold cursor-pointer ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Setting up a session
                </summary>
                <ul className={`mt-3 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Choose Planning Poker from the home screen</li>
                  <li>• Select your card deck (Fibonacci, T-shirt sizes, or custom values)</li>
                  <li>• Generate a unique session code or use the QR code for instant team access</li>
                  <li>• Set yourself as moderator or join as a participant</li>
                </ul>
              </details>

              <details className={`mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <summary className={`font-semibold cursor-pointer ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Running the estimation
                </summary>
                <ol className={`mt-3 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li><strong>1. Present the story</strong> - Moderator shares what's being estimated</li>
                  <li><strong>2. Team votes</strong> - Each participant selects their estimate card and confidence level</li>
                  <li><strong>3. Reveal</strong> - All votes are revealed simultaneously to prevent bias</li>
                  <li><strong>4. Discuss</strong> - Team discusses differences, especially outliers</li>
                  <li><strong>5. Re-vote if needed</strong> - Repeat until consensus is reached</li>
                  <li><strong>6. Record</strong> - Moderator records the final estimate</li>
                </ol>
              </details>

              <details className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <summary className={`font-semibold cursor-pointer ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Key features
                </summary>
                <ul className={`mt-3 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• <strong>Confidence weighting:</strong> Participants indicate how confident they are in their estimates</li>
                  <li>• <strong>Consensus detection:</strong> Automatic highlighting when the team reaches agreement</li>
                  <li>• <strong>Observer mode:</strong> Stakeholders can watch without influencing votes</li>
                  <li>• <strong>Vote history:</strong> Track all rounds of voting for each story</li>
                  <li>• <strong>Mobile optimized:</strong> Works seamlessly on phones, tablets, and desktops</li>
                </ul>
              </details>
            </section>

            {/* Retrospectives Section */}
            <section className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🔄 Retrospectives
              </h3>
              
              <div className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <h4 className="font-semibold mb-2">What are Retrospectives?</h4>
                <p className="text-sm">
                  Retrospectives are regular team reflections where you discuss what went well, what didn't, and what to improve. Scrumptious supports multiple retrospective formats with structured workflows to keep your retros focused and productive.
                </p>
              </div>

              <details className={`mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <summary className={`font-semibold cursor-pointer ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Choosing your format
                </summary>
                <div className={`mt-3 space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <strong>Start/Stop/Continue</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Start: What should we begin doing?</li>
                      <li>• Stop: What should we stop doing?</li>
                      <li>• Continue: What's working that we should keep doing?</li>
                    </ul>
                  </div>
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <strong>Glad/Sad/Mad</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Glad: What made us happy or proud?</li>
                      <li>• Sad: What disappointed or concerned us?</li>
                      <li>• Mad: What frustrated us or needs immediate attention?</li>
                    </ul>
                  </div>
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <strong>Went Well/To Improve</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Went Well: Celebrate successes and wins</li>
                      <li>• To Improve: Identify areas for growth</li>
                    </ul>
                  </div>
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <strong>4Ls: Liked/Learned/Lacked/Longed For</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Liked: What did we enjoy or appreciate?</li>
                      <li>• Learned: What insights did we gain?</li>
                      <li>• Lacked: What was missing or insufficient?</li>
                      <li>• Longed For: What do we wish we had?</li>
                    </ul>
                  </div>
                </div>
              </details>

              <details className={`mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <summary className={`font-semibold cursor-pointer ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  The phased workflow
                </summary>
                <div className={`mt-3 space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <strong>Phase 1: Brainstorming ⏱️</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Team members privately add their thoughts to each category</li>
                      <li>• Set a timer (default 5 minutes, customizable)</li>
                      <li>• All submissions are anonymous during this phase</li>
                      <li>• Ideas appear in real-time as teammates add them</li>
                    </ul>
                  </div>
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <strong>Phase 2: Grouping 🎯</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Review all submitted ideas together</li>
                      <li>• Drag and drop similar items to group related themes</li>
                      <li>• Discuss and refine as you organize</li>
                      <li>• Identify patterns and common threads</li>
                      <li>• Optional timer to maintain focus</li>
                    </ul>
                  </div>
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <strong>Phase 3: Voting 🗳️</strong>
                    <ul className="ml-4 mt-1">
                      <li>• Each team member gets a set number of votes (customizable)</li>
                      <li>• Vote on which grouped themes or items are most important</li>
                      <li>• Real-time vote tallies with pie chart visualization</li>
                      <li>• Use results to prioritize action items</li>
                    </ul>
                  </div>
                </div>
              </details>

              <details className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <summary className={`font-semibold cursor-pointer ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  After the retrospective
                </summary>
                <ul className={`mt-3 space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• <strong>Review results:</strong> See voting outcomes with visual analytics</li>
                  <li>• <strong>Export data:</strong> Download retrospective results as CSV for documentation</li>
                  <li>• <strong>Action tracking:</strong> Use voting results to prioritize follow-up items</li>
                </ul>
              </details>
            </section>

            {/* Tips Section */}
            <section className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                💡 Tips for Success
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>For Planning Poker:</h4>
                  <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• Encourage discussion of outlier estimates before re-voting</li>
                    <li>• Use confidence levels to identify when someone needs more information</li>
                    <li>• Keep stories small enough to estimate in a single session</li>
                    <li>• Let the team decide when consensus is "good enough"</li>
                  </ul>
                </div>
                
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>For Retrospectives:</h4>
                  <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• Set a positive, blameless tone at the start</li>
                    <li>• Actually use the timers - they prevent over-analysis</li>
                    <li>• Focus on actionable outcomes, not just venting</li>
                    <li>• Follow up on action items from previous retros</li>
                    <li>• Rotate formats to keep retrospectives fresh</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Technical Notes */}
            <section className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ⚙️ Technical Notes
              </h3>
              <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• <strong>No accounts required:</strong> Jump right in, no sign-up needed</li>
                <li>• <strong>Browser-based:</strong> Works in any modern browser, no installation</li>
                <li>• <strong>Real-time sync:</strong> Firebase-powered instant updates</li>
                <li>• <strong>Mobile-friendly:</strong> Fully responsive design works on any device</li>
                <li>• <strong>Data privacy:</strong> Sessions are temporary and not permanently stored</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
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
  // Core state
  const [userName, setUserName] = useState('');
  const [isModerator, setIsModerator] = useState(true);
  const [isObserver, setIsObserver] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [db, setDb] = useState(null);
  const [dbModule, setDbModule] = useState(null);
  const [wasRemoved, setWasRemoved] = useState(false);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  
  // Session type state
  const [sessionType, setSessionType] = useState(null);
  const [retroFormat, setRetroFormat] = useState(null);
  const [showFormatSelector, setShowFormatSelector] = useState(false);
  
  // Phased retrospective state
  const [retroPhase, setRetroPhase] = useState('input');
  const [retroInputs, setRetroInputs] = useState([]);
  const [retroGroups, setRetroGroups] = useState([]);
  const [retroComments, setRetroComments] = useState({});
  const [newInputText, setNewInputText] = useState('');
  const [newCommentText, setNewCommentText] = useState({});
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const timerInterval = useRef(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  
  // Column-based retrospective state (from v2.9.0)
  const [retroItems, setRetroItems] = useState({});
  const [selectedColumn, setSelectedColumn] = useState(null);

  // Planning poker state
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [resetTime, setResetTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [votingScale, setVotingScale] = useState('fibonacci');
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
  const [selectedConfidence, setSelectedConfidence] = useState(null);
  const [confidenceVotingEnabled, setConfidenceVotingEnabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);
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

  // Main Firebase sync useEffect
  useEffect(() => {
    if (!sessionId || !db || !dbModule) return;

    const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
    
    const unsubscribe = dbModule.onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const newParticipants = Object.values(data.participants || {});
        setParticipants(newParticipants);
        
        if (data.sessionType) {
          setSessionType(data.sessionType);
        }
        
        // Load retrospective data
        if (data.sessionType === 'retrospective') {
          if (data.retroFormat) {
            setRetroFormat(data.retroFormat);
          }
          if (data.retroPhase) {
            setRetroPhase(data.retroPhase);
          }
          if (data.retroInputs) {
            setRetroInputs(Object.values(data.retroInputs));
          } else {
            setRetroInputs([]);
          }
          if (data.retroGroups) {
            setRetroGroups(Object.values(data.retroGroups));
          } else {
            setRetroGroups([]);
          }
          if (data.retroComments) {
            setRetroComments(data.retroComments);
          } else {
            setRetroComments({});
          }
          if (data.timer) {
            setTimer(data.timer);
            if (data.timer.active && data.timer.startTime) {
              const elapsed = Math.floor((Date.now() - data.timer.startTime) / 1000);
              const remaining = Math.max(0, data.timer.duration * 60 - elapsed);
              setTimeRemaining(remaining);
            }
          }
          // Load column-based retro items
          if (data.retroItems) {
            setRetroItems(data.retroItems);
          }
        }
        // Load planning poker data
        if (data.sessionType === 'estimation' || !data.sessionType) {
          setRevealed(data.revealed || false);
          setShowPieChart(data.revealed || false);
          setVotingScale(data.votingScale || 'fibonacci');
          setConfidenceVotingEnabled(data.confidenceVotingEnabled || false);
          
          if (data.history) {
            const historyArray = Object.values(data.history).sort((a, b) => b.timestamp - a.timestamp);
            setSessionHistory(historyArray);
          }
          
          if (data.currentTicket !== undefined) {
            setTicketNumber(data.currentTicket);
          } else {
            setTicketNumber('');
          }
          
          if (data.determinedPoints) {
            setDeterminedPoints(data.determinedPoints);
          }
          
          if (data.isFirstRound !== undefined) {
            setIsFirstRound(data.isFirstRound);
          }
        }
        
        // Check if current user still exists
        if (currentUserId && hasJoined) {
          if (!data.participants || !data.participants[currentUserId]) {
            if (!wasRemoved) {
              setWasRemoved(true);
            }
            setHasJoined(false);
            setSelectedPoint(null);
            return;
          }
          
          const currentUser = data.participants[currentUserId];
          if (data.sessionType === 'estimation' || !data.sessionType) {
            setSelectedPoint(currentUser.points);
            setSelectedConfidence(confidenceVotingEnabled ? currentUser.confidence : null);
          }
          setIsModerator(currentUser.isModerator || false);
          setIsObserver(currentUser.isObserver || false);
        }
      }
    });

    return () => unsubscribe();
  }, [sessionId, currentUserId, db, dbModule, hasJoined, wasRemoved, confidenceVotingEnabled]);

  // Timer countdown
  useEffect(() => {
    if (!timer?.active || timeRemaining <= 0) {
      if (timerInterval.current) clearInterval(timerInterval.current);
      return;
    }
    
    timerInterval.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval.current);
          if (isModerator && db && dbModule) {
            const sessionRef = dbModule.ref(db, `sessions/${sessionId}/timer`);
            dbModule.update(sessionRef, { active: false });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [timer?.active, timeRemaining, isModerator, db, dbModule, sessionId]);

  useEffect(() => {
    if (sessionId) {
      const currentUrl = window.location.origin + window.location.pathname + '?session=' + sessionId;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [sessionId]);

  // ADD THIS NEW useEffect HERE:
  // Auto-reveal when all participants have voted (except first round)
  useEffect(() => {
    if (!sessionId || !db || !dbModule || isFirstRound || revealed) return;
    
    const votingParticipants = participants.filter(p => !p.isModerator && !p.isObserver);
    if (votingParticipants.length === 0) return;
    
    const allVoted = votingParticipants.every(p => 
      p.points !== null && p.points !== undefined && p.points !== ''
    );
    
    if (allVoted && isModerator) {
      // Auto-reveal after a short delay
      const timer = setTimeout(async () => {
        const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
        await dbModule.update(sessionRef, { revealed: true });
        setShowPieChart(true);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [participants, isFirstRound, revealed, sessionId, db, dbModule, isModerator]);

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
        }
      });
    }
  };

  const handleCreateSession = async (type) => {
    if (!db || !dbModule) return;

    if (type === 'retrospective') {
      setSessionType('retrospective');
      setShowFormatSelector(true);
      return;
    }

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
      retroPhase: 'input',
      participants: {},
      retroInputs: {},
      retroGroups: {},
      retroComments: {},
      retroItems: {},
      createdAt: Date.now()
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
      setWasRemoved(false);
      
      if (!sessionSnapshot.exists()) {
        await dbModule.set(sessionRef, {
          sessionType: 'estimation',
          votingScale: 'fibonacci',
          revealed: false,
          participants: {},
          isFirstRound: true,
          confidenceVotingEnabled: false,
          createdAt: Date.now()
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
  const handleLeaveSession = async () => {
  if (!db || !dbModule || !currentUserId) return;
  
  const participantRef = dbModule.ref(db, `sessions/${sessionId}/participants/${currentUserId}`);
  await dbModule.remove(participantRef);
  
  setHasJoined(false);
  setSessionId('');
  setSelectedPoint(null);
  setShowLeaveConfirm(false);
  setWasRemoved(false);
  setCurrentUserId(null);
  setShowReleaseNotes(false);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
  // Timer functions
  const startTimer = async (minutes) => {
    if (!isModerator || !db || !dbModule) return;
    
    const timerData = {
      active: true,
      duration: minutes,
      startTime: Date.now()
    };
    
    const sessionRef = dbModule.ref(db, `sessions/${sessionId}/timer`);
    await dbModule.set(sessionRef, timerData);
  };

  const stopTimer = async () => {
    if (!isModerator || !db || !dbModule) return;
    
    const sessionRef = dbModule.ref(db, `sessions/${sessionId}/timer`);
    await dbModule.update(sessionRef, { active: false });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Phased retrospective functions
const addRetroInput = async (columnId) => {
  if (!newInputText.trim() || !db || !dbModule || isObserver) return;
  
  const inputId = Date.now().toString();
  const input = {
    id: inputId,
    text: newInputText.trim(),
    author: 'Anonymous',
    columnId: columnId,  
    votes: 0,
    voters: [],
    timestamp: Date.now()
  };
  
  const inputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${inputId}`);
  await dbModule.set(inputRef, input);
  
  setNewInputText('');
  setSelectedColumn(null);  
};

  const toggleRetroVote = async (inputId) => {
    if (!db || !dbModule || isObserver) return;
    
    const input = retroInputs.find(i => i.id === inputId);
    if (!input) return;
    
    const hasVoted = input.voters?.includes(currentUserId);
    const newVotes = hasVoted ? input.votes - 1 : input.votes + 1;
    const newVoters = hasVoted 
      ? (input.voters || []).filter(v => v !== currentUserId)
      : [...(input.voters || []), currentUserId];
    
    const inputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${inputId}`);
    await dbModule.update(inputRef, { votes: newVotes, voters: newVoters });
  };

  const toggleGroupVote = async (groupId) => {
  if (!db || !dbModule || isObserver) return;
  
  const group = retroGroups.find(g => g.id === groupId);
  if (!group) return;
  
  const hasVoted = group.voters?.includes(currentUserId);
  const newVotes = hasVoted ? (group.votes || 0) - 1 : (group.votes || 0) + 1;
  const newVoters = hasVoted 
    ? (group.voters || []).filter(v => v !== currentUserId)
    : [...(group.voters || []), currentUserId];
  
  const groupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${groupId}`);
  await dbModule.update(groupRef, { votes: newVotes, voters: newVoters });
};

const handleDragStart = (e, item, isGroup = false) => {
  setDraggedItem({ ...item, isGroup });
  e.dataTransfer.effectAllowed = 'move';
};

const handleDragOver = (e, targetItem, isGroup = false) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  setDragOverItem({ id: targetItem.id, isGroup });
};

const handleDragLeave = () => {
  setDragOverItem(null);
};

const handleDrop = async (e, targetItem, targetIsGroup) => {
  e.preventDefault();
  if (!draggedItem || !db || !dbModule || isObserver) return;

  // Can't drop on itself
  if (draggedItem.id === targetItem.id && draggedItem.isGroup === targetIsGroup) {
    setDraggedItem(null);
    setDragOverItem(null);
    return;
  }

  // If dropping item onto another item - create new group
  if (!draggedItem.isGroup && !targetIsGroup) {
    const groupId = Date.now().toString();
    const newGroup = {
      id: groupId,
      title: draggedItem.text.substring(0, 50) + (draggedItem.text.length > 50 ? '...' : ''),
      items: [draggedItem, targetItem],
      votes: 0,
      voters: [],
      timestamp: Date.now()
    };

    const groupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${groupId}`);
    await dbModule.set(groupRef, newGroup);

    // Remove both items from inputs
    const draggedInputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${draggedItem.id}`);
    const targetInputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${targetItem.id}`);
    await dbModule.remove(draggedInputRef);
    await dbModule.remove(targetInputRef);

  } else if (!draggedItem.isGroup && targetIsGroup) {
    // Dropping item onto group - add to group
    const group = retroGroups.find(g => g.id === targetItem.id);
    if (!group) return;

    const updatedGroup = {
      ...group,
      items: [...group.items, draggedItem]
    };

    const groupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${targetItem.id}`);
    await dbModule.set(groupRef, updatedGroup);

    // Remove item from inputs
    const inputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${draggedItem.id}`);
    await dbModule.remove(inputRef);

  } else if (draggedItem.isGroup && targetIsGroup) {
    // Merging two groups
    const sourceGroup = retroGroups.find(g => g.id === draggedItem.id);
    const targetGroup = retroGroups.find(g => g.id === targetItem.id);
    if (!sourceGroup || !targetGroup) return;

    const mergedGroup = {
      ...targetGroup,
      items: [...targetGroup.items, ...sourceGroup.items],
      votes: (targetGroup.votes || 0) + (sourceGroup.votes || 0),
      voters: [...new Set([...(targetGroup.voters || []), ...(sourceGroup.voters || [])])]
    };

    const targetGroupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${targetItem.id}`);
    await dbModule.set(targetGroupRef, mergedGroup);

    // Remove source group
    const sourceGroupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${draggedItem.id}`);
    await dbModule.remove(sourceGroupRef);
  }

  setDraggedItem(null);
  setDragOverItem(null);
};

const handleRemoveFromGroup = async (groupId, itemToRemove) => {
  if (!db || !dbModule || isObserver) return;

  const group = retroGroups.find(g => g.id === groupId);
  if (!group) return;

  const remainingItems = group.items.filter(item => item.id !== itemToRemove.id);

  if (remainingItems.length === 1) {
    // Only one item left - convert back to individual item
    const lastItem = remainingItems[0];
    const inputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${lastItem.id}`);
    await dbModule.set(inputRef, lastItem);

    // Remove the group
    const groupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${groupId}`);
    await dbModule.remove(groupRef);
  } else if (remainingItems.length > 1) {
    // Update group with remaining items
    const updatedGroup = {
      ...group,
      items: remainingItems
    };

    const groupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${groupId}`);
    await dbModule.set(groupRef, updatedGroup);
  }

  // Add removed item back to inputs
  const inputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${itemToRemove.id}`);
  await dbModule.set(inputRef, itemToRemove);
};

const handleRenameGroup = async (groupId, newName) => {
  if (!db || !dbModule || !newName.trim()) return;

  const groupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${groupId}`);
  await dbModule.update(groupRef, { title: newName.trim() });

  setEditingGroupId(null);
  setEditingGroupName('');
};

  const createRetroGroup = async (itemId) => {
  if (!db || !dbModule || isObserver) return;
  
  const item = retroInputs.find(i => i.id === itemId);
  if (!item) return;

  const groupId = Date.now().toString();
  const newGroup = {
    id: groupId,
    title: item.text.substring(0, 50) + (item.text.length > 50 ? '...' : ''),
    items: [item],
    votes: 0,
    voters: [],
    timestamp: Date.now()
  };

  const groupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${groupId}`);
  await dbModule.set(groupRef, newGroup);
  
  const inputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${itemId}`);
  await dbModule.remove(inputRef);
};

  const addToRetroGroup = async (groupId, itemId) => {
  if (!db || !dbModule || isObserver) return;
  
  const item = retroInputs.find(i => i.id === itemId);
  const group = retroGroups.find(g => g.id === groupId);
  if (!item || !group) return;

  const updatedGroup = {
    ...group,
    items: [...group.items, item]
  };

  const groupRef = dbModule.ref(db, `sessions/${sessionId}/retroGroups/${groupId}`);
  await dbModule.set(groupRef, updatedGroup);
  
  const inputRef = dbModule.ref(db, `sessions/${sessionId}/retroInputs/${itemId}`);
  await dbModule.remove(inputRef);
};
  const addRetroComment = async (groupId) => {
    if (!newCommentText[groupId]?.trim() || !db || !dbModule || isObserver) return;

    const comment = {
      id: Date.now().toString(),
      text: newCommentText[groupId],
      author: userName,
      timestamp: Date.now()
    };

    const commentRef = dbModule.ref(db, `sessions/${sessionId}/retroComments/${groupId}/${comment.id}`);
    await dbModule.set(commentRef, comment);

    setNewCommentText({ ...newCommentText, [groupId]: '' });
  };

  const advanceRetroPhase = async () => {
    if (!isModerator || !db || !dbModule) return;
    
    const nextPhase = retroPhase === 'input' ? 'grouping' : 'discussion';
    const sessionRef = dbModule.ref(db, `sessions/${sessionId}`);
    await dbModule.update(sessionRef, { retroPhase: nextPhase });
  };

  const exportRetroToCSV = () => {
    let csv = 'Retrospective Export\n\n';
    csv += `Session: ${sessionId}\n`;
    csv += `Format: ${RETRO_FORMATS[retroFormat]?.name}\n`;
    csv += `Date: ${new Date().toLocaleString()}\n\n`;

    csv += 'Groups and Items\n';
    csv += 'Group Title,Item,Votes\n';
    
    retroGroups.forEach(group => {
      group.items.forEach((item, idx) => {
        csv += `"${idx === 0 ? group.title : ''}","${item.text}",${item.votes}\n`;
      });
      csv += `,,Total: ${group.votes}\n\n`;
    });

    csv += '\nComments\n';
    csv += 'Group,Comment,Author,Timestamp\n';
    
    Object.entries(retroComments).forEach(([groupId, comments]) => {
      const group = retroGroups.find(g => g.id === groupId);
      Object.values(comments).forEach(comment => {
        csv += `"${group?.title || ''}","${comment.text}",${comment.author},${new Date(comment.timestamp).toLocaleString()}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retro-${sessionId}-${Date.now()}.csv`;
    a.click();
  };

  // Column-based retrospective functions (from v2.9.0)
  const handleAddRetroItem = async (columnId) => {
    if (!newInputText.trim() || !db || !dbModule || !currentUserId) return;
    
    const itemId = Date.now().toString();
    const item = {
      id: itemId,
      text: newInputText.trim(),
      authorId: currentUserId,
      authorName: userName,
      columnId: columnId,
      timestamp: Date.now(),
      votes: 0
    };
    
    const itemRef = dbModule.ref(db, `sessions/${sessionId}/retroItems/${itemId}`);
    await dbModule.set(itemRef, item);
    
    setNewInputText('');
    setSelectedColumn(null);
  };

  const handleDeleteRetroItem = async (itemId) => {
    if (!db || !dbModule) return;
    
    const itemRef = dbModule.ref(db, `sessions/${sessionId}/retroItems/${itemId}`);
    await dbModule.remove(itemRef);
  };

  const handleVoteRetroItem = async (itemId) => {
    if (!db || !dbModule) return;
    
    const item = retroItems[itemId];
    if (!item) return;
    
    const newVotes = (item.votes || 0) + 1;
    
    const itemRef = dbModule.ref(db, `sessions/${sessionId}/retroItems/${itemId}`);
    await dbModule.update(itemRef, { votes: newVotes });
  };
  // Planning poker functions
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
  
  // Show pie chart when revealing, hide when hiding
if (!revealed) {
  setShowPieChart(true);
} else {
  setShowPieChart(false);
}
  
  await dbModule.update(sessionRef, updates);
};

  const handleReset = async () => {
    if (!db || !dbModule) return;
    
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
    
    const votingParticipants = participants.filter(p => !p.isModerator && !p.isObserver);
    
    if (revealed && votingParticipants.length > 0) {
      const votedParticipants = votingParticipants.filter(p => p.points !== null && p.points !== undefined && p.points !== '');
      
      if (votedParticipants.length > 0) {
        const stats = calculateAverage();
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
    setShowPieChart(false);
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
    
    // Filter out "No QA" votes for consensus check
    const votesForConsensus = allVotes.filter(v => v !== 'No QA');
    const uniqueVotes = new Set(votesForConsensus);
    const consensus = uniqueVotes.size === 1 && votesForConsensus.length > 1;
      
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
      
      const confidentVoters = confidenceBreakdown.high + confidenceBreakdown.medium;
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

  // Sorted participants helper
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.isModerator && !b.isModerator) return -1;
    if (!a.isModerator && b.isModerator) return 1;
    if (!a.isModerator && !a.isObserver && (b.isModerator || b.isObserver)) return -1;
    if ((a.isModerator || a.isObserver) && !b.isModerator && !b.isObserver) return 1;
    if (a.isObserver && !b.isObserver && !b.isModerator) return 1;
    if (!a.isObserver && b.isObserver && !a.isModerator) return -1;
    
    return a.name.localeCompare(b.name);
  });
  // Loading state
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

  // Landing page
  if (!sessionId) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-slate-100'} flex items-center justify-center p-4`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 max-w-md w-full`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4 relative">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>scrumptious</h1>
              <button
                onClick={toggleDarkMode}
                className={`absolute right-0 p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Your agile ceremony toolkit</p>
          </div>
          
          <div className="space-y-4">
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
                placeholder="Enter Session ID"
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
          onClick={() => setShowReleaseNotes(true)}
          className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} cursor-pointer underline`}
          title="View release notes"
        >
          scrumptious v{APP_VERSION}
        </p>
      </div>
    </div>
    
    {/* Format Selector Modal */}
    {showFormatSelector && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div 
          className="absolute inset-0" 
          onClick={() => setShowFormatSelector(false)}
        />
        <div className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} rounded-lg shadow-2xl max-w-2xl w-full relative z-10`}>
          <div className="p-6 border-b">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Choose Retrospective Format
            </h2>
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
    <div>
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Release Notes
      </h2>
      <button
        onClick={() => {
          setShowReleaseNotes(false);
          setShowHowItWorks(true);
        }}
        className={`text-sm mt-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}
      >
        How It Works →
      </button>
    </div>
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

      {/* How It Works Modal */}
      {showHowItWorks && (
        <HowItWorks darkMode={darkMode} onClose={() => setShowHowItWorks(false)} />
      )}
    </div>
);
}

  // Join page
  if (!hasJoined) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-slate-100'} flex items-center justify-center p-4`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 max-w-md w-full`}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4 relative">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>scrumptious</h1>
              <button
                onClick={toggleDarkMode}
                className={`absolute right-0 p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Session ID:</p>
              <code className={`${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded font-mono text-lg font-bold`}>{sessionId}</code>
              <button
                onClick={copySessionId}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {showCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />}
              </button>
            </div>
            
            {wasRemoved && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">
                  ⚠️ You have been removed from the session.
                </p>
              </div>
            )}
            
            {qrCodeUrl && (
              <div className="mb-4 flex flex-col items-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Scan to join:</p>
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
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
  {sessionType !== 'retrospective' && (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isObserver}
        onChange={(e) => {
          setIsObserver(e.target.checked);
          if (e.target.checked) setIsModerator(false);
        }}
        className="w-4 h-4 text-blue-600 rounded"
      />
      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Observer</span>
    </label>
  )}
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={isModerator}
      onChange={(e) => {
        setIsModerator(e.target.checked);
        if (e.target.checked) setIsObserver(false);
      }}
      className="w-4 h-4 text-blue-600 rounded"
    />
    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Moderator</span>
  </label>
</div>
            
            <button
  onClick={handleJoin}
  disabled={!userName.trim()}
  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
>
  Join Session
</button>
          </div>
        </div>
      </div>
    );
  }

  // Get current retro format
  const currentRetroFormat = retroFormat ? RETRO_FORMATS[retroFormat] : null;
  // RETROSPECTIVE SESSION VIEW with phased approach
  if (sessionType === 'retrospective' && retroFormat && currentRetroFormat && retroPhase) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50'} p-4`}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in { animation: fadeIn 0.3s ease-out; }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .modal-enter { animation: slideUp 0.3s ease-out; }
        `}</style>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 mb-6`}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Retrospective: {currentRetroFormat.name}
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Session: <code className={`font-mono ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{sessionId}</code>
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                  
                  {isModerator && retroPhase === 'discussion' && (
                    <button
                      onClick={exportRetroToCSV}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Download size={18} />
                      Export
                    </button>
                  )}
                  
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
                    Leave
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className={`${darkMode ? 'text-gray-100' : 'text-gray-600'} text-sm`}>
                <span>Welcome, </span>
                {isEditingName ? (
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
                    } rounded text-sm`}
                    autoFocus
                  />
                ) : (
                  <span 
                    className={`font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-600'} cursor-pointer hover:underline`}
                    onClick={handleStartEditName}
                  >
                    {userName}
                  </span>
                )}!
                <div className="inline-flex items-center gap-2 ml-2">
                  {isModerator && <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded">Moderator</span>}
                  {isObserver && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Observer</span>}
                  {!isModerator && !isObserver && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Participant</span>}
                  
                  {!isModerator && sessionType !== 'retrospective' && (
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
              {/* Phase Indicator */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className={`flex items-center gap-2 ${retroPhase === 'input' ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${retroPhase === 'input' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span>Input</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
                <div className={`flex items-center gap-2 ${retroPhase === 'grouping' ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${retroPhase === 'grouping' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span>Grouping</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
                <div className={`flex items-center gap-2 ${retroPhase === 'discussion' ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${retroPhase === 'discussion' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span>Discussion</span>
                </div>

                {isModerator && retroPhase !== 'discussion' && (
                  <button 
                    onClick={advanceRetroPhase}
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next Phase →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Timer Control */}
{retroPhase === 'input' && (isModerator || timer?.active) && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-4 mb-6`}>
              <div className="flex items-center gap-4">
                <Clock size={20} className="text-gray-600" />
                
                {!timer?.active ? (
  <div className="flex gap-2 flex-wrap">
    {[1,2,3,4,5,10,15].map(m => (
      <button
        key={m}
        onClick={() => startTimer(m)}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        {m} min
      </button>
    ))}
  </div>
) : (
  <>
    <div className="text-2xl font-mono font-bold text-purple-600">
      {formatTime(timeRemaining)}
    </div>
    {isModerator && (
      <button 
        onClick={stopTimer}
        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Stop
      </button>
    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Phase Content */}
          {retroPhase === 'input' && (
  <div className={`grid grid-cols-1 md:grid-cols-${currentRetroFormat.columns.length >= 4 ? '2' : currentRetroFormat.columns.length} gap-4`}>
    {currentRetroFormat.columns.map(column => {
      const columnItems = retroInputs.filter(item => item.columnId === column.id);
      
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
            {columnItems.map(item => (
              <div
                key={item.id}
                className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                } border-l-4`}
                style={{ borderLeftColor: column.color }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`flex-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {item.text}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Anonymous
                  </span>
                  {!isObserver && (
                    <button
                      onClick={() => toggleRetroVote(item.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        item.voters?.includes(currentUserId)
                          ? 'bg-purple-600 text-white' 
                          : darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <ThumbsUp size={14} />
                      {item.votes}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
)}
          {retroPhase === 'grouping' && (
  <div className={`grid grid-cols-1 md:grid-cols-${currentRetroFormat.columns.length >= 4 ? '2' : currentRetroFormat.columns.length} gap-4`}>
    {currentRetroFormat.columns.map(column => {
      const columnItems = retroInputs.filter(item => item.columnId === column.id);
      const columnGroups = retroGroups.filter(group => {
        // A group belongs to a column if its first item is from that column
        return group.items.length > 0 && group.items[0].columnId === column.id;
      });
      
      return (
        <div
          key={column.id}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-4 min-h-[400px]`}
          style={{ borderTop: `4px solid ${column.color}` }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{column.icon}</span>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {column.label}
            </h3>
            <span className={`ml-auto text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {columnItems.length + columnGroups.length} items
            </span>
          </div>

          <div className="space-y-3">
            {/* Individual Items */}
            {columnItems.map(item => (
              <div
                key={item.id}
                draggable={!isObserver}
                onDragStart={(e) => handleDragStart(e, item, false)}
                onDragOver={(e) => handleDragOver(e, item, false)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item, false)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  !isObserver ? 'cursor-move' : ''
                } ${
                  dragOverItem?.id === item.id && !dragOverItem?.isGroup
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                    : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                } border-l-4`}
                style={{ borderLeftColor: column.color }}
              >
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {item.text}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Anonymous
                  </span>
                  {!isObserver && (
                    <button
                      onClick={() => toggleRetroVote(item.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                        item.voters?.includes(currentUserId)
                          ? 'bg-purple-600 text-white scale-110' 
                          : darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <ThumbsUp size={12} />
                      {item.votes || 0}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Groups */}
            {columnGroups.map(group => (
              <div
                key={group.id}
                draggable={!isObserver}
                onDragStart={(e) => handleDragStart(e, group, true)}
                onDragOver={(e) => handleDragOver(e, group, true)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, group, true)}
                className={`border-2 rounded-lg p-3 transition-all ${
                  !isObserver ? 'cursor-move' : ''
                } ${
                  dragOverItem?.id === group.id && dragOverItem?.isGroup
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                    : darkMode ? 'border-purple-700 bg-purple-900/30' : 'border-purple-300 bg-purple-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  {editingGroupId === group.id ? (
                    <input
                      type="text"
                      value={editingGroupName}
                      onChange={(e) => setEditingGroupName(e.target.value)}
                      onBlur={() => handleRenameGroup(group.id, editingGroupName)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleRenameGroup(group.id, editingGroupName);
                        if (e.key === 'Escape') { setEditingGroupId(null); setEditingGroupName(''); }
                      }}
                      className={`flex-1 px-2 py-1 border ${
                        darkMode 
                          ? 'bg-gray-700 border-purple-500 text-white' 
                          : 'bg-white border-purple-500'
                      } rounded text-sm font-bold`}
                      autoFocus
                    />
                  ) : (
                    <h4 
                      className={`flex-1 font-bold cursor-pointer hover:text-purple-600 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                      onClick={() => {
                        if (!isObserver) {
                          setEditingGroupId(group.id);
                          setEditingGroupName(group.title);
                        }
                      }}
                      title="Click to rename"
                    >
                      {group.title}
                    </h4>
                  )}
                  {!isObserver && (
                    <button
                      onClick={() => toggleGroupVote(group.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                        group.voters?.includes(currentUserId)
                          ? 'bg-purple-600 text-white scale-110' 
                          : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsUp size={12} />
                      {group.votes || 0}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {group.items.map(item => {
                    const itemColumn = currentRetroFormat.columns.find(c => c.id === item.columnId);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-2 p-2 rounded text-sm ${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } border-l-4 group relative`}
                        style={{ borderLeftColor: itemColumn?.color || '#6b7280' }}
                      >
                        {itemColumn && (
                          <span className="text-xs shrink-0 mt-0.5" style={{ color: itemColumn.color }}>
                            {itemColumn.icon}
                          </span>
                        )}
                        <span className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.text}
                        </span>
                        {!isObserver && (
                          <button
                            onClick={() => handleRemoveFromGroup(group.id, item)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                            }`}
                            title="Remove from group"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {columnItems.length === 0 && columnGroups.length === 0 && (
            <p className={`text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} py-8`}>
              No items in this column yet
            </p>
          )}
        </div>
      );
    })}
  </div>
)}
          
  {retroPhase === 'discussion' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
    <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      Discussion
    </h2>
    <div className="space-y-6">
      {/* Show Groups */}
      {[...retroGroups].sort((a, b) => (b.votes || 0) - (a.votes || 0)).map(group => (
        <div key={group.id} className={`border-2 ${darkMode ? 'border-purple-700 bg-purple-900/20' : 'border-purple-200'} rounded-lg p-4`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-bold text-purple-600">{group.votes || 0}</span>
            {editingGroupId === group.id ? (
              <input
                type="text"
                value={editingGroupName}
                onChange={(e) => setEditingGroupName(e.target.value)}
                onBlur={() => handleRenameGroup(group.id, editingGroupName)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleRenameGroup(group.id, editingGroupName);
                  if (e.key === 'Escape') { setEditingGroupId(null); setEditingGroupName(''); }
                }}
                className={`flex-1 px-2 py-1 border ${
                  darkMode 
                    ? 'bg-gray-700 border-purple-500 text-white' 
                    : 'bg-white border-purple-500'
                } rounded text-sm font-bold`}
                autoFocus
              />
            ) : (
              <h3 
                className={`font-bold text-lg cursor-pointer hover:text-purple-600 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                onClick={() => {
                  if (!isObserver) {
                    setEditingGroupId(group.id);
                    setEditingGroupName(group.title);
                  }
                }}
                title="Click to rename"
              >
                {group.title}
              </h3>
            )}
          </div>
          
          <div className="space-y-2 ml-6 mb-4">
            {group.items.map(item => {
              const column = currentRetroFormat.columns.find(c => c.id === item.columnId);
              return (
                <div 
                  key={item.id} 
                  className={`text-sm p-2 rounded flex items-start gap-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-l-4`}
                  style={{ borderLeftColor: column?.color || '#6b7280' }}
                >
                  {column && (
                    <span className="text-xs shrink-0 mt-0.5" style={{ color: column.color }}>
                      {column.icon}
                    </span>
                  )}
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.text}</span>
                </div>
              );
            })}
          </div>

          <div className="ml-6 mt-4 border-t pt-4">
            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <MessageSquare size={16} />
              Comments ({Object.keys(retroComments[group.id] || {}).length})
            </h4>
            
            <div className="space-y-2 mb-3">
              {Object.values(retroComments[group.id] || {}).map(comment => (
                <div key={comment.id} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-2 rounded text-sm`}>
                  <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{comment.text}</p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {comment.author} • {new Date(comment.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>

            {!isObserver && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText[group.id] || ''}
                  onChange={(e) => setNewCommentText({ ...newCommentText, [group.id]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && addRetroComment(group.id)}
                  placeholder="Add a comment..."
                  className={`flex-1 px-3 py-2 border ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300'
                  } rounded text-sm`}
                />
                <button 
                  onClick={() => addRetroComment(group.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  Comment
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Show Ungrouped Items */}
      {retroInputs.map(item => {
        const column = currentRetroFormat.columns.find(c => c.id === item.columnId);
        return (
          <div 
            key={item.id} 
            className={`border-2 ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'} rounded-lg p-4`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-purple-600">{item.votes || 0}</span>
              <div className="flex items-start gap-2 flex-1">
                {column && (
                  <span className="text-lg shrink-0" style={{ color: column.color }}>
                    {column.icon}
                  </span>
                )}
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-medium`}>
                    {item.text}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {column?.label || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section for Individual Items */}
            <div className="ml-6 mt-4 border-t pt-4">
              <h4 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                <MessageSquare size={16} />
                Comments ({Object.keys(retroComments[item.id] || {}).length})
              </h4>
              
              <div className="space-y-2 mb-3">
                {Object.values(retroComments[item.id] || {}).map(comment => (
                  <div key={comment.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-2 rounded text-sm`}>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{comment.text}</p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {comment.author} • {new Date(comment.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>

              {!isObserver && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText[item.id] || ''}
                    onChange={(e) => setNewCommentText({ ...newCommentText, [item.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addRetroComment(item.id)}
                    placeholder="Add a comment..."
                    className={`flex-1 px-3 py-2 border ${
                      darkMode 
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300'
                    } rounded text-sm`}
                  />
                  <button 
                    onClick={() => addRetroComment(item.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {retroGroups.length === 0 && retroInputs.length === 0 && (
        <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} py-8`}>
          No items to discuss yet. Add items in Phase 1 and group them in Phase 2.
        </p>
      )}
    </div>
  </div>
)}

      {/* Empty State */}
      {retroGroups.length === 0 && retroInputs.length === 0 && (
        <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} py-8`}>
          No items to discuss yet. Add items in Phase 1 and group them in Phase 2.
        </p>
      )}
    </div>
  </div>
)}

          {/* Participants List */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 mt-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
                      } text-white`}
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
        
        {/* Add Item Modal */}
        {selectedColumn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => {
                setSelectedColumn(null);
                setNewInputText('');
              }}
            />
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full relative z-10 modal-enter`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Add Item
              </h3>
              <textarea
                value={newInputText}
                onChange={(e) => setNewInputText(e.target.value)}
                placeholder="Enter your thoughts... (Anonymous)"
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
                    setNewInputText('');
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
                  onClick={() => addRetroInput(selectedColumn)}
                  disabled={!newInputText.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0" 
              onClick={() => setShowShareModal(false)}
            />
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full relative z-10`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Share Retrospective
                </h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className={`p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Session Code
                  </label>
                  <div className={`text-3xl font-bold text-center py-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
                    {sessionId}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Share Link
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={`${window.location.origin}${window.location.pathname}?session=${sessionId}`}
                      readOnly 
                      className={`flex-1 px-3 py-2 border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      } rounded text-sm`}
                    />
                    <button 
                      onClick={copySessionId}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setShowQR(!showQR)}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  {showQR ? 'Hide' : 'Show'} QR Code
                </button>

                {showQR && qrCodeUrl && (
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto border-2 border-gray-300 rounded" />
                  </div>
                )}
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
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Leave Session?
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to leave this session?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveSession}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Release Notes
                    </h2>
                    <button
                      onClick={() => {
                        setShowReleaseNotes(false);
                        setShowHowItWorks(true);
                      }}
                      className={`text-sm mt-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}
                    >
                      How It Works →
                    </button>
                  </div>
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

        {/* How It Works Modal */}
        {showHowItWorks && (
          <HowItWorks darkMode={darkMode} onClose={() => setShowHowItWorks(false)} />
        )}

        <footer className="mt-6 text-center">
  <p 
    onClick={() => setShowReleaseNotes(true)}
    className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} cursor-pointer underline`}
    title="View release notes"
  >
    scrumptious v{APP_VERSION}
  </p>

</footer>
      </div>
    );
  }
  // COLUMN-BASED RETROSPECTIVE VIEW (from v2.9.0 - better for input phase)
  if (sessionType === 'retrospective' && retroFormat && currentRetroFormat) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} p-4`}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in { animation: fadeIn 0.3s ease-out; }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .modal-enter { animation: slideUp 0.3s ease-out; }
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
                setNewInputText('');
              }}
            />
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full relative z-10 modal-enter`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Add Item
              </h3>
              <textarea
                value={newInputText}
                onChange={(e) => setNewInputText(e.target.value)}
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
                    setNewInputText('');
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
                  disabled={!newInputText.trim()}
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
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Release Notes
                    </h2>
                    <button
                      onClick={() => {
                        setShowReleaseNotes(false);
                        setShowHowItWorks(true);
                      }}
                      className={`text-sm mt-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}
                    >
                      How It Works →
                    </button>
                  </div>
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

        {/* How It Works Modal */}
        {showHowItWorks && (
          <HowItWorks darkMode={darkMode} onClose={() => setShowHowItWorks(false)} />
        )}

        <footer className="mt-6 text-center">
          <p 
            className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} cursor-pointer underline`}
            title="View release notes"
          >
            scrumptious v{APP_VERSION}
          </p>
        </footer>
      </div>
    );
  }
  // PLANNING POKER SESSION VIEW
  const stats = sessionType === 'estimation' ? calculateAverage() : null;
  const votingParticipants = participants.filter(p => !p.isModerator && !p.isObserver);
  const currentScale = votingScale === 'fibonacci' ? FIBONACCI : TSHIRT;

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
        @keyframes pieGrow {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .pie-chart-grow {
          animation: pieGrow 0.5s ease-out;
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-blue-50'} rounded-lg shadow-xl p-4 sm:p-6 mb-6`}>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>scrumptious: Planning Poker</h1>
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
                {!revealed && (
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
    )}
    
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
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {revealed && showPieChart ? 'Vote Distribution' : 'Votes'}
                </h2>                {isModerator && (
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
              {revealed && showPieChart && stats ? (
                <div className="flex items-center justify-center py-8">
                  <PieChart stats={stats} darkMode={darkMode} />
                </div>
              ) : (
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
              )}
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
      
      {/* How It Works Modal */}
        {showHowItWorks && (
          <HowItWorks darkMode={darkMode} onClose={() => setShowHowItWorks(false)} />
        )}

      <footer className="mt-6 text-center">
        <p 
          className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} cursor-pointer underline`}
          onClick={() => setShowReleaseNotes(true)}
          title="View release notes"
        >
          scrumptious v{APP_VERSION}
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
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Release Notes
                    </h2>
                    <button
                      onClick={() => {
                        setShowReleaseNotes(false);
                        setShowHowItWorks(true);
                      }}
                      className={`text-sm mt-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}
                    >
                      How It Works →
                    </button>
                  </div>
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