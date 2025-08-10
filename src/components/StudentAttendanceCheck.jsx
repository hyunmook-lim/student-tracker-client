import React, { useState } from 'react';
import SessionDetailModal from './SessionDetailModal';
import './StudentAttendanceCheck.css';

// 가상의 수업 데이터 (실제로는 store에서 가져올 예정)
const mockClasses = [
  {
    id: 1,
    name: '웹 개발 기초',
    description: 'HTML, CSS, JavaScript 기초부터 심화까지',
    totalSessions: 12,
    attendedSessions: 10,
    sessions: [
      { id: 1, title: '1회차 - HTML 기초', date: '2024-01-15', attended: true },
      { id: 2, title: '2회차 - CSS 기초', date: '2024-01-17', attended: true },
      {
        id: 3,
        title: '3회차 - JavaScript 변수',
        date: '2024-01-22',
        attended: false,
      },
      {
        id: 4,
        title: '4회차 - JavaScript 함수',
        date: '2024-01-24',
        attended: true,
      },
      { id: 5, title: '5회차 - DOM 조작', date: '2024-01-29', attended: true },
      {
        id: 6,
        title: '6회차 - 이벤트 처리',
        date: '2024-01-31',
        attended: true,
      },
      {
        id: 7,
        title: '7회차 - 비동기 프로그래밍',
        date: '2024-02-05',
        attended: false,
      },
      { id: 8, title: '8회차 - API 연동', date: '2024-02-07', attended: true },
      {
        id: 9,
        title: '9회차 - 프로젝트 1',
        date: '2024-02-12',
        attended: true,
      },
      {
        id: 10,
        title: '10회차 - 프로젝트 2',
        date: '2024-02-14',
        attended: true,
      },
      { id: 11, title: '11회차 - 배포', date: '2024-02-19', attended: true },
      {
        id: 12,
        title: '12회차 - 최종 발표',
        date: '2024-02-21',
        attended: true,
      },
    ],
  },
  {
    id: 2,
    name: 'React 심화',
    description: 'React Hooks, 상태 관리, 최적화 기법',
    totalSessions: 8,
    attendedSessions: 7,
    sessions: [
      {
        id: 1,
        title: '1회차 - React 소개',
        date: '2024-02-26',
        attended: true,
      },
      {
        id: 2,
        title: '2회차 - JSX와 컴포넌트',
        date: '2024-02-28',
        attended: true,
      },
      {
        id: 3,
        title: '3회차 - State와 Props',
        date: '2024-03-05',
        attended: false,
      },
      {
        id: 4,
        title: '4회차 - Hooks 기초',
        date: '2024-03-07',
        attended: true,
      },
      { id: 5, title: '5회차 - useEffect', date: '2024-03-12', attended: true },
      {
        id: 6,
        title: '6회차 - Context API',
        date: '2024-03-14',
        attended: true,
      },
      {
        id: 7,
        title: '7회차 - 성능 최적화',
        date: '2024-03-19',
        attended: true,
      },
      {
        id: 8,
        title: '8회차 - 프로젝트 실습',
        date: '2024-03-21',
        attended: true,
      },
    ],
  },
  {
    id: 3,
    name: '데이터베이스 설계',
    description: 'SQL, 데이터 모델링, 성능 최적화',
    totalSessions: 10,
    attendedSessions: 9,
    sessions: [
      {
        id: 1,
        title: '1회차 - 데이터베이스 개요',
        date: '2024-03-26',
        attended: true,
      },
      {
        id: 2,
        title: '2회차 - 관계형 모델',
        date: '2024-03-28',
        attended: true,
      },
      { id: 3, title: '3회차 - SQL 기초', date: '2024-04-02', attended: true },
      {
        id: 4,
        title: '4회차 - 조인과 서브쿼리',
        date: '2024-04-04',
        attended: false,
      },
      { id: 5, title: '5회차 - 인덱스', date: '2024-04-09', attended: true },
      { id: 6, title: '6회차 - 트랜잭션', date: '2024-04-11', attended: true },
      { id: 7, title: '7회차 - 정규화', date: '2024-04-16', attended: true },
      { id: 8, title: '8회차 - 성능 튜닝', date: '2024-04-18', attended: true },
      {
        id: 9,
        title: '9회차 - 프로젝트 설계',
        date: '2024-04-23',
        attended: true,
      },
      {
        id: 10,
        title: '10회차 - 최종 발표',
        date: '2024-04-25',
        attended: true,
      },
    ],
  },
];

function StudentAttendanceCheck() {
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClassClick = classId => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  const handleSessionClick = session => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const getAttendanceRate = (attendedSessions, totalSessions) => {
    return Math.round((attendedSessions / totalSessions) * 100);
  };

  return (
    <div className='student-attendance-check-container'>
      <div className='student-attendance-check-header'>
        <h2>출석 현황 확인</h2>
        <p>수업별 출석 현황을 확인하고 회차별 상세 정보를 살펴보세요</p>
      </div>

      <div className='classes-list'>
        {mockClasses.map(classItem => (
          <div key={classItem.id} className='class-card'>
            <div
              className='class-summary'
              onClick={() => handleClassClick(classItem.id)}
            >
              <div className='class-info'>
                <h3>{classItem.name}</h3>
                <p>{classItem.description}</p>
              </div>
              <div className='attendance-summary'>
                <div className='attendance-stats'>
                  <span className='attendance-count'>
                    {classItem.attendedSessions}/{classItem.totalSessions}회
                    출석
                  </span>
                  <span className='attendance-rate'>
                    출석률{' '}
                    {getAttendanceRate(
                      classItem.attendedSessions,
                      classItem.totalSessions
                    )}
                    %
                  </span>
                </div>
                <div className='expand-icon'>
                  {expandedClassId === classItem.id ? '▼' : '▶'}
                </div>
              </div>
            </div>

            {expandedClassId === classItem.id && (
              <div className='sessions-list'>
                <div className='sessions-grid'>
                  {classItem.sessions.map(session => (
                    <div
                      key={session.id}
                      className={`session-card-compact ${session.attended ? 'attended' : 'absent'}`}
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className='session-info-compact'>
                        <div
                          className={`attendance-badge-left ${session.attended ? 'present' : 'absent'}`}
                        ></div>
                        <span className='session-title-compact'>
                          {session.title}
                        </span>
                        <span className='session-date-compact'>
                          {session.date}
                        </span>
                        <span
                          className={`status-badge-compact ${session.attended ? 'present' : 'absent'}`}
                        >
                          {session.attended ? '출석' : '결석'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <SessionDetailModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default StudentAttendanceCheck;
