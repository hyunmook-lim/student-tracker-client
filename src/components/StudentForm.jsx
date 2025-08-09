import React from 'react';
import { useStudentsStore, useUIStore } from '../store';
import './StudentForm.css';

function StudentForm() {
  const { addStudent, updateStudent } = useStudentsStore();
  const {
    modalType,
    selectedStudent,
    closeModal,
    studentFormData,
    updateStudentFormData,
    updateStudentFormGrades,
  } = useUIStore();

  const isEditMode = modalType === 'editStudent';

  const handleInputChange = e => {
    const { name, value } = e.target;
    updateStudentFormData(name, value);
  };

  const handleGradeChange = (subject, value) => {
    updateStudentFormGrades(subject, value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (isEditMode) {
      updateStudent(selectedStudent.id, studentFormData);
    } else {
      addStudent(studentFormData);
    }

    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className='student-form'>
      <div className='form-header'>
        <h3>{isEditMode ? '학생 정보 수정' : '새 학생 추가'}</h3>
      </div>

      <div className='form-body'>
        <div className='form-section'>
          <h4>기본 정보</h4>
          <div className='form-grid'>
            <div className='form-group'>
              <label htmlFor='name'>이름</label>
              <input
                type='text'
                id='name'
                name='name'
                value={studentFormData.name}
                onChange={handleInputChange}
                placeholder='학생 이름'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='studentNumber'>학번</label>
              <input
                type='text'
                id='studentNumber'
                name='studentNumber'
                value={studentFormData.studentNumber}
                onChange={handleInputChange}
                placeholder='학번'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='grade'>학년</label>
              <select
                id='grade'
                name='grade'
                value={studentFormData.grade}
                onChange={handleInputChange}
                required
              >
                <option value={1}>1학년</option>
                <option value={2}>2학년</option>
                <option value={3}>3학년</option>
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='class'>반</label>
              <select
                id='class'
                name='class'
                value={studentFormData.class}
                onChange={handleInputChange}
                required
              >
                <option value={1}>1반</option>
                <option value={2}>2반</option>
                <option value={3}>3반</option>
                <option value={4}>4반</option>
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='attendance'>출석률 (%)</label>
              <input
                type='number'
                id='attendance'
                name='attendance'
                value={studentFormData.attendance}
                onChange={handleInputChange}
                min='0'
                max='100'
                placeholder='출석률'
              />
            </div>
          </div>
        </div>

        <div className='form-section'>
          <h4>성적 정보</h4>
          <div className='grades-grid'>
            <div className='form-group'>
              <label htmlFor='korean'>국어</label>
              <input
                type='number'
                id='korean'
                value={studentFormData.grades.korean}
                onChange={e => handleGradeChange('korean', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='math'>수학</label>
              <input
                type='number'
                id='math'
                value={studentFormData.grades.math}
                onChange={e => handleGradeChange('math', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='english'>영어</label>
              <input
                type='number'
                id='english'
                value={studentFormData.grades.english}
                onChange={e => handleGradeChange('english', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='science'>과학</label>
              <input
                type='number'
                id='science'
                value={studentFormData.grades.science}
                onChange={e => handleGradeChange('science', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='social'>사회</label>
              <input
                type='number'
                id='social'
                value={studentFormData.grades.social}
                onChange={e => handleGradeChange('social', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='form-actions'>
        <button type='button' className='cancel-btn' onClick={closeModal}>
          취소
        </button>
        <button type='submit' className='submit-btn'>
          {isEditMode ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
