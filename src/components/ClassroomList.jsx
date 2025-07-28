import React, { useState } from 'react';
import './ClassroomList.css';

function ClassroomList() {
  const [expandedClass, setExpandedClass] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassData, setNewClassData] = useState({
    name: '',
    description: '',
  });

  // 반 데이터 (실제로는 서버에서 가져올 데이터)
  const classrooms = [
    {
      id: 1,
      name: '1학년 1반',
      description: '수학 기초 과정',
      studentCount: 25,
      students: [
        { id: 1, name: '김철수', studentId: '2024001', status: 'approved' },
        { id: 2, name: '이영희', studentId: '2024002', status: 'approved' },
        { id: 3, name: '박민수', studentId: '2024003', status: 'pending' },
        { id: 4, name: '정수진', studentId: '2024004', status: 'approved' },
        { id: 5, name: '최동현', studentId: '2024005', status: 'pending' },
      ],
    },
    {
      id: 2,
      name: '1학년 2반',
      description: '영어 기초 과정',
      studentCount: 23,
      students: [
        { id: 6, name: '강지영', studentId: '2024006', status: 'approved' },
        { id: 7, name: '윤서준', studentId: '2024007', status: 'pending' },
        { id: 8, name: '임하나', studentId: '2024008', status: 'approved' },
        { id: 9, name: '송태현', studentId: '2024009', status: 'pending' },
      ],
    },
    {
      id: 3,
      name: '2학년 1반',
      description: '수학 심화 과정',
      studentCount: 28,
      students: [
        { id: 10, name: '한소희', studentId: '2023001', status: 'approved' },
        { id: 11, name: '김준호', studentId: '2023002', status: 'approved' },
        { id: 12, name: '박서연', studentId: '2023003', status: 'pending' },
        { id: 13, name: '이현우', studentId: '2023004', status: 'approved' },
        { id: 14, name: '정다은', studentId: '2023005', status: 'approved' },
        { id: 15, name: '최승민', studentId: '2023006', status: 'pending' },
      ],
    },
    {
      id: 4,
      name: '2학년 2반',
      description: '과학 기초 과정',
      studentCount: 26,
      students: [
        { id: 16, name: '김민지', studentId: '2023007', status: 'approved' },
        { id: 17, name: '이준영', studentId: '2023008', status: 'pending' },
        { id: 18, name: '박지원', studentId: '2023009', status: 'approved' },
        { id: 19, name: '정현수', studentId: '2023010', status: 'pending' },
      ],
    },
  ];

  const handleClassClick = classId => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleAddClass = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewClassData({ name: '', description: '' });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewClassData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitClass = () => {
    if (!newClassData.name.trim() || !newClassData.description.trim()) {
      alert('반 이름과 설명을 모두 입력해주세요.');
      return;
    }

    // 실제로는 서버에 반 추가 요청을 보낼 것입니다
    alert('반 추가 기능이 구현될 예정입니다.');
    handleCloseModal();
  };

  const handleDeleteClass = () => {
    if (window.confirm('정말로 이 반을 삭제하시겠습니까?')) {
      // 반 삭제 로직
      alert('반 삭제 기능이 구현될 예정입니다.');
    }
  };

  const handleStudentAction = (studentId, action) => {
    if (action === 'delete') {
      if (window.confirm('정말로 이 학생을 삭제하시겠습니까?')) {
        // 학생 삭제 로직
        alert('학생 삭제 기능이 구현될 예정입니다.');
      }
    } else if (action === 'approve') {
      // 학생 승인 로직
      alert('학생 승인 기능이 구현될 예정입니다.');
    }
  };

  return (
    <div className='classroom-list'>
      <div className='classroom-header'>
        <h3>반 관리</h3>
        <button className='add-class-btn' onClick={handleAddClass}>
          반 추가
        </button>
      </div>

      <div className='classroom-container'>
        {classrooms.map(classroom => (
          <div key={classroom.id} className='classroom-item'>
            <div className='classroom-header-row'>
              <div
                className='classroom-info'
                onClick={() => handleClassClick(classroom.id)}
              >
                <div className='classroom-name'>{classroom.name}</div>
                <div className='classroom-description'>
                  {classroom.description}
                </div>
                <div className='classroom-student-count'>
                  {classroom.studentCount}명
                </div>
              </div>
              <button
                className='delete-class-btn'
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteClass(classroom.id);
                }}
                title='반 삭제'
              >
                삭제
              </button>
            </div>

            {expandedClass === classroom.id && (
              <div className='students-list'>
                <div className='students-header'>
                  <span>학번</span>
                  <span>이름</span>
                  <span>작업</span>
                </div>
                {classroom.students.map(student => (
                  <div key={student.id} className='student-item'>
                    <span className='student-id'>{student.studentId}</span>
                    <span className='student-name'>{student.name}</span>
                    <div className='student-action'>
                      {student.status === 'approved' ? (
                        <button
                          className='student-completed-btn'
                          onClick={() =>
                            handleStudentAction(student.id, 'delete')
                          }
                          title='학생 삭제'
                        >
                          <span>완료</span>
                        </button>
                      ) : (
                        <button
                          className='student-approve-btn'
                          onClick={() =>
                            handleStudentAction(student.id, 'approve')
                          }
                        >
                          수락
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 반 추가 모달 */}
      {showAddModal && (
        <div className='modal-overlay' onClick={handleCloseModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>반 추가</h3>
              <button className='modal-close-btn' onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='input-group'>
                <label htmlFor='className'>반 이름</label>
                <input
                  type='text'
                  id='className'
                  name='name'
                  value={newClassData.name}
                  onChange={handleInputChange}
                  placeholder='예: 1학년 1반'
                />
              </div>
              <div className='input-group'>
                <label htmlFor='classDescription'>반 설명</label>
                <textarea
                  id='classDescription'
                  name='description'
                  value={newClassData.description}
                  onChange={handleInputChange}
                  placeholder='반에 대한 설명을 입력하세요'
                  rows='3'
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button className='modal-cancel-btn' onClick={handleCloseModal}>
                취소
              </button>
              <button className='modal-submit-btn' onClick={handleSubmitClass}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassroomList;
