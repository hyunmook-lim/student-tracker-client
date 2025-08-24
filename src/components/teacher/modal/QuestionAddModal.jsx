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
  onSave,
  resetQuestions,
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    resetQuestions();
    setQuestionCount(1);
    onClose();
  };

  const handleSave = async () => {
    await onSave();
  };

  return (
    <div className='question-add-modal-overlay' onClick={handleClose}>
      <div
        className='question-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='question-add-modal-header'>
          <h3>문제 추가</h3>
          <button className='question-add-close-btn' onClick={handleClose}>
            ×
          </button>
        </div>
        <div className='question-add-questions-container'>
          <div className='question-add-question-labels'>
            <div className='label-group question-number'>문제</div>
            <div className='label-group main-topic'>대단원</div>
            <div className='label-group sub-topic'>소단원</div>
            <div className='label-group difficulty'>난이도</div>
            <div className='label-group score'>배점</div>
            <div className='label-group answer'>정답</div>
            <div className='label-group delete'>삭제</div>
          </div>
          {questions.map((question, index) => (
            <div key={question.id} className='question-add-question-row'>
              <div className='question-add-field-group question-number'>
                <span className='question-add-question-number'>
                  {index + 1}
                </span>
              </div>
              <div className='question-add-field-group main-topic'>
                <input
                  type='text'
                  value={question.mainTopic}
                  onChange={e =>
                    updateQuestion(question.id, 'mainTopic', e.target.value)
                  }
                  placeholder='대단원'
                />
              </div>
              <div className='question-add-field-group sub-topic'>
                <input
                  type='text'
                  value={question.subTopic}
                  onChange={e =>
                    updateQuestion(question.id, 'subTopic', e.target.value)
                  }
                  placeholder='소단원'
                />
              </div>
              <div className='question-add-field-group difficulty'>
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
              <div className='question-add-field-group score'>
                <input
                  type='number'
                  value={question.score}
                  onChange={e =>
                    updateQuestion(question.id, 'score', e.target.value)
                  }
                  placeholder='배점을 입력하세요'
                  min='1'
                />
              </div>
              <div className='question-add-field-group answer'>
                <input
                  type='text'
                  value={question.answer || ''}
                  onChange={e =>
                    updateQuestion(question.id, 'answer', e.target.value)
                  }
                  placeholder='정답을 입력하세요'
                />
              </div>
              <div className='question-add-field-group delete'>
                {questions.length > 1 && (
                  <button
                    className='question-add-remove-question-btn'
                    onClick={() => handleRemoveQuestion(question.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className='question-add-question-actions'>
          <div className='question-add-add-questions-container'>
            <input
              type='number'
              value={questionCount}
              onChange={e => setQuestionCount(e.target.value)}
              placeholder='개수'
              min='1'
              max='50'
              className='question-add-question-count-input'
            />
            <button
              className='question-add-add-question-btn'
              onClick={handleAddQuestions}
            >
              + 문제 추가
            </button>
          </div>
          <button
            className='question-add-save-questions-btn'
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionAddModal;
