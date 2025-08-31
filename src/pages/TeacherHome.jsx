import React from 'react';
import './TeacherHome.css';
import { useAuthStore, useUIStore } from '../store';
import ClassroomListComponent from '../components/teacher/component/ClassroomListComponent';
import LectureListComponent from '../components/teacher/component/LectureListComponent';
import ResultListComponent from '../components/teacher/component/ResultListComponent';
import ReportGenerationComponent from '../components/teacher/component/ReportGenerationComponent';

function TeacherHome() {
  const { logout } = useAuthStore();
  const { currentView, setCurrentView } = useUIStore();

  // 교사 페이지 진입 시 기본 뷰 설정
  React.useEffect(() => {
    if (currentView === 'dashboard' || !currentView) {
      setCurrentView('class-management');
    }
  }, [currentView, setCurrentView]);

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
      case 'report-generation':
        return <ReportGenerationComponent />;
      default:
        return <ClassroomListComponent />;
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
          <button
            className={`nav-btn ${currentView === 'report-generation' ? 'active' : ''}`}
            onClick={() => setCurrentView('report-generation')}
          >
            성적표 생성
          </button>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className='main-content'>
        {renderContent()}
      </main>
    </div>
  );
}

export default TeacherHome;
