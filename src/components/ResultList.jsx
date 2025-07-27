import React, { useState } from 'react';

function ResultList() {
  const [expandedClass, setExpandedClass] = useState(null);

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
          hasResult: true, // 결과 입력 완료
        },
        {
          id: 2,
          title: '2회차 - 방정식',
          description: '1차 방정식 풀이 방법',
          date: '2024-01-22',
          hasResult: false, // 결과 미입력
        },
        {
          id: 3,
          title: '3회차 - 함수',
          description: '함수의 개념과 그래프',
          date: '2024-01-29',
          hasResult: true, // 결과 입력 완료
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
          hasResult: false, // 결과 미입력
        },
        {
          id: 5,
          title: '2회차 - 문법 기초',
          description: '기본 문법 구조',
          date: '2024-01-23',
          hasResult: false, // 결과 미입력
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
          hasResult: true, // 결과 입력 완료
        },
        {
          id: 7,
          title: '2회차 - 적분',
          description: '적분의 개념과 기본 공식',
          date: '2024-01-24',
          hasResult: true, // 결과 입력 완료
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
          hasResult: false, // 결과 미입력
        },
        {
          id: 9,
          title: '2회차 - 화학 기초',
          description: '원소와 화합물',
          date: '2024-01-25',
          hasResult: true, // 결과 입력 완료
        },
      ],
    },
  ];

  const handleClassClick = classId => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleResultAction = (sessionId, hasResult) => {
    if (hasResult) {
      // 결과가 있는 경우 - 수정 모드
      console.log('수정 모드:', sessionId);
      // TODO: 결과 수정 모달 또는 페이지로 이동
    } else {
      // 결과가 없는 경우 - 입력 모드
      console.log('입력 모드:', sessionId);
      // TODO: 결과 입력 모달 또는 페이지로 이동
    }
  };

  return (
    <div className='session-list'>
      <div className='session-header'>
        <h3>수업 결과 입력</h3>
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
            </div>

            {expandedClass === classroom.id && (
              <div className='sessions-list'>
                <div className='sessions-header'>
                  <span>제목</span>
                  <span>설명</span>
                  <span>수업날짜</span>
                  <span>작업</span>
                </div>
                {classroom.sessions.map(session => (
                  <div key={session.id} className='session-detail-item'>
                    <span className='session-title'>{session.title}</span>
                    <span className='session-desc'>{session.description}</span>
                    <span className='session-date'>{session.date}</span>
                    <button
                      className={`result-action-btn ${
                        session.hasResult ? 'result-completed' : 'result-input'
                      }`}
                      onClick={() =>
                        handleResultAction(session.id, session.hasResult)
                      }
                    >
                      {session.hasResult ? '완료' : '입력'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultList;
