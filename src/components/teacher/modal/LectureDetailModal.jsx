import React, { useState, useEffect } from 'react';
import { getQuestionsByLecture } from '../../../api/questionApi';
import './LectureDetailModal.css';

function LectureDetailModal({ isOpen, onClose, lecture }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && lecture) {
      fetchQuestions();
    }
  }, [isOpen, lecture]);

  const fetchQuestions = async () => {
    if (!lecture?.uid && !lecture?.id) return;

    setLoading(true);
    setError(null);

    try {
      const lectureId = lecture.uid || lecture.id;
      const result = await getQuestionsByLecture(lectureId);
      
      if (result.success) {
        setQuestions(result.data || []);
      } else {
        setError(result.error || '문제를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('문제 불러오기 오류:', error);
      setError('문제를 불러오는데 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lecture-detail-modal-overlay" onClick={handleOverlayClick}>
      <div className="lecture-detail-modal">
        <div className="modal-header">
          <h2>강의 상세 정보</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {lecture && (
            <div className="lecture-info-section">
              <h3>강의 정보</h3>
              <div className="lecture-details-row">
                <span className="lecture-name">{lecture.lectureName}</span>
                <span className="lecture-description">{lecture.description || 'N/A'}</span>
                <span className="lecture-date">
                  {lecture.lectureDate ? lecture.lectureDate.split('T')[0] : 'N/A'}
                </span>
              </div>
            </div>
          )}

          <div className="questions-section">
            <h3>문제 목록 ({questions.length}개)</h3>
            
            {loading && (
              <div className="loading-message">문제를 불러오는 중...</div>
            )}

            {error && (
              <div className="error-message">{error}</div>
            )}

            {!loading && !error && questions.length === 0 && (
              <div className="no-questions-message">
                이 강의에 등록된 문제가 없습니다.
              </div>
            )}

            {!loading && !error && questions.length > 0 && (
              <div className="questions-list">
                {questions.map((question, index) => (
                  <div key={question.uid || question.id || index} className="question-item">
                    <div className="question-row">
                      <span className="question-number">
                        문제 {question.number || index + 1}
                      </span>
                      <span className="question-main-topic">
                        {question.mainTopic || 'N/A'}
                      </span>
                      <span className="question-sub-topic">
                        {question.subTopic || 'N/A'}
                      </span>
                      <span className="question-difficulty">
                        {question.difficulty || 'N/A'}
                      </span>
                      <span className="question-score">
                        {question.score || 0}점
                      </span>
                      <span className="question-answer">
                        {question.answer || question.correctAnswer || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default LectureDetailModal;