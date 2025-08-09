import React from 'react';
import {
  useAttendanceStore,
  useClassroomStore,
  useSessionStore,
} from '../store';
import './AttendanceCheck.css';

function AttendanceCheck() {
  const {
    selectedClass,
    selectedSession,
    setSelectedClass,
    setSelectedSession,
    updateAttendance,
    getAttendanceBySession,
  } = useAttendanceStore();

  const { classrooms } = useClassroomStore();
  const { getSessionsByClassroom } = useSessionStore();

  const handleClassSelect = classroom => {
    setSelectedClass(classroom);
    setSelectedSession(null);
  };

  const handleSessionSelect = session => {
    setSelectedSession(session);
  };

  const handleAttendanceChange = (studentId, status) => {
    if (selectedSession) {
      const currentTime = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      updateAttendance(
        selectedSession.id,
        studentId,
        status,
        status === '결석' ? '-' : currentTime
      );
    }
  };

  const getAttendanceData = () => {
    if (!selectedSession) return null;
    return getAttendanceBySession(selectedSession.id);
  };

  const attendanceData = getAttendanceData();

  return (
    <div className='attendance-check-container'>
      <div className='attendance-check-header'>
        <h2>출석 체크</h2>
      </div>

      <div className='selection-section'>
        <div className='class-selection'>
          <h3>반 선택</h3>
          <div className='class-list'>
            {classrooms.map(classroom => (
              <div
                key={classroom.id}
                className={`class-item ${
                  selectedClass?.id === classroom.id ? 'selected' : ''
                }`}
                onClick={() => handleClassSelect(classroom)}
              >
                <h4>{classroom.name}</h4>
                <p>{classroom.description}</p>
                <span>학생 수: {classroom.studentCount}명</span>
              </div>
            ))}
          </div>
        </div>

        {selectedClass && (
          <div className='session-selection'>
            <h3>수업 선택</h3>
            <div className='session-list'>
              {getSessionsByClassroom(selectedClass.id).map(session => (
                <div
                  key={session.id}
                  className={`session-item ${
                    selectedSession?.id === session.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSessionSelect(session)}
                >
                  <h4>{session.title}</h4>
                  <p>{session.description}</p>
                  <span>{session.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedSession && attendanceData && (
        <div className='attendance-section'>
          <div className='attendance-header'>
            <h3>
              {selectedClass.name} - {selectedSession.title}
            </h3>
            <p>수업 날짜: {selectedSession.date}</p>
          </div>

          <div className='attendance-list'>
            <div className='attendance-list-header'>
              <span>학생명</span>
              <span>출석 상태</span>
              <span>체크 시간</span>
              <span>액션</span>
            </div>
            {attendanceData.attendance.map(record => (
              <div key={record.studentId} className='attendance-item'>
                <span className='student-name'>{record.name}</span>
                <span className={`status ${record.status}`}>
                  {record.status}
                </span>
                <span className='time'>{record.time}</span>
                <div className='actions'>
                  <button
                    className={`status-btn present ${
                      record.status === '출석' ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleAttendanceChange(record.studentId, '출석')
                    }
                  >
                    출석
                  </button>
                  <button
                    className={`status-btn late ${
                      record.status === '지각' ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleAttendanceChange(record.studentId, '지각')
                    }
                  >
                    지각
                  </button>
                  <button
                    className={`status-btn absent ${
                      record.status === '결석' ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleAttendanceChange(record.studentId, '결석')
                    }
                  >
                    결석
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='attendance-summary'>
            <div className='summary-item'>
              <span>출석:</span>
              <span>
                {
                  attendanceData.attendance.filter(
                    record => record.status === '출석'
                  ).length
                }
                명
              </span>
            </div>
            <div className='summary-item'>
              <span>지각:</span>
              <span>
                {
                  attendanceData.attendance.filter(
                    record => record.status === '지각'
                  ).length
                }
                명
              </span>
            </div>
            <div className='summary-item'>
              <span>결석:</span>
              <span>
                {
                  attendanceData.attendance.filter(
                    record => record.status === '결석'
                  ).length
                }
                명
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceCheck;
