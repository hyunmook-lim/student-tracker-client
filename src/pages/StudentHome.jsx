import React from 'react';
import './StudentHome.css';
import { useAuthStore, useUIStore } from '../store';
import LectureInfoComponent from '../components/student/component/LectureInfoComponent';
import GradeReportComponent from '../components/student/component/GradeReportComponent';
import AttendanceCheckComponent from '../components/student/component/AttendanceCheckComponent';
import WrongPatternComponent from '../components/student/component/WrongPatternComponent';

function StudentHome() {
  const { logout, currentUser } = useAuthStore();
  const { currentView, setCurrentView } = useUIStore();

  // 학생 페이지 진입 시 기본 뷰 설정
  React.useEffect(() => {
    if (currentView === 'dashboard' || !currentView) {
      setCurrentView('lecture-info');
    }
  }, [currentView, setCurrentView]);

  const handleLogout = () => {
    logout();
  };

  // 학생 데이터 (실제로는 서버에서 가져올 데이터)
  const studentData = {
    name: '김학생',
    studentId: '2024001',
    className: '2학년 3반',
    completedLectures: 8,
    totalLectures: 12,
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
        totalLectures: 12,
        completedLectures: 8,
        lectures: [
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
        totalLectures: 10,
        completedLectures: 6,
        lectures: [
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
        totalLectures: 8,
        completedLectures: 5,
        lectures: [
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
      { lecture: 1, myScore: 85, classAverage: 78 },
      { lecture: 2, myScore: 92, classAverage: 82 },
      { lecture: 3, myScore: 88, classAverage: 80 },
      { lecture: 4, myScore: 95, classAverage: 85 },
      { lecture: 5, myScore: 90, classAverage: 83 },
      { lecture: 6, myScore: 87, classAverage: 79 },
      { lecture: 7, myScore: 93, classAverage: 86 },
      { lecture: 8, myScore: 89, classAverage: 84 },
    ],
    assignmentScores: [
      { lecture: 1, myScore: 88, classAverage: 82 },
      { lecture: 2, myScore: 95, classAverage: 85 },
      { lecture: 3, myScore: 92, classAverage: 87 },
      { lecture: 4, myScore: 89, classAverage: 83 },
      { lecture: 5, myScore: 96, classAverage: 88 },
      { lecture: 6, myScore: 91, classAverage: 86 },
      { lecture: 7, myScore: 94, classAverage: 89 },
      { lecture: 8, myScore: 90, classAverage: 85 },
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
      case 'lecture-info':
        return <LectureInfoComponent studentData={studentData} />;
      case 'grade-report':
        return <GradeReportComponent />;
      case 'attendance-report':
        return <AttendanceCheckComponent />;
      case 'wrong-pattern':
        return <WrongPatternComponent />;
      default:
        return <LectureInfoComponent studentData={studentData} />;
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
          <span className='user-type'>
            학생 모드 - {currentUser?.name || '학생'}
          </span>
          <button className='logout-btn' onClick={handleLogout}>
            로그아웃
          </button>
        </div>

        <nav className='sidebar-nav'>
          <button
            className={`nav-btn ${currentView === 'lecture-info' ? 'active' : ''}`}
            onClick={() => setCurrentView('lecture-info')}
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
      <main className='main-content'>{renderContent()}</main>
    </div>
  );
}

export default StudentHome;
