import React from 'react';
import { useStudentsStore, useUIStore } from '../../../store';
import './StudentListComponent.css';

function StudentListComponent() {
  const { students, deleteStudent } = useStudentsStore();
  const { setSelectedStudent, openModal } = useUIStore();

  const handleEditStudent = student => {
    setSelectedStudent(student);
    openModal('editStudent');
  };

  const handleDeleteStudent = id => {
    if (window.confirm('정말로 이 학생을 삭제하시겠습니까?')) {
      deleteStudent(id);
    }
  };

  const handleViewGrades = student => {
    setSelectedStudent(student);
    openModal('gradeInput');
  };

  return (
    <div className='student-list'>
      <div className='student-list-header'>
        <h2>학생 목록</h2>
        <button
          className='add-student-btn'
          onClick={() => openModal('addStudent')}
        >
          학생 추가
        </button>
      </div>

      <div className='student-table'>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>학년</th>
              <th>반</th>
              <th>학번</th>
              <th>출석률</th>
              <th>평균 성적</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const averageGrade =
                Object.values(student.grades).reduce(
                  (sum, grade) => sum + grade,
                  0
                ) / Object.keys(student.grades).length;

              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.grade}학년</td>
                  <td>{student.class}반</td>
                  <td>{student.studentNumber}</td>
                  <td>{student.attendance}%</td>
                  <td>{averageGrade.toFixed(1)}점</td>
                  <td>
                    <div className='action-buttons'>
                      <button
                        className='edit-btn'
                        onClick={() => handleEditStudent(student)}
                      >
                        수정
                      </button>
                      <button
                        className='grades-btn'
                        onClick={() => handleViewGrades(student)}
                      >
                        성적
                      </button>
                      <button
                        className='delete-btn'
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentListComponent;
