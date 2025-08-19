import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import './GradeDetailModal.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

function GradeDetailModal({ grade, isOpen, onClose }) {
  if (!isOpen || !grade) return null;

  // 임시 데이터 (실제로는 서버에서 가져올 데이터)
  const gradeDetail = {
    ...grade,
    // 전체 8회차 성적 데이터 (실제로는 서버에서 가져올 데이터)
    allLectures: [
      { lecture: 1, myScore: 85, classAverage: 78, date: '2024-01-15' },
      { lecture: 2, myScore: 92, classAverage: 82, date: '2024-01-22' },
      { lecture: 3, myScore: 78, classAverage: 75, date: '2024-01-29' },
      { lecture: 4, myScore: 88, classAverage: 80, date: '2024-02-05' },
      { lecture: 5, myScore: 95, classAverage: 85, date: '2024-02-12' },
      { lecture: 6, myScore: 85, classAverage: 83, date: '2024-02-19' },
      { lecture: 7, myScore: 87, classAverage: 81, date: '2024-02-26' },
      { lecture: 8, myScore: 96, classAverage: 86, date: '2024-03-05' },
    ],
    // 과제 성적 데이터
    assignments: [
      { lecture: 1, grade: 'A', date: '2024-01-15' },
      { lecture: 2, grade: 'A', date: '2024-01-22' },
      { lecture: 3, grade: 'B', date: '2024-01-29' },
      { lecture: 4, grade: 'B', date: '2024-02-05' },
      { lecture: 5, grade: 'A', date: '2024-02-12' },
      { lecture: 6, grade: 'A', date: '2024-02-19' },
      { lecture: 7, grade: 'B', date: '2024-02-26' },
      { lecture: 8, grade: 'A', date: '2024-03-05' },
    ],
    // 출석 데이터
    attendance: {
      totalLectures: 8,
      attendedLectures: 7,
      attendanceRate: 87.5,
      lectures: [
        { lecture: 1, attended: true, date: '2024-01-15' },
        { lecture: 2, attended: true, date: '2024-01-22' },
        { lecture: 3, attended: true, date: '2024-01-29' },
        { lecture: 4, attended: true, date: '2024-02-05' },
        { lecture: 5, attended: true, date: '2024-02-12' },
        { lecture: 6, attended: false, date: '2024-02-19' },
        { lecture: 7, attended: true, date: '2024-02-26' },
        { lecture: 8, attended: true, date: '2024-03-05' },
      ],
    },
    // 단원별 오답분포 데이터
    wrongUnits: [
      { id: 1, name: '수와 연산', wrongCount: 3, totalCount: 15 },
      { id: 2, name: '분수와 소수', wrongCount: 2, totalCount: 12 },
      { id: 3, name: '도형의 성질', wrongCount: 4, totalCount: 18 },
      { id: 4, name: '측정', wrongCount: 1, totalCount: 10 },
      { id: 5, name: '확률과 통계', wrongCount: 2, totalCount: 8 },
    ],
    // 난이도별 오답분포 데이터
    wrongDifficulties: [
      { id: 1, name: '쉬움', wrongCount: 1, totalCount: 20 },
      { id: 2, name: '보통', wrongCount: 4, totalCount: 25 },
      { id: 3, name: '어려움', wrongCount: 6, totalCount: 15 },
      { id: 4, name: '매우 어려움', wrongCount: 1, totalCount: 5 },
    ],
    // 교사 피드백 데이터
    teacherFeedback: {
      date: '2024-03-05',
      content:
        '전반적으로 좋은 성적을 보여주고 있습니다. 특히 수와 연산 부분에서 안정적인 실력을 보여주었고, 도형의 성질 부분에서는 더 많은 연습이 필요합니다. 난이도가 높은 문제들에서 실수하는 경우가 있으니, 문제를 꼼꼼히 읽고 단계별로 풀이하는 습관을 기르시기 바랍니다. 다음 시험에서는 더 좋은 결과를 기대합니다.',
    },
  };

  // 성적 추이 그래프 데이터
  const scoreTrendData = {
    labels: gradeDetail.allLectures.map(s => `${s.lecture}회차`),
    datasets: [
      {
        label: '반 평균',
        data: gradeDetail.allLectures.map(s => s.classAverage),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        type: 'line',
      },
      {
        label: '내 점수',
        data: gradeDetail.allLectures.map(s => s.myScore),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        type: 'bar',
      },
    ],
  };

  const scoreTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
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
          stepSize: 20,
        },
      },
    },
  };

  const getGradeColor = grade => {
    switch (grade) {
      case 'A':
        return '#10b981';
      case 'B':
        return '#3b82f6';
      case 'C':
        return '#f59e0b';
      case 'D':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getUnitStatus = (wrongCount, totalCount) => {
    const wrongRate = (wrongCount / totalCount) * 100;
    if (wrongRate >= 30) return 'weak';
    if (wrongRate >= 15) return 'improve';
    return 'good';
  };

  const getUnitStatusText = (wrongCount, totalCount) => {
    const wrongRate = (wrongCount / totalCount) * 100;
    if (wrongRate >= 30) return '취약';
    if (wrongRate >= 15) return '보완필요';
    return '양호';
  };

  return (
    <div className='grade-detail-modal-overlay' onClick={onClose}>
      <div
        className='grade-detail-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h2 className='grade-title'>{grade.title}</h2>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>

        {/* 하단 섹션 */}
        <div className='grade-detail-bottom'>
          <div className='bottom-grid'>
            {/* 왼쪽 - 두 개의 카드 */}
            <div className='left-column'>
              {/* 성적 추이 그래프 카드 */}
              <div className='detail-card score-trend-card'>
                <h3 className='section-title'>성적 추이</h3>
                <div className='chart-content'>
                  <div className='chart-container'>
                    <Line data={scoreTrendData} options={scoreTrendOptions} />
                  </div>
                </div>
              </div>

              {/* 출석 및 과제 카드 */}
              <div className='detail-card attendance-assignment-card'>
                <div className='attendance-assignment-content'>
                  <div className='attendance-section'>
                    <h3 className='section-title'>출석 현황</h3>
                    <div className='attendance-summary'>
                      <div className='attendance-circle'>
                        <span className='attendance-number'>
                          {gradeDetail.attendance.attendedLectures}
                        </span>
                        <span className='attendance-total'>
                          / {gradeDetail.attendance.totalLectures}
                        </span>
                      </div>
                      <div className='attendance-rate'>
                        {gradeDetail.attendance.attendanceRate}%
                      </div>
                    </div>
                    <div className='attendance-list'>
                      {gradeDetail.attendance.lectures.map(lecture => (
                        <div
                          key={lecture.lecture}
                          className={`attendance-item ${lecture.attended ? 'present' : 'absent'}`}
                        >
                          <span className='lecture-number'>
                            {lecture.lecture}회차
                          </span>
                          <span className='attendance-status'>
                            {lecture.attended ? '출석' : '결석'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='assignment-section'>
                    <h3 className='section-title'>과제 성적</h3>
                    <div className='assignment-list'>
                      {gradeDetail.assignments.map(assignment => (
                        <div
                          key={assignment.lecture}
                          className='assignment-item'
                        >
                          <span className='lecture-number'>
                            {assignment.lecture}회차
                          </span>
                          <span
                            className='assignment-grade'
                            style={{ color: getGradeColor(assignment.grade) }}
                          >
                            {assignment.grade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 - 오답분포 및 피드백 */}
            <div className='right-column'>
              {/* 단원별 오답분포 카드 */}
              <div className='detail-card wrong-unit-card'>
                <h3 className='section-title'>단원별 취약점</h3>
                <div className='wrong-unit-list'>
                  {gradeDetail.wrongUnits.map(unit => (
                    <div key={unit.id} className='wrong-unit-item'>
                      <div className='unit-info'>
                        <span className='unit-name'>{unit.name}</span>
                        <span
                          className={`unit-status ${getUnitStatus(unit.wrongCount, unit.totalCount)}`}
                        >
                          {getUnitStatusText(unit.wrongCount, unit.totalCount)}
                        </span>
                      </div>
                      <div className='unit-progress'>
                        <div className='progress-bar'>
                          <div
                            className='progress-fill'
                            style={{
                              width: `${(unit.wrongCount / unit.totalCount) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className='progress-text'>
                          <span className='wrong-count'>
                            {unit.wrongCount} 오답
                          </span>
                          <span className='separator'> / </span>
                          <span className='total-count'>
                            {unit.totalCount} 문제
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 난이도별 오답분포 카드 */}
              <div className='detail-card wrong-difficulty-card'>
                <h3 className='section-title'>난이도별 취약점</h3>
                <div className='wrong-difficulty-list'>
                  {gradeDetail.wrongDifficulties.map(difficulty => (
                    <div key={difficulty.id} className='wrong-difficulty-item'>
                      <div className='difficulty-info'>
                        <span className='difficulty-name'>
                          {difficulty.name}
                        </span>
                        <span
                          className={`difficulty-status ${getUnitStatus(difficulty.wrongCount, difficulty.totalCount)}`}
                        >
                          {getUnitStatusText(
                            difficulty.wrongCount,
                            difficulty.totalCount
                          )}
                        </span>
                      </div>
                      <div className='difficulty-progress'>
                        <div className='progress-bar'>
                          <div
                            className='progress-fill'
                            style={{
                              width: `${(difficulty.wrongCount / difficulty.totalCount) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className='progress-text'>
                          <span className='wrong-count'>
                            {difficulty.wrongCount} 오답
                          </span>
                          <span className='separator'> / </span>
                          <span className='total-count'>
                            {difficulty.totalCount} 문제
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 교사 피드백 카드 */}
              <div className='detail-card teacher-feedback-card'>
                <h3 className='section-title'>교사 피드백</h3>
                <div className='teacher-feedback-content'>
                  <div className='feedback-date'>
                    {gradeDetail.teacherFeedback.date}
                  </div>
                  <div className='feedback-text'>
                    {gradeDetail.teacherFeedback.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradeDetailModal;
