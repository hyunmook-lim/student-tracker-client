import React from 'react';
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
import './StudentDashboard.css';

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

function StudentDashboard({ studentData }) {
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

  return (
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
            {studentData.totalAttendanceDays}/{studentData.totalSchoolDays}일
          </p>
        </div>
        <div className='dashboard-card'>
          <h4>평균 점수</h4>
          <p className='card-number'>{studentData.averageScore}점</p>
        </div>
        <div className='dashboard-card'>
          <h4>과제 평균 완성도</h4>
          <p className='card-number'>{studentData.assignmentCompletion}%</p>
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
  );
}

export default StudentDashboard;
