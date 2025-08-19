import React from 'react';
import './ResultDetailModal.css';

function ResultDetailModal({
  isOpen,
  onClose,
  selectedLecture,
  getResultsForLecture,
  getGradeColor,
  classrooms,
  expandedClass,
}) {
  if (!isOpen || !selectedLecture) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>{selectedLecture.title} - 성적 결과</h3>
          <button className='modal-close' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          {selectedLecture.hasResults ? (
            <div className='results-display'>
              <div className='results-table'>
                <div className='table-header'>
                  <span>순위</span>
                  <span>학생명</span>
                  <span>점수</span>
                  <span>만점</span>
                  <span>등급</span>
                </div>
                {getResultsForLecture(selectedLecture.id)
                  .sort((a, b) => a.rank - b.rank)
                  .map(student => (
                    <div key={student.id} className='table-row'>
                      <span className='rank'>{student.rank}등</span>
                      <span className='name'>{student.name}</span>
                      <span className='score'>{student.score}점</span>
                      <span className='total'>{student.total}점</span>
                      <span className={`grade ${getGradeColor(student.score)}`}>
                        {student.score >= 90
                          ? 'A'
                          : student.score >= 80
                            ? 'B'
                            : student.score >= 70
                              ? 'C'
                              : 'D'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className='results-input'>
              <p>이 회차의 성적 결과를 입력해주세요.</p>
              <div className='input-form'>
                <div className='form-group'>
                  <label>학생별 점수 입력</label>
                  <div className='student-scores'>
                    {classrooms
                      .find(c => c.id === expandedClass)
                      ?.students?.map(student => (
                        <div key={student.id} className='score-input-row'>
                          <span className='student-name'>{student.name}</span>
                          <input
                            type='number'
                            min='0'
                            max='100'
                            placeholder='점수'
                            className='score-input'
                          />
                          <span className='total-score'>/ 100점</span>
                        </div>
                      )) || []}
                  </div>
                </div>
                <div className='form-actions'>
                  <button className='btn btn-cancel' onClick={onClose}>
                    취소
                  </button>
                  <button className='btn btn-save'>저장</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultDetailModal;
