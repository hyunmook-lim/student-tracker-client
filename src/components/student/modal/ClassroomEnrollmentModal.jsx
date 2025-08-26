import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store';
import { getAllClassrooms } from '../../../api/classroomApi';
import { enrollStudentToClassroom } from '../../../api/classroomStudentApi';
import './ClassroomEnrollmentModal.css';

function ClassroomEnrollmentModal({ isOpen, onClose }) {
  const { currentUser } = useAuthStore();
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 수업 목록 가져오기
  useEffect(() => {
    if (isOpen) {
      fetchClassrooms();
    }
  }, [isOpen]);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const result = await getAllClassrooms();
      if (result.success) {
        setClassrooms(result.data);
      } else {
        console.error('수업 목록 가져오기 실패:', result.error);
        alert('수업 목록을 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('수업 목록 가져오기 오류:', error);
      alert('수업 목록을 가져오는데 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedClassroom || !currentUser) return;

    setSubmitting(true);
    try {
      const result = await enrollStudentToClassroom(
        currentUser.uid,
        selectedClassroom
      );
      if (result.success) {
        alert('수업 참여 신청이 완료되었습니다!');
        setSelectedClassroom('');
        onClose();
      } else {
        console.error('수업 참여 신청 실패:', result.error);
        alert('수업 참여 신청에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('수업 참여 신청 오류:', error);
      alert('수업 참여 신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedClassroom('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='classroom-enrollment-modal-overlay' onClick={onClose}>
      <div
        className='classroom-enrollment-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='classroom-enrollment-modal-header'>
          <h3>수업 참여 신청</h3>
          <button
            className='classroom-enrollment-modal-close'
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className='classroom-enrollment-modal-body'>
          {loading ? (
            <div className='loading-message'>수업 목록을 불러오는 중...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='input-group'>
                <label htmlFor='classroom-select'>수업 선택</label>
                <select
                  id='classroom-select'
                  value={selectedClassroom}
                  onChange={e => setSelectedClassroom(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value=''>수업을 선택해주세요</option>
                  {classrooms.map(classroom => (
                    <option key={classroom.uid} value={classroom.uid}>
                      {classroom.name} - {classroom.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className='classroom-enrollment-modal-footer'>
                <button
                  type='button'
                  className='classroom-enrollment-modal-cancel-btn'
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  취소
                </button>
                <button
                  type='submit'
                  className='classroom-enrollment-modal-submit-btn'
                  disabled={!selectedClassroom || submitting}
                >
                  {submitting ? '신청 중...' : '신청하기'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassroomEnrollmentModal;
