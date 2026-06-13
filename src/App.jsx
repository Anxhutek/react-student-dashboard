import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('attendance');
  
  // Semester configuration
  const [semTotalGoal, setSemTotalGoal] = useState(() => {
    return parseInt(localStorage.getItem('sem_total_goal')) || 450;
  });
  const [semEndDate, setSemEndDate] = useState(() => {
    return localStorage.getItem('sem_end_date') || '';
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(semTotalGoal);
  const [tempEndDate, setTempEndDate] = useState(semEndDate);

  // Daily log state: array of { date: 'YYYY-MM-DD', conducted: X, attended: Y }
  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem('daily_attendance_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { date: '2026-06-11', conducted: 5, attended: 4 },
      { date: '2026-06-12', conducted: 6, attended: 5 },
      { date: '2026-06-13', conducted: 4, attended: 3 },
    ];
  });

  // Daily inputs
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [inputConducted, setInputConducted] = useState(4);
  const [inputAttended, setInputAttended] = useState(3);

  // Save to localStorage when states change
  useEffect(() => {
    localStorage.setItem('daily_attendance_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('sem_total_goal', semTotalGoal.toString());
  }, [semTotalGoal]);

  useEffect(() => {
    localStorage.setItem('sem_end_date', semEndDate);
  }, [semEndDate]);

  // Check if selected log date is past semester end date
  const isSemEnded = semEndDate && inputDate > semEndDate;

  // Handle adding a daily log
  const handleAddLog = (e) => {
    e.preventDefault();
    if (isSemEnded) {
      alert("Semester has ended. You cannot log classes for a date past the semester end date.");
      return;
    }
    if (inputConducted < 0 || inputAttended < 0 || inputAttended > inputConducted) {
      alert("Attended classes cannot exceed conducted classes, and numbers cannot be negative.");
      return;
    }

    const existingIndex = dailyLogs.findIndex(log => log.date === inputDate);
    if (existingIndex !== -1) {
      const updated = [...dailyLogs];
      updated[existingIndex] = { date: inputDate, conducted: inputConducted, attended: inputAttended };
      setDailyLogs(updated);
    } else {
      const newLog = { date: inputDate, conducted: inputConducted, attended: inputAttended };
      setDailyLogs([...dailyLogs, newLog].sort((a, b) => b.date.localeCompare(a.date)));
    }
  };

  const handleDeleteLog = (dateToDelete) => {
    setDailyLogs(dailyLogs.filter(log => log.date !== dateToDelete));
  };

  // Cumulative Calculations
  const totalConductedSoFar = dailyLogs.reduce((sum, log) => sum + log.conducted, 0);
  const totalAttendedSoFar = dailyLogs.reduce((sum, log) => sum + log.attended, 0);
  
  const currentAttendance = totalConductedSoFar > 0 
    ? ((totalAttendedSoFar / totalConductedSoFar) * 100).toFixed(2) 
    : 0;
  
  const isEligible = currentAttendance >= 75;
  
  let statusText = '';
  let countNumber = 0;
  let statusColor = 'var(--text-secondary)';

  if (totalConductedSoFar > 0) {
    if (isEligible) {
      countNumber = Math.floor((4 * totalAttendedSoFar - 3 * totalConductedSoFar) / 3);
      statusText = `Safe to bunk next ${countNumber} classes consecutively!`;
      statusColor = 'var(--accent-success)';
    } else {
      countNumber = Math.ceil(3 * totalConductedSoFar - 4 * totalAttendedSoFar);
      statusText = `Must attend next ${countNumber} classes consecutively to hit 75%!`;
      statusColor = 'var(--accent-secondary)';
    }
  } else {
    statusText = 'No class records logged yet. Enter today\'s classes below!';
  }

  // Dashboard Tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Complete React Components Lab', subject: 'Web D', priority: 'High', due: 'Tonight' },
    { id: 2, name: 'Prepare cheat-sheet for JS Array Methods', subject: 'Programming', priority: 'Medium', due: 'Tomorrow' },
  ]);

  // AI Assistant States
  const [groqKey, setGroqKey] = useState(localStorage.getItem('groq_api_key') || '');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello Anshu! I am your AI Study Companion. Ask me any doubts about your syllabus or test preparation.' }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const saveApiKey = (key) => {
    localStorage.setItem('groq_api_key', key);
    setGroqKey(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem('groq_api_key');
    setGroqKey('');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userQuery.trim() || !groqKey) return;

    const newMessages = [...chatMessages, { role: 'user', content: userQuery }];
    setChatMessages(newMessages);
    setUserQuery('');
    setLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: 'You are a helpful B.Tech doubt solver. Give brief answers and formatting.' },
            ...newMessages
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setChatMessages([...newMessages, { role: 'assistant', content: data.choices[0].message.content }]);
      } else {
        throw new Error('Failed to fetch from Groq');
      }
    } catch (err) {
      setChatMessages([...newMessages, { role: 'assistant', content: `Error: ${err.message}. Check API key.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <span>CSE-19 Dashboard</span>
        </div>
        <ul className="nav-links">
          <li 
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            📅 Attendance Tracker
          </li>
          <li 
            className={`nav-item ${activeTab === 'ai-tutor' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-tutor')}
          >
            🤖 AI Study Companion
          </li>
          <li 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Semester Overview
          </li>
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="main-content">
        <header className="header-panel">
          <div className="welcome-text">
            <h1>Welcome, Anshu Kumar Verma</h1>
            <p style={{ color: 'var(--text-secondary)' }}>B.Tech CSE-19 | ABES Engineering College</p>
          </div>
          <div className="student-badge">
            <span className="status-dot" style={{ backgroundColor: isEligible ? 'var(--accent-success)' : 'var(--accent-secondary)' }}></span>
            <span>{currentAttendance}% Overall</span>
          </div>
        </header>

        {activeTab === 'attendance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
            {/* Left side: Goal config, logging form, and history */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Semester Goal Configuration */}
              <div className="panel-card">
                <div className="panel-header">
                  <span>Semester Config & Deadlines</span>
                </div>
                {isEditingGoal ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Classes:</label>
                        <input 
                          type="number" 
                          value={tempGoal} 
                          onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                          style={{ width: '100px', padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: '#fff' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Semester End Date:</label>
                        <input 
                          type="date" 
                          value={tempEndDate} 
                          onChange={(e) => setTempEndDate(e.target.value)}
                          style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: '#fff' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => { setSemTotalGoal(tempGoal); setSemEndDate(tempEndDate); setIsEditingGoal(false); }}
                        style={{ padding: '0.4rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Save Settings
                      </button>
                      <button 
                        onClick={() => setIsEditingGoal(false)}
                        style={{ padding: '0.4rem 1rem', background: 'transparent', border: '1px solid var(--border-glass)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Planned Classes:</span>
                        <strong style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }}>{semTotalGoal}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>End Date:</span>
                        <strong style={{ fontSize: '1.2rem', marginLeft: '0.5rem', color: semEndDate ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {semEndDate ? semEndDate : 'Not Set'}
                        </strong>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setTempGoal(semTotalGoal); setTempEndDate(semEndDate); setIsEditingGoal(true); }}
                      style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Edit Settings
                    </button>
                  </div>
                )}
              </div>

              {/* Daily Log Entry Form */}
              <div className="panel-card">
                <div className="panel-header">
                  <span>Log Daily Classes</span>
                </div>
                {isSemEnded ? (
                  <div style={{ padding: '1rem', background: 'rgba(236,72,153,0.08)', border: '1px solid var(--accent-secondary)', borderRadius: '8px', color: 'var(--accent-secondary)', marginTop: '0.5rem', fontWeight: '600' }}>
                    🚫 Log Locked: Selected date ({inputDate}) is past the Semester End Date ({semEndDate}). Daily class entries are closed.
                  </div>
                ) : null}
                <form onSubmit={handleAddLog} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '1rem', alignItems: 'end', marginTop: '0.5rem', opacity: isSemEnded ? 0.5 : 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select Date</label>
                    <input 
                      type="date" 
                      value={inputDate} 
                      onChange={(e) => setInputDate(e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Classes Conducted</label>
                    <input 
                      type="number" 
                      value={inputConducted} 
                      disabled={isSemEnded}
                      onChange={(e) => setInputConducted(parseInt(e.target.value) || 0)}
                      style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Classes Attended</label>
                    <input 
                      type="number" 
                      value={inputAttended} 
                      disabled={isSemEnded}
                      onChange={(e) => setInputAttended(parseInt(e.target.value) || 0)}
                      style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff' }}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSemEnded}
                    style={{ 
                      padding: '0.6rem 1.2rem', 
                      background: isSemEnded ? 'rgba(255,255,255,0.05)' : 'var(--accent-primary)', 
                      border: 'none', 
                      borderRadius: '6px', 
                      color: isSemEnded ? 'var(--text-muted)' : '#fff', 
                      fontWeight: '600', 
                      cursor: isSemEnded ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    Log Day
                  </button>
                </form>
              </div>

              {/* History / Log List */}
              <div className="panel-card" style={{ flex: 1 }}>
                <div className="panel-header">
                  <span>Attendance History</span>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '250px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {dailyLogs.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No records logged yet.</p>
                  ) : (
                    dailyLogs.map((log) => (
                      <div 
                        key={log.date} 
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                      >
                        <div>
                          <strong>{log.date}</strong>
                          <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
                            Conducted: {log.conducted} | Attended: {log.attended}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontWeight: '700', color: log.conducted > 0 && (log.attended / log.conducted) >= 0.75 ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                            {log.conducted > 0 ? ((log.attended / log.conducted) * 100).toFixed(0) : 0}%
                          </span>
                          <button 
                            onClick={() => handleDeleteLog(log.date)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right side: Summary Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Circular Attendance Dial */}
              <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.01)', flex: 1 }}>
                <div 
                  style={{ 
                    width: '160px', 
                    height: '160px', 
                    borderRadius: '50%', 
                    border: `5px solid ${statusColor}`, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    boxShadow: `0 0 30px rgba(99, 102, 241, 0.05)`
                  }}
                >
                  <span style={{ fontSize: '2.5rem', fontWeight: '800', color: statusColor }}>{currentAttendance}%</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Overall</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.4rem', color: statusColor, fontWeight: '700' }}>
                    {isEligible ? 'Safe Status' : 'Attendance Shortage'}
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500', maxWidth: '300px', lineHeight: '1.4' }}>
                    {statusText}
                  </p>
                </div>
              </div>

              {/* Progress towards Semester Goal */}
              <div className="panel-card">
                <div className="panel-header">
                  <span>Semester Completion Tracker</span>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Classes Conducted So Far:</span>
                    <strong>{totalConductedSoFar} / {semTotalGoal}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Attended So Far:</span>
                    <strong>{totalAttendedSoFar}</strong>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.min(100, (totalConductedSoFar / semTotalGoal) * 100)}%`, 
                        background: 'var(--accent-primary)' 
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Semester is approximately {((totalConductedSoFar / semTotalGoal) * 100).toFixed(0)}% completed (based on goal).
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'ai-tutor' && (
          <div className="panel-card" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem' }}>
              <span>🤖 B.Tech AI Doubt Solver</span>
              {groqKey && (
                <button 
                  onClick={clearApiKey}
                  style={{
                    padding: '0.3rem 0.6rem',
                    background: 'rgba(236, 72, 153, 0.2)',
                    border: '1px solid var(--accent-secondary)',
                    borderRadius: '6px',
                    color: 'var(--accent-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  Change API Key
                </button>
              )}
            </div>

            {!groqKey ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', maxWidth: '450px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Enter Groq API Key to Start</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  To keep your key safe and avoid platform auto-revocation, paste it here. It is saved locally in your browser and never sent to git.
                </p>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = e.target.elements.keyInput.value.trim();
                    if(val) saveApiKey(val);
                  }}
                  style={{ width: '100%', display: 'flex', gap: '0.5rem' }}
                >
                  <input 
                    name="keyInput" 
                    type="password" 
                    placeholder="gsk_..." 
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  />
                  <button 
                    type="submit" 
                    style={{
                      padding: '0.75rem 1.25rem',
                      background: 'var(--accent-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden', marginTop: '1rem' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: msg.role === 'user' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-glass)',
                        padding: '1rem',
                        borderRadius: '12px',
                        maxWidth: '80%',
                        whiteSpace: 'pre-wrap',
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {loading && (
                    <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.01)', padding: '0.75rem 1.25rem', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                      Thinking...
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Ask doubt: e.g. What is polymorphism in Java?"
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'var(--accent-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Ask AI
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div className="dashboard-layout">
              <div className="panel-card">
                <div className="panel-header">
                  <span>Upcoming Deadlines & Tasks</span>
                </div>
                <div className="task-list">
                  {tasks.map((task) => (
                    <div className="task-item" key={task.id}>
                      <div className="task-details">
                        <span className="task-name">{task.name}</span>
                        <span className="task-meta">{task.subject} • Due: {task.due}</span>
                      </div>
                      <span className={`badge-tag ${task.priority === 'High' ? 'badge-high' : 'badge-med'}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <span>Logged Attendance Stats</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Classes Logged</span>
                    <strong>{totalConductedSoFar}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Attended</span>
                    <strong>{totalAttendedSoFar}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Bunkable / Shortage Offset</span>
                    <strong style={{ color: statusColor }}>{countNumber} classes</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
