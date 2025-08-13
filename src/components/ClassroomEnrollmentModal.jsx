import React, { useState } from 'react';
import { useClassroomStore } from '../store';
import './ClassroomEnrollmentModal.css';

function ClassroomEnrollmentModal({ isOpen, onClose }) {
  const { classrooms } = useClassroomStore();
  const [selectedClassroom, setSelectedClassroom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedClassroom) {
      // 여기에 수업 참여 신청 로직을 추가할 수 있습니다
      console.log('수업 참여 신청:', selectedClassroom);
      alert('수업 참여 신청이 완료되었습니다!');
      setSelectedClassroom('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedClassroom('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="classroom-enrollment-modal-overlay" onClick={onClose}>
      <div className="classroom-enrollment-modal-content" onClick={e => e.stopPropagation()}>
        <div className="classroom-enrollment-modal-header">
          <h3>수업 참여 신청</h3>
          <button className="classroom-enrollment-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="classroom-enrollment-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="classroom-select">수업 선택</label>
              <select
                id="classroom-select"
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                required
              >
                <option value="">수업을 선택해주세요</option>
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} - {classroom.description}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="classroom-enrollment-modal-footer">
              <button 
                type="button" 
                className="classroom-enrollment-modal-cancel-btn"
                onClick={handleCancel}
              >
                취소
              </button>
              <button 
                type="submit" 
                className="classroom-enrollment-modal-submit-btn"
                disabled={!selectedClassroom}
              >
                신청하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClassroomEnrollmentModal;
