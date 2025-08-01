import React from 'react';
import './StudentHome.css';
import { useAuthStore, useUIStore } from '../store';
import StudentDashboard from '../components/StudentDashboard';
import SessionInfo from '../components/SessionInfo';
import GradeReport from '../components/GradeReport';
import AttendanceReport from '../components/AttendanceReport';
import WrongPattern from '../components/WrongPattern';

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
    className: '2학년 3반',
    completedSessions: 8,
    totalSessions: 12,
    attendanceRate: '96.2',
    totalAttendanceDays: 25,
    totalSchoolDays: 26,
    averageScore: '88.5',
    assignmentCompletion: '92.3',
    // 수강 중인 반 정보
    classes: [
      {
        id: 1,
        name: '수학 기초반',
        teacher: '김수학',
        totalSessions: 12,
        completedSessions: 8,
        sessions: [
          {
            id: 1,
            title: '1회차 - 수와 연산',
            date: '2024-01-15',
            status: 'completed',
          },
          {
            id: 2,
            title: '2회차 - 분수와 소수',
            date: '2024-01-22',
            status: 'completed',
          },
          {
            id: 3,
            title: '3회차 - 도형의 성질',
            date: '2024-01-29',
            status: 'completed',
          },
          {
            id: 4,
            title: '4회차 - 측정',
            date: '2024-02-05',
            status: 'completed',
          },
          {
            id: 5,
            title: '5회차 - 확률과 통계',
            date: '2024-02-12',
            status: 'completed',
          },
          {
            id: 6,
            title: '6회차 - 문자와 식',
            date: '2024-02-19',
            status: 'completed',
          },
          {
            id: 7,
            title: '7회차 - 함수',
            date: '2024-02-26',
            status: 'completed',
          },
          {
            id: 8,
            title: '8회차 - 기하',
            date: '2024-03-04',
            status: 'completed',
          },
          {
            id: 9,
            title: '9회차 - 수열',
            date: '2024-03-11',
            status: 'upcoming',
          },
          {
            id: 10,
            title: '10회차 - 미적분',
            date: '2024-03-18',
            status: 'upcoming',
          },
          {
            id: 11,
            title: '11회차 - 확률',
            date: '2024-03-25',
            status: 'upcoming',
          },
          {
            id: 12,
            title: '12회차 - 종합평가',
            date: '2024-04-01',
            status: 'upcoming',
          },
        ],
      },
      {
        id: 2,
        name: '영어 심화반',
        teacher: '박영어',
        totalSessions: 10,
        completedSessions: 6,
        sessions: [
          {
            id: 1,
            title: '1회차 - Grammar Review',
            date: '2024-01-16',
            status: 'completed',
          },
          {
            id: 2,
            title: '2회차 - Reading Comprehension',
            date: '2024-01-23',
            status: 'completed',
          },
          {
            id: 3,
            title: '3회차 - Vocabulary Building',
            date: '2024-01-30',
            status: 'completed',
          },
          {
            id: 4,
            title: '4회차 - Writing Skills',
            date: '2024-02-06',
            status: 'completed',
          },
          {
            id: 5,
            title: '5회차 - Listening Practice',
            date: '2024-02-13',
            status: 'completed',
          },
          {
            id: 6,
            title: '6회차 - Speaking Practice',
            date: '2024-02-20',
            status: 'completed',
          },
          {
            id: 7,
            title: '7회차 - TOEIC Practice',
            date: '2024-02-27',
            status: 'upcoming',
          },
          {
            id: 8,
            title: '8회차 - Essay Writing',
            date: '2024-03-05',
            status: 'upcoming',
          },
          {
            id: 9,
            title: '9회차 - Advanced Grammar',
            date: '2024-03-12',
            status: 'upcoming',
          },
          {
            id: 10,
            title: '10회차 - Final Test',
            date: '2024-03-19',
            status: 'upcoming',
          },
        ],
      },
      {
        id: 3,
        name: '과학 탐구반',
        teacher: '이과학',
        totalSessions: 8,
        completedSessions: 5,
        sessions: [
          {
            id: 1,
            title: '1회차 - 물리학 기초',
            date: '2024-01-17',
            status: 'completed',
          },
          {
            id: 2,
            title: '2회차 - 화학 기초',
            date: '2024-01-24',
            status: 'completed',
          },
          {
            id: 3,
            title: '3회차 - 생물학 기초',
            date: '2024-01-31',
            status: 'completed',
          },
          {
            id: 4,
            title: '4회차 - 지구과학 기초',
            date: '2024-02-07',
            status: 'completed',
          },
          {
            id: 5,
            title: '5회차 - 실험 방법론',
            date: '2024-02-14',
            status: 'completed',
          },
          {
            id: 6,
            title: '6회차 - 탐구 프로젝트',
            date: '2024-02-21',
            status: 'upcoming',
          },
          {
            id: 7,
            title: '7회차 - 과학사',
            date: '2024-02-28',
            status: 'upcoming',
          },
          {
            id: 8,
            title: '8회차 - 종합 평가',
            date: '2024-03-06',
            status: 'upcoming',
          },
        ],
      },
    ],
    // 그래프용 데이터
    testScores: [
      { session: 1, myScore: 85, classAverage: 78 },
      { session: 2, myScore: 92, classAverage: 82 },
      { session: 3, myScore: 88, classAverage: 80 },
      { session: 4, myScore: 95, classAverage: 85 },
      { session: 5, myScore: 90, classAverage: 83 },
      { session: 6, myScore: 87, classAverage: 79 },
      { session: 7, myScore: 93, classAverage: 86 },
      { session: 8, myScore: 89, classAverage: 84 },
    ],
    assignmentScores: [
      { session: 1, myScore: 88, classAverage: 82 },
      { session: 2, myScore: 95, classAverage: 85 },
      { session: 3, myScore: 92, classAverage: 87 },
      { session: 4, myScore: 89, classAverage: 83 },
      { session: 5, myScore: 96, classAverage: 88 },
      { session: 6, myScore: 91, classAverage: 86 },
      { session: 7, myScore: 94, classAverage: 89 },
      { session: 8, myScore: 90, classAverage: 85 },
    ],
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
      case 'session-info':
        return <SessionInfo studentData={studentData} />;
      case 'grade-report':
        return <GradeReport />;
      case 'attendance-report':
        return <AttendanceReport />;
      case 'wrong-pattern':
        return <WrongPattern />;
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
            className={`nav-btn ${currentView === 'session-info' ? 'active' : ''}`}
            onClick={() => setCurrentView('session-info')}
          >
            회차별 정보
          </button>
          <button
            className={`nav-btn ${currentView === 'grade-report' ? 'active' : ''}`}
            onClick={() => setCurrentView('grade-report')}
          >
            성적 확인
          </button>
          <button
            className={`nav-btn ${currentView === 'attendance-report' ? 'active' : ''}`}
            onClick={() => setCurrentView('attendance-report')}
          >
            출석 확인
          </button>
          <button
            className={`nav-btn ${currentView === 'wrong-pattern' ? 'active' : ''}`}
            onClick={() => setCurrentView('wrong-pattern')}
          >
            오답패턴 분석
          </button>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className='main-content'>
        {currentView === 'dashboard' && (
          <StudentDashboard studentData={studentData} />
        )}

        {currentView !== 'dashboard' && renderContent()}
      </main>
    </div>
  );
}

export default StudentHome;
