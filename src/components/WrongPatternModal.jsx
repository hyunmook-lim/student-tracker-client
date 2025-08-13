import React from 'react';
import { useWrongPatternStore } from '../store';
import './WrongPatternModal.css';

function WrongPatternModal({ classData, isOpen, onClose }) {
  const { getSeverityColor } = useWrongPatternStore();

  if (!isOpen || !classData) return null;

  // 난이도 정의
  const difficultyLevels = ['중', '중상', '상', '최상'];

  // 단원별 난이도별 오답 데이터 (실제로는 API에서 받아올 데이터)
  const heatmapData = [
    {
      unit: 'JavaScript 변수',
      difficulties: { 중: 15, 중상: 25, 상: 35, 최상: 45 },
    },
    {
      unit: 'CSS Flexbox',
      difficulties: { 중: 10, 중상: 20, 상: 30, 최상: 40 },
    },
    {
      unit: 'HTML 시맨틱',
      difficulties: { 중: 5, 중상: 15, 상: 25, 최상: 35 },
    },
    {
      unit: '이벤트 처리',
      difficulties: { 중: 20, 중상: 30, 상: 40, 최상: 50 },
    },
    {
      unit: '비동기 프로그래밍',
      difficulties: { 중: 25, 중상: 35, 상: 45, 최상: 55 },
    },
  ];

  // 색상 강도 계산
  const getColorIntensity = percentage => {
    if (percentage <= 10) return 0.1;
    if (percentage <= 20) return 0.3;
    if (percentage <= 30) return 0.5;
    if (percentage <= 40) return 0.7;
    return 0.9;
  };

  // 색상 계산
  const getHeatmapColor = percentage => {
    const intensity = getColorIntensity(percentage);
    const red = Math.round(239 * intensity);
    const green = Math.round(68 * (1 - intensity));
    const blue = Math.round(68 * (1 - intensity));
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <div className='wrong-pattern-modal-overlay' onClick={onClose}>
      <div className='wrong-pattern-modal' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>{classData.name} - 오답패턴 분석</h2>
          <button className='close-button' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='modal-content'>
          {/* 전체 통계 */}
          <div className='overall-stats'>
            <div className='stat-card'>
              <div className='stat-number'>
                {classData?.totalQuestions || 0}
              </div>
              <div className='stat-label'>총 문제 수</div>
            </div>
            <div className='stat-card'>
              <div className='stat-number wrong'>
                {classData?.wrongQuestions || 0}
              </div>
              <div className='stat-label'>오답 수</div>
            </div>
            <div className='stat-card'>
              <div
                className='stat-number'
                style={{ color: getSeverityColor(classData?.wrongRate || 0) }}
              >
                {classData?.wrongRate || 0}%
              </div>
              <div className='stat-label'>오답률</div>
            </div>
          </div>

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
                            color: percentage > 30 ? 'white' : '#1e293b',
                          }}
                          title={`${item.unit} - ${level} 난이도: ${percentage}% 오답률`}
                        >
                          {percentage}%
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
                  style={{ backgroundColor: 'rgb(239, 68, 68)' }}
                ></div>
                <span>높음 (40% 이상)</span>
              </div>
              <div className='legend-item'>
                <div
                  className='legend-color'
                  style={{ backgroundColor: 'rgb(239, 119, 68)' }}
                ></div>
                <span>중간 (20-39%)</span>
              </div>
              <div className='legend-item'>
                <div
                  className='legend-color'
                  style={{ backgroundColor: 'rgb(239, 170, 68)' }}
                ></div>
                <span>낮음 (10-19%)</span>
              </div>
              <div className='legend-item'>
                <div
                  className='legend-color'
                  style={{ backgroundColor: 'rgb(239, 221, 68)' }}
                ></div>
                <span>매우 낮음 (10% 미만)</span>
              </div>
            </div>
          </div>

          {/* 개선 제안 */}
          <div className='improvement-section'>
            <h3>개선 제안</h3>
            <div className='improvement-content'>
              <div className='improvement-item'>
                <div className='improvement-icon'>📚</div>
                <div className='improvement-text'>
                  <strong>집중 학습 필요:</strong> 오답률이 높은 패턴들을
                  우선적으로 복습하세요.
                </div>
              </div>
              <div className='improvement-item'>
                <div className='improvement-icon'>🎯</div>
                <div className='improvement-text'>
                  <strong>연습 문제 풀이:</strong> 관련된 추가 문제를 풀어
                  개념을 확실히 이해하세요.
                </div>
              </div>
              <div className='improvement-item'>
                <div className='improvement-icon'>💡</div>
                <div className='improvement-text'>
                  <strong>개념 정리:</strong> 오답한 부분의 기본 개념을 다시
                  한번 정리해보세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WrongPatternModal;
