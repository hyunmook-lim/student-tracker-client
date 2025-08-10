import React from 'react';
import { useSessionStore, useClassroomStore } from '../store';
import './SessionList.css';

function SessionList() {
  const {
    expandedClasses,
    toggleClassExpansion,
    isSessionModalOpen,
    isQuestionModalOpen,
    openSessionModal,
    closeSessionModal,
    closeQuestionModal,
    newSessionData,
    updateNewSessionData,
    addSession,
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    resetQuestions,
    getSessionsByClassroom,
  } = useSessionStore();

  const { classrooms } = useClassroomStore();

  const handleAddSession = () => {
    if (addSession()) {
      resetQuestions();
    }
  };

  const [questionCount, setQuestionCount] = React.useState(1);

  const handleAddQuestions = () => {
    const count = parseInt(questionCount);
    if (count > 0 && count <= 50) {
      for (let i = 0; i < count; i++) {
        addQuestion();
      }
      setQuestionCount(1);
    } else {
      alert('1-50 사이의 숫자를 입력해주세요.');
    }
  };

  const handleRemoveQuestion = id => {
    if (questions.length > 1) {
      removeQuestion(id);
    }
  };

  const handleAddRound = classroomId => {
    updateNewSessionData('classroomId', classroomId);
    openSessionModal();
  };

  return (
    <div className='session-list-container'>
      <div className='session-list-header'>
        <h2>수업 관리</h2>
      </div>

      <div className='classroom-list'>
        {classrooms.map(classroom => (
          <div key={classroom.id} className='classroom-item'>
            <div
              className='classroom-header'
              onClick={() => toggleClassExpansion(classroom.id)}
            >
              <div className='classroom-info'>
                <h3>{classroom.name}</h3>
                <p>{classroom.description}</p>
                <span className='student-count'>
                  학생 수: {classroom.studentCount}명
                </span>
              </div>
              <div className='classroom-actions'>
                <button
                  className='add-round-btn'
                  onClick={e => {
                    e.stopPropagation();
                    handleAddRound(classroom.id);
                  }}
                >
                  + 새 회차
                </button>
              </div>
            </div>

            {expandedClasses.has(classroom.id) && (
              <div className='sessions-list'>
                {getSessionsByClassroom(classroom.id).map(session => (
                  <div key={session.id} className='session-item'>
                    <div className='session-info'>
                      <span className='session-date'>{session.date}</span>
                      <h4>{session.title}</h4>
                      <p>{session.description}</p>
                    </div>
                    <div className='session-actions'>
                      <button className='edit-btn'>수정</button>
                      <button className='delete-btn'>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 회차 추가 모달 */}
      {isSessionModalOpen && (
        <div className='modal-overlay' onClick={closeSessionModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>새 회차 추가</h3>
              <button className='close-btn' onClick={closeSessionModal}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-group'>
                <label>회차 제목</label>
                <input
                  type='text'
                  value={newSessionData.title}
                  onChange={e => updateNewSessionData('title', e.target.value)}
                  placeholder='회차 제목을 입력하세요'
                />
              </div>
              <div className='form-group'>
                <label>회차 설명</label>
                <textarea
                  value={newSessionData.description}
                  onChange={e =>
                    updateNewSessionData('description', e.target.value)
                  }
                  placeholder='회차 설명을 입력하세요'
                  rows='3'
                />
              </div>
              <div className='form-group'>
                <label>회차 날짜</label>
                <input
                  type='date'
                  value={newSessionData.date}
                  onChange={e => updateNewSessionData('date', e.target.value)}
                />
              </div>
            </div>
            <div className='modal-actions'>
              <button className='cancel-btn' onClick={closeSessionModal}>
                취소
              </button>
              <button className='save-btn' onClick={handleAddSession}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 문제 추가 모달 */}
      {isQuestionModalOpen && (
        <div className='modal-overlay' onClick={closeQuestionModal}>
          <div
            className='question-modal-content'
            onClick={e => e.stopPropagation()}
          >
            <div className='modal-header'>
              <h3>문제 추가</h3>
              <button className='close-btn' onClick={closeQuestionModal}>
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
                        updateQuestion(
                          question.id,
                          'difficulty',
                          e.target.value
                        )
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
                <button
                  className='add-question-btn'
                  onClick={handleAddQuestions}
                >
                  + 문제 추가
                </button>
              </div>
              <button
                className='save-questions-btn'
                onClick={closeQuestionModal}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionList;
