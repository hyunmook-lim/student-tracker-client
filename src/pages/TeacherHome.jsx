import React from 'react';
import './TeacherHome.css';
import { useAuthStore, useUIStore } from '../store';
import DashboardComponent from '../components/teacher/component/DashboardComponent';
import ClassroomListComponent from '../components/teacher/component/ClassroomListComponent';
import LectureListComponent from '../components/teacher/component/LectureListComponent';
import ResultListComponent from '../components/teacher/component/ResultListComponent';

function TeacherHome() {
  const { logout } = useAuthStore();
  const { currentView, setCurrentView } = useUIStore();

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'class-management':
        return <ClassroomListComponent />;
      case 'lecture-management':
        return <LectureListComponent />;
      case 'result-input':
        return <ResultListComponent />;
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
    <div className='teacher-home-container'>
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
            className={`nav-btn ${currentView === 'lecture-management' ? 'active' : ''}`}
            onClick={() => setCurrentView('lecture-management')}
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
        {currentView === 'dashboard' && <DashboardComponent />}

        {currentView !== 'dashboard' && renderContent()}
      </main>
    </div>
  );
}

export default TeacherHome;
