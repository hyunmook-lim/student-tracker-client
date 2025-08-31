import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store';
import { getStudentClassrooms } from '../../../api/classroomStudentApi';
import { getLecturesByClassroom } from '../../../api/lectureApi';
import { getStudentLectureResultByStudentAndLecture } from '../../../api/studentLectureResultApi';
import LectureDetailModal from '../modal/LectureDetailModal';
import './AttendanceCheckComponent.css';

function StudentAttendanceCheck() {
  const { currentUser } = useAuthStore();
  const [studentClassrooms, setStudentClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedClassrooms, setExpandedClassrooms] = useState(new Set());
  const [classroomSessions, setClassroomSessions] = useState({});
  const [sessionResults, setSessionResults] = useState({});
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        // 승인된 수업만 필터링
        const approvedClassrooms = result.data.filter(
          item => item.status === 'APPROVED'
        );
        setStudentClassrooms(approvedClassrooms);
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

  const handleClassroomClick = classroomUid => {
    setExpandedClassrooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classroomUid)) {
        newSet.delete(classroomUid);
      } else {
        newSet.add(classroomUid);
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

        // 각 강의의 출석 정보 확인
        const sessions = result.data;
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

        // 백그라운드에서 출석 정보 확인
        sessions.forEach(async lecture => {
          try {
            const resultData = await getStudentLectureResultByStudentAndLecture(
              currentUser.uid,
              lecture.uid
            );

            if (resultData.success) {
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
            console.log(`강의 ${lecture.uid} 출석 정보 확인 실패:`, error);
          }
        });
      } else {
        console.error('강의 목록 가져오기 실패:', result.error);
      }
    } catch (error) {
      console.error('강의 목록 가져오기 오류:', error);
    }
  };

  const handleLectureClick = lecture => {
    setSelectedLecture(lecture);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLecture(null);
  };

  // 출석률 계산
  const calculateAttendanceRate = classroomUid => {
    const sessions = classroomSessions[classroomUid] || [];
    const results = sessionResults[classroomUid] || {};

    if (sessions.length === 0) return 0;

    const attendedCount = sessions.filter(session => {
      const result = results[session.uid];
      return result && result.hasResult && result.isAttended;
    }).length;

    return Math.round((attendedCount / sessions.length) * 100);
  };

  // 출석 횟수 계산
  const calculateAttendanceCount = classroomUid => {
    const sessions = classroomSessions[classroomUid] || [];
    const results = sessionResults[classroomUid] || {};

    const attendedCount = sessions.filter(session => {
      const result = results[session.uid];
      return result && result.hasResult && result.isAttended;
    }).length;

    return { attended: attendedCount, total: sessions.length };
  };

  if (loading) {
    return (
      <div className='attendance-check-container'>
        <div className='attendance-check-header'>
          <h2>출석 현황 확인</h2>
        </div>
        <div className='loading-message'>
          <p>출석 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (studentClassrooms.length === 0) {
    return (
      <div className='attendance-check-container'>
        <div className='attendance-check-header'>
          <h2>출석 현황 확인</h2>
        </div>
        <div className='empty-message'>
          <p>승인된 수업이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='attendance-check-container'>
        <div className='attendance-check-header'>
          <h2>출석 현황 확인</h2>
        </div>

        <div className='classrooms-list'>
          {studentClassrooms.map(item => {
            const attendanceCount = calculateAttendanceCount(
              item.classroom.uid
            );
            const attendanceRate = calculateAttendanceRate(item.classroom.uid);
            const isExpanded = expandedClassrooms.has(item.classroom.uid);

            return (
              <div key={item.uid} className='class-section'>
                <div
                  className='class-header'
                  onClick={() => handleClassroomClick(item.classroom.uid)}
                >
                  <div className='class-info'>
                    <h3>{item.classroom.classroomName}</h3>
                    <p>
                      {item.classroom.description || '수업 설명이 없습니다.'}
                    </p>
                  </div>
                  <div className='attendance-summary'>
                    <div className='attendance-stats'>
                      <span className='attendance-count'>
                        {attendanceCount.attended}/{attendanceCount.total}회
                        출석
                      </span>
                      <span className='attendance-rate'>
                        출석률 {attendanceRate}%
                      </span>
                    </div>
                    <div
                      className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                    >
                      {'>'}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className='sessions-list'>
                    {classroomSessions[item.classroom.uid]?.length > 0 ? (
                      <div className='lectures-grid'>
                        {classroomSessions[item.classroom.uid].map(lecture => {
                          const sessionResult =
                            sessionResults[item.classroom.uid]?.[lecture.uid];
                          const status = sessionResult?.status || 'scheduled';
                          const isClickable = sessionResult?.hasResult;
                          const isAttended = status === 'completed';
                          const isScheduled = status === 'scheduled';

                          return (
                            <div
                              key={lecture.uid || lecture.id}
                              className={`lecture-card-compact ${
                                isAttended
                                  ? 'attended'
                                  : isScheduled
                                    ? 'scheduled'
                                    : 'absent'
                              }`}
                              onClick={() =>
                                isClickable && handleLectureClick(lecture)
                              }
                            >
                              <div className='lecture-info-compact'>
                                <div
                                  className={`attendance-badge-left ${
                                    isAttended
                                      ? 'present'
                                      : isScheduled
                                        ? 'scheduled'
                                        : 'absent'
                                  }`}
                                ></div>
                                <span className='lecture-title-compact'>
                                  {lecture.lectureName}
                                </span>
                                <span className='lecture-date-compact'>
                                  {lecture.lectureDate
                                    ? lecture.lectureDate.split('T')[0]
                                    : ''}
                                </span>
                                <span
                                  className={`status-badge-compact ${
                                    isAttended
                                      ? 'present'
                                      : isScheduled
                                        ? 'scheduled'
                                        : 'absent'
                                  }`}
                                >
                                  {isAttended
                                    ? '출석'
                                    : isScheduled
                                      ? '예정'
                                      : '결석'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className='empty-sessions-message'>
                        아직 회차가 없습니다.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 강의 상세 모달 */}
      <LectureDetailModal
        lecture={selectedLecture}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default StudentAttendanceCheck;
