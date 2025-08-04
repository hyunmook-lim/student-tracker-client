import React, { useState } from 'react';
import './AttendanceCheck.css';

function AttendanceCheck() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  // 수업 데이터 (실제로는 서버에서 가져올 데이터)
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
          date: '2024-01-15',
          attendance: [
            { studentId: 1, name: '김철수', status: '출석', time: '09:00' },
            { studentId: 2, name: '이영희', status: '지각', time: '09:15' },
            { studentId: 3, name: '박민수', status: '출석', time: '08:55' },
            { studentId: 4, name: '정수진', status: '결석', time: '-' },
            { studentId: 5, name: '최동현', status: '출석', time: '09:02' },
          ],
        },
        {
          id: 2,
          title: '2회차 - 방정식',
          date: '2024-01-22',
          attendance: [
            { studentId: 1, name: '김철수', status: '출석', time: '09:00' },
            { studentId: 2, name: '이영희', status: '출석', time: '08:58' },
            { studentId: 3, name: '박민수', status: '지각', time: '09:20' },
            { studentId: 4, name: '정수진', status: '출석', time: '09:05' },
            { studentId: 5, name: '최동현', status: '결석', time: '-' },
          ],
        },
        {
          id: 3,
          title: '3회차 - 함수',
          date: '2024-01-29',
          attendance: [
            { studentId: 1, name: '김철수', status: '출석', time: '09:00' },
            { studentId: 2, name: '이영희', status: '출석', time: '08:55' },
            { studentId: 3, name: '박민수', status: '출석', time: '09:01' },
            { studentId: 4, name: '정수진', status: '출석', time: '09:03' },
            { studentId: 5, name: '최동현', status: '출석', time: '08:58' },
          ],
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
          date: '2024-01-16',
          attendance: [
            { studentId: 6, name: '한지민', status: '출석', time: '09:00' },
            { studentId: 7, name: '송민호', status: '지각', time: '09:10' },
            { studentId: 8, name: '윤서연', status: '출석', time: '08:57' },
            { studentId: 9, name: '강현우', status: '결석', time: '-' },
            { studentId: 10, name: '임지은', status: '출석', time: '09:02' },
          ],
        },
        {
          id: 5,
          title: '2회차 - 문법 기초',
          date: '2024-01-23',
          attendance: [
            { studentId: 6, name: '한지민', status: '출석', time: '09:00' },
            { studentId: 7, name: '송민호', status: '출석', time: '08:59' },
            { studentId: 8, name: '윤서연', status: '지각', time: '09:12' },
            { studentId: 9, name: '강현우', status: '출석', time: '09:05' },
            { studentId: 10, name: '임지은', status: '출석', time: '09:01' },
          ],
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
          date: '2024-01-17',
          attendance: [
            { studentId: 11, name: '오승준', status: '출석', time: '09:00' },
            { studentId: 12, name: '김나영', status: '출석', time: '08:58' },
            { studentId: 13, name: '이준호', status: '지각', time: '09:18' },
            { studentId: 14, name: '박소영', status: '출석', time: '09:01' },
            { studentId: 15, name: '최민석', status: '결석', time: '-' },
          ],
        },
        {
          id: 7,
          title: '2회차 - 적분',
          date: '2024-01-24',
          attendance: [
            { studentId: 11, name: '오승준', status: '출석', time: '09:00' },
            { studentId: 12, name: '김나영', status: '출석', time: '08:55' },
            { studentId: 13, name: '이준호', status: '출석', time: '09:02' },
            { studentId: 14, name: '박소영', status: '지각', time: '09:15' },
            { studentId: 15, name: '최민석', status: '출석', time: '09:03' },
          ],
        },
      ],
    },
  ];

  const handleClassClick = classId => {
    setSelectedClass(selectedClass === classId ? null : classId);
    setSelectedSession(null);
  };

  const handleSessionClick = sessionId => {
    setSelectedSession(selectedSession === sessionId ? null : sessionId);
  };

  const getStatusColor = status => {
    switch (status) {
      case '출석':
        return 'present';
      case '지각':
        return 'late';
      case '결석':
        return 'absent';
      default:
        return '';
    }
  };

  const getAttendanceStats = attendance => {
    const present = attendance.filter(a => a.status === '출석').length;
    const late = attendance.filter(a => a.status === '지각').length;
    const absent = attendance.filter(a => a.status === '결석').length;
    return { present, late, absent };
  };

  return (
    <div className='attendance-check'>
      <div className='attendance-header'>
        <h3>출석 확인</h3>
      </div>

      <div className='attendance-container'>
        {classrooms.map(classroom => (
          <div key={classroom.id} className='attendance-item'>
            <div
              className='attendance-header-row'
              onClick={() => handleClassClick(classroom.id)}
            >
              <div className='class-name'>{classroom.name}</div>
              <div className='class-description'>{classroom.description}</div>
              <div className='class-student-count'>
                {classroom.studentCount}명
              </div>
            </div>

            {selectedClass === classroom.id && (
              <div className='sessions-list'>
                <div className='sessions-header'>
                  <span>회차</span>
                  <span>수업날짜</span>
                  <span>출석 현황</span>
                  <span>상세보기</span>
                </div>
                {classroom.sessions.map(session => {
                  const stats = getAttendanceStats(session.attendance);
                  return (
                    <div key={session.id} className='session-detail-item'>
                      <span className='session-title'>{session.title}</span>
                      <span className='session-date'>{session.date}</span>
                      <div className='attendance-stats'>
                        <span className='stat present'>
                          출석 {stats.present}명
                        </span>
                        <span className='stat late'>지각 {stats.late}명</span>
                        <span className='stat absent'>
                          결석 {stats.absent}명
                        </span>
                      </div>
                      <button
                        className='view-detail-btn'
                        onClick={() => handleSessionClick(session.id)}
                      >
                        {selectedSession === session.id ? '접기' : '상세보기'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 선택된 회차의 상세 출석 정보 */}
            {selectedClass === classroom.id && selectedSession && (
              <div className='attendance-detail'>
                <div className='detail-header'>
                  <h4>
                    {
                      classroom.sessions.find(s => s.id === selectedSession)
                        ?.title
                    }
                  </h4>
                </div>
                <div className='attendance-table'>
                  <div className='table-header'>
                    <span>번호</span>
                    <span>학생명</span>
                    <span>출석 상태</span>
                    <span>등교 시간</span>
                  </div>
                  {classroom.sessions
                    .find(s => s.id === selectedSession)
                    ?.attendance.map((student, index) => (
                      <div
                        key={student.studentId}
                        className={`table-row ${getStatusColor(student.status)}`}
                      >
                        <span className='student-number'>{index + 1}</span>
                        <span className='student-name'>{student.name}</span>
                        <span
                          className={`status-badge ${getStatusColor(student.status)}`}
                        >
                          {student.status}
                        </span>
                        <span className='attendance-time'>{student.time}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendanceCheck;
