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

  const handleClose = () => {
    updateNewLectureData('lectureName', '');
    updateNewLectureData('description', '');
    updateNewLectureData('lectureDate', '');
    onClose();
  };

  return (
    <div className='lecture-add-modal-overlay' onClick={handleClose}>
      <div
        className='lecture-add-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='lecture-add-modal-header'>
          <h3>새 강의 추가</h3>
          <button className='lecture-add-close-btn' onClick={handleClose}>
            ×
          </button>
        </div>
        <div className='lecture-add-modal-body'>
          <div className='lecture-add-form-group'>
            <label>강의 제목</label>
            <input
              type='text'
              value={newLectureData.lectureName}
              onChange={e =>
                updateNewLectureData('lectureName', e.target.value)
              }
              placeholder='강의 제목을 입력하세요'
            />
          </div>
          <div className='lecture-add-form-group'>
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
          <div className='lecture-add-form-group'>
            <label>강의 날짜</label>
            <input
              type='date'
              value={newLectureData.lectureDate}
              onChange={e =>
                updateNewLectureData('lectureDate', e.target.value)
              }
            />
          </div>
        </div>
        <div className='lecture-add-modal-actions'>
          <button className='cancel-btn' onClick={handleClose}>
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
