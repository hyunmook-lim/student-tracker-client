import React from 'react';
import WrongPatternModal from './WrongPatternModal';
import WrongPatternStats from './WrongPatternStats';
import { useWrongPatternStore } from '../store';
import './WrongPattern.css';

function WrongPattern() {
  const {
    classes,
    selectedClass,
    isModalOpen,
    selectClassAndOpenModal,
    closeModal,
    getWrongRateColor,
  } = useWrongPatternStore();

  const handleClassClick = classItem => {
    selectClassAndOpenModal(classItem);
  };

  return (
    <div className='wrong-pattern-container'>
      <div className='wrong-pattern-header'>
        <h2>오답패턴 분석</h2>
      </div>

      {/* 전체 통계 섹션 */}
      <WrongPatternStats />

      <div className='classes-grid'>
        {classes.map(classItem => (
          <div
            key={classItem.id}
            className='class-card'
            onClick={() => handleClassClick(classItem)}
          >
            <div className='class-info'>
              <h3>{classItem.name}</h3>
              <p>{classItem.description}</p>
            </div>
            <div className='wrong-stats'>
              <div className='stats-row'>
                <span className='total-questions'>
                  총 {classItem.totalQuestions}문제
                </span>
                <span className='wrong-questions'>
                  오답 {classItem.wrongQuestions}문제
                </span>
              </div>
              <div className='wrong-rate-row'>
                <span
                  className='wrong-rate'
                  style={{ color: getWrongRateColor(classItem.wrongRate) }}
                >
                  오답률 {classItem.wrongRate}%
                </span>
              </div>
            </div>
            <div className='expand-icon'>▶</div>
          </div>
        ))}
      </div>

      <WrongPatternModal
        classData={selectedClass}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default WrongPattern;
