import React, { useState } from 'react';
import './StudentAttendanceCheck.css';

function StudentAttendanceCheck() {
  const [selectedClass, setSelectedClass] = useState(null);

  // 학생의 수강 수업 데이터 (실제로는 서버에서 가져올 데이터)
  const studentClasses = [
    {
      id: 1,
      name: '수학 기초반',
      totalSessions: 12,
      completedSessions: 8,
      sessions: [
        {
          id: 1,
          title: '1회차 - 수와 연산',
          date: '2024-01-15',
          attendance: '출석',
          time: '09:00',
        },
        {
          id: 2,
          title: '2회차 - 분수와 소수',
          date: '2024-01-22',
          attendance: '출석',
          time: '08:58',
        },
        {
          id: 3,
          title: '3회차 - 도형의 성질',
          date: '2024-01-29',
          attendance: '출석',
          time: '09:15',
        },
        {
          id: 4,
          title: '4회차 - 측정',
          date: '2024-02-05',
          attendance: '출석',
          time: '09:02',
        },
        {
          id: 5,
          title: '5회차 - 확률과 통계',
          date: '2024-02-12',
          attendance: '출석',
          time: '08:55',
        },
        {
          id: 6,
          title: '6회차 - 문자와 식',
          date: '2024-02-19',
          attendance: '결석',
          time: '-',
        },
        {
          id: 7,
          title: '7회차 - 함수',
          date: '2024-02-26',
          attendance: '출석',
          time: '09:01',
        },
        {
          id: 8,
          title: '8회차 - 기하',
          date: '2024-03-04',
          attendance: '출석',
          time: '08:57',
        },
        {
          id: 9,
          title: '9회차 - 수열',
          date: '2024-03-11',
          attendance: '예정',
          time: '-',
        },
        {
          id: 10,
          title: '10회차 - 미적분',
          date: '2024-03-18',
          attendance: '예정',
          time: '-',
        },
        {
          id: 11,
          title: '11회차 - 확률',
          date: '2024-03-25',
          attendance: '예정',
          time: '-',
        },
        {
          id: 12,
          title: '12회차 - 종합평가',
          date: '2024-04-01',
          attendance: '예정',
          time: '-',
        },
      ],
    },
    {
      id: 2,
      name: '영어 심화반',
      totalSessions: 10,
      completedSessions: 6,
      sessions: [
        {
          id: 1,
          title: '1회차 - Grammar Review',
          date: '2024-01-16',
          attendance: '출석',
          time: '09:00',
        },
        {
          id: 2,
          title: '2회차 - Reading Comprehension',
          date: '2024-01-23',
          attendance: '출석',
          time: '08:59',
        },
        {
          id: 3,
          title: '3회차 - Vocabulary Building',
          date: '2024-01-30',
          attendance: '출석',
          time: '09:12',
        },
        {
          id: 4,
          title: '4회차 - Writing Skills',
          date: '2024-02-06',
          attendance: '출석',
          time: '09:03',
        },
        {
          id: 5,
          title: '5회차 - Listening Practice',
          date: '2024-02-13',
          attendance: '출석',
          time: '08:56',
        },
        {
          id: 6,
          title: '6회차 - Speaking Practice',
          date: '2024-02-20',
          attendance: '출석',
          time: '09:01',
        },
        {
          id: 7,
          title: '7회차 - TOEIC Practice',
          date: '2024-02-27',
          attendance: '예정',
          time: '-',
        },
        {
          id: 8,
          title: '8회차 - Essay Writing',
          date: '2024-03-05',
          attendance: '예정',
          time: '-',
        },
        {
          id: 9,
          title: '9회차 - Advanced Grammar',
          date: '2024-03-12',
          attendance: '예정',
          time: '-',
        },
        {
          id: 10,
          title: '10회차 - Final Test',
          date: '2024-03-19',
          attendance: '예정',
          time: '-',
        },
      ],
    },
    {
      id: 3,
      name: '과학 탐구반',
      totalSessions: 8,
      completedSessions: 5,
      sessions: [
        {
          id: 1,
          title: '1회차 - 물리학 기초',
          date: '2024-01-17',
          attendance: '출석',
          time: '09:00',
        },
        {
          id: 2,
          title: '2회차 - 화학 기초',
          date: '2024-01-24',
          attendance: '출석',
          time: '08:58',
        },
        {
          id: 3,
          title: '3회차 - 생물학 기초',
          date: '2024-01-31',
          attendance: '결석',
          time: '-',
        },
        {
          id: 4,
          title: '4회차 - 지구과학 기초',
          date: '2024-02-07',
          attendance: '출석',
          time: '09:05',
        },
        {
          id: 5,
          title: '5회차 - 실험 방법론',
          date: '2024-02-14',
          attendance: '출석',
          time: '08:55',
        },
        {
          id: 6,
          title: '6회차 - 탐구 프로젝트',
          date: '2024-02-21',
          attendance: '예정',
          time: '-',
        },
        {
          id: 7,
          title: '7회차 - 과학사',
          date: '2024-02-28',
          attendance: '예정',
          time: '-',
        },
        {
          id: 8,
          title: '8회차 - 종합 평가',
          date: '2024-03-06',
          attendance: '예정',
          time: '-',
        },
      ],
    },
  ];

  const handleClassClick = classId => {
    setSelectedClass(selectedClass === classId ? null : classId);
  };

  const getStatusColor = status => {
    switch (status) {
      case '출석':
        return 'present';
      case '지각':
        return 'late';
      case '결석':
        return 'absent';
      case '예정':
        return 'upcoming';
      default:
        return '';
    }
  };

  const getAttendanceStats = sessions => {
    const present = sessions.filter(s => s.attendance === '출석').length;
    const absent = sessions.filter(s => s.attendance === '결석').length;
    const upcoming = sessions.filter(s => s.attendance === '예정').length;
    return { present, absent, upcoming };
  };

  return (
    <div className='student-attendance-check'>
      <div className='attendance-header'>
        <h3>내 출석 확인</h3>
      </div>

      <div className='attendance-container'>
        {studentClasses.map(classItem => {
          const stats = getAttendanceStats(classItem.sessions);
          return (
            <div key={classItem.id} className='attendance-item'>
              <div
                className='attendance-header-row'
                onClick={() => handleClassClick(classItem.id)}
              >
                <div className='class-info'>
                  <div className='class-name'>{classItem.name}</div>
                </div>
                <div className='class-stats'>
                  <div className='progress-info'>
                    {classItem.completedSessions}/{classItem.totalSessions}회
                    완료
                  </div>
                  <div className='attendance-summary'>
                    <span className='stat present'>출석 {stats.present}회</span>
                    <span className='stat absent'>결석 {stats.absent}회</span>
                  </div>
                </div>
              </div>

              {selectedClass === classItem.id && (
                <div className='sessions-list'>
                  {classItem.sessions.map(session => (
                    <div
                      key={session.id}
                      className={`session-detail-item ${getStatusColor(session.attendance)}`}
                    >
                      <div className='session-info'>
                        <div className='session-title'>{session.title}</div>
                        <div className='session-date'>{session.date}</div>
                      </div>
                      <div className='attendance-info'>
                        <span
                          className={`status-badge ${getStatusColor(session.attendance)}`}
                        >
                          {session.attendance}
                        </span>
                        <span className='attendance-time'>{session.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentAttendanceCheck;
