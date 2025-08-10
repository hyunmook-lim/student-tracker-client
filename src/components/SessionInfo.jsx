import React from 'react';
import { useSessionStore, useClassroomStore } from '../store';
import SessionDetailModal from './SessionDetailModal';
import './SessionInfo.css';

function SessionInfo() {
  const {
    expandedClasses,
    toggleClassExpansion,
    selectedSession,
    setSelectedSession,
    getSessionsByClassroom,
  } = useSessionStore();

  const { classrooms } = useClassroomStore();

  const handleSessionClick = session => {
    setSelectedSession(session);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  return (
    <>
      <div className='session-info-container'>
        <div className='session-info-header'>
          <h2>수업 정보</h2>
        </div>

        <div className='classrooms-list'>
          {classrooms.map(classroom => (
            <div key={classroom.id} className='classroom-section'>
              <div
                className='classroom-header'
                onClick={() => toggleClassExpansion(classroom.id)}
              >
                <div className='classroom-info'>
                  <h3>{classroom.name}</h3>
                  <p>{classroom.description}</p>
                  <span>학생 수: {classroom.studentCount}명</span>
                </div>
                <div className='expand-icon'>
                  {expandedClasses.has(classroom.id) ? '▼' : '▶'}
                </div>
              </div>

              {expandedClasses.has(classroom.id) && (
                <div className='sessions-grid'>
                  {getSessionsByClassroom(classroom.id).map(session => (
                    <div
                      key={session.id}
                      className='session-card'
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className='session-header'>
                        <h4>{session.title}</h4>
                        <span className='session-date'>{session.date}</span>
                      </div>
                      <div className='session-content'>
                        <p>{session.description}</p>
                      </div>
                      <div className='session-actions'>
                        <button className='view-detail-btn'>자세히 보기</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 세션 상세 모달 */}
      <SessionDetailModal
        session={selectedSession}
        isOpen={!!selectedSession}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default SessionInfo;
