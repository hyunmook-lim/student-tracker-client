import React from 'react';
import { useClassroomStore } from '../store';
import './ClassroomList.css';

function ClassroomList() {
  const {
    classrooms,
    expandedClass,
    setExpandedClass,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    newClassData,
    updateNewClassData,
    addClass,
    updateStudentStatus,
  } = useClassroomStore();

  const handleClassClick = classId => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleAddClass = () => {
    addClass();
  };

  const handleApproveStudent = (classroomId, studentId) => {
    updateStudentStatus(classroomId, studentId, 'approved');
  };

  const handleRejectStudent = (classroomId, studentId) => {
    updateStudentStatus(classroomId, studentId, 'rejected');
  };

  return (
    <div className='classroom-list-container'>
      <div className='classroom-list-header'>
        <h2>반 관리</h2>
        <button className='add-classroom-btn' onClick={openAddModal}>
          + 새 반 추가
        </button>
      </div>

      <div className='classroom-grid'>
        {classrooms.map(classroom => (
          <div key={classroom.id} className='classroom-item'>
            <div
              className='classroom-header'
              onClick={() => handleClassClick(classroom.id)}
            >
              <div className='classroom-info'>
                <h3>{classroom.name}</h3>
                <p>{classroom.description}</p>
                <span className='student-count'>
                  학생 수: {classroom.studentCount}명
                </span>
              </div>
              <div className='expand-icon'>
                {expandedClass === classroom.id ? '▼' : '▶'}
              </div>
            </div>

            {expandedClass === classroom.id && (
              <div className='students-section'>
                <div className='students-header'>
                  <h4>학생 목록</h4>
                </div>
                <div className='students-list'>
                  {classroom.students.map(student => (
                    <div key={student.id} className='student-item'>
                      <div className='student-info'>
                        <span className='student-name'>{student.name}</span>
                        <span className='student-id'>{student.studentId}</span>
                      </div>
                      <div className='student-status'>
                        <span className={`status-badge ${student.status}`}>
                          {student.status === 'approved'
                            ? '승인됨'
                            : student.status === 'pending'
                              ? '대기중'
                              : '거부됨'}
                        </span>
                        {student.status === 'pending' && (
                          <div className='action-buttons'>
                            <button
                              className='approve-btn'
                              onClick={() =>
                                handleApproveStudent(classroom.id, student.id)
                              }
                            >
                              승인
                            </button>
                            <button
                              className='reject-btn'
                              onClick={() =>
                                handleRejectStudent(classroom.id, student.id)
                              }
                            >
                              거부
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 반 추가 모달 */}
      {isAddModalOpen && (
        <div className='modal-overlay' onClick={closeAddModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>새 반 추가</h3>
              <button className='close-btn' onClick={closeAddModal}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-group'>
                <label>반 이름</label>
                <input
                  type='text'
                  value={newClassData.name}
                  onChange={e => updateNewClassData('name', e.target.value)}
                  placeholder='예: 1학년 1반'
                />
              </div>
              <div className='form-group'>
                <label>반 설명</label>
                <textarea
                  value={newClassData.description}
                  onChange={e =>
                    updateNewClassData('description', e.target.value)
                  }
                  placeholder='반에 대한 설명을 입력하세요'
                  rows='3'
                />
              </div>
            </div>
            <div className='modal-actions'>
              <button className='cancel-btn' onClick={closeAddModal}>
                취소
              </button>
              <button className='save-btn' onClick={handleAddClass}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassroomList;
