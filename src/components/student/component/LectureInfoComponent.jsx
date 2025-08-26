import React, { useState, useEffect } from 'react';
import { useLectureStore } from '../../../store';
import { useAuthStore } from '../../../store';
import { getStudentClassrooms } from '../../../api/classroomStudentApi';
import { getLecturesByClassroom } from '../../../api/lectureApi';
import LectureDetailModal from '../modal/LectureDetailModal';
import ClassroomEnrollmentModal from '../modal/ClassroomEnrollmentModal';
import './LectureInfoComponent.css';

function LectureInfoComponent() {
  const { selectedLecture, setSelectedLecture } = useLectureStore();

  const { currentUser } = useAuthStore();

  const [studentClassrooms, setStudentClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [expandedClassrooms, setExpandedClassrooms] = useState(new Set());
  const [classroomSessions, setClassroomSessions] = useState({});

  // 학생의 수업 목록 가져오기
  useEffect(() => {
    if (currentUser?.uid) {
      fetchStudentClassrooms();
    }
  }, [currentUser]);

  const fetchStudentClassrooms = async () => {
    setLoading(true);
    try {
      const result = await getStudentClassrooms(currentUser.uid);
      if (result.success) {
        setStudentClassrooms(result.data);
      } else {
        console.error('학생 수업 목록 가져오기 실패:', result.error);
        alert('수업 목록을 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('학생 수업 목록 가져오기 오류:', error);
      alert('수업 목록을 가져오는데 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'WAITING':
        return '대기';
      case 'APPROVED':
        return '승인';
      case 'REJECTED':
        return '거절';
      default:
        return '알 수 없음';
    }
  };

  const getStatusClass = status => {
    switch (status) {
      case 'WAITING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-unknown';
    }
  };

  const handleCloseModal = () => {
    setSelectedLecture(null);
  };

  const handleClassroomClick = (classroomUid, status) => {
    // 승인 상태일 때만 클릭 가능
    if (status !== 'APPROVED') return;

    setExpandedClassrooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classroomUid)) {
        newSet.delete(classroomUid);
      } else {
        newSet.add(classroomUid);
        // TODO: 회차 정보 로드
        fetchClassroomSessions(classroomUid);
      }
      return newSet;
    });
  };

  const fetchClassroomSessions = async classroomUid => {
    try {
      const result = await getLecturesByClassroom(classroomUid);
      if (result.success) {
        setClassroomSessions(prev => ({
          ...prev,
          [classroomUid]: result.data,
        }));
      } else {
        console.error('강의 목록 가져오기 실패:', result.error);
      }
    } catch (error) {
      console.error('강의 목록 가져오기 오류:', error);
    }
  };

  const handleOpenEnrollmentModal = () => {
    setIsEnrollmentModalOpen(true);
  };

  const handleCloseEnrollmentModal = () => {
    setIsEnrollmentModalOpen(false);
    // 모달 닫힐 때 목록 새로고침
    if (currentUser?.uid) {
      fetchStudentClassrooms();
    }
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
          {loading ? (
            <div className='loading-message'>수업 목록을 불러오는 중...</div>
          ) : studentClassrooms.length === 0 ? (
            <div className='empty-message'>참여 신청한 수업이 없습니다.</div>
          ) : (
            studentClassrooms.map(item => (
              <div key={item.classroom.uid}>
                <div
                  className={`classroom-row ${item.status === 'APPROVED' ? 'classroom-clickable' : 'classroom-disabled'}`}
                  onClick={() =>
                    handleClassroomClick(item.classroom.uid, item.status)
                  }
                >
                  <div className='classroom-left'>
                    <h3>{item.classroom.name}</h3>
                    <p>{item.classroom.description}</p>
                  </div>
                  <div className='classroom-right'>
                    <span
                      className={`status-badge ${getStatusClass(item.status)}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>

                {item.status === 'APPROVED' &&
                  expandedClassrooms.has(item.classroom.uid) && (
                    <div className='sessions-list'>
                      {classroomSessions[item.classroom.uid]?.length > 0 ? (
                        classroomSessions[item.classroom.uid].map(lecture => (
                          <div
                            key={lecture.uid || lecture.id}
                            className='session-item'
                          >
                            <div className='session-info'>
                              <h4>{lecture.lectureName}</h4>
                              <span className='session-date'>
                                {lecture.lectureDate
                                  ? lecture.lectureDate.split('T')[0]
                                  : ''}
                              </span>
                            </div>
                            <div className='session-status'>
                              <span className='session-status-badge status-completed'>
                                완료
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='empty-sessions-message'>
                          아직 회차가 없습니다.
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ))
          )}
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
