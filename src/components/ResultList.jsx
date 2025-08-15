import React, { useState } from 'react';
import { useClassroomStore } from '../store';
import './ResultList.css';

function ResultList() {
  const { classrooms, expandedClass, setExpandedClass } = useClassroomStore();
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClassClick = classId => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  // 임시 회차 데이터 (실제로는 서버에서 가져올 데이터)
  const getSessionsForClass = classId => {
    // classId를 사용하여 해당 반의 회차 데이터를 가져옴
    const sessions = [
      {
        id: 1,
        title: '1회차 - 수학 기초',
        date: '2024-01-15',
        isCompleted: true,
        hasResults: true,
      },
      {
        id: 2,
        title: '2회차 - 방정식',
        date: '2024-01-22',
        isCompleted: true,
        hasResults: true,
      },
      {
        id: 3,
        title: '3회차 - 함수',
        date: '2024-01-29',
        isCompleted: true,
        hasResults: false,
      },
      {
        id: 4,
        title: '4회차 - 통계',
        date: '2024-02-05',
        isCompleted: false,
        hasResults: false,
      },
      {
        id: 5,
        title: '5회차 - 기하',
        date: '2024-02-12',
        isCompleted: false,
        hasResults: false,
      },
    ];
    return sessions;
  };

  // 임시 결과 데이터 (실제로는 서버에서 가져올 데이터)
  const getResultsForSession = sessionId => {
    const results = {
      1: [
        { id: 1, name: '김철수', score: 85, rank: 3, total: 100 },
        { id: 2, name: '이영희', score: 92, rank: 1, total: 100 },
        { id: 3, name: '박민수', score: 78, rank: 5, total: 100 },
        { id: 4, name: '정수진', score: 88, rank: 2, total: 100 },
        { id: 5, name: '최동현', score: 81, rank: 4, total: 100 },
      ],
      2: [
        { id: 1, name: '김철수', score: 90, rank: 2, total: 100 },
        { id: 2, name: '이영희', score: 95, rank: 1, total: 100 },
        { id: 3, name: '박민수', score: 82, rank: 4, total: 100 },
        { id: 4, name: '정수진', score: 85, rank: 3, total: 100 },
        { id: 5, name: '최동현', score: 79, rank: 5, total: 100 },
      ],
    };
    return results[sessionId] || [];
  };

  const handleInputResults = session => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleViewResults = session => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const getGradeColor = score => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  };

  return (
    <div className='result-list-container'>
      <div className='result-list-header'>
        <h2>성적 결과</h2>
      </div>

      <div className='classroom-results'>
        {classrooms.map(classroom => (
          <div key={classroom.id} className='classroom-result-item'>
            <div
              className='classroom-header'
              onClick={() => handleClassClick(classroom.id)}
            >
              <div className='classroom-info'>
                <h3>{classroom.name}</h3>
                <p>{classroom.description}</p>
                <span>학생 수: {classroom.studentCount}명</span>
              </div>
              <div className='expand-icon'>
                {expandedClass === classroom.id ? '▼' : '▶'}
              </div>
            </div>

            {expandedClass === classroom.id && (
              <div className='sessions-section'>
                <div className='sessions-header'>
                  <h4>회차별 성적 관리</h4>
                </div>
                <div className='sessions-list'>
                  {getSessionsForClass(classroom.id).map(session => (
                    <div key={session.id} className='session-item'>
                      <div className='session-info'>
                        <div className='session-title'>
                          <h5>{session.title}</h5>
                          <span className='session-date'>{session.date}</span>
                        </div>
                        <div className='session-status'>
                          {session.isCompleted ? (
                            <span className='status completed'>완료</span>
                          ) : (
                            <span className='status pending'>진행중</span>
                          )}
                        </div>
                      </div>
                      <div className='session-actions'>
                        {session.isCompleted && session.hasResults ? (
                          <button
                            className='btn btn-view'
                            onClick={() => handleViewResults(session)}
                          >
                            결과 보기
                          </button>
                        ) : session.isCompleted && !session.hasResults ? (
                          <button
                            className='btn btn-input'
                            onClick={() => handleInputResults(session)}
                          >
                            결과 입력
                          </button>
                        ) : (
                          <button className='btn btn-disabled' disabled>
                            대기중
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 결과 입력/보기 모달 */}
      {isModalOpen && selectedSession && (
        <div className='modal-overlay' onClick={handleCloseModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>{selectedSession.title} - 성적 결과</h3>
              <button className='modal-close' onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              {selectedSession.hasResults ? (
                <div className='results-display'>
                  <div className='results-table'>
                    <div className='table-header'>
                      <span>순위</span>
                      <span>학생명</span>
                      <span>점수</span>
                      <span>만점</span>
                      <span>등급</span>
                    </div>
                    {getResultsForSession(selectedSession.id)
                      .sort((a, b) => a.rank - b.rank)
                      .map(student => (
                        <div key={student.id} className='table-row'>
                          <span className='rank'>{student.rank}등</span>
                          <span className='name'>{student.name}</span>
                          <span className='score'>{student.score}점</span>
                          <span className='total'>{student.total}점</span>
                          <span
                            className={`grade ${getGradeColor(student.score)}`}
                          >
                            {student.score >= 90
                              ? 'A'
                              : student.score >= 80
                                ? 'B'
                                : student.score >= 70
                                  ? 'C'
                                  : 'D'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className='results-input'>
                  <p>이 회차의 성적 결과를 입력해주세요.</p>
                  <div className='input-form'>
                    <div className='form-group'>
                      <label>학생별 점수 입력</label>
                      <div className='student-scores'>
                        {classrooms
                          .find(c => c.id === expandedClass)
                          ?.students?.map(student => (
                            <div key={student.id} className='score-input-row'>
                              <span className='student-name'>
                                {student.name}
                              </span>
                              <input
                                type='number'
                                min='0'
                                max='100'
                                placeholder='점수'
                                className='score-input'
                              />
                              <span className='total-score'>/ 100점</span>
                            </div>
                          )) || []}
                      </div>
                    </div>
                    <div className='form-actions'>
                      <button
                        className='btn btn-cancel'
                        onClick={handleCloseModal}
                      >
                        취소
                      </button>
                      <button className='btn btn-save'>저장</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultList;
