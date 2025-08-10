import React from 'react';
import './Modal.css';
import { useUIStore } from '../store';
import StudentForm from './StudentForm';
import GradeForm from './GradeForm';

function Modal() {
  const { isModalOpen, modalType, closeModal } = useUIStore();

  if (!isModalOpen) return null;

  const getModalTitle = () => {
    switch (modalType) {
      case 'addStudent':
        return '학생 추가';
      case 'editStudent':
        return '학생 정보 수정';
      case 'gradeInput':
        return '성적 입력';
      case 'attendanceInput':
        return '출석 입력';
      default:
        return '모달';
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'addStudent':
      case 'editStudent':
        return <StudentForm />;
      case 'gradeInput':
        return <GradeForm />;
      default:
        return <div>내용을 불러올 수 없습니다.</div>;
    }
  };

  return (
    <div className='app-modal-overlay' onClick={closeModal}>
      <div className='app-modal-content' onClick={e => e.stopPropagation()}>
        <div className='app-modal-header'>
          <h2>{getModalTitle()}</h2>
          <button className='app-modal-close' onClick={closeModal}>
            ×
          </button>
        </div>
        <div className='app-modal-body'>{renderModalContent()}</div>
      </div>
    </div>
  );
}

export default Modal;
