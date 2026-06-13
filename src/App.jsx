import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Complete React Components Lab', subject: 'Web D', priority: 'High', due: 'Tonight' },
    { id: 2, name: 'Prepare cheat-sheet for JS Array Methods', subject: 'Programming', priority: 'Medium', due: 'Tomorrow' },
    { id: 3, name: 'Revise Java OOP Concepts & Inheritance', subject: 'Java OOPs', priority: 'High', due: '1 Day' },
    { id: 4, name: 'Create Employee Spring Controller CRUD Test', subject: 'Spring Boot', priority: 'Low', due: '3 Days' },
  ]);

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
    },
    {
      q: 'Which annotation in Spring Boot is used to create a REST Controller?',
      options: ['@Controller', '@RestController', '@ResponseBody', '@RequestMapping'],
      ans: '@RestController'
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
          <span>CSE-19 Hub</span>
        </div>
        <ul className="nav-links">
          <li 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
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
            👤 Profile & Academics
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
            <span className="status-dot"></span>
            <span>Sem 2 Active</span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Dashboard */}
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
                <span className="stat-title">Completed Experiments</span>
                <span className="stat-value" style={{ color: 'var(--accent-success)' }}>12/12</span>
              </div>
            </section>

            <div className="dashboard-layout">
              {/* Task Section */}
              <div className="panel-card">
                <div className="panel-header">
                  <span>Upcoming Deadlines & Tasks</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', cursor: 'pointer' }}>View All</span>
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

              {/* Activity Feed */}
              <div className="panel-card">
                <div className="panel-header">
                  <span>Recent Academic Activity</span>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-timeline">
                      <div className="timeline-dot"></div>
                      <div className="timeline-line"></div>
                    </div>
                    <div className="activity-content">
                      <span className="activity-title">Pushed Spring REST APIs to Git</span>
                      <span className="activity-time">Just now</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-timeline">
                      <div className="timeline-dot" style={{ background: 'var(--accent-secondary)' }}></div>
                      <div className="timeline-line"></div>
                    </div>
                    <div className="activity-content">
                      <span className="activity-title">Completed React JS Lab Submission</span>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-timeline">
                      <div className="timeline-dot"></div>
                    </div>
                    <div className="activity-content">
                      <span className="activity-title">Created Repository for Section CSE-19</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                <span style={{ color: 'var(--accent-success)', fontWeight: '600' }}>Excellent Standings</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
