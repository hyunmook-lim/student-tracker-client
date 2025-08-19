import React from 'react';
import './LectureAddModal.css';

function LectureAddModal({
  isOpen,
  onClose,
  newLectureData,
  updateNewLectureData,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>새 강의 추가</h3>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          <div className='form-group'>
            <label>강의 제목</label>
            <input
              type='text'
              value={newLectureData.title}
              onChange={e => updateNewLectureData('title', e.target.value)}
              placeholder='강의 제목을 입력하세요'
            />
          </div>
          <div className='form-group'>
            <label>강의 설명</label>
            <textarea
              value={newLectureData.description}
              onChange={e =>
                updateNewLectureData('description', e.target.value)
              }
              placeholder='강의 설명을 입력하세요'
              rows='3'
            />
          </div>
          <div className='form-group'>
            <label>강의 날짜</label>
            <input
              type='date'
              value={newLectureData.date}
              onChange={e => updateNewLectureData('date', e.target.value)}
            />
          </div>
        </div>
        <div className='modal-actions'>
          <button className='cancel-btn' onClick={onClose}>
            취소
          </button>
          <button className='save-btn' onClick={onSave}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default LectureAddModal;
