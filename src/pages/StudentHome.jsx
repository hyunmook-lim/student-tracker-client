import React from 'react';
import './StudentHome.css';
import { useAuthStore, useUIStore } from '../store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  // 그래프 데이터 설정
  const testChartData = {
    labels: studentData.testScores.map(item => `${item.session}회차`),
    datasets: [
      {
        label: '본인 점수',
        data: studentData.testScores.map(item => item.myScore),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        type: 'line',
      },
      {
        label: '반 평균',
        data: studentData.testScores.map(item => item.classAverage),
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: '#9ca3af',
        borderWidth: 1,
        type: 'bar',
      },
    ],
  };

  const assignmentChartData = {
    labels: studentData.assignmentScores.map(item => `${item.session}회차`),
    datasets: [
      {
        label: '본인 완성도',
        data: studentData.assignmentScores.map(item => item.myScore),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: false,
        type: 'line',
      },
      {
        label: '반 평균',
        data: studentData.assignmentScores.map(item => item.classAverage),
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: '#9ca3af',
        borderWidth: 1,
        type: 'bar',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + '점';
          },
        },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
  };

  const renderContent = () => {
    switch (currentView) {
      case 'session-info':
        return (
          <div className='session-info'>
            <h3>회차별 정보</h3>
            <p>회차별 정보 페이지입니다.</p>
          </div>
        );
      case 'grade-report':
        return (
          <div className='grade-report'>
            <h3>성적 확인</h3>
            <p>성적 확인 페이지입니다.</p>
          </div>
        );
      case 'attendance-report':
        return (
          <div className='attendance-report'>
            <h3>출석 확인</h3>
            <p>출석 확인 페이지입니다.</p>
          </div>
        );
      case 'wrong-pattern':
        return (
          <div className='wrong-pattern'>
            <h3>오답패턴 분석</h3>
            <p>오답패턴 분석 페이지입니다.</p>
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
          <div className='dashboard-section'>
            <h3 className='dashboard-title'>대시보드</h3>
            <div className='dashboard-grid'>
              <div className='dashboard-card'>
                <h4>반명 / 진행된 회차</h4>
                <p className='card-number'>{studentData.className}</p>
                <p className='card-subtitle'>
                  {studentData.completedSessions}/{studentData.totalSessions}
                  회차
                </p>
              </div>
              <div className='dashboard-card'>
                <h4>출석률</h4>
                <p className='card-number'>{studentData.attendanceRate}%</p>
                <p className='card-subtitle'>
                  {studentData.totalAttendanceDays}/
                  {studentData.totalSchoolDays}일
                </p>
              </div>
              <div className='dashboard-card'>
                <h4>평균 점수</h4>
                <p className='card-number'>{studentData.averageScore}점</p>
              </div>
              <div className='dashboard-card'>
                <h4>과제 평균 완성도</h4>
                <p className='card-number'>
                  {studentData.assignmentCompletion}%
                </p>
              </div>
            </div>

            {/* 성적 분포 그래프 */}
            <div className='charts-section'>
              <h3 className='charts-title'>성적 분포</h3>

              {/* 테스트 점수 그래프 */}
              <div className='chart-container'>
                <h4 className='chart-subtitle'>회차별 테스트 점수</h4>
                <div className='chart-wrapper'>
                  <Line
                    key='test-chart'
                    data={testChartData}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* 과제 완성도 그래프 */}
              <div className='chart-container'>
                <h4 className='chart-subtitle'>회차별 과제 완성도</h4>
                <div className='chart-wrapper'>
                  <Line
                    key='assignment-chart'
                    data={assignmentChartData}
                    options={chartOptions}
                  />
                </div>
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
