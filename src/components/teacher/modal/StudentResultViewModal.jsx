import React, { useState, useEffect } from 'react';
import './StudentResultViewModal.css';

function StudentResultViewModal({
  isOpen,
  onClose,
  student,
  questions,
  initialData,
}) {
  const [formData, setFormData] = useState({
    attendance: '출석',
    assignmentGrade: '',
    answers: {},
  });

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
  }, [isOpen, initialData, questions]);

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className='student-result-view-modal-overlay' onClick={onClose}>
      <div
        className='student-result-view-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='student-result-view-modal-header'>
          <h3>{(() => {
            const studentObj = student.student || student;
            return studentObj.name || studentObj.studentName || '학생';
          })()} - 회차 정보 보기</h3>
          <button className='student-result-view-modal-close' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='student-result-view-modal-body'>
          {/* 출석 여부 */}
          <div className='form-section'>
            <div className='form-row'>
              <span className='form-label'>출석 여부</span>
              <div className='attendance-display'>
                <span
                  className={`attendance-status ${formData.attendance === '출석' ? 'present' : 'absent'}`}
                >
                  {formData.attendance}
                </span>
              </div>
            </div>
          </div>

          {/* 과제 등급 - 출석한 경우에만 표시 */}
          {formData.attendance === '출석' && (
            <div className='form-section'>
              <div className='form-row'>
                <span className='form-label'>과제 등급</span>
                <div className='grade-display'>
                  <span
                    className={`grade-status grade-${formData.assignmentGrade}`}
                  >
                    {formData.assignmentGrade || '미입력'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 문제 답안 - 출석한 경우에만 표시 */}
          {formData.attendance === '출석' && questions.length > 0 && (
            <div className='form-section'>
              <h4>문제 답안</h4>
              <div className='questions-container'>
                <div className='questions-header'>
                  <span className='question-header-item'>문제 번호</span>
                  <span className='question-header-item'>대단원</span>
                  <span className='question-header-item'>소단원</span>
                  <span className='question-header-item'>난이도</span>
                  <span className='question-header-item'>배점</span>
                  <span className='question-header-item'>정답</span>
                  <span className='question-header-item'>학생 답안</span>
                </div>
                {questions.map((question, index) => {
                  const questionId = question.uid || question.id;
                  const studentAnswer = formData.answers[questionId] || '';
                  
                  // 백엔드 데이터에서 정답 여부 가져오기
                  let isCorrect = false;
                  if (initialData && initialData.questionResults) {
                    const questionResult = initialData.questionResults.find(
                      qr => qr.questionId === questionId
                    );
                    if (questionResult) {
                      isCorrect = questionResult.isCorrect;
                    }
                  } else {
                    // 백엔드 데이터가 없는 경우 기본 로직 사용
                    isCorrect = studentAnswer === question.answer;
                  }

                  return (
                    <div key={questionId} className='question-row'>
                      <span className='question-number'>{index + 1}</span>
                      <span className='question-major-unit'>
                        {question.mainTopic || '대단원'}
                      </span>
                      <span className='question-minor-unit'>
                        {question.subTopic || '소단원'}
                      </span>
                      <div className='question-difficulty-container'>
                        <span className='question-difficulty'>
                          {question.difficulty || '보통'}
                        </span>
                      </div>
                      <div className='question-score-container'>
                        <span className='question-score'>
                          {question.score || 10}점
                        </span>
                      </div>
                      <div className='question-answer-container'>
                        <span className='question-answer'>
                          {question.answer || '정답'}
                        </span>
                      </div>
                      <div className='answer-display-container'>
                        <span
                          className={`answer-display ${isCorrect ? 'correct' : 'incorrect'}`}
                        >
                          {studentAnswer || '미입력'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className='student-result-view-modal-actions'>
          <button
            className='student-result-view-btn student-result-view-btn-close'
            onClick={handleClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentResultViewModal;
