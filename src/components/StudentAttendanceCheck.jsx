import React from 'react';
import { useClassroomStore } from '../store';
import './StudentAttendanceCheck.css';

function StudentAttendanceCheck() {
  const { classrooms, selectedClassroom, setSelectedClassroom } =
    useClassroomStore();

  const handleClassSelect = classroom => {
    setSelectedClassroom(classroom);
  };

  return (
    <div className='student-attendance-check-container'>
      <div className='student-attendance-check-header'>
        <h2>학생용 출석 체크</h2>
        <p>소속 반을 선택하여 출석을 확인하세요</p>
      </div>

      <div className='class-selection-grid'>
        {classrooms.map(classroom => (
          <div
            key={classroom.id}
            className={`class-option ${
              selectedClassroom?.id === classroom.id ? 'selected' : ''
            }`}
            onClick={() => handleClassSelect(classroom)}
          >
            <div className='class-info'>
              <h3>{classroom.name}</h3>
              <p>{classroom.description}</p>
              <span>학생 수: {classroom.studentCount}명</span>
            </div>
            {selectedClassroom?.id === classroom.id && (
              <div className='selected-indicator'>✓</div>
            )}
          </div>
        ))}
      </div>

      {selectedClassroom && (
        <div className='attendance-confirmation'>
          <div className='confirmation-card'>
            <h3>출석 체크</h3>
            <p>
              <strong>{selectedClassroom.name}</strong>에 출석하시겠습니까?
            </p>
            <div className='confirmation-actions'>
              <button className='check-in-btn'>출석 체크</button>
              <button
                className='cancel-btn'
                onClick={() => setSelectedClassroom(null)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAttendanceCheck;
