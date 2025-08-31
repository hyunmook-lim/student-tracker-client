import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAuthStore } from '../../../store';
import { getStudentLectureResultByStudentAndLecture } from '../../../api/studentLectureResultApi';
import { exportToPDF } from '../../../utils/pdfExport';
import './LectureDetailModal.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function LectureDetailModal({ lecture, isOpen, onClose }) {
  const { currentUser } = useAuthStore();
  const [lectureDetail, setLectureDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLectureDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!currentUser?.uid || !lecture?.uid) {
        setError('사용자 또는 강의 정보가 없습니다.');
        return;
      }

      const result = await getStudentLectureResultByStudentAndLecture(
        currentUser.uid,
        lecture.uid
      );

      if (result.success) {
        console.log(
          '받아온 JSON 데이터 구조:',
          JSON.stringify(result.data, null, 2)
        );
        setLectureDetail(result.data);
      } else {
        setError(result.error);
        console.error('강의 상세 정보 로드 실패:', result.error);
      }
    } catch (error) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('강의 상세 정보 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, lecture]);

  // API에서 데이터 로딩
  useEffect(() => {
    if (isOpen && lecture && currentUser) {
      fetchLectureDetail();
    }
  }, [isOpen, lecture, currentUser, fetchLectureDetail]);

  if (!isOpen || !lecture) return null;

  // 실제 데이터 또는 로딩/에러 상태에 따른 기본 데이터 사용
  const displayData = lectureDetail
    ? {
        attendance: {
          status: lectureDetail.isAttended ? '출석' : '결석',
          date: lectureDetail.createdAt || new Date().toISOString(),
          time: '09:00',
          note: lectureDetail.isAttended ? '출석 완료' : '결석',
        },
        assignment: {
          status: lectureDetail.assignmentScore ? '제출' : '미제출',
          score: lectureDetail.assignmentScore || 'N/A',
          grade: lectureDetail.assignmentScore || 'N/A',
          submittedAt: lectureDetail.createdAt || 'N/A',
          feedback: '피드백 없음',
        },
        test: {
          score: lectureDetail.studentScore || 0,
          rank: lectureDetail.classRank || 0,
          classAverage: lectureDetail.classAverage || 0,
          totalStudents: 0,
          maxScore: lectureDetail.totalScore || 100,
        },
        homework: {
          list: lectureDetail.homework || [],
          status:
            lectureDetail.homework && lectureDetail.homework.length > 0
              ? '있음'
              : '없음',
        },
        solvedProblems: lectureDetail.questionResults
          ? lectureDetail.questionResults.map(q => ({
              id: q.uid,
              questionNumber: q.questionNumber,
              status: q.isCorrect ? 'correct' : 'incorrect',
              majorUnit: q.mainTopic,
              minorUnit: q.subTopic,
              difficulty: q.difficulty,
              maxScore: q.maxScore,
            }))
          : [],
        wrongUnitDistribution: (() => {
          if (!lectureDetail.questionResults) return { labels: [], data: [] };
          const wrongAnswers = lectureDetail.questionResults.filter(
            q => !q.isCorrect
          );
          const unitCounts = {};
          wrongAnswers.forEach(q => {
            const unit = q.mainTopic;
            unitCounts[unit] = (unitCounts[unit] || 0) + 1;
          });
          return {
            labels: Object.keys(unitCounts),
            data: Object.values(unitCounts),
          };
        })(),
        difficultyDistribution: (() => {
          if (!lectureDetail.questionResults) return { labels: [], data: [] };
          const wrongAnswers = lectureDetail.questionResults.filter(
            q => !q.isCorrect
          );
          const difficultyCounts = {};
          wrongAnswers.forEach(q => {
            const difficulty = q.difficulty;
            difficultyCounts[difficulty] =
              (difficultyCounts[difficulty] || 0) + 1;
          });
          return {
            labels: Object.keys(difficultyCounts),
            data: Object.values(difficultyCounts),
          };
        })(),
      }
    : {
        attendance: {
          status: '로딩 중',
          date: lecture.lectureDate || new Date().toISOString(),
          time: '09:00',
          note: '데이터 로딩 중...',
        },
        assignment: {
          status: '로딩 중',
          score: 'N/A',
          grade: 'N/A',
          submittedAt: 'N/A',
          feedback: '데이터 로딩 중...',
        },
        test: {
          score: 0,
          rank: 0,
          classAverage: 0,
          totalStudents: 0,
          maxScore: 100,
        },
        homework: {
          list: [],
          status: '로딩 중',
        },
        solvedProblems: [],
        wrongUnitDistribution: {
          labels: [],
          data: [],
        },
        difficultyDistribution: {
          labels: [],
          data: [],
        },
      };

  // 그래프 데이터 설정
  const wrongUnitChartData = {
    labels: displayData.wrongUnitDistribution?.labels || [],
    datasets: [
      {
        data: displayData.wrongUnitDistribution?.data || [],
        backgroundColor: [
          '#3b82f6', // 파란색
          '#10b981', // 초록색
          '#f59e0b', // 주황색
          '#ef4444', // 빨간색
          '#8b5cf6', // 보라색
          '#06b6d4', // 청록색
          '#f97316', // 주황색
          '#84cc16', // 연두색
          '#ec4899', // 분홍색
          '#6366f1', // 인디고색
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const difficultyChartData = {
    labels: displayData.difficultyDistribution?.labels || [],
    datasets: [
      {
        data: displayData.difficultyDistribution?.data || [],
        backgroundColor: [
          '#10b981', // 초록색
          '#f59e0b', // 주황색
          '#ef4444', // 빨간색
          '#3b82f6', // 파란색
          '#8b5cf6', // 보라색
          '#06b6d4', // 청록색
          '#f97316', // 주황색
          '#84cc16', // 연두색
        ],
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

  const handlePDFExport = async () => {
    // WrongPatternModal과 동일한 방식으로 단순화
    await exportToPDF(
      'lecture-detail-content',
      `강의상세_${lecture.lectureName || '강의'}.pdf`
    );
  };

  return (
    <div className='lecture-detail-modal-overlay' onClick={onClose}>
      <div
        id='lecture-detail-content'
        className='lecture-detail-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h2 className='lecture-title'>
            {lecture.lectureName || lecture.title || '강의 상세'}
          </h2>
          <div className='modal-buttons'>
            <button
              className='pdf-export-btn'
              onClick={handlePDFExport}
              title='PDF로 내보내기'
            >
              📄 PDF
            </button>
            <button className='close-btn' onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        {/* 로딩/에러 상태 표시 */}
        {loading && (
          <div className='loading-overlay'>
            <div className='loading-spinner'></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className='error-message'>
            <p>⚠️ {error}</p>
            <button onClick={fetchLectureDetail} className='retry-btn'>
              다시 시도
            </button>
          </div>
        )}

        <div className='lecture-detail-grid'>
          {/* 출결 및 과제 카드 */}
          <div className='detail-card attendance-assignment-card'>
            <h3 className='section-title'>출결 및 과제</h3>
            <div className='attendance-assignment-display'>
              <div className='info-section'>
                <div className='info-label'>출석 여부</div>
                <div
                  className={`status-display ${displayData.attendance.status === '출석' ? 'present' : 'absent'}`}
                >
                  {displayData.attendance.status}
                </div>
              </div>
              <div className='info-section'>
                <div className='info-label'>과제 점수</div>
                <div
                  className={`grade-display ${displayData.assignment.grade}`}
                >
                  {displayData.assignment.grade}
                </div>
              </div>
            </div>
          </div>

          {/* 테스트 결과 카드 */}
          <div className='detail-card test-result-card'>
            <h3 className='section-title'>테스트 결과</h3>
            <div className='test-score-display'>
              <div className='main-score'>
                <span className='score-number'>{displayData.test.score}</span>
                <span className='score-total'>
                  / {displayData.test.maxScore}
                </span>
                <span className='score-unit'>점</span>
              </div>
              <div className='score-details'>
                <div className='info-item'>
                  <span className='label'>등수:</span>
                  <span className='rank'>{displayData.test.rank}등</span>
                </div>
                <div className='info-item'>
                  <span className='label'>반 평균:</span>
                  <span>{displayData.test.classAverage.toFixed(1)}점</span>
                </div>
              </div>
            </div>
          </div>

          {/* 숙제 카드 */}
          <div className='detail-card homework-card'>
            <h3 className='section-title'>숙제</h3>
            <div className='homework-list'>
              {displayData.homework.list &&
              displayData.homework.list.length > 0 ? (
                displayData.homework.list.map((homeworkItem, index) => (
                  <div key={index} className='homework-item'>
                    <span className='homework-number'>{index + 1}.</span>
                    <span className='homework-title'>{homeworkItem}</span>
                  </div>
                ))
              ) : (
                <div className='no-homework'>
                  {loading
                    ? '숙제 정보 로딩 중...'
                    : '이번 회차에는 숙제가 없습니다.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className='lecture-detail-bottom'>
          <div className='bottom-grid'>
            {/* 왼쪽 - 푼 문제 리스트 */}
            <div className='detail-card problems-list-card'>
              <h3 className='section-title'>푼 문제 리스트</h3>
              <div className='problems-list'>
                {displayData.solvedProblems &&
                displayData.solvedProblems.length > 0 ? (
                  displayData.solvedProblems.map(problem => (
                    <div
                      key={problem.id}
                      className={`problem-item ${problem.status}`}
                    >
                      <div className='problem-left'>
                        <div
                          className={`problem-status-badge ${problem.status}`}
                        ></div>
                        <span className='problem-number'>
                          {problem.questionNumber}.
                        </span>
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
                        <span className='score-badge'>
                          {problem.maxScore}점
                        </span>
                        <span className={`status-badge ${problem.status}`}>
                          {problem.status === 'correct' ? '정답' : '오답'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='empty-problems-message'>
                    {loading
                      ? '문제 데이터 로딩 중...'
                      : '문제 데이터가 없습니다.'}
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽 - 그래프들 */}
            <div className='charts-column'>
              {/* 오답 단원 분포 그래프 */}
              <div className='detail-card chart-card'>
                <h3 className='section-title'>오답 단원 분포</h3>
                <div className='chart-content'>
                  <div className='chart-container'>
                    {wrongUnitChartData.labels.length > 0 ? (
                      <>
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
                                    wrongUnitChartData.datasets[0]
                                      .backgroundColor[index],
                                }}
                              ></div>
                              <span className='legend-label'>{label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className='empty-chart-message'>
                        {loading
                          ? '차트 데이터 로딩 중...'
                          : '오답이 없습니다.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 난이도별 오답 그래프 */}
              <div className='detail-card chart-card'>
                <h3 className='section-title'>난이도별 오답</h3>
                <div className='chart-content'>
                  <div className='chart-container'>
                    {difficultyChartData.labels.length > 0 ? (
                      <>
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
                                    difficultyChartData.datasets[0]
                                      .backgroundColor[index],
                                }}
                              ></div>
                              <span className='legend-label'>{label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className='empty-chart-message'>
                        {loading
                          ? '차트 데이터 로딩 중...'
                          : '오답이 없습니다.'}
                      </div>
                    )}
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

export default LectureDetailModal;
