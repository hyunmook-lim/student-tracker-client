import React, { useState, useEffect } from 'react';
import { useStudentsStore, useUIStore } from '../store';
import './GradeForm.css';

function GradeForm() {
  const { updateStudentGrade, selectedStudent } = useStudentsStore();
  const { closeModal } = useUIStore();

  const [grades, setGrades] = useState({
    korean: 0,
    math: 0,
    english: 0,
    science: 0,
    social: 0,
  });

  useEffect(() => {
    if (selectedStudent) {
      setGrades(selectedStudent.grades);
    }
  }, [selectedStudent]);

  const handleGradeChange = (subject, value) => {
    setGrades(prev => ({
      ...prev,
      [subject]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (selectedStudent) {
      Object.entries(grades).forEach(([subject, grade]) => {
        updateStudentGrade(selectedStudent.id, subject, grade);
      });
    }

    closeModal();
  };

  const calculateAverage = () => {
    const values = Object.values(grades);
    return values.reduce((sum, grade) => sum + grade, 0) / values.length;
  };

  if (!selectedStudent) {
    return <div>학생 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className='grade-form'>
      <div className='student-info'>
        <h3>{selectedStudent.name} 학생 성적</h3>
        <p>
          {selectedStudent.grade}학년 {selectedStudent.class}반 -{' '}
          {selectedStudent.studentNumber}번
        </p>
      </div>

      <div className='grades-grid'>
        {Object.entries(grades).map(([subject, grade]) => (
          <div key={subject} className='form-group'>
            <label htmlFor={subject}>{getSubjectName(subject)}</label>
            <input
              type='number'
              id={subject}
              value={grade}
              onChange={e => handleGradeChange(subject, e.target.value)}
              min='0'
              max='100'
              required
            />
          </div>
        ))}
      </div>

      <div className='grade-summary'>
        <h4>성적 요약</h4>
        <div className='summary-grid'>
          {Object.entries(grades).map(([subject, grade]) => (
            <div key={subject} className='summary-item'>
              <span className='subject'>{getSubjectName(subject)}</span>
              <span className='grade'>{grade}점</span>
            </div>
          ))}
          <div className='summary-item average'>
            <span className='subject'>평균</span>
            <span className='grade'>{calculateAverage().toFixed(1)}점</span>
          </div>
        </div>
      </div>

      <div className='form-actions'>
        <button type='button' onClick={closeModal} className='cancel-btn'>
          취소
        </button>
        <button type='submit' className='submit-btn'>
          저장
        </button>
      </div>
    </form>
  );
}

function getSubjectName(subject) {
  const subjectNames = {
    korean: '국어',
    math: '수학',
    english: '영어',
    science: '과학',
    social: '사회',
  };
  return subjectNames[subject] || subject;
}

export default GradeForm;
