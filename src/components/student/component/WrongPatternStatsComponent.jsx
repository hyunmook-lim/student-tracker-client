import React from 'react';
import { useWrongPatternStore } from '../../../store';
import './WrongPatternStatsComponent.css';

function WrongPatternStatsComponent() {
  const { getProcessedAnalytics, getWrongRateColor } = useWrongPatternStore();
  const analytics = getProcessedAnalytics();

  if (!analytics) return null;

  const stats = analytics.overview;

  return (
    <div className='wrong-pattern-stats-container'>
      <div className='stats-grid'>
        <div className='stat-item'>
          <div className='stat-icon'>📚</div>
          <div className='stat-content'>
            <div className='stat-number'>{stats.totalClassrooms}</div>
            <div className='stat-label'>수강 수업 수</div>
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
            <div className='stat-number wrong'>{stats.totalWrongAnswers}</div>
            <div className='stat-label'>총 오답 수</div>
          </div>
        </div>

        <div className='stat-item'>
          <div className='stat-icon'>📊</div>
          <div className='stat-content'>
            <div
              className='stat-number'
              style={{ color: getWrongRateColor(stats.wrongAnswerRate) }}
            >
              {stats.wrongAnswerRate.toFixed(1)}%
            </div>
            <div className='stat-label'>오답률</div>
          </div>
        </div>
      </div>

      <div className='stats-summary'>
        <div className='summary-item'>
          <div className='summary-icon'>🎯</div>
          <div className='summary-text'>
            <strong>개선 포인트:</strong> 전체 오답률이{' '}
            {stats.wrongAnswerRate.toFixed(1)}
            %로
            {stats.wrongAnswerRate > 15
              ? ' 개선이 필요합니다'
              : ' 양호한 수준입니다'}
          </div>
        </div>

        <div className='summary-item'>
          <div className='summary-icon'>📈</div>
          <div className='summary-text'>
            <strong>학습 진행도:</strong> 총 {stats.totalQuestions}문제 중
            {stats.totalWrongAnswers}문제를 오답하여 전체 정답률은
            {Math.round(
              ((stats.totalQuestions - stats.totalWrongAnswers) /
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
