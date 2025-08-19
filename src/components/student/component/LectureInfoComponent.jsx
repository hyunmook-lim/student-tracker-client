import React, { useState } from 'react';
import { useLectureStore, useClassroomStore } from '../../../store';
import LectureDetailModal from '../modal/LectureDetailModal';
import ClassroomEnrollmentModal from '../modal/ClassroomEnrollmentModal';
import './LectureInfoComponent.css';

function LectureInfoComponent() {
  const {
    expandedClasses,
    toggleClassExpansion,
    selectedLecture,
    setSelectedLecture,
    getLecturesByClassroom,
  } = useLectureStore();

  const { classrooms } = useClassroomStore();

  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  const handleLectureClick = lecture => {
    setSelectedLecture(lecture);
  };

  const handleCloseModal = () => {
    setSelectedLecture(null);
  };

  const handleOpenEnrollmentModal = () => {
    setIsEnrollmentModalOpen(true);
  };

  const handleCloseEnrollmentModal = () => {
    setIsEnrollmentModalOpen(false);
  };

  return (
    <>
      <div className='lecture-info-container'>
        <div className='lecture-info-header'>
          <h2>수업 정보</h2>
          <button
            className='add-classroom-btn'
            onClick={handleOpenEnrollmentModal}
          >
            수업 추가
          </button>
        </div>

        <div className='classrooms-list'>
          {classrooms.map(classroom => (
            <div key={classroom.id} className='classroom-section'>
              <div
                className='classroom-header'
                onClick={() => toggleClassExpansion(classroom.id)}
              >
                <div className='classroom-info'>
                  <h3>{classroom.name}</h3>
                  <p>{classroom.description}</p>
                  <span>학생 수: {classroom.studentCount}명</span>
                </div>
                <div className='expand-icon'>
                  {expandedClasses.has(classroom.id) ? '▼' : '▶'}
                </div>
              </div>

              {expandedClasses.has(classroom.id) && (
                <div className='lectures-grid'>
                  {getLecturesByClassroom(classroom.id).map(lecture => (
                    <div
                      key={lecture.id}
                      className='lecture-card'
                      onClick={() => handleLectureClick(lecture)}
                    >
                      <div className='lecture-header'>
                        <h4>{lecture.title}</h4>
                        <span className='lecture-date'>{lecture.date}</span>
                      </div>
                      <div className='lecture-content'>
                        <p>{lecture.description}</p>
                      </div>
                      <div className='lecture-actions'>
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

      {/* 강의 상세 모달 */}
      <LectureDetailModal
        lecture={selectedLecture}
        isOpen={!!selectedLecture}
        onClose={handleCloseModal}
      />

      {/* 수업 참여 신청 모달 */}
      <ClassroomEnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={handleCloseEnrollmentModal}
      />
    </>
  );
}

export default LectureInfoComponent;
