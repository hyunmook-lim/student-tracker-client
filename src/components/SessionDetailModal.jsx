import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './SessionDetailModal.css';

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
      {
        id: 1,
        majorUnit: '수와 연산',
        minorUnit: '덧셈',
        difficulty: '중',
        status: 'correct',
      },
      {
        id: 2,
        majorUnit: '수와 연산',
        minorUnit: '뺄셈',
        difficulty: '중',
        status: 'correct',
      },
      {
        id: 3,
        majorUnit: '수와 연산',
        minorUnit: '곱셈',
        difficulty: '중상',
        status: 'wrong',
      },
      {
        id: 4,
        majorUnit: '수와 연산',
        minorUnit: '나눗셈',
        difficulty: '중상',
        status: 'correct',
      },
      {
        id: 5,
        majorUnit: '분수와 소수',
        minorUnit: '분수 비교',
        difficulty: '상',
        status: 'wrong',
      },
      {
        id: 6,
        majorUnit: '분수와 소수',
        minorUnit: '소수 계산',
        difficulty: '중상',
        status: 'correct',
      },
      {
        id: 7,
        majorUnit: '도형의 성질',
        minorUnit: '삼각형',
        difficulty: '중',
        status: 'correct',
      },
      {
        id: 8,
        majorUnit: '도형의 성질',
        minorUnit: '사각형',
        difficulty: '상',
        status: 'wrong',
      },
      {
        id: 9,
        majorUnit: '도형의 성질',
        minorUnit: '원',
        difficulty: '중',
        status: 'correct',
      },
      {
        id: 10,
        majorUnit: '측정',
        minorUnit: '길이',
        difficulty: '중',
        status: 'correct',
      },
      {
        id: 11,
        majorUnit: '측정',
        minorUnit: '무게',
        difficulty: '중상',
        status: 'wrong',
      },
      {
        id: 12,
        majorUnit: '측정',
        minorUnit: '부피',
        difficulty: '최상',
        status: 'correct',
      },
      {
        id: 13,
        majorUnit: '확률과 통계',
        minorUnit: '확률',
        difficulty: '상',
        status: 'correct',
      },
      {
        id: 14,
        majorUnit: '확률과 통계',
        minorUnit: '통계',
        difficulty: '최상',
        status: 'wrong',
      },
      {
        id: 15,
        majorUnit: '문자와 식',
        minorUnit: '방정식',
        difficulty: '최상',
        status: 'correct',
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
    layout: {
      padding: 0,
    },
    elements: {
      arc: {
        borderWidth: 1,
      },
    },
    plugins: {
      legend: {
        display: false, // 기본 범례 숨김
      },
    },
  };

  return (
    <div className='session-detail-modal-overlay' onClick={onClose}>
      <div
        className='session-detail-modal-content'
        onClick={e => e.stopPropagation()}
      >
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
                    <div className='problem-left'>
                      <div
                        className={`problem-status-badge ${problem.status}`}
                      ></div>
                      <span className='problem-number'>{problem.id}.</span>
                      <span className='problem-major-unit'>
                        {problem.majorUnit}
                      </span>
                      <span className='problem-minor-unit'>
                        {problem.minorUnit}
                      </span>
                    </div>
                    <div className='problem-right'>
                      <span
                        className={`difficulty-badge ${problem.difficulty}`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className={`status-badge ${problem.status}`}>
                        {problem.status === 'correct' ? '정답' : '오답'}
                      </span>
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
                <div className='chart-content'>
                  <div className='chart-container'>
                    <Doughnut
                      data={wrongUnitChartData}
                      options={chartOptions}
                    />
                    <div className='chart-legend'>
                      {wrongUnitChartData.labels.map((label, index) => (
                        <div key={label} className='legend-item'>
                          <div
                            className='legend-color'
                            style={{
                              backgroundColor:
                                wrongUnitChartData.datasets[0].backgroundColor[
                                  index
                                ],
                            }}
                          ></div>
                          <span className='legend-label'>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 난이도별 오답 그래프 */}
              <div className='detail-card chart-card'>
                <h3 className='section-title'>난이도별 오답</h3>
                <div className='chart-content'>
                  <div className='chart-container'>
                    <Doughnut
                      data={difficultyChartData}
                      options={chartOptions}
                    />
                    <div className='chart-legend'>
                      {difficultyChartData.labels.map((label, index) => (
                        <div key={label} className='legend-item'>
                          <div
                            className='legend-color'
                            style={{
                              backgroundColor:
                                difficultyChartData.datasets[0].backgroundColor[
                                  index
                                ],
                            }}
                          ></div>
                          <span className='legend-label'>{label}</span>
                        </div>
                      ))}
                    </div>
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

export default SessionDetailModal;
