import React, { useState, useEffect } from 'react';
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
import { getStudentReport } from '../../../api/studentApi';
import useAuthStore from '../../../store/authStore';
import { exportToPDF } from '../../../utils/pdfExport';
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
  const { currentUser } = useAuthStore();
  const [gradeDetail, setGradeDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API에서 성적표 데이터 가져오기
  useEffect(() => {
    const fetchGradeDetail = async () => {
      if (!isOpen || !grade || !currentUser?.uid) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getStudentReport(currentUser.uid, grade.reportId);

        if (result.success) {
          const apiData = result.data;

          // API 데이터를 기존 구조에 맞게 변환
          const transformedData = {
            ...grade,
            title: apiData.reportTitle || grade.title,
            description: apiData.reportDescription,
            classroomName: apiData.classroomName,
            // 회차별 성적 데이터 (소숫점 첫째자리까지만 표시, 결석시 null)
            allLectures:
              apiData.lectureResults?.map((lecture, index) => ({
                lecture: index + 1,
                myScore: lecture.isAttended
                  ? Math.round((lecture.studentScore || 0) * 10) / 10
                  : null,
                classAverage: Math.round((lecture.classAverage || 0) * 10) / 10,
                date: new Date(lecture.lectureDate).toLocaleDateString('ko-KR'),
                isAttended: lecture.isAttended,
              })) || [],
            // 과제 성적 데이터 (결석시 '-' 표시)
            assignments:
              apiData.lectureResults?.map((lecture, index) => ({
                lecture: index + 1,
                grade: lecture.isAttended
                  ? lecture.assignmentScore || 'N/A'
                  : '-',
                date: new Date(lecture.lectureDate).toLocaleDateString('ko-KR'),
                isAttended: lecture.isAttended,
              })) || [],
            // 출석 데이터 (소숫점 첫째자리까지만 표시)
            attendance: {
              totalLectures: apiData.lectureResults?.length || 0,
              attendedLectures:
                apiData.lectureResults?.filter(l => l.isAttended).length || 0,
              attendanceRate:
                apiData.lectureResults?.length > 0
                  ? Math.round(
                      (apiData.lectureResults.filter(l => l.isAttended).length /
                        apiData.lectureResults.length) *
                        100 *
                        10
                    ) / 10
                  : 0,
              lectures:
                apiData.lectureResults?.map((lecture, index) => ({
                  lecture: index + 1,
                  attended: lecture.isAttended,
                  date: new Date(lecture.lectureDate).toLocaleDateString(
                    'ko-KR'
                  ),
                })) || [],
            },
            // 단원별 오답분포 데이터 (API 응답에서 문제별 결과를 단원별로 집계)
            wrongUnits: transformQuestionsByTopic(apiData.lectureResults),
            // 난이도별 오답분포 데이터 (API 응답에서 문제별 결과를 난이도별로 집계)
            wrongDifficulties: transformQuestionsByDifficulty(
              apiData.lectureResults
            ),
            // 교사 피드백 데이터
            teacherFeedback: {
              date: new Date(apiData.createdAt).toLocaleDateString('ko-KR'),
              content: apiData.feedback || '피드백이 작성되지 않았습니다.',
            },
            // 전체 성적 정보 (소숫점 첫째자리까지만 표시)
            overallScore: Math.round((apiData.overallScore || 0) * 10) / 10,
            overallTotalScore:
              Math.round((apiData.overallTotalScore || 0) * 10) / 10,
            overallAverage: Math.round((apiData.overallAverage || 0) * 10) / 10,
            overallRank: apiData.overallRank,
          };

          setGradeDetail(transformedData);
        } else {
          setError(result.error || '성적표 데이터를 가져올 수 없습니다.');
        }
      } catch (err) {
        console.error('성적표 데이터 조회 중 오류:', err);
        setError('성적표 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchGradeDetail();
  }, [isOpen, grade, currentUser]);

  // 문제별 결과를 단원별로 집계하는 함수
  const transformQuestionsByTopic = lectureResults => {
    const topicMap = new Map();

    lectureResults?.forEach(lecture => {
      lecture.questionResults?.forEach(question => {
        const topic = question.mainTopic;
        if (!topicMap.has(topic)) {
          topicMap.set(topic, { name: topic, wrongCount: 0, totalCount: 0 });
        }
        const topicData = topicMap.get(topic);
        topicData.totalCount++;
        if (!question.isCorrect) {
          topicData.wrongCount++;
        }
      });
    });

    return Array.from(topicMap.values()).map((topic, index) => ({
      id: index + 1,
      ...topic,
    }));
  };

  // 문제별 결과를 난이도별로 집계하는 함수
  const transformQuestionsByDifficulty = lectureResults => {
    const difficultyMap = new Map();

    lectureResults?.forEach(lecture => {
      lecture.questionResults?.forEach(question => {
        const difficulty = question.difficulty;
        if (!difficultyMap.has(difficulty)) {
          difficultyMap.set(difficulty, {
            name: difficulty,
            wrongCount: 0,
            totalCount: 0,
          });
        }
        const difficultyData = difficultyMap.get(difficulty);
        difficultyData.totalCount++;
        if (!question.isCorrect) {
          difficultyData.wrongCount++;
        }
      });
    });

    return Array.from(difficultyMap.values()).map((difficulty, index) => ({
      id: index + 1,
      ...difficulty,
    }));
  };

  if (!isOpen || !grade) return null;

  if (loading) {
    return (
      <div className='grade-detail-modal-overlay' onClick={onClose}>
        <div
          id='grade-detail-loading-content'
          className='grade-detail-modal-content'
          onClick={e => e.stopPropagation()}
        >
          <div className='modal-header'>
            <h2 className='grade-title'>성적표 로딩 중...</h2>
            <div className='modal-buttons'>
              <button
                className='pdf-export-btn'
                onClick={() =>
                  exportToPDF(
                    'grade-detail-loading-pdf-content',
                    '성적표_로딩중.pdf'
                  )
                }
                title='PDF로 내보내기'
                disabled
              >
                📄 PDF
              </button>
              <button className='close-btn' onClick={onClose}>
                ×
              </button>
            </div>
          </div>
          <div className='loading-content'>
            <p>성적표 데이터를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='grade-detail-modal-overlay' onClick={onClose}>
        <div
          id='grade-detail-error-content'
          className='grade-detail-modal-content'
          onClick={e => e.stopPropagation()}
        >
          <div className='modal-header'>
            <h2 className='grade-title'>오류</h2>
            <div className='modal-buttons'>
              <button
                className='pdf-export-btn'
                onClick={() =>
                  exportToPDF(
                    'grade-detail-error-pdf-content',
                    '성적표_오류.pdf'
                  )
                }
                title='PDF로 내보내기'
                disabled
              >
                📄 PDF
              </button>
              <button className='close-btn' onClick={onClose}>
                ×
              </button>
            </div>
          </div>
          <div className='error-content'>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gradeDetail) return null;

  const handlePDFExport = async () => {
    // WrongPatternModal과 동일한 방식으로 단순화
    await exportToPDF('grade-detail-content', `성적표_${grade.title}.pdf`);
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
        data: gradeDetail.allLectures.map(s => s.myScore), // null 값은 차트에서 자동으로 처리됨
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        type: 'bar',
      },
    ],
  };

  // 성적 추이 그래프 옵션 (최대값을 해당 회차들의 최대점수로 설정, 결석한 회차 제외)
  const getMaxScoreForChart = () => {
    if (!gradeDetail?.allLectures || gradeDetail.allLectures.length === 0)
      return 100;

    const allScores = [
      ...gradeDetail.allLectures
        .filter(l => l.myScore !== null)
        .map(l => l.myScore),
      ...gradeDetail.allLectures.map(l => l.classAverage),
    ];

    if (allScores.length === 0) return 100;

    const maxScore = Math.max(...allScores);
    // 최대값에 여유를 두기 위해 10% 추가하고 10단위로 올림
    return Math.ceil((maxScore * 1.1) / 10) * 10;
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
        max: getMaxScoreForChart(),
        ticks: {
          stepSize: Math.ceil(getMaxScoreForChart() / 5), // 5단계로 나누어 표시
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
        id='grade-detail-content'
        className='grade-detail-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h2 className='grade-title'>{grade.title}</h2>
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

        {/* 하단 섹션 */}
        <div className='grade-detail-bottom'>
          <div className='bottom-grid'>
            {/* 왼쪽 - 두 개의 카드 */}
            <div className='left-column'>
              {/* 성적표 카드 */}
              <div className='detail-card score-table-card'>
                <h3 className='section-title'>회차별 성적표</h3>
                <div className='score-table-container'>
                  <table className='score-table'>
                    <thead>
                      <tr>
                        <th></th>
                        {gradeDetail.allLectures.map(lecture => (
                          <th key={lecture.lecture}>{lecture.lecture}회차</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='row-header'>내 성적</td>
                        {gradeDetail.allLectures.map(lecture => (
                          <td key={lecture.lecture} className='my-score'>
                            {lecture.myScore !== null
                              ? `${lecture.myScore.toFixed(1)}점`
                              : '-'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className='row-header'>반 평균</td>
                        {gradeDetail.allLectures.map(lecture => (
                          <td key={lecture.lecture} className='class-average'>
                            {lecture.classAverage.toFixed(1)}점
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className='row-header'>차이</td>
                        {gradeDetail.allLectures.map(lecture => {
                          if (lecture.myScore === null) {
                            return (
                              <td key={lecture.lecture} className='score-diff'>
                                -
                              </td>
                            );
                          }
                          const diff = lecture.myScore - lecture.classAverage;
                          return (
                            <td
                              key={lecture.lecture}
                              className={`score-diff ${diff >= 0 ? 'positive' : 'negative'}`}
                            >
                              {diff >= 0 ? '+' : ''}
                              {diff.toFixed(1)}점
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

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
                        {gradeDetail.attendance.attendanceRate.toFixed(1)}%
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
