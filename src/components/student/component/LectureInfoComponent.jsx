import React, { useState, useEffect } from 'react';
import { useLectureStore } from '../../../store';
import { useAuthStore } from '../../../store';
import { getStudentClassrooms } from '../../../api/classroomStudentApi';
import { getLecturesByClassroom } from '../../../api/lectureApi';
import { getStudentLectureResultByStudentAndLecture } from '../../../api/studentLectureResultApi';
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
  const [sessionResults, setSessionResults] = useState({});

  // 학생의 수업 목록 가져오기
  useEffect(() => {
    console.log('currentUser 전체:', currentUser);
    console.log('currentUser.uid:', currentUser?.uid);
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
      console.log('회차 목록 가져오기 시작 - classroomUid:', classroomUid);
      const result = await getLecturesByClassroom(classroomUid);
      console.log('회차 목록 API 응답:', result);

      if (result.success) {
        setClassroomSessions(prev => ({
          ...prev,
          [classroomUid]: result.data,
        }));

        console.log('회차 목록 설정 완료:', result.data);

        // 각 강의의 결과 존재 여부 확인 (비동기적으로 처리)
        const sessions = result.data;

        // 우선 모든 회차를 예정으로 표시
        const initialResultMap = {};
        sessions.forEach(lecture => {
          initialResultMap[lecture.uid] = {
            hasResult: false,
            isAttended: null,
            status: 'scheduled',
          };
        });

        setSessionResults(prev => ({
          ...prev,
          [classroomUid]: initialResultMap,
        }));

        // 백그라운드에서 결과 존재 여부 확인
        sessions.forEach(async lecture => {
          try {
            const resultData = await getStudentLectureResultByStudentAndLecture(
              currentUser.uid,
              lecture.uid
            );

            if (resultData.success) {
              // 출석 여부 확인 - 결석인 경우는 클릭 불가
              const isAttended = resultData.data.isAttended;
              setSessionResults(prev => ({
                ...prev,
                [classroomUid]: {
                  ...prev[classroomUid],
                  [lecture.uid]: {
                    hasResult: true,
                    isAttended: isAttended,
                    status: isAttended ? 'completed' : 'absent',
                  },
                },
              }));
            }
          } catch (error) {
            console.log(`강의 ${lecture.uid} 결과 확인 실패:`, error);
          }
        });
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
                    <h3>{item.classroom.classroomName}</h3>
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
                        classroomSessions[item.classroom.uid].map(lecture => {
                          const sessionResult =
                            sessionResults[item.classroom.uid]?.[lecture.uid];
                          const status = sessionResult?.status || 'scheduled';
                          const isClickable = status === 'completed';

                          const getStatusText = status => {
                            switch (status) {
                              case 'completed':
                                return '완료';
                              case 'absent':
                                return '결석';
                              default:
                                return '예정';
                            }
                          };

                          return (
                            <div
                              key={lecture.uid || lecture.id}
                              className={`session-item ${isClickable ? 'session-clickable' : 'session-disabled'}`}
                              onClick={() =>
                                isClickable && setSelectedLecture(lecture)
                              }
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
                                <span
                                  className={`session-status-badge status-${status}`}
                                >
                                  {getStatusText(status)}
                                </span>
                              </div>
                            </div>
                          );
                        })
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
