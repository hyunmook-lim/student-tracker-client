import React, { useState } from 'react';
import './SessionList.css';

function SessionList() {
  const [expandedClass, setExpandedClass] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [questions, setQuestions] = useState([
    {
      id: 1,
      mainUnit: '',
      subUnit: '',
      type: '',
      difficulty: '',
      points: '',
    },
  ]);

  // 반 데이터 (실제로는 서버에서 가져올 데이터)
  const classrooms = [
    {
      id: 1,
      name: '1학년 1반',
      description: '수학 기초 과정',
      studentCount: 25,
      sessions: [
        {
          id: 1,
          title: '1회차 - 수학 기초',
          description: '수학의 기본 개념과 연산법칙',
          date: '2024-01-15',
        },
        {
          id: 2,
          title: '2회차 - 방정식',
          description: '1차 방정식 풀이 방법',
          date: '2024-01-22',
        },
        {
          id: 3,
          title: '3회차 - 함수',
          description: '함수의 개념과 그래프',
          date: '2024-01-29',
        },
      ],
    },
    {
      id: 2,
      name: '1학년 2반',
      description: '영어 기초 과정',
      studentCount: 23,
      sessions: [
        {
          id: 4,
          title: '1회차 - 영어 기초',
          description: '알파벳과 기본 인사말',
          date: '2024-01-16',
        },
        {
          id: 5,
          title: '2회차 - 문법 기초',
          description: '기본 문법 구조',
          date: '2024-01-23',
        },
      ],
    },
    {
      id: 3,
      name: '2학년 1반',
      description: '수학 심화 과정',
      studentCount: 28,
      sessions: [
        {
          id: 6,
          title: '1회차 - 미분',
          description: '미분의 개념과 기본 공식',
          date: '2024-01-17',
        },
        {
          id: 7,
          title: '2회차 - 적분',
          description: '적분의 개념과 기본 공식',
          date: '2024-01-24',
        },
      ],
    },
    {
      id: 4,
      name: '2학년 2반',
      description: '과학 기초 과정',
      studentCount: 26,
      sessions: [
        {
          id: 8,
          title: '1회차 - 물리 기초',
          description: '힘과 운동의 법칙',
          date: '2024-01-18',
        },
      ],
    },
  ];

  const handleClassClick = classId => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleAddSession = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewSessionData({ title: '', description: '', date: '' });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewSessionData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitSession = () => {
    if (!newSessionData.title.trim() || !newSessionData.date) {
      alert('제목과 수업날짜를 입력해주세요.');
      return;
    }

    // 첫 번째 모달 닫고 문제 입력 모달 열기
    setShowAddModal(false);
    setShowQuestionModal(true);
  };

  const handleCloseQuestionModal = () => {
    setShowQuestionModal(false);
    setQuestions([
      {
        id: 1,
        mainUnit: '',
        subUnit: '',
        type: '',
        difficulty: '',
        points: '',
      },
    ]);
  };

  const handleAddQuestion = () => {
    const newId = questions.length + 1;
    setQuestions(prev => [
      ...prev,
      {
        id: newId,
        mainUnit: '',
        subUnit: '',
        type: '',
        difficulty: '',
        points: '',
      },
    ]);
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === id ? { ...question, [field]: value } : question
      )
    );
  };

  const handleSubmitQuestions = () => {
    // 실제로는 서버에 문제 추가 요청을 보낼 것입니다
    alert('문제 추가 기능이 구현될 예정입니다.');
    handleCloseQuestionModal();
    setNewSessionData({ title: '', description: '', date: '' });
  };

  const handleDeleteQuestion = id => {
    if (questions.length === 1) {
      alert('최소 1개의 문제는 있어야 합니다.');
      return;
    }
    setQuestions(prev => {
      const filtered = prev.filter(question => question.id !== id);
      // 번호를 1번부터 다시 매기기
      return filtered.map((question, index) => ({
        ...question,
        id: index + 1,
      }));
    });
  };

  return (
    <div className='session-list'>
      <div className='session-header'>
        <h3>회차 관리</h3>
      </div>

      <div className='session-container'>
        {classrooms.map(classroom => (
          <div key={classroom.id} className='session-item'>
            <div
              className='session-header-row'
              onClick={() => handleClassClick(classroom.id)}
            >
              <div className='session-name'>{classroom.name}</div>
              <div className='session-description'>{classroom.description}</div>
              <div className='session-student-count'>
                {classroom.studentCount}명
              </div>
              <button
                className='add-session-btn'
                onClick={e => {
                  e.stopPropagation();
                  handleAddSession(classroom.id);
                }}
                title='회차 추가'
              >
                회차 추가
              </button>
            </div>

            {expandedClass === classroom.id && (
              <div className='sessions-list'>
                <div className='sessions-header'>
                  <span>제목</span>
                  <span>설명</span>
                  <span>수업날짜</span>
                </div>
                {classroom.sessions.map(session => (
                  <div key={session.id} className='session-detail-item'>
                    <span className='session-title'>{session.title}</span>
                    <span className='session-desc'>{session.description}</span>
                    <span className='session-date'>{session.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 회차 추가 모달 */}
      {showAddModal && (
        <div className='modal-overlay' onClick={handleCloseModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>회차 추가</h3>
              <button className='modal-close-btn' onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='input-group'>
                <label htmlFor='sessionTitle'>제목</label>
                <input
                  type='text'
                  id='sessionTitle'
                  name='title'
                  value={newSessionData.title}
                  onChange={handleInputChange}
                  placeholder='예: 1회차 - 수학 기초'
                />
              </div>
              <div className='input-group'>
                <label htmlFor='sessionDescription'>설명</label>
                <textarea
                  id='sessionDescription'
                  name='description'
                  value={newSessionData.description}
                  onChange={handleInputChange}
                  placeholder='회차에 대한 설명을 입력하세요'
                  rows='3'
                />
              </div>
              <div className='input-group'>
                <label htmlFor='sessionDate'>수업날짜</label>
                <input
                  type='date'
                  id='sessionDate'
                  name='date'
                  value={newSessionData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button className='modal-cancel-btn' onClick={handleCloseModal}>
                취소
              </button>
              <button
                className='modal-submit-btn'
                onClick={handleSubmitSession}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 문제 입력 모달 */}
      {showQuestionModal && (
        <div className='modal-overlay' onClick={handleCloseQuestionModal}>
          <div
            className='modal-content question-modal'
            onClick={e => e.stopPropagation()}
          >
            <div className='modal-header'>
              <h3>문제 입력</h3>
              <button
                className='modal-close-btn'
                onClick={handleCloseQuestionModal}
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='question-header'>
                <h4>{newSessionData.title}</h4>
                <button
                  className='add-question-btn'
                  onClick={handleAddQuestion}
                >
                  + 문제 추가
                </button>
              </div>
              <div className='questions-table'>
                <div className='questions-header'>
                  <span>번호</span>
                  <span>대단원</span>
                  <span>소단원</span>
                  <span>유형</span>
                  <span>난이도</span>
                  <span>배점</span>
                  <span>작업</span>
                </div>
                {questions.map(question => (
                  <div key={question.id} className='question-row'>
                    <span className='question-number'>{question.id}</span>
                    <input
                      type='text'
                      value={question.mainUnit}
                      onChange={e =>
                        handleQuestionChange(
                          question.id,
                          'mainUnit',
                          e.target.value
                        )
                      }
                      placeholder='대단원'
                    />
                    <input
                      type='text'
                      value={question.subUnit}
                      onChange={e =>
                        handleQuestionChange(
                          question.id,
                          'subUnit',
                          e.target.value
                        )
                      }
                      placeholder='소단원'
                    />
                    <input
                      type='text'
                      value={question.type}
                      onChange={e =>
                        handleQuestionChange(
                          question.id,
                          'type',
                          e.target.value
                        )
                      }
                      placeholder='유형'
                    />
                    <select
                      value={question.difficulty}
                      onChange={e =>
                        handleQuestionChange(
                          question.id,
                          'difficulty',
                          e.target.value
                        )
                      }
                    >
                      <option value=''>난이도 선택</option>
                      <option value='중'>중</option>
                      <option value='중상'>중상</option>
                      <option value='상'>상</option>
                      <option value='최상'>최상</option>
                    </select>
                    <input
                      type='number'
                      value={question.points}
                      onChange={e =>
                        handleQuestionChange(
                          question.id,
                          'points',
                          e.target.value
                        )
                      }
                      placeholder='배점'
                      min='1'
                    />
                    <button
                      className='delete-question-btn'
                      onClick={() => handleDeleteQuestion(question.id)}
                      title='문제 삭제'
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className='modal-footer'>
              <button
                className='modal-cancel-btn'
                onClick={handleCloseQuestionModal}
              >
                취소
              </button>
              <button
                className='modal-submit-btn'
                onClick={handleSubmitQuestions}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionList;
