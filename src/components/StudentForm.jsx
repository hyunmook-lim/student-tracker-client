import React, { useState, useEffect } from 'react';
import { useStudentsStore, useUIStore } from '../store';

function StudentForm() {
  const { addStudent, updateStudent } = useStudentsStore();
  const { modalType, selectedStudent, closeModal } = useUIStore();

  const [formData, setFormData] = useState({
    name: '',
    grade: 1,
    class: 1,
    studentNumber: '',
    attendance: 100,
    grades: {
      korean: 0,
      math: 0,
      english: 0,
      science: 0,
      social: 0,
    },
  });

  const isEditMode = modalType === 'editStudent';

  useEffect(() => {
    if (isEditMode && selectedStudent) {
      setFormData(selectedStudent);
    }
  }, [isEditMode, selectedStudent]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGradeChange = (subject, value) => {
    setFormData(prev => ({
      ...prev,
      grades: {
        ...prev.grades,
        [subject]: parseInt(value) || 0,
      },
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (isEditMode) {
      updateStudent(selectedStudent.id, formData);
    } else {
      addStudent(formData);
    }

    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className='student-form'>
      <div className='form-group'>
        <label htmlFor='name'>이름</label>
        <input
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor='grade'>학년</label>
          <select
            id='grade'
            name='grade'
            value={formData.grade}
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
            value={formData.class}
            onChange={handleInputChange}
            required
          >
            <option value={1}>1반</option>
            <option value={2}>2반</option>
            <option value={3}>3반</option>
            <option value={4}>4반</option>
          </select>
        </div>
      </div>

      <div className='form-group'>
        <label htmlFor='studentNumber'>학번</label>
        <input
          type='text'
          id='studentNumber'
          name='studentNumber'
          value={formData.studentNumber}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='form-group'>
        <label htmlFor='attendance'>출석률 (%)</label>
        <input
          type='number'
          id='attendance'
          name='attendance'
          value={formData.attendance}
          onChange={handleInputChange}
          min='0'
          max='100'
          required
        />
      </div>

      <div className='grades-section'>
        <h3>성적</h3>
        <div className='grades-grid'>
          {Object.entries(formData.grades).map(([subject, grade]) => (
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
      </div>

      <div className='form-actions'>
        <button type='button' onClick={closeModal} className='cancel-btn'>
          취소
        </button>
        <button type='submit' className='submit-btn'>
          {isEditMode ? '수정' : '추가'}
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

export default StudentForm;
