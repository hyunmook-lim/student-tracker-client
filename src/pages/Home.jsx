import React from 'react';
import './Home.css';
import { useAuthStore, useStudentsStore, useUIStore } from '../store';
import StudentList from '../components/StudentList';
import Modal from '../components/Modal';

function Home({ userType }) {
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

  const myAverageGrade = userType === 'student' ? '88.5' : averageGrade;
  const myAttendance =
    userType === 'student'
      ? '96'
      : `${Math.round((todayAttendance / totalStudents) * 100)}`;

  const renderContent = () => {
    if (userType === 'student') {
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

    switch (currentView) {
      case 'students':
        return <StudentList />;
      case 'grades':
        return <div>성적 관리 페이지</div>;
      case 'attendance':
        return <div>출석 관리 페이지</div>;
      case 'settings':
        return <div>설정 페이지</div>;
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
      <header className='home-header'>
        <h1 className='home-title'>학생 관리 시스템</h1>
        <div className='user-info'>
          <span className='user-type'>
            {userType === 'teacher' ? '선생님' : '학생'} 모드
          </span>
          <button className='logout-btn' onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      {userType === 'teacher' && (
        <nav className='navigation'>
          <button
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            대시보드
          </button>
          <button
            className={`nav-btn ${currentView === 'students' ? 'active' : ''}`}
            onClick={() => setCurrentView('students')}
          >
            학생 관리
          </button>
          <button
            className={`nav-btn ${currentView === 'grades' ? 'active' : ''}`}
            onClick={() => setCurrentView('grades')}
          >
            성적 관리
          </button>
          <button
            className={`nav-btn ${currentView === 'attendance' ? 'active' : ''}`}
            onClick={() => setCurrentView('attendance')}
          >
            출석 관리
          </button>
        </nav>
      )}

      <main className='home-main'>
        {currentView === 'dashboard' && (
          <div className='dashboard-section'>
            <h3 className='dashboard-title'>대시보드</h3>
            <div className='dashboard-grid'>
              {userType === 'teacher' ? (
                <>
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
                </>
              ) : (
                <>
                  <div className='dashboard-card'>
                    <h4>내 평균 성적</h4>
                    <p className='card-number'>{myAverageGrade}점</p>
                  </div>
                  <div className='dashboard-card'>
                    <h4>출석률</h4>
                    <p className='card-number'>{myAttendance}%</p>
                  </div>
                  <div className='dashboard-card'>
                    <h4>완료한 과제</h4>
                    <p className='card-number'>12개</p>
                  </div>
                  <div className='dashboard-card'>
                    <h4>남은 과제</h4>
                    <p className='card-number'>2개</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {currentView !== 'dashboard' && renderContent()}
      </main>

      <Modal />
    </div>
  );
}

export default Home;
