import React from 'react';
import { useWrongPatternStore } from '../../../store';
import { exportToPDF } from '../../../utils/pdfExport';
import './WrongPatternModal.css';

function WrongPatternModal({ classData, isOpen, onClose }) {
  const { getSeverityColor } = useWrongPatternStore();

  if (!isOpen || !classData) return null;

  console.log('WrongPatternModal - classData:', classData);
  console.log(
    'WrongPatternModal - classData JSON:',
    JSON.stringify(classData, null, 2)
  );

  // 백엔드 API 응답 데이터 사용
  console.log('WrongPatternModal - API 응답 데이터:', classData);

  // 백엔드 API 응답 데이터 직접 사용
  const apiData = classData || {};

  // API 응답에서 데이터 추출
  const mainTopicDifficultyStats = apiData.mainTopicDifficultyStatistics || [];
  const top3MainTopics = apiData.top3MainTopics || [];
  const assignmentScoreStats = apiData.assignmentScoreStatistics || {};

  console.log(
    'WrongPatternModal - mainTopicDifficultyStats:',
    mainTopicDifficultyStats
  );
  console.log('WrongPatternModal - top3MainTopics:', top3MainTopics);

  // 데이터가 없는 경우 처리
  if (!apiData.totalQuestions || apiData.totalQuestions === 0) {
    return (
      <div className='wrong-pattern-modal-overlay' onClick={onClose}>
        <div
          id='wrong-pattern-content'
          className='wrong-pattern-modal'
          onClick={e => e.stopPropagation()}
        >
          <div className='modal-header'>
            <h2>{apiData.classroomName || '반'} - 오답패턴 분석</h2>
            <div className='modal-buttons'>
              <button
                className='pdf-export-btn'
                onClick={handlePDFExport}
                title='PDF로 내보내기'
              >
                📄 PDF
              </button>
              <button className='close-button' onClick={onClose}>
                ✕
              </button>
            </div>
          </div>
          <div className='modal-content'>
            <div className='no-data-state'>
              <div className='no-data-icon'>📊</div>
              <h3>아직 분석할 데이터가 없습니다</h3>
              <p>
                결과 입력이 완료되면 오답 패턴 분석 데이터를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 난이도 정의
  const difficultyLevels = ['중', '중상', '상', '최상'];

  // 히트맵 데이터 - API의 mainTopicDifficultyStatistics 사용
  const heatmapData = mainTopicDifficultyStats.map(mainTopicStat => {
    const difficulties = {};

    // 난이도별 통계를 히트맵 형식으로 변환
    mainTopicStat.difficultyStatistics?.forEach(diffStat => {
      difficulties[diffStat.difficulty] = diffStat.wrongAnswerRate;
    });

    return {
      unit: mainTopicStat.mainTopic,
      difficulties: difficulties,
    };
  });

  // API의 top3MainTopics 직접 사용 (왼쪽 섹션용)
  const top3MainTopicUnits = top3MainTopics.map(mainTopic => ({
    name: mainTopic.mainTopic,
    wrongRate: mainTopic.wrongAnswerRate,
    color: getSeverityColor(mainTopic.wrongAnswerRate),
    count: mainTopic.wrongAnswerCount,
    total: mainTopic.totalQuestionCount,
    subUnits:
      mainTopic.top3SubTopics?.map(subTopic => ({
        name: subTopic.subTopic,
        wrongRate: subTopic.wrongAnswerRate,
        count: subTopic.wrongAnswerCount,
        total: subTopic.totalQuestionCount,
      })) || [],
  }));

  // 히트맵 색상 계산
  const getHeatmapColor = percentage => {
    if (percentage >= 40) return '#fecaca'; // 연한 빨간색
    if (percentage >= 20) return '#fed7aa'; // 연한 주황색
    if (percentage >= 10) return '#fef08a'; // 연한 노란색
    return '#fefefe'; // 아이보리색
  };

  const handlePDFExport = async () => {
    // PDF 내보내기를 위해 임시로 스크롤 제거하고 전체 높이 표시
    const modal = document.getElementById('wrong-pattern-main-content');
    const originalOverflow = modal.style.overflow;
    const originalHeight = modal.style.height;
    const originalMaxHeight = modal.style.maxHeight;

    // 스크롤 제거하고 자동 높이로 설정
    modal.style.overflow = 'visible';
    modal.style.height = 'auto';
    modal.style.maxHeight = 'none';

    // 하위 스크롤 컨테이너들도 처리
    const scrollContainers = modal.querySelectorAll(
      '.heatmap-container, .assignment-stats, .top3-cards'
    );
    const originalStyles = [];

    scrollContainers.forEach((container, index) => {
      originalStyles[index] = {
        overflow: container.style.overflow,
        maxHeight: container.style.maxHeight,
      };
      container.style.overflow = 'visible';
      container.style.maxHeight = 'none';
    });

    // 잠시 대기 후 PDF 생성
    setTimeout(async () => {
      try {
        await exportToPDF(
          'wrong-pattern-main-content',
          `오답패턴분석_${apiData.classroomName || '반'}.pdf`
        );
      } finally {
        // 원래 스타일 복원
        modal.style.overflow = originalOverflow;
        modal.style.height = originalHeight;
        modal.style.maxHeight = originalMaxHeight;

        scrollContainers.forEach((container, index) => {
          container.style.overflow = originalStyles[index].overflow;
          container.style.maxHeight = originalStyles[index].maxHeight;
        });
      }
    }, 100);
  };

  return (
    <div className='wrong-pattern-modal-overlay' onClick={onClose}>
      <div
        id='wrong-pattern-main-content'
        className='wrong-pattern-modal'
        onClick={e => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h2>{apiData.classroomName || '반'} - 오답패턴 분석</h2>
          <div className='modal-buttons'>
            <button
              className='pdf-export-btn'
              onClick={handlePDFExport}
              title='PDF로 내보내기'
            >
              📄 PDF
            </button>
            <button className='close-button' onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className='modal-content'>
          <div className='content-layout'>
            {/* 왼쪽 섹션 */}
            <div className='left-section'>
              {/* 전체 통계 */}
              <div className='overall-stats'>
                <div className='stat-card'>
                  <div className='stat-icon'>📝</div>
                  <div className='stat-number'>
                    {apiData.totalQuestions || 0}
                  </div>
                  <div className='stat-label'>총 문제 수</div>
                </div>
                <div className='stat-card'>
                  <div className='stat-icon'>❌</div>
                  <div className='stat-number wrong'>
                    {apiData.totalWrongAnswers || 0}
                  </div>
                  <div className='stat-label'>오답 수</div>
                </div>
                <div className='stat-card'>
                  <div className='stat-icon'>📊</div>
                  <div
                    className='stat-number'
                    style={{
                      color: getSeverityColor(apiData.wrongAnswerRate || 0),
                    }}
                  >
                    {(apiData.wrongAnswerRate || 0).toFixed(1)}%
                  </div>
                  <div className='stat-label'>오답률</div>
                </div>
              </div>

              {/* 오답률 top3 */}
              <div className='top3-section'>
                <h3>오답률 Top 3</h3>
                <div className='top3-cards'>
                  {top3MainTopicUnits.map((unit, index) => (
                    <div key={index} className='top3-card'>
                      <div className='card-inner'>
                        <div className='card-front'>
                          <div className='front-content'>
                            <div className='rank-badge'>{index + 1}</div>
                            <div className='unit-name'>{unit.name}</div>
                            <div
                              className='unit-wrong-rate'
                              style={{ color: unit.color }}
                            >
                              {(unit.wrongRate || 0).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className='card-back'>
                          <div className='sub-units-list'>
                            {unit.subUnits.map((subUnit, subIndex) => (
                              <div key={subIndex} className='sub-unit-item'>
                                <div className='sub-unit-rank'>
                                  {subIndex + 1}
                                </div>
                                <div className='sub-unit-name'>
                                  {subUnit.name}
                                </div>
                                <div
                                  className='sub-unit-rate'
                                  style={{ color: unit.color }}
                                >
                                  {(subUnit.wrongRate || 0).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 오른쪽 섹션 */}
            <div className='right-section'>
              {/* 히트맵 */}
              <div className='heatmap-section'>
                <h3>단원별 난이도 오답률 히트맵</h3>
                <div className='heatmap-container'>
                  <div className='heatmap-header'>
                    <div className='heatmap-corner'></div>
                    {difficultyLevels.map(level => (
                      <div key={level} className='heatmap-header-cell'>
                        {level}
                      </div>
                    ))}
                  </div>
                  <div className='heatmap-body'>
                    {heatmapData.map((item, rowIndex) => (
                      <div key={rowIndex} className='heatmap-row'>
                        <div className='heatmap-row-header'>{item.unit}</div>
                        {difficultyLevels.map((level, colIndex) => {
                          const percentage = item.difficulties[level];
                          return (
                            <div
                              key={colIndex}
                              className='heatmap-cell'
                              style={{
                                backgroundColor: getHeatmapColor(percentage),
                                color: '#1e293b',
                              }}
                              title={`${item.unit} - ${level} 난이도: ${(percentage || 0).toFixed(1)}% 오답률`}
                            >
                              {(percentage || 0).toFixed(1)}%
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 범례 */}
                <div className='heatmap-legend'>
                  <div className='legend-item'>
                    <div
                      className='legend-color'
                      style={{ backgroundColor: '#fecaca' }}
                    ></div>
                    <span>높음 (40% 이상)</span>
                  </div>
                  <div className='legend-item'>
                    <div
                      className='legend-color'
                      style={{ backgroundColor: '#fed7aa' }}
                    ></div>
                    <span>중간 (20-39%)</span>
                  </div>
                  <div className='legend-item'>
                    <div
                      className='legend-color'
                      style={{ backgroundColor: '#fef08a' }}
                    ></div>
                    <span>낮음 (10-19%)</span>
                  </div>
                  <div className='legend-item'>
                    <div
                      className='legend-color'
                      style={{ backgroundColor: '#fefefe' }}
                    ></div>
                    <span>매우 낮음 (10% 미만)</span>
                  </div>
                </div>
              </div>

              {/* 과제 점수 통계 */}
              {assignmentScoreStats.totalAssignments > 0 && (
                <div className='assignment-stats-section'>
                  <h3>과제 점수 분포</h3>
                  <div className='assignment-stats'>
                    <div className='assignment-total'>
                      <span className='total-label'>총 과제수</span>
                      <span className='total-number'>
                        {assignmentScoreStats.totalAssignments || 0}개
                      </span>
                    </div>
                    <div className='grade-distribution'>
                      <div className='grade-item grade-a'>
                        <span className='grade-label'>A등급</span>
                        <span className='grade-count'>
                          {assignmentScoreStats.acount || 0}개
                        </span>
                        <span className='grade-rate'>
                          ({(assignmentScoreStats.arate || 0).toFixed(1)}%)
                        </span>
                      </div>
                      <div className='grade-item grade-b'>
                        <span className='grade-label'>B등급</span>
                        <span className='grade-count'>
                          {assignmentScoreStats.bcount || 0}개
                        </span>
                        <span className='grade-rate'>
                          ({(assignmentScoreStats.brate || 0).toFixed(1)}%)
                        </span>
                      </div>
                      <div className='grade-item grade-c'>
                        <span className='grade-label'>C등급</span>
                        <span className='grade-count'>
                          {assignmentScoreStats.ccount || 0}개
                        </span>
                        <span className='grade-rate'>
                          ({(assignmentScoreStats.crate || 0).toFixed(1)}%)
                        </span>
                      </div>
                      <div className='grade-item grade-d'>
                        <span className='grade-label'>D등급</span>
                        <span className='grade-count'>
                          {assignmentScoreStats.dcount || 0}개
                        </span>
                        <span className='grade-rate'>
                          ({(assignmentScoreStats.drate || 0).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WrongPatternModal;
