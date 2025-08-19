import React, { useState } from 'react';
import GradeDetailModal from '../modal/GradeDetailModal';
import './GradeReportComponent.css';

// 가상의 수업 데이터 (실제로는 store에서 가져올 예정)
const mockClasses = [
  {
    id: 1,
    name: '웹 개발 기초',
    description: 'HTML, CSS, JavaScript 기초부터 심화까지',
    studentCount: 25,
    grades: [
      {
        id: 1,
        title: '1-2회차 성적표',
        startLecture: 1,
        endLecture: 2,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 88.5,
        rank: 5,
        subject: 'HTML/CSS 기초',
        lectures: [
          { lecture: 1, score: 85, attended: true, date: '2024-01-15' },
          { lecture: 2, score: 92, attended: true, date: '2024-01-22' },
        ],
      },
      {
        id: 2,
        title: '3-4회차 성적표',
        startLecture: 3,
        endLecture: 4,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 83.0,
        rank: 8,
        subject: 'JavaScript 기초',
        lectures: [
          { lecture: 3, score: 78, attended: true, date: '2024-01-29' },
          { lecture: 4, score: 88, attended: true, date: '2024-02-05' },
        ],
      },
      {
        id: 3,
        title: '5-6회차 성적표',
        startLecture: 5,
        endLecture: 6,
        totalLectures: 8,
        attendedLectures: 1,
        averageScore: 90.0,
        rank: 3,
        subject: 'DOM 조작',
        lectures: [
          { lecture: 5, score: 95, attended: true, date: '2024-02-12' },
          { lecture: 6, score: 85, attended: false, date: '2024-02-19' },
        ],
      },
      {
        id: 4,
        title: '7-8회차 성적표',
        startLecture: 7,
        endLecture: 8,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 91.5,
        rank: 2,
        subject: '프로젝트 실습',
        lectures: [
          { lecture: 7, score: 87, attended: true, date: '2024-02-26' },
          { lecture: 8, score: 96, attended: true, date: '2024-03-05' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'React 심화',
    description: 'React Hooks, 상태 관리, 최적화 기법',
    studentCount: 20,
    grades: [
      {
        id: 1,
        title: '1-2회차 성적표',
        startLecture: 1,
        endLecture: 2,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 85.5,
        rank: 4,
        subject: 'React 기초',
        lectures: [
          { lecture: 1, score: 82, attended: true, date: '2024-02-26' },
          { lecture: 2, score: 89, attended: true, date: '2024-03-05' },
        ],
      },
      {
        id: 2,
        title: '3-4회차 성적표',
        startLecture: 3,
        endLecture: 4,
        totalLectures: 8,
        attendedLectures: 1,
        averageScore: 83.5,
        rank: 6,
        subject: 'Hooks & Context',
        lectures: [
          { lecture: 3, score: 76, attended: true, date: '2024-03-12' },
          { lecture: 4, score: 91, attended: false, date: '2024-03-19' },
        ],
      },
      {
        id: 3,
        title: '5-6회차 성적표',
        startLecture: 5,
        endLecture: 6,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 89.5,
        rank: 3,
        subject: '성능 최적화',
        lectures: [
          { lecture: 5, score: 88, attended: true, date: '2024-03-26' },
          { lecture: 6, score: 91, attended: true, date: '2024-04-02' },
        ],
      },
      {
        id: 4,
        title: '7-8회차 성적표',
        startLecture: 7,
        endLecture: 8,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 87.0,
        rank: 5,
        subject: '프로젝트 실습',
        lectures: [
          { lecture: 7, score: 84, attended: true, date: '2024-04-09' },
          { lecture: 8, score: 90, attended: true, date: '2024-04-16' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '데이터베이스 설계',
    description: 'SQL, 데이터 모델링, 성능 최적화',
    studentCount: 18,
    grades: [
      {
        id: 1,
        title: '1-2회차 성적표',
        startLecture: 1,
        endLecture: 2,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 88.5,
        rank: 3,
        subject: '데이터베이스 기초',
        lectures: [
          { lecture: 1, score: 85, attended: true, date: '2024-03-26' },
          { lecture: 2, score: 92, attended: true, date: '2024-04-02' },
        ],
      },
      {
        id: 2,
        title: '3-4회차 성적표',
        startLecture: 3,
        endLecture: 4,
        totalLectures: 8,
        attendedLectures: 1,
        averageScore: 86.0,
        rank: 4,
        subject: 'SQL 고급',
        lectures: [
          { lecture: 3, score: 89, attended: true, date: '2024-04-09' },
          { lecture: 4, score: 83, attended: false, date: '2024-04-16' },
        ],
      },
      {
        id: 3,
        title: '5-6회차 성적표',
        startLecture: 5,
        endLecture: 6,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 91.0,
        rank: 2,
        subject: '데이터 모델링',
        lectures: [
          { lecture: 5, score: 88, attended: true, date: '2024-04-23' },
          { lecture: 6, score: 94, attended: true, date: '2024-04-30' },
        ],
      },
      {
        id: 4,
        title: '7-8회차 성적표',
        startLecture: 7,
        endLecture: 8,
        totalLectures: 8,
        attendedLectures: 2,
        averageScore: 89.5,
        rank: 3,
        subject: '성능 최적화',
        lectures: [
          { lecture: 7, score: 87, attended: true, date: '2024-05-07' },
          { lecture: 8, score: 92, attended: true, date: '2024-05-14' },
        ],
      },
    ],
  },
];

function GradeReport() {
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleClassExpansion = classId => {
    const newExpandedClasses = new Set(expandedClasses);
    if (newExpandedClasses.has(classId)) {
      newExpandedClasses.delete(classId);
    } else {
      newExpandedClasses.add(classId);
    }
    setExpandedClasses(newExpandedClasses);
  };

  const handleGradeClick = grade => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGrade(null);
  };

  const getAttendanceRate = (attendedLectures, totalLectures) => {
    return Math.round((attendedLectures / totalLectures) * 100);
  };

  return (
    <>
      <div className='grade-report-container'>
        <div className='grade-report-header'>
          <h2>성적 확인</h2>
        </div>

        <div className='classes-list'>
          {mockClasses.map(classItem => (
            <div key={classItem.id} className='class-section'>
              <div
                className='class-header'
                onClick={() => toggleClassExpansion(classItem.id)}
              >
                <div className='class-info'>
                  <h3>{classItem.name}</h3>
                  <p>{classItem.description}</p>
                  <span>학생 수: {classItem.studentCount}명</span>
                </div>
                <div className='expand-icon'>
                  {expandedClasses.has(classItem.id) ? '▼' : '▶'}
                </div>
              </div>

              {expandedClasses.has(classItem.id) && (
                <div className='grade-cards-grid'>
                  {classItem.grades.map(grade => (
                    <div
                      key={grade.id}
                      className='grade-card'
                      onClick={() => handleGradeClick(grade)}
                    >
                      <div className='grade-header'>
                        <h4>{grade.title}</h4>
                        <span className='grade-subject'>{grade.subject}</span>
                      </div>
                      <div className='grade-content'>
                        <div className='grade-summary'>
                          <div className='summary-item'>
                            <span className='summary-label'>회차:</span>
                            <span className='summary-value'>
                              {grade.startLecture}-{grade.endLecture}회차
                            </span>
                          </div>
                          <div className='summary-item'>
                            <span className='summary-label'>출석률:</span>
                            <span className='summary-value'>
                              {grade.attendedLectures}/{grade.totalLectures}회 (
                              {getAttendanceRate(
                                grade.attendedLectures,
                                grade.totalLectures
                              )}
                              %)
                            </span>
                          </div>
                          <div className='summary-item'>
                            <span className='summary-label'>평균 점수:</span>
                            <span className='summary-value'>
                              {grade.averageScore}점
                            </span>
                          </div>
                          <div className='summary-item'>
                            <span className='summary-label'>등수:</span>
                            <span className='summary-value'>
                              {grade.rank}등
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='grade-actions'>
                        <button className='view-detail-btn'>자세히 보기</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 성적 상세 모달 */}
      <GradeDetailModal
        grade={selectedGrade}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default GradeReport;
