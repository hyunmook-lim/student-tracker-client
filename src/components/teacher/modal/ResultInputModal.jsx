import React, { useState, useEffect } from 'react';
import './ResultInputModal.css';

function ResultInputModal({
  isOpen,
  onClose,
  selectedLecture,
  classrooms,
  expandedClass,
  onSave,
}) {
  const [studentResults, setStudentResults] = useState([]);

  useEffect(() => {
    if (isOpen && expandedClass) {
      const classroom = classrooms.find(c => c.id === expandedClass);
      if (classroom?.students) {
        // 기존 데이터가 있으면 사용하고, 없으면 기본값으로 초기화
        const initialResults = classroom.students.map(student => ({
          id: student.id,
          name: student.name,
          attendance: student.attendance || '출석',
          examScore: student.examScore || '',
          examTotal: student.examTotal || 100,
          assignmentGrade: student.assignmentGrade || '',
        }));
        setStudentResults(initialResults);
      }
    }
  }, [isOpen, expandedClass, classrooms]);

  const handleAttendanceChange = (studentId, attendance) => {
    setStudentResults(prev =>
      prev.map(student =>
        student.id === studentId
          ? {
              ...student,
              attendance,
              // 결석이면 점수 초기화
              examScore: attendance === '결석' ? '' : student.examScore,
              assignmentGrade:
                attendance === '결석' ? '' : student.assignmentGrade,
            }
          : student
      )
    );
  };

  const handleExamScoreChange = (studentId, score) => {
    const numScore = score === '' ? '' : parseInt(score);
    setStudentResults(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, examScore: numScore } : student
      )
    );
  };

  const handleAssignmentGradeChange = (studentId, grade) => {
    setStudentResults(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, assignmentGrade: grade }
          : student
      )
    );
  };

  const handleSave = () => {
    // 유효성 검사
    const hasErrors = studentResults.some(student => {
      if (student.attendance === '출석') {
        if (
          student.examScore === '' ||
          student.examScore < 0 ||
          student.examScore > student.examTotal
        ) {
          return true;
        }
        if (!student.assignmentGrade) {
          return true;
        }
      }
      return false;
    });

    if (hasErrors) {
      alert('출석한 학생의 시험 점수와 과제 등급을 모두 입력해주세요.');
      return;
    }

    // 저장 로직
    if (onSave) {
      onSave(studentResults);
    }
    onClose();
  };

  if (!isOpen || !selectedLecture) return null;

  return (
    <div className='result-input-modal-overlay' onClick={onClose}>
      <div
        className='result-input-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='result-input-modal-header'>
          <h3>{selectedLecture.title} - 결과 입력</h3>
          <button className='result-input-modal-close' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='result-input-modal-body'>
          <div className='result-input-form'>
            <div className='result-input-table'>
              <div className='result-input-table-header'>
                <span>학생명</span>
                <span>출석</span>
                <span>시험 점수</span>
                <span>과제 등급</span>
              </div>
              {studentResults.map(student => (
                <div key={student.id} className='result-input-table-row'>
                  <span className='result-input-student-name'>
                    {student.name}
                  </span>
                  <div className='result-input-attendance-select'>
                    <select
                      value={student.attendance}
                      onChange={e =>
                        handleAttendanceChange(student.id, e.target.value)
                      }
                    >
                      <option value='출석'>출석</option>
                      <option value='결석'>결석</option>
                    </select>
                  </div>
                  <div className='result-input-exam-score'>
                    <input
                      type='number'
                      min='0'
                      max={student.examTotal}
                      value={student.examScore}
                      onChange={e =>
                        handleExamScoreChange(student.id, e.target.value)
                      }
                      disabled={student.attendance === '결석'}
                      placeholder='점수'
                    />
                    <span className='result-input-total'>
                      / {student.examTotal}점
                    </span>
                  </div>
                  <div className='result-input-assignment-grade'>
                    <select
                      value={student.assignmentGrade}
                      onChange={e =>
                        handleAssignmentGradeChange(student.id, e.target.value)
                      }
                      disabled={student.attendance === '결석'}
                    >
                      <option value=''>선택</option>
                      <option value='A'>A</option>
                      <option value='B'>B</option>
                      <option value='C'>C</option>
                      <option value='D'>D</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className='result-input-actions'>
              <button
                className='result-input-btn result-input-btn-cancel'
                onClick={onClose}
              >
                취소
              </button>
              <button
                className='result-input-btn result-input-btn-save'
                onClick={handleSave}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultInputModal;
