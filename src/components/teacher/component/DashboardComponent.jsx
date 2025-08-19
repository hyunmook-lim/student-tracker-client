import React from 'react';
import { useStudentsStore } from '../../../store';
import './DashboardComponent.css';

function DashboardComponent() {
  const { students } = useStudentsStore();

  // 통계 계산
  const totalStudents = students.length;
  const todayAttendance = students.filter(student =>
    student.attendanceRecord.some(
      record => record.date === '2024-01-19' && record.status === 'present'
    )
  ).length;

  const averageGrade =
    students.length > 0
      ? (
          students.reduce((sum, student) => {
            const grades = Object.values(student.grades);
            return (
              sum + grades.reduce((s, grade) => s + grade, 0) / grades.length
            );
          }, 0) / students.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className='dashboard-section'>
      <h3 className='dashboard-title'>대시보드</h3>
      <div className='dashboard-grid'>
        <div className='dashboard-card'>
          <h4>전체 학생</h4>
          <p className='card-number'>{totalStudents}명</p>
        </div>
        <div className='dashboard-card'>
          <h4>오늘 출석</h4>
          <p className='card-number'>{todayAttendance}명</p>
        </div>
        <div className='dashboard-card'>
          <h4>평균 성적</h4>
          <p className='card-number'>{averageGrade}점</p>
        </div>
        <div className='dashboard-card'>
          <h4>미제출 과제</h4>
          <p className='card-number'>3건</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent;
