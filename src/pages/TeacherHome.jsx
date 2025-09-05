import React from 'react';
import './TeacherHome.css';
import { useAuthStore, useUIStore } from '../store';
import ClassroomListComponent from '../components/teacher/component/ClassroomListComponent';
import LectureListComponent from '../components/teacher/component/LectureListComponent';
import ResultListComponent from '../components/teacher/component/ResultListComponent';
import ReportGenerationComponent from '../components/teacher/component/ReportGenerationComponent';
import ChangePasswordModal from '../components/teacher/modal/ChangePasswordModal';
import { changeTeacherPassword } from '../api/teacherApi';

function TeacherHome() {
  const { logout, currentUser } = useAuthStore();
  const {
    currentView,
    setCurrentView,
    isModalOpen,
    modalType,
    openModal,
    closeModal,
  } = useUIStore();

  // 교사 페이지 진입 시 기본 뷰 설정
  React.useEffect(() => {
    if (currentView === 'dashboard' || !currentView) {
      setCurrentView('class-management');
    }
  }, [currentView, setCurrentView]);

  const handleLogout = () => {
    logout();
  };

  const handleChangePassword = async passwordData => {
    try {
      console.log('Current user:', currentUser);
      console.log('Password data:', {
        uid: currentUser?.uid,
        loginId: currentUser?.loginId,
        password: passwordData.password,
        newPassword: passwordData.newPassword,
      });
      
      const result = await changeTeacherPassword({
        uid: currentUser?.uid,
        loginId: currentUser?.loginId,
        password: passwordData.password,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
      } else {
        alert(`비밀번호 변경에 실패했습니다: ${result.error}`);
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
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
          <div className='user-actions'>
            <button
              className='change-password-btn'
              onClick={() => openModal('changePassword')}
            >
              비밀번호 변경
            </button>
            <button className='logout-btn' onClick={handleLogout}>
              로그아웃
            </button>
          </div>
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
      <main className='main-content'>{renderContent()}</main>

      {/* 비밀번호 변경 모달 */}
      <ChangePasswordModal
        isOpen={isModalOpen && modalType === 'changePassword'}
        onClose={closeModal}
        onChangePassword={handleChangePassword}
      />
    </div>
  );
}

export default TeacherHome;
