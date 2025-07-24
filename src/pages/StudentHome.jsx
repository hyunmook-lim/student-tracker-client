import React from 'react';
import './Home.css';
import { useAuthStore, useUIStore } from '../store';

function StudentHome() {
  const { logout } = useAuthStore();
  const { currentView, setCurrentView } = useUIStore();

  const handleLogout = () => {
    logout();
  };

  // 학생 데이터 (실제로는 서버에서 가져올 데이터)
  const studentData = {
    name: '김학생',
    studentId: '2024001',
    averageGrade: '88.5',
    attendanceRate: '96',
    completedAssignments: 12,
    remainingAssignments: 2,
    recentGrades: [
      { subject: '수학', grade: 92 },
      { subject: '영어', grade: 85 },
      { subject: '과학', grade: 88 },
      { subject: '국어', grade: 90 },
    ],
    attendanceRecord: [
      { date: '2024-01-15', status: 'present' },
      { date: '2024-01-16', status: 'present' },
      { date: '2024-01-17', status: 'absent' },
      { date: '2024-01-18', status: 'present' },
      { date: '2024-01-19', status: 'present' },
    ],
  };

  const renderContent = () => {
    switch (currentView) {
      case 'grades':
        return (
          <div className='student-grades'>
            <h3>내 성적</h3>
            <div className='grades-list'>
              {studentData.recentGrades.map((grade, index) => (
                <div key={index} className='grade-item'>
                  <span className='subject'>{grade.subject}</span>
                  <span className='grade'>{grade.grade}점</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className='student-attendance'>
            <h3>출석 기록</h3>
            <div className='attendance-list'>
              {studentData.attendanceRecord.map((record, index) => (
                <div key={index} className='attendance-item'>
                  <span className='date'>{record.date}</span>
                  <span className={`status ${record.status}`}>
                    {record.status === 'present' ? '출석' : '결석'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div className='student-assignments'>
            <h3>과제 현황</h3>
            <div className='assignments-info'>
              <div className='assignment-item'>
                <span>완료한 과제</span>
                <span>{studentData.completedAssignments}개</span>
              </div>
              <div className='assignment-item'>
                <span>남은 과제</span>
                <span>{studentData.remainingAssignments}개</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className='student-dashboard'>
            <div className='welcome-section'>
              <h2 className='welcome-title'>내 정보</h2>
              <p className='welcome-message'>
                내 성적과 출석 현황을 확인할 수 있습니다.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className='home-container'>
      {/* 왼쪽 사이드바 */}
      <aside className='sidebar'>
        <div className='sidebar-header'>
          <h1 className='sidebar-title'>학생 관리 시스템</h1>
        </div>

        <div className='user-info'>
          <span className='user-type'>학생 모드 - {studentData.name}</span>
          <button className='logout-btn' onClick={handleLogout}>
            로그아웃
          </button>
        </div>

        <nav className='sidebar-nav'>
          <button
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            대시보드
          </button>
          <button
            className={`nav-btn ${currentView === 'grades' ? 'active' : ''}`}
            onClick={() => setCurrentView('grades')}
          >
            내 성적
          </button>
          <button
            className={`nav-btn ${currentView === 'attendance' ? 'active' : ''}`}
            onClick={() => setCurrentView('attendance')}
          >
            출석 기록
          </button>
          <button
            className={`nav-btn ${currentView === 'assignments' ? 'active' : ''}`}
            onClick={() => setCurrentView('assignments')}
          >
            과제 현황
          </button>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className='main-content'>
        {currentView === 'dashboard' && (
          <div className='dashboard-section'>
            <h3 className='dashboard-title'>내 대시보드</h3>
            <div className='dashboard-grid'>
              <div className='dashboard-card'>
                <h4>내 평균 성적</h4>
                <p className='card-number'>{studentData.averageGrade}점</p>
              </div>
              <div className='dashboard-card'>
                <h4>출석률</h4>
                <p className='card-number'>{studentData.attendanceRate}%</p>
              </div>
              <div className='dashboard-card'>
                <h4>완료한 과제</h4>
                <p className='card-number'>
                  {studentData.completedAssignments}개
                </p>
              </div>
              <div className='dashboard-card'>
                <h4>남은 과제</h4>
                <p className='card-number'>
                  {studentData.remainingAssignments}개
                </p>
              </div>
            </div>
          </div>
        )}

        {currentView !== 'dashboard' && renderContent()}
      </main>
    </div>
  );
}

export default StudentHome;
