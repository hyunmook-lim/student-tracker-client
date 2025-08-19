import React from 'react';
import { useWrongPatternStore } from '../../../store';
import './WrongPatternStatsComponent.css';

function WrongPatternStatsComponent() {
  const { getOverallStats, getWrongRateColor } = useWrongPatternStore();
  const stats = getOverallStats();

  return (
    <div className='wrong-pattern-stats-container'>
      <div className='stats-grid'>
        <div className='stat-item'>
          <div className='stat-icon'>📚</div>
          <div className='stat-content'>
            <div className='stat-number'>{stats.totalClasses}</div>
            <div className='stat-label'>수업 수</div>
          </div>
        </div>

        <div className='stat-item'>
          <div className='stat-icon'>❓</div>
          <div className='stat-content'>
            <div className='stat-number'>{stats.totalQuestions}</div>
            <div className='stat-label'>총 문제 수</div>
          </div>
        </div>

        <div className='stat-item'>
          <div className='stat-icon'>❌</div>
          <div className='stat-content'>
            <div className='stat-number wrong'>{stats.totalWrongQuestions}</div>
            <div className='stat-label'>총 오답 수</div>
          </div>
        </div>

        <div className='stat-item'>
          <div className='stat-icon'>📊</div>
          <div className='stat-content'>
            <div
              className='stat-number'
              style={{ color: getWrongRateColor(stats.averageWrongRate) }}
            >
              {stats.averageWrongRate}%
            </div>
            <div className='stat-label'>평균 오답률</div>
          </div>
        </div>
      </div>

      <div className='stats-summary'>
        <div className='summary-item'>
          <div className='summary-icon'>🎯</div>
          <div className='summary-text'>
            <strong>개선 포인트:</strong> 평균 오답률이 {stats.averageWrongRate}
            %로
            {stats.averageWrongRate > 15
              ? ' 개선이 필요합니다'
              : ' 양호한 수준입니다'}
          </div>
        </div>

        <div className='summary-item'>
          <div className='summary-icon'>📈</div>
          <div className='summary-text'>
            <strong>학습 진행도:</strong> 총 {stats.totalQuestions}문제 중
            {stats.totalWrongQuestions}문제를 오답하여 전체 정답률은
            {Math.round(
              ((stats.totalQuestions - stats.totalWrongQuestions) /
                stats.totalQuestions) *
                100
            )}
            %입니다
          </div>
        </div>
      </div>
    </div>
  );
}

export default WrongPatternStatsComponent;
