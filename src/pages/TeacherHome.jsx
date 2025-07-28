import React from 'react';
import '../components/TeacherHome.css';
import { useAuthStore, useStudentsStore, useUIStore } from '../store';
import StudentList from '../components/StudentList';
import ClassroomList from '../components/ClassroomList';
import SessionList from '../components/SessionList';
import ResultList from '../components/ResultList';
import Modal from '../components/Modal';

function TeacherHome() {
  const { logout } = useAuthStore();
  const { students } = useStudentsStore();
  const { currentView, setCurrentView } = useUIStore();

  const handleLogout = () => {
    logout();
  };

  // 통계 계산
  const totalStudents = students.length;
  const todayAttendance = students.filter(student =>
    student.attendanceRecord.some(
      record => record.date === '2024-01-19' && record.status === 'present'
    )
  ).length;

  const averageGrade =
    students.length > 0
      ? (
          students.reduce((sum, student) => {
            const grades = Object.values(student.grades);
            return (
              sum + grades.reduce((s, grade) => s + grade, 0) / grades.length
            );
          }, 0) / students.length
        ).toFixed(1)
      : '0.0';

  const renderContent = () => {
    switch (currentView) {
      case 'class-management':
        return <ClassroomList />;
      case 'session-management':
        return <SessionList />;
      case 'result-input':
        return <ResultList />;
      default:
        return (
          <div className='teacher-dashboard'>
            <div className='welcome-section'>
              <h2 className='welcome-title'>선생님 대시보드</h2>
              <p className='welcome-message'>
                학생들을 관리하고 성적을 확인할 수 있습니다.
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
          <span className='user-type'>선생님 모드</span>
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
            className={`nav-btn ${currentView === 'class-management' ? 'active' : ''}`}
            onClick={() => setCurrentView('class-management')}
          >
            반 관리
          </button>
          <button
            className={`nav-btn ${currentView === 'session-management' ? 'active' : ''}`}
            onClick={() => setCurrentView('session-management')}
          >
            회차 관리
          </button>
          <button
            className={`nav-btn ${currentView === 'result-input' ? 'active' : ''}`}
            onClick={() => setCurrentView('result-input')}
          >
            수업 결과 입력
          </button>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className='main-content'>
        {currentView === 'dashboard' && (
          <div className='dashboard-section'>
            <h3 className='dashboard-title'>대시보드</h3>
            <div className='dashboard-grid'>
              <div className='dashboard-card'>
                <h4>전체 학생</h4>
                <p className='card-number'>{totalStudents}명</p>
              </div>
              <div className='dashboard-card'>
                <h4>오늘 출석</h4>
                <p className='card-number'>{todayAttendance}명</p>
              </div>
              <div className='dashboard-card'>
                <h4>평균 성적</h4>
                <p className='card-number'>{averageGrade}점</p>
              </div>
              <div className='dashboard-card'>
                <h4>미제출 과제</h4>
                <p className='card-number'>3건</p>
              </div>
            </div>
          </div>
        )}

        {currentView !== 'dashboard' && renderContent()}
      </main>

      <Modal />
    </div>
  );
}

export default TeacherHome;
