import React from 'react';
import './ConfirmModal.css';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className='confirm-modal-overlay' onClick={onClose}>
      <div className='confirm-modal-content' onClick={e => e.stopPropagation()}>
        <div className='confirm-modal-header'>
          <h3>{title || '확인'}</h3>
        </div>
        <div className='confirm-modal-body'>
          <p>{message}</p>
        </div>
        <div className='confirm-modal-actions'>
          <button className='cancel-btn' onClick={onClose}>
            취소
          </button>
          <button className='confirm-btn' onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
