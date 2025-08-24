import React, { useState } from 'react';
import { useClassroomStore } from '../../../store';
import ResultDetailModal from '../modal/ResultDetailModal';
import ResultInputModal from '../modal/ResultInputModal';
import './ResultListComponent.css';

function ResultListComponent() {
  const { classrooms, expandedClass, setExpandedClass, updateStudentResults } =
    useClassroomStore();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  const handleClassClick = classId => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  // 임시 회차 데이터 (실제로는 서버에서 가져올 데이터)
  const getLecturesForClass = () => {
    // classId를 사용하여 해당 반의 회차 데이터를 가져옴
    const lectures = [
      {
        id: 1,
        title: '1회차 - 수학 기초',
        date: '2024-01-15',
        isCompleted: true,
        hasResults: true,
      },
      {
        id: 2,
        title: '2회차 - 방정식',
        date: '2024-01-22',
        isCompleted: true,
        hasResults: true,
      },
      {
        id: 3,
        title: '3회차 - 함수',
        date: '2024-01-29',
        isCompleted: true,
        hasResults: false,
      },
      {
        id: 4,
        title: '4회차 - 통계',
        date: '2024-02-05',
        isCompleted: false,
        hasResults: false,
      },
      {
        id: 5,
        title: '5회차 - 기하',
        date: '2024-02-12',
        isCompleted: false,
        hasResults: false,
      },
    ];
    return lectures;
  };

  // 임시 결과 데이터 (실제로는 서버에서 가져올 데이터)
  const getResultsForLecture = lectureId => {
    const results = {
      1: [
        { id: 1, name: '김철수', score: 85, rank: 3, total: 100 },
        { id: 2, name: '이영희', score: 92, rank: 1, total: 100 },
        { id: 3, name: '박민수', score: 78, rank: 5, total: 100 },
        { id: 4, name: '정수진', score: 88, rank: 2, total: 100 },
        { id: 5, name: '최동현', score: 81, rank: 4, total: 100 },
      ],
      2: [
        { id: 1, name: '김철수', score: 90, rank: 2, total: 100 },
        { id: 2, name: '이영희', score: 95, rank: 1, total: 100 },
        { id: 3, name: '박민수', score: 82, rank: 4, total: 100 },
        { id: 4, name: '정수진', score: 85, rank: 3, total: 100 },
        { id: 5, name: '최동현', score: 79, rank: 5, total: 100 },
      ],
    };
    return results[lectureId] || [];
  };

  const handleInputResults = lecture => {
    setSelectedLecture(lecture);
    setIsInputModalOpen(true);
  };

  const handleViewResults = lecture => {
    setSelectedLecture(lecture);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLecture(null);
  };

  const handleCloseInputModal = () => {
    setIsInputModalOpen(false);
    setSelectedLecture(null);
  };

  const handleSaveResults = results => {
    updateStudentResults(expandedClass, results);
    setIsInputModalOpen(false);
    setSelectedLecture(null);
  };

  const getGradeColor = score => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  };

  return (
    <div className='result-list-container'>
      <div className='result-list-header'>
        <h2>성적 결과</h2>
      </div>

      <div className='classroom-results'>
        {classrooms.map(classroom => (
          <div key={classroom.id} className='classroom-result-item'>
            <div
              className='classroom-header'
              onClick={() => handleClassClick(classroom.id)}
            >
              <div className='classroom-info'>
                <h3>{classroom.name}</h3>
                <p>{classroom.description}</p>
                <span>학생 수: {classroom.studentCount}명</span>
              </div>
              <div className='expand-icon'>
                {expandedClass === classroom.id ? '▼' : '▶'}
              </div>
            </div>

            {expandedClass === classroom.id && (
              <div className='lectures-section'>
                <div className='lectures-header'>
                  <h4>회차별 성적 관리</h4>
                </div>
                <div className='lectures-list'>
                  {getLecturesForClass().map(lecture => (
                    <div key={lecture.id} className='lecture-item'>
                      <div className='lecture-info'>
                        <div className='lecture-title'>
                          <h5>{lecture.title}</h5>
                          <span className='lecture-date'>{lecture.date}</span>
                        </div>
                        <div className='lecture-status'>
                          {lecture.isCompleted ? (
                            <span className='status completed'>완료</span>
                          ) : (
                            <span className='status pending'>진행중</span>
                          )}
                        </div>
                      </div>
                      <div className='lecture-actions'>
                        {lecture.isCompleted && lecture.hasResults ? (
                          <button
                            className='btn btn-view'
                            onClick={() => handleViewResults(lecture)}
                          >
                            결과 보기
                          </button>
                        ) : lecture.isCompleted && !lecture.hasResults ? (
                          <button
                            className='btn btn-input'
                            onClick={() => handleInputResults(lecture)}
                          >
                            결과 입력
                          </button>
                        ) : (
                          <button className='btn btn-disabled' disabled>
                            대기중
                          </button>
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

      <ResultDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedLecture={selectedLecture}
        getResultsForLecture={getResultsForLecture}
        getGradeColor={getGradeColor}
        classrooms={classrooms}
        expandedClass={expandedClass}
      />

      <ResultInputModal
        isOpen={isInputModalOpen}
        onClose={handleCloseInputModal}
        selectedLecture={selectedLecture}
        classrooms={classrooms}
        expandedClass={expandedClass}
        onSave={handleSaveResults}
      />
    </div>
  );
}

export default ResultListComponent;
