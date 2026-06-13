import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('attendance');
  
  // Attendance Checker States
  const [totalClasses, setTotalClasses] = useState(100);
  const [attendedClasses, setAttendedClasses] = useState(70);
  
  // Calculation helper
  const currentAttendance = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : 0;
  const isEligible = currentAttendance >= 75;
  
  let resultText = '';
  let statusColor = '';
  let countNumber = 0;

  if (totalClasses > 0) {
    if (isEligible) {
      // Bunk calculation: (4A - 3T) / 3
      countNumber = Math.floor((4 * attendedClasses - 3 * totalClasses) / 3);
      if (countNumber < 0) countNumber = 0;
      resultText = `Safe to Bunk! You can skip the next ${countNumber} classes consecutively.`;
      statusColor = 'var(--accent-success)';
    } else {
      // Classes to attend calculation: 3T - 4A
      countNumber = Math.ceil(3 * totalClasses - 4 * attendedClasses);
      if (countNumber < 0) countNumber = 0;
      resultText = `Attendance Low! You need to attend the next ${countNumber} classes consecutively to reach 75%.`;
      statusColor = 'var(--accent-secondary)';
    }
  }

  // Dashboard state (tasks)
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Complete React Components Lab', subject: 'Web D', priority: 'High', due: 'Tonight' },
    { id: 2, name: 'Prepare cheat-sheet for JS Array Methods', subject: 'Programming', priority: 'Medium', due: 'Tomorrow' },
    { id: 3, name: 'Revise Java OOP Concepts & Inheritance', subject: 'Java OOPs', priority: 'High', due: '1 Day' },
  ]);

  // Quiz Engine
  const [testPrepQuestion, setTestPrepQuestion] = useState(0);
  const quizQuestions = [
    {
      q: 'Which hook is used to handle side effects in React?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      ans: 'useEffect'
    },
    {
      q: 'What is the correct syntax for declaring a state variable in React?',
      options: ['const [state, setState] = useState(initial)', 'let state = useState()', 'const state = setState()', 'var state = new React.State()'],
      ans: 'const [state, setState] = useState(initial)'
    }
  ];
  const [selectedAns, setSelectedAns] = useState('');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizAnswer = (option) => {
    setSelectedAns(option);
    if (option === quizQuestions[testPrepQuestion].ans) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (testPrepQuestion < quizQuestions.length - 1) {
        setTestPrepQuestion(testPrepQuestion + 1);
        setSelectedAns('');
      } else {
        setQuizFinished(true);
      }
    }, 1000);
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
            📅 Attendance Checker
          </li>
          <li 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Tasks & Stats
          </li>
          <li 
            className={`nav-item ${activeTab === 'prep' ? 'active' : ''}`}
            onClick={() => setActiveTab('prep')}
          >
            📝 Test Preparation
          </li>
          <li 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Student Profile
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
            <span>{currentAttendance}% Attendance</span>
          </div>
        </header>

        {activeTab === 'attendance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
            {/* Input card */}
            <div className="panel-card">
              <div className="panel-header">
                <span>Calculate & Plan Attendance</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Total Classes Conducted So Far</label>
                  <input 
                    type="number" 
                    value={totalClasses} 
                    onChange={(e) => setTotalClasses(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Number of Classes Attended</label>
                  <input 
                    type="number" 
                    value={attendedClasses} 
                    onChange={(e) => setAttendedClasses(Math.min(totalClasses, Math.max(0, parseInt(e.target.value) || 0)))}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                {/* Progress bar visual */}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    <span>Progress to 75% Requirement</span>
                    <span>75% Min Target</span>
                  </div>
                  <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.min(100, (currentAttendance / 75) * 100)}%`, 
                        background: isEligible ? 'linear-gradient(90deg, var(--accent-primary), var(--accent-success))' : 'linear-gradient(90deg, var(--accent-warning), var(--accent-secondary))' 
                      }}
                    ></div>
                    <div style={{ position: 'absolute', right: '25%', top: '0', width: '2px', height: '100%', background: 'rgba(255,255,255,0.3)' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.01)' }}>
              <div 
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%', 
                  border: `4px solid ${statusColor}`, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  boxShadow: `0 0 20px rgba(255,255,255,0.02)`
                }}
              >
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: statusColor }}>{currentAttendance}%</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Current</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: statusColor, fontWeight: '700' }}>
                  {isEligible ? 'Safe' : 'Shortage'} Status
                </h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '500', maxWidth: '300px', lineHeight: '1.4' }}>
                  {resultText}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-title">Target Semester GPA</span>
                <span className="stat-value">9.5+</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Pending Tasks</span>
                <span className="stat-value">{tasks.length} Items</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Completed Labs</span>
                <span className="stat-value" style={{ color: 'var(--accent-success)' }}>12/12</span>
              </div>
            </section>

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
                  <span>Recent Activity Log</span>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-timeline">
                      <div className="timeline-dot"></div>
                      <div className="timeline-line"></div>
                    </div>
                    <div className="activity-content">
                      <span className="activity-title">Updated Attendance Calculator</span>
                      <span className="activity-time">Just now</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-timeline">
                      <div className="timeline-dot" style={{ background: 'var(--accent-secondary)' }}></div>
                    </div>
                    <div className="activity-content">
                      <span className="activity-title">Pushed Spring REST APIs to Git</span>
                      <span className="activity-time">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'prep' && (
          <div className="panel-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="panel-header">
              <span>Quick Test Preparation Quiz</span>
            </div>
            {!quizFinished ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                  Q{testPrepQuestion + 1}: {quizQuestions[testPrepQuestion].q}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {quizQuestions[testPrepQuestion].options.map((opt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(opt)}
                      style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        border: selectedAns === opt ? '2px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                        background: selectedAns === opt ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-success)' }}>
                  🎉 Prep Quiz Completed!
                </h3>
                <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                  Your score: <strong>{score} / {quizQuestions.length}</strong>
                </p>
                <button
                  onClick={() => {
                    setTestPrepQuestion(0);
                    setScore(0);
                    setQuizFinished(false);
                    setSelectedAns('');
                  }}
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
                  Restart Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="panel-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="panel-header">
              <span>Academic Profile Info</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Full Name</span>
                <strong>Anshu Kumar Verma</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Institution</span>
                <strong>ABES Engineering College, Ghaziabad</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Course</span>
                <strong>B.Tech Computer Science & Engineering</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Semester & Section</span>
                <strong>2nd Semester, CSE-19</strong>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
