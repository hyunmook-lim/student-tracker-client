import React, { useState, useEffect } from 'react';
import './StudentResultModal.css';

function StudentResultModal({
  isOpen,
  onClose,
  student,
  questions,
  initialData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    attendance: '출석',
    assignmentGrade: '',
    answers: {},
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        attendance: initialData.attendance || '출석',
        assignmentGrade: initialData.assignmentGrade || '',
        answers: initialData.answers || {},
      });
    } else if (isOpen) {
      // 초기 데이터가 없는 경우 기본값 설정
      const initialAnswers = {};
      questions.forEach(question => {
        const questionId = question.uid || question.id;
        initialAnswers[questionId] = '';
      });

      setFormData({
        attendance: '출석',
        assignmentGrade: '',
        answers: initialAnswers,
      });
    }
    setErrors({});
  }, [isOpen, initialData, questions]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));

    // 에러 제거
    if (errors[`answer_${questionId}`]) {
      setErrors(prev => ({
        ...prev,
        [`answer_${questionId}`]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 출석 여부는 항상 선택되어야 함
    if (!formData.attendance) {
      newErrors.attendance = '출석 여부를 선택해주세요.';
    }

    // 출석한 경우에만 과제 등급과 답안 검증
    if (formData.attendance === '출석') {
      if (!formData.assignmentGrade.trim()) {
        newErrors.assignmentGrade = '과제 등급을 입력해주세요.';
      }

      // 모든 문제에 대한 답안 검증
      questions.forEach(question => {
        const questionId = question.uid || question.id;
        const answer = formData.answers[questionId];
        if (!answer || !answer.trim()) {
          newErrors[`answer_${questionId}`] = '답안을 입력해주세요.';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const resultData = {
      ...formData,
      isCompleted: true,
    };

    onSave(resultData);
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className='student-result-modal-overlay' onClick={onClose}>
      <div
        className='student-result-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='student-result-modal-header'>
          <h3>{student.studentName} - 회차 정보 입력</h3>
          <button className='student-result-modal-close' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='student-result-modal-body'>
          {/* 출석 여부 */}
          <div className='form-section'>
            <div className='form-row'>
              <span className='form-label'>출석 여부</span>
              <div className='attendance-options'>
                <label className='attendance-option'>
                  <input
                    type='radio'
                    name='attendance'
                    value='출석'
                    checked={formData.attendance === '출석'}
                    onChange={e =>
                      handleInputChange('attendance', e.target.value)
                    }
                  />
                  <span className='attendance-slider' data-label='출석'></span>
                </label>
                <label className='attendance-option'>
                  <input
                    type='radio'
                    name='attendance'
                    value='결석'
                    checked={formData.attendance === '결석'}
                    onChange={e =>
                      handleInputChange('attendance', e.target.value)
                    }
                  />
                  <span className='attendance-slider' data-label='결석'></span>
                </label>
              </div>
            </div>
            {errors.attendance && (
              <div className='error-message'>{errors.attendance}</div>
            )}
          </div>

          {/* 과제 등급 - 출석한 경우에만 표시 */}
          {formData.attendance === '출석' && (
            <div className='form-section'>
              <div className='form-row'>
                <span className='form-label'>과제 등급</span>
                <div className='grade-options'>
                  <label className='grade-option'>
                    <input
                      type='radio'
                      name='assignmentGrade'
                      value='A'
                      checked={formData.assignmentGrade === 'A'}
                      onChange={e =>
                        handleInputChange('assignmentGrade', e.target.value)
                      }
                    />
                    <span className='grade-slider'>A</span>
                  </label>
                  <label className='grade-option'>
                    <input
                      type='radio'
                      name='assignmentGrade'
                      value='B'
                      checked={formData.assignmentGrade === 'B'}
                      onChange={e =>
                        handleInputChange('assignmentGrade', e.target.value)
                      }
                    />
                    <span className='grade-slider'>B</span>
                  </label>
                  <label className='grade-option'>
                    <input
                      type='radio'
                      name='assignmentGrade'
                      value='C'
                      checked={formData.assignmentGrade === 'C'}
                      onChange={e =>
                        handleInputChange('assignmentGrade', e.target.value)
                      }
                    />
                    <span className='grade-slider'>C</span>
                  </label>
                  <label className='grade-option'>
                    <input
                      type='radio'
                      name='assignmentGrade'
                      value='D'
                      checked={formData.assignmentGrade === 'D'}
                      onChange={e =>
                        handleInputChange('assignmentGrade', e.target.value)
                      }
                    />
                    <span className='grade-slider'>D</span>
                  </label>
                </div>
              </div>
              {errors.assignmentGrade && (
                <div className='error-message'>{errors.assignmentGrade}</div>
              )}
            </div>
          )}

          {/* 문제 답안 - 출석한 경우에만 표시 */}
          {formData.attendance === '출석' && questions.length > 0 && (
            <div className='form-section'>
              <h4>문제 답안</h4>
              <div className='questions-container'>
                <div className='questions-header'>
                  <span className='question-header-item'>문제 번호</span>
                  <span className='question-header-item'>난이도</span>
                  <span className='question-header-item'>배점</span>
                  <span className='question-header-item'>정답</span>
                  <span className='question-header-item'>학생 답안</span>
                </div>
                {questions.map((question, index) => {
                  const questionId = question.uid || question.id;
                  return (
                    <div key={questionId} className='question-row'>
                      <span className='question-number'>{index + 1}</span>
                      <span className='question-difficulty'>
                        {question.difficulty || '보통'}
                      </span>
                      <span className='question-score'>
                        {question.score || 10}점
                      </span>
                      <span className='question-answer'>
                        {question.answer || '정답'}
                      </span>
                      <div className='answer-input-container'>
                        <input
                          type='text'
                          className='answer-input'
                          placeholder='학생 답안 입력...'
                          value={formData.answers[questionId] || ''}
                          onChange={e =>
                            handleAnswerChange(questionId, e.target.value)
                          }
                        />
                        {errors[`answer_${questionId}`] && (
                          <div className='error-message'>
                            {errors[`answer_${questionId}`]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className='student-result-modal-actions'>
          <button
            className='student-result-btn student-result-btn-cancel'
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            className='student-result-btn student-result-btn-save'
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentResultModal;
