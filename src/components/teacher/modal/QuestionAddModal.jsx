import React from 'react';
import './QuestionAddModal.css';

function QuestionAddModal({
  isOpen,
  onClose,
  questions,
  updateQuestion,
  handleRemoveQuestion,
  questionCount,
  setQuestionCount,
  handleAddQuestions,
}) {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div
        className='question-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h3>문제 추가</h3>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='questions-container'>
          <div className='question-labels'>
            <div className='label-group question-number'>문제</div>
            <div className='label-group main-unit'>대단원</div>
            <div className='label-group sub-unit'>소단원</div>
            <div className='label-group difficulty'>난이도</div>
            <div className='label-group points'>배점</div>
            <div className='label-group delete'>삭제</div>
          </div>
          {questions.map((question, index) => (
            <div key={question.id} className='question-row'>
              <div className='field-group question-number'>
                <span className='question-number'>{index + 1}</span>
              </div>
              <div className='field-group main-unit'>
                <input
                  type='text'
                  value={question.mainUnit}
                  onChange={e =>
                    updateQuestion(question.id, 'mainUnit', e.target.value)
                  }
                  placeholder='대단원을 입력하세요'
                />
              </div>
              <div className='field-group sub-unit'>
                <input
                  type='text'
                  value={question.subUnit}
                  onChange={e =>
                    updateQuestion(question.id, 'subUnit', e.target.value)
                  }
                  placeholder='소단원을 입력하세요'
                />
              </div>
              <div className='field-group difficulty'>
                <select
                  value={question.difficulty}
                  onChange={e =>
                    updateQuestion(question.id, 'difficulty', e.target.value)
                  }
                >
                  <option value=''>선택</option>
                  <option value='쉬움'>쉬움</option>
                  <option value='보통'>보통</option>
                  <option value='어려움'>어려움</option>
                </select>
              </div>
              <div className='field-group points'>
                <input
                  type='number'
                  value={question.points}
                  onChange={e =>
                    updateQuestion(question.id, 'points', e.target.value)
                  }
                  placeholder='배점을 입력하세요'
                  min='1'
                />
              </div>
              <div className='field-group delete'>
                {questions.length > 1 && (
                  <button
                    className='remove-question-btn'
                    onClick={() => handleRemoveQuestion(question.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className='question-actions'>
          <div className='add-questions-container'>
            <input
              type='number'
              value={questionCount}
              onChange={e => setQuestionCount(e.target.value)}
              placeholder='개수'
              min='1'
              max='50'
              className='question-count-input'
            />
            <button className='add-question-btn' onClick={handleAddQuestions}>
              + 문제 추가
            </button>
          </div>
          <button className='save-questions-btn' onClick={onClose}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionAddModal;
