import React, { useEffect, useState } from 'react';
import { useClassroomStore } from '../store';
import { useAuthStore } from '../store';
import {
  createClassroom,
  getTeacherClassrooms,
  updateClassroom,
  deleteClassroom,
} from '../api/classroomApi';
import './ClassroomList.css';

function ClassroomList() {
  const {
    expandedClass,
    setExpandedClass,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    newClassData,
    updateNewClassData,
  } = useClassroomStore();

  const { currentUser } = useAuthStore();
  const [apiClassrooms, setApiClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

  // 컴포넌트 마운트 시 교사의 반 목록 가져오기
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (!currentUser || currentUser.type !== 'teacher') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getTeacherClassrooms(currentUser.uid);

        if (result.success) {
          console.log('반 목록 가져오기 성공:', result.data);
          setApiClassrooms(result.data);
        } else {
          console.error('반 목록 가져오기 실패:', result.error);
          setError(result.error);
        }
      } catch (error) {
        console.error('반 목록 가져오기 오류:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [currentUser]);

  // 반 추가 후 목록 새로고침
  const refreshClassrooms = async () => {
    if (!currentUser || currentUser.type !== 'teacher') return;

    try {
      const result = await getTeacherClassrooms(currentUser.uid);
      if (result.success) {
        setApiClassrooms(result.data);
      }
    } catch (error) {
      console.error('반 목록 새로고침 오류:', error);
    }
  };

  const handleClassClick = classId => {
    console.log('=== 반 클릭 이벤트 ===');
    console.log('클릭된 반 ID:', classId, '타입:', typeof classId);
    console.log(
      '현재 확장된 반 ID:',
      expandedClass,
      '타입:',
      typeof expandedClass
    );
    console.log('ID가 같은가?', expandedClass === classId);
    setExpandedClass(classId);
  };

  // 수정 모드 시작
  const handleEditClick = (classroom, e) => {
    e.stopPropagation();
    setEditingClassroom(classroom.uid);
    setEditData({
      name: classroom.classroomName,
      description: classroom.description,
    });
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingClassroom(null);
    setEditData({ name: '', description: '' });
  };

  // 수정 저장
  const handleEditSave = async classroomId => {
    if (!editData.name.trim()) {
      alert('반 이름을 입력해주세요.');
      return;
    }

    if (!editData.description.trim()) {
      alert('반 설명을 입력해주세요.');
      return;
    }

    try {
      const updateData = {
        classroomName: editData.name,
        description: editData.description,
      };

      console.log('반 수정 요청:', updateData);

      const result = await updateClassroom(classroomId, updateData);

      if (result.success) {
        alert('반이 성공적으로 수정되었습니다!');
        console.log('반 수정 성공:', result.data);

        // 반 목록 새로고침
        await refreshClassrooms();

        // 수정 모드 종료
        setEditingClassroom(null);
        setEditData({ name: '', description: '' });
      } else {
        alert(`반 수정 실패: ${result.error}`);
        console.error('반 수정 실패 상세:', result);
      }
    } catch (error) {
      console.error('반 수정 오류:', error);
      alert('반 수정 중 오류가 발생했습니다.');
    }
  };

  // 삭제 처리
  const handleDeleteClick = async (classroomId, classroomName, e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      `"${classroomName}" 반을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );

    if (!confirmDelete) return;

    try {
      console.log('반 삭제 요청:', classroomId);

      const result = await deleteClassroom(classroomId);

      if (result.success) {
        alert('반이 성공적으로 삭제되었습니다!');
        console.log('반 삭제 성공');

        // 반 목록 새로고침
        await refreshClassrooms();
      } else {
        alert(`반 삭제 실패: ${result.error}`);
        console.error('반 삭제 실패 상세:', result);
      }
    } catch (error) {
      console.error('반 삭제 오류:', error);
      alert('반 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleAddClass = async () => {
    // 필수 필드 검증
    if (!newClassData.name.trim()) {
      alert('반 이름을 입력해주세요.');
      return;
    }

    if (!newClassData.description.trim()) {
      alert('반 설명을 입력해주세요.');
      return;
    }

    // 현재 로그인된 교사 정보 확인
    if (!currentUser || currentUser.type !== 'teacher') {
      alert('교사 로그인이 필요합니다.');
      return;
    }

    try {
      const classroomData = {
        teacherId: currentUser.uid,
        classroomName: newClassData.name,
        description: newClassData.description,
      };

      console.log('반 추가 요청:', classroomData);

      const result = await createClassroom(classroomData);

      if (result.success) {
        alert('반이 성공적으로 추가되었습니다!');
        console.log('반 추가 성공:', result.data);

        // 반 목록 새로고침
        await refreshClassrooms();

        // 모달 닫기
        closeAddModal();
      } else {
        alert(`반 추가 실패: ${result.error}`);
        console.error('반 추가 실패 상세:', result);
      }
    } catch (error) {
      console.error('반 추가 오류:', error);
      alert('반 추가 중 오류가 발생했습니다.');
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className='classroom-list-container'>
        <div className='classroom-list-header'>
          <h2>반 관리</h2>
        </div>
        <div className='loading-message'>반 목록을 불러오는 중...</div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className='classroom-list-container'>
        <div className='classroom-list-header'>
          <h2>반 관리</h2>
        </div>
        <div className='error-message'>
          반 목록을 불러오는데 실패했습니다: {error}
        </div>
      </div>
    );
  }

  return (
    <div className='classroom-list-container'>
      <div className='classroom-list-header'>
        <h2>반 관리</h2>
        <button className='add-classroom-btn' onClick={openAddModal}>
          + 새 반 추가
        </button>
      </div>

      <div className='classroom-grid'>
        {apiClassrooms.map(classroom => (
          <div key={classroom.uid} className='classroom-item'>
            <div
              className='classroom-header'
              onClick={() => handleClassClick(classroom.uid)}
            >
              <div className='classroom-info'>
                {editingClassroom === classroom.uid ? (
                  <div className='edit-form'>
                    <input
                      type='text'
                      value={editData.name}
                      onChange={e =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className='edit-input'
                      onClick={e => e.stopPropagation()}
                    />
                    <textarea
                      value={editData.description}
                      onChange={e =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className='edit-textarea'
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <>
                    <h3>{classroom.classroomName}</h3>
                    <p>{classroom.description}</p>
                    <span className='student-count'>
                      학생 수:{' '}
                      {classroom.studentIds ? classroom.studentIds.length : 0}명
                    </span>
                  </>
                )}
              </div>
              <div className='classroom-actions'>
                {editingClassroom === classroom.uid ? (
                  <div className='edit-actions'>
                    <button
                      className='save-btn'
                      onClick={() => handleEditSave(classroom.uid)}
                    >
                      저장
                    </button>
                    <button className='cancel-btn' onClick={handleEditCancel}>
                      취소
                    </button>
                  </div>
                ) : (
                  <div className='action-buttons'>
                    <button
                      className='edit-btn'
                      onClick={e => handleEditClick(classroom, e)}
                    >
                      수정
                    </button>
                    <button
                      className='delete-btn'
                      onClick={e =>
                        handleDeleteClick(
                          classroom.uid,
                          classroom.classroomName,
                          e
                        )
                      }
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            {expandedClass === classroom.uid && (
              <div className='students-section'>
                <div className='students-header'>
                  <h4>학생 목록</h4>
                </div>
                <div className='students-list'>
                  {classroom.studentIds && classroom.studentIds.length > 0 ? (
                    classroom.studentIds.map((studentId, index) => (
                      <div key={index} className='student-item'>
                        <div className='student-info'>
                          <span className='student-name'>학생 {studentId}</span>
                          <span className='student-id'>ID: {studentId}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='no-students'>
                      <p>등록된 학생이 없습니다.</p>
                    </div>
                  )}
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
