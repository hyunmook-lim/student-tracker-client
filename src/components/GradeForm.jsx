import React from 'react';
import { useStudentsStore, useUIStore } from '../store';
import './GradeForm.css';

function GradeForm() {
  const { updateStudentGrade } = useStudentsStore();
  const { closeModal, selectedStudent, gradeFormData, updateGradeFormData } =
    useUIStore();

  const handleGradeChange = (subject, value) => {
    updateGradeFormData(subject, value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (selectedStudent) {
      Object.entries(gradeFormData).forEach(([subject, grade]) => {
        updateStudentGrade(selectedStudent.id, subject, grade);
      });
    }

    closeModal();
  };

  const calculateAverage = () => {
    const values = Object.values(gradeFormData);
    return values.reduce((sum, grade) => sum + grade, 0) / values.length;
  };

  if (!selectedStudent) {
    return <div>학생 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className='grade-form'>
      <div className='form-header'>
        <h3>{selectedStudent.name} 성적 입력</h3>
      </div>

      <div className='form-body'>
        <div className='grade-grid'>
          <div className='grade-item'>
            <label htmlFor='korean'>국어</label>
            <input
              type='number'
              id='korean'
              value={gradeFormData.korean}
              onChange={e => handleGradeChange('korean', e.target.value)}
              min='0'
              max='100'
              placeholder='0-100'
            />
          </div>

          <div className='grade-item'>
            <label htmlFor='math'>수학</label>
            <input
              type='number'
              id='math'
              value={gradeFormData.math}
              onChange={e => handleGradeChange('math', e.target.value)}
              min='0'
              max='100'
              placeholder='0-100'
            />
          </div>

          <div className='grade-item'>
            <label htmlFor='english'>영어</label>
            <input
              type='number'
              id='english'
              value={gradeFormData.english}
              onChange={e => handleGradeChange('english', e.target.value)}
              min='0'
              max='100'
              placeholder='0-100'
            />
          </div>

          <div className='grade-item'>
            <label htmlFor='science'>과학</label>
            <input
              type='number'
              id='science'
              value={gradeFormData.science}
              onChange={e => handleGradeChange('science', e.target.value)}
              min='0'
              max='100'
              placeholder='0-100'
            />
          </div>

          <div className='grade-item'>
            <label htmlFor='social'>사회</label>
            <input
              type='number'
              id='social'
              value={gradeFormData.social}
              onChange={e => handleGradeChange('social', e.target.value)}
              min='0'
              max='100'
              placeholder='0-100'
            />
          </div>
        </div>

        <div className='grade-summary'>
          <div className='average-display'>
            <span className='average-label'>평균:</span>
            <span className='average-value'>
              {calculateAverage().toFixed(1)}점
            </span>
          </div>
        </div>
      </div>

      <div className='form-actions'>
        <button type='button' className='cancel-btn' onClick={closeModal}>
          취소
        </button>
        <button type='submit' className='submit-btn'>
          저장
        </button>
      </div>
    </form>
  );
}

export default GradeForm;
