import React from 'react';
import './ClassroomAddModal.css';

function ClassroomAddModal({
  isOpen,
  onClose,
  newClassData,
  updateNewClassData,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className='classroom-add-modal-overlay' onClick={onClose}>
      <div
        className='classroom-add-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='classroom-add-modal-header'>
          <h3>새 반 추가</h3>
          <button className='classroom-add-close-btn' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='classroom-add-modal-body'>
          <div className='classroom-add-form-group'>
            <label>반 이름</label>
            <input
              type='text'
              value={newClassData.name}
              onChange={e => updateNewClassData('name', e.target.value)}
              placeholder='예: 1학년 1반'
            />
          </div>
          <div className='classroom-add-form-group'>
            <label>반 설명</label>
            <textarea
              value={newClassData.description}
              onChange={e => updateNewClassData('description', e.target.value)}
              placeholder='반에 대한 설명을 입력하세요'
              rows='3'
            />
          </div>
        </div>
        <div className='classroom-add-modal-actions'>
          <button className='classroom-add-cancel-btn' onClick={onClose}>
            취소
          </button>
          <button className='classroom-add-save-btn' onClick={onSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassroomAddModal;
