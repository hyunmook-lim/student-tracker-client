import React, { useState } from 'react';

function ClassroomList() {
  const [expandedClass, setExpandedClass] = useState(null);

  // 반 데이터 (실제로는 서버에서 가져올 데이터)
  const classrooms = [
    {
      id: 1,
      name: '1학년 1반',
      description: '수학 기초 과정',
      studentCount: 25,
      students: [
        { id: 1, name: '김철수', studentId: '2024001' },
        { id: 2, name: '이영희', studentId: '2024002' },
        { id: 3, name: '박민수', studentId: '2024003' },
        { id: 4, name: '정수진', studentId: '2024004' },
        { id: 5, name: '최동현', studentId: '2024005' },
      ],
    },
    {
      id: 2,
      name: '1학년 2반',
      description: '영어 기초 과정',
      studentCount: 23,
      students: [
        { id: 6, name: '강지영', studentId: '2024006' },
        { id: 7, name: '윤서준', studentId: '2024007' },
        { id: 8, name: '임하나', studentId: '2024008' },
        { id: 9, name: '송태현', studentId: '2024009' },
      ],
    },
    {
      id: 3,
      name: '2학년 1반',
      description: '수학 심화 과정',
      studentCount: 28,
      students: [
        { id: 10, name: '한소희', studentId: '2023001' },
        { id: 11, name: '김준호', studentId: '2023002' },
        { id: 12, name: '박서연', studentId: '2023003' },
        { id: 13, name: '이현우', studentId: '2023004' },
        { id: 14, name: '정다은', studentId: '2023005' },
        { id: 15, name: '최승민', studentId: '2023006' },
      ],
    },
    {
      id: 4,
      name: '2학년 2반',
      description: '과학 기초 과정',
      studentCount: 26,
      students: [
        { id: 16, name: '김민지', studentId: '2023007' },
        { id: 17, name: '이준영', studentId: '2023008' },
        { id: 18, name: '박지원', studentId: '2023009' },
        { id: 19, name: '정현수', studentId: '2023010' },
      ],
    },
  ];

  const handleClassClick = classId => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleAddClass = () => {
    // 반 추가 로직
    alert('반 추가 기능이 구현될 예정입니다.');
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
            <div
              className='classroom-header-row'
              onClick={() => handleClassClick(classroom.id)}
            >
              <div className='classroom-name'>{classroom.name}</div>
              <div className='classroom-description'>
                {classroom.description}
              </div>
              <div className='classroom-student-count'>
                {classroom.studentCount}명
              </div>
              <div className='classroom-expand-icon'>
                {expandedClass === classroom.id ? '▼' : '▶'}
              </div>
            </div>

            {expandedClass === classroom.id && (
              <div className='students-list'>
                <div className='students-header'>
                  <span>학번</span>
                  <span>이름</span>
                </div>
                {classroom.students.map(student => (
                  <div key={student.id} className='student-item'>
                    <span className='student-id'>{student.studentId}</span>
                    <span className='student-name'>{student.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassroomList;
