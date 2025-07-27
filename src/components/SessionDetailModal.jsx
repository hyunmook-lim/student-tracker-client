import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function SessionDetailModal({ session, isOpen, onClose }) {
  if (!isOpen || !session) return null;

  // 임시 데이터 (실제로는 서버에서 가져올 데이터)
  const sessionDetail = {
    attendance: {
      status: '출석',
      date: session.date,
      time: '09:00',
      note: '정상 출석',
    },
    assignment: {
      status: '제출완료',
      score: 95,
      grade: 'A',
      submittedAt: '2024-01-15 23:59',
      feedback: '매우 잘했습니다!',
    },
    test: {
      score: 88,
      rank: 5,
      classAverage: 82,
      totalStudents: 25,
      maxScore: 100,
    },
    homework: {
      title: '수학 문제집 1-5페이지',
      dueDate: '2024-01-20',
      status: '미제출',
      description: '교과서 1장의 연습문제를 풀어오세요.',
    },
    // 푼 문제 리스트
    solvedProblems: [
      { id: 1, title: '수와 연산 - 덧셈', status: 'correct', time: '2분 30초' },
      { id: 2, title: '수와 연산 - 뺄셈', status: 'correct', time: '1분 45초' },
      { id: 3, title: '수와 연산 - 곱셈', status: 'wrong', time: '3분 20초' },
      {
        id: 4,
        title: '수와 연산 - 나눗셈',
        status: 'correct',
        time: '2분 15초',
      },
      {
        id: 5,
        title: '분수와 소수 - 분수 비교',
        status: 'wrong',
        time: '4분 10초',
      },
      {
        id: 6,
        title: '분수와 소수 - 소수 계산',
        status: 'correct',
        time: '2분 50초',
      },
      {
        id: 7,
        title: '도형의 성질 - 삼각형',
        status: 'correct',
        time: '3분 5초',
      },
      {
        id: 8,
        title: '도형의 성질 - 사각형',
        status: 'wrong',
        time: '5분 30초',
      },
      { id: 9, title: '도형의 성질 - 원', status: 'correct', time: '2분 40초' },
      { id: 10, title: '측정 - 길이', status: 'correct', time: '1분 55초' },
      { id: 11, title: '측정 - 무게', status: 'wrong', time: '3분 45초' },
      { id: 12, title: '측정 - 부피', status: 'correct', time: '2분 20초' },
      {
        id: 13,
        title: '확률과 통계 - 확률',
        status: 'correct',
        time: '2분 10초',
      },
      {
        id: 14,
        title: '확률과 통계 - 통계',
        status: 'wrong',
        time: '4분 25초',
      },
      {
        id: 15,
        title: '문자와 식 - 방정식',
        status: 'correct',
        time: '3분 15초',
      },
    ],
    // 오답 단원 분포 데이터
    wrongUnitDistribution: {
      labels: [
        '수와 연산',
        '분수와 소수',
        '도형의 성질',
        '측정',
        '확률과 통계',
      ],
      data: [1, 1, 1, 1, 1],
    },
    // 난이도별 오답 데이터
    difficultyDistribution: {
      labels: ['쉬움', '보통', '어려움'],
      data: [1, 2, 2],
    },
  };

  // 그래프 데이터 설정
  const wrongUnitChartData = {
    labels: sessionDetail.wrongUnitDistribution.labels,
    datasets: [
      {
        data: sessionDetail.wrongUnitDistribution.data,
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const difficultyChartData = {
    labels: sessionDetail.difficultyDistribution.labels,
    datasets: [
      {
        data: sessionDetail.difficultyDistribution.data,
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='session-detail-modal' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h2 className='session-title'>{session.title}</h2>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='session-detail-grid'>
          {/* 출결 및 과제 카드 */}
          <div className='detail-card attendance-assignment-card'>
            <h3 className='section-title'>출결 및 과제</h3>
            <div className='attendance-assignment-display'>
              <div className='info-section'>
                <div className='info-label'>출석 여부</div>
                <div
                  className={`status-display ${sessionDetail.attendance.status === '출석' ? 'present' : 'absent'}`}
                >
                  {sessionDetail.attendance.status}
                </div>
              </div>
              <div className='info-section'>
                <div className='info-label'>과제 점수</div>
                <div
                  className={`grade-display ${sessionDetail.assignment.grade}`}
                >
                  {sessionDetail.assignment.grade}
                </div>
              </div>
            </div>
          </div>

          {/* 테스트 결과 카드 */}
          <div className='detail-card test-result-card'>
            <h3 className='section-title'>테스트 결과</h3>
            <div className='test-score-display'>
              <div className='main-score'>
                <span className='score-number'>{sessionDetail.test.score}</span>
                <span className='score-unit'>점</span>
              </div>
              <div className='score-details'>
                <div className='info-item'>
                  <span className='label'>등수:</span>
                  <span className='rank'>{sessionDetail.test.rank}등</span>
                </div>
                <div className='info-item'>
                  <span className='label'>반 평균:</span>
                  <span>{sessionDetail.test.classAverage}점</span>
                </div>
              </div>
            </div>
          </div>

          {/* 숙제 카드 */}
          <div className='detail-card homework-card'>
            <h3 className='section-title'>숙제</h3>
            <div className='homework-list'>
              <div className='homework-item'>
                <span className='homework-title'>
                  {sessionDetail.homework.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className='session-detail-bottom'>
          <div className='bottom-grid'>
            {/* 왼쪽 - 푼 문제 리스트 */}
            <div className='detail-card problems-list-card'>
              <h3 className='section-title'>푼 문제 리스트</h3>
              <div className='problems-list'>
                {sessionDetail.solvedProblems.map(problem => (
                  <div
                    key={problem.id}
                    className={`problem-item ${problem.status}`}
                  >
                    <div className='problem-info'>
                      <span className='problem-number'>{problem.id}.</span>
                      <span className='problem-title'>{problem.title}</span>
                    </div>
                    <div className='problem-details'>
                      <span className={`status-badge ${problem.status}`}>
                        {problem.status === 'correct' ? '정답' : '오답'}
                      </span>
                      <span className='problem-time'>{problem.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 - 그래프들 */}
            <div className='charts-column'>
              {/* 오답 단원 분포 그래프 */}
              <div className='detail-card chart-card'>
                <h3 className='section-title'>오답 단원 분포</h3>
                <div className='chart-container'>
                  <Doughnut data={wrongUnitChartData} options={chartOptions} />
                </div>
              </div>

              {/* 난이도별 오답 그래프 */}
              <div className='detail-card chart-card'>
                <h3 className='section-title'>난이도별 오답</h3>
                <div className='chart-container'>
                  <Doughnut data={difficultyChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetailModal;
