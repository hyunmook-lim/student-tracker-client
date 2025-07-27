import React, { useState } from 'react';
import SessionDetailModal from './SessionDetailModal';

function SessionInfo({ studentData }) {
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleClassExpansion = classId => {
    setExpandedClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  const openSessionModal = session => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const closeSessionModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  return (
    <div className='session-info'>
      <h3 className='session-info-title'>회차별 정보</h3>
      <div className='classes-container'>
        {studentData.classes.map(classItem => {
          const isExpanded = expandedClasses.has(classItem.id);
          return (
            <div key={classItem.id} className='class-card'>
              <div
                className='class-header clickable'
                onClick={() => toggleClassExpansion(classItem.id)}
              >
                <div className='class-header-content'>
                  <h4 className='class-name'>{classItem.name}</h4>
                  <div className='class-progress'>
                    <span className='progress-text'>
                      {classItem.completedSessions}/{classItem.totalSessions}
                      회차 완료
                    </span>
                    <div className='progress-bar'>
                      <div
                        className='progress-fill'
                        style={{
                          width: `${(classItem.completedSessions / classItem.totalSessions) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                  ▼
                </div>
              </div>
              {isExpanded && (
                <div className='sessions-grid'>
                  {classItem.sessions.map(session => (
                    <div
                      key={session.id}
                      className={`session-card ${session.status}`}
                      onClick={() => openSessionModal(session)}
                    >
                      <div className='session-header'>
                        <span className='session-number'>{session.id}회차</span>
                        <span className={`session-status ${session.status}`}>
                          {session.status === 'completed' ? '완료' : '예정'}
                        </span>
                      </div>
                      <h5 className='session-title'>{session.title}</h5>
                      <p className='session-date'>{session.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SessionDetailModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={closeSessionModal}
      />
    </div>
  );
}

export default SessionInfo;
