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
    openQuestionModal,
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

  const handleAddQuestion = () => {
    addQuestion();
  };

  const handleRemoveQuestion = id => {
    if (questions.length > 1) {
      removeQuestion(id);
    }
  };

  return (
    <div className='session-list-container'>
      <div className='session-list-header'>
        <h2>수업 관리</h2>
        <button className='add-session-btn' onClick={openSessionModal}>
          + 새 수업 추가
        </button>
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
              <div className='expand-icon'>
                {expandedClasses.has(classroom.id) ? '▼' : '▶'}
              </div>
            </div>

            {expandedClasses.has(classroom.id) && (
              <div className='sessions-list'>
                {getSessionsByClassroom(classroom.id).map(session => (
                  <div key={session.id} className='session-item'>
                    <div className='session-info'>
                      <h4>{session.title}</h4>
                      <p>{session.description}</p>
                      <span className='session-date'>{session.date}</span>
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

      {/* 수업 추가 모달 */}
      {isSessionModalOpen && (
        <div className='modal-overlay' onClick={closeSessionModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>새 수업 추가</h3>
              <button className='close-btn' onClick={closeSessionModal}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-group'>
                <label>반 선택</label>
                <select
                  value={newSessionData.classroomId || ''}
                  onChange={e =>
                    updateNewSessionData(
                      'classroomId',
                      parseInt(e.target.value)
                    )
                  }
                >
                  <option value=''>반을 선택해주세요</option>
                  {classrooms.map(classroom => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-group'>
                <label>수업 제목</label>
                <input
                  type='text'
                  value={newSessionData.title}
                  onChange={e => updateNewSessionData('title', e.target.value)}
                  placeholder='수업 제목을 입력하세요'
                />
              </div>
              <div className='form-group'>
                <label>수업 설명</label>
                <textarea
                  value={newSessionData.description}
                  onChange={e =>
                    updateNewSessionData('description', e.target.value)
                  }
                  placeholder='수업 설명을 입력하세요'
                  rows='3'
                />
              </div>
              <div className='form-group'>
                <label>수업 날짜</label>
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
                저장
              </button>
              <button className='question-btn' onClick={openQuestionModal}>
                문제 추가
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
              {questions.map((question, index) => (
                <div key={question.id} className='question-form'>
                  <div className='question-header'>
                    <h4>문제 {index + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        className='remove-question-btn'
                        onClick={() => handleRemoveQuestion(question.id)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className='question-fields'>
                    <div className='field-group'>
                      <label>대단원</label>
                      <input
                        type='text'
                        value={question.mainUnit}
                        onChange={e =>
                          updateQuestion(
                            question.id,
                            'mainUnit',
                            e.target.value
                          )
                        }
                        placeholder='대단원을 입력하세요'
                      />
                    </div>
                    <div className='field-group'>
                      <label>소단원</label>
                      <input
                        type='text'
                        value={question.subUnit}
                        onChange={e =>
                          updateQuestion(question.id, 'subUnit', e.target.value)
                        }
                        placeholder='소단원을 입력하세요'
                      />
                    </div>
                    <div className='field-group'>
                      <label>문제 유형</label>
                      <select
                        value={question.type}
                        onChange={e =>
                          updateQuestion(question.id, 'type', e.target.value)
                        }
                      >
                        <option value=''>선택</option>
                        <option value='객관식'>객관식</option>
                        <option value='주관식'>주관식</option>
                        <option value='서술형'>서술형</option>
                      </select>
                    </div>
                    <div className='field-group'>
                      <label>난이도</label>
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
                    <div className='field-group'>
                      <label>배점</label>
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
                  </div>
                </div>
              ))}
            </div>
            <div className='question-actions'>
              <button className='add-question-btn' onClick={handleAddQuestion}>
                + 문제 추가
              </button>
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
