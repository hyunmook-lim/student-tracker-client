import React, { useEffect, useState, useCallback } from 'react';
import { useClassroomStore } from '../../../store';
import { useAuthStore } from '../../../store';
import { getTeacherClassrooms } from '../../../api/classroomApi';
import { getLecturesByClassroom } from '../../../api/lectureApi';
import ResultDetailModal from '../modal/ResultDetailModal';
import ResultInputModal from '../modal/ResultInputModal';
import ResultViewModal from '../modal/ResultViewModal';
import './ResultListComponent.css';

function ResultListComponent() {
  const { classrooms, expandedClass, updateStudentResults } =
    useClassroomStore();
  const { currentUser } = useAuthStore();

  const [apiClassrooms, setApiClassrooms] = useState([]);
  const [classroomLectures, setClassroomLectures] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // 컴포넌트 마운트 시 교사의 반 목록 가져오기
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (!currentUser || currentUser.type !== 'teacher') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getTeacherClassrooms(currentUser.uid);

        if (result.success) {
          console.log('반 목록 가져오기 성공:', result.data);
          setApiClassrooms(result.data);
        } else {
          console.error('반 목록 가져오기 실패:', result.error);
          setError(result.error);
        }
      } catch (error) {
        console.error('반 목록 가져오기 오류:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [currentUser]);

  // 특정 반의 강의 목록 가져오기
  const fetchLecturesForClassroom = async classroomId => {
    try {
      const result = await getLecturesByClassroom(classroomId);
      if (result.success) {
        console.log(`반 ${classroomId} 강의 목록 가져오기 성공:`, result.data);
        setClassroomLectures(prev => ({
          ...prev,
          [classroomId]: result.data,
        }));
      } else {
        console.error(
          `반 ${classroomId} 강의 목록 가져오기 실패:`,
          result.error
        );
      }
    } catch (error) {
      console.error(`반 ${classroomId} 강의 목록 가져오기 오류:`, error);
    }
  };

  // 반을 클릭할 때 강의 목록 가져오기
  const handleClassroomClick = classroomId => {
    const newExpandedClasses = new Set(expandedClasses);
    if (expandedClasses.has(classroomId)) {
      newExpandedClasses.delete(classroomId);
    } else {
      newExpandedClasses.add(classroomId);
      if (!classroomLectures[classroomId]) {
        fetchLecturesForClassroom(classroomId);
      }
    }
    setExpandedClasses(newExpandedClasses);
  };

  // classroomLectures 상태 변경 시 디버깅
  useEffect(() => {
    console.log('classroomLectures 상태 변경됨:', classroomLectures);
  }, [classroomLectures]);

  // 강의 상태 판단 함수
  const getLectureStatus = lectureDate => {
    if (!lectureDate) return 'completed';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lecture = new Date(lectureDate);
    lecture.setHours(0, 0, 0, 0);

    if (lecture.getTime() === today.getTime()) {
      return 'ongoing';
    } else if (lecture.getTime() < today.getTime()) {
      return 'completed';
    } else {
      return 'scheduled';
    }
  };

  const getLectureStatusText = lectureDate => {
    const status = getLectureStatus(lectureDate);
    switch (status) {
      case 'ongoing':
        return '진행중';
      case 'completed':
        return '완료';
      case 'scheduled':
        return '예정';
      default:
        return '완료';
    }
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
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLecture(null);
  };

  const handleCloseInputModal = () => {
    setIsInputModalOpen(false);
    setSelectedLecture(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedLecture(null);
  };

  const handleSaveResults = useCallback(
    data => {
      // 새로운 형식의 데이터 처리 (강의 목록 업데이트 포함)
      if (data && data.type === 'lectures_updated') {
        console.log('강의 목록 업데이트 시작:', {
          expandedClass,
          lectures: data.lectures,
          currentLectures: classroomLectures[expandedClass],
        });

        // 강의 ID 매칭 확인
        const currentLectureIds =
          classroomLectures[expandedClass]?.map(l => l.uid || l.id) || [];
        const newLectureIds = data.lectures?.map(l => l.uid || l.id) || [];
        console.log('강의 ID 매칭 확인:', {
          currentIds: currentLectureIds,
          newIds: newLectureIds,
          selectedLectureId: selectedLecture?.uid || selectedLecture?.id,
        });

        // 강의 목록 업데이트 - 즉시 반영되도록 함수형 업데이트 사용
        setClassroomLectures(prev => {
          const updated = {
            ...prev,
            [expandedClass]: data.lectures,
          };
          console.log('업데이트된 강의 목록:', updated);
          return updated;
        });

        // 학생 결과도 업데이트
        updateStudentResults(expandedClass, data.results);
      } else {
        // 기존 형식의 데이터 처리 (하위 호환성)
        updateStudentResults(expandedClass, data);
      }

      setIsInputModalOpen(false);
      setSelectedLecture(null);
    },
    [expandedClass, classroomLectures, selectedLecture, updateStudentResults]
  );

  const getGradeColor = score => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className='result-list-container'>
        <div className='result-list-header'>
          <h2>성적 결과</h2>
        </div>
        <div className='loading-message'>반 목록을 불러오는 중...</div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className='result-list-container'>
        <div className='result-list-header'>
          <h2>성적 결과</h2>
        </div>
        <div className='error-message'>
          반 목록을 불러오는데 실패했습니다: {error}
        </div>
      </div>
    );
  }

  return (
    <div className='result-list-container'>
      <div className='result-list-header'>
        <h2>성적 결과</h2>
      </div>

      <div className='classroom-results'>
        {apiClassrooms.map(classroom => (
          <div key={classroom.uid} className='classroom-result-item'>
            <div
              className='classroom-header'
              onClick={() => handleClassroomClick(classroom.uid)}
            >
              <div className='classroom-info'>
                <h3>{classroom.classroomName}</h3>
                <p>{classroom.description}</p>
                <span>
                  학생 수:{' '}
                  {classroom.studentIds ? classroom.studentIds.length : 0}명
                </span>
              </div>
              <div className='expand-icon'>
                {expandedClasses.has(classroom.uid) ? '▼' : '▶'}
              </div>
            </div>

            {expandedClasses.has(classroom.uid) && (
              <div className='lectures-section'>
                <div className='lectures-header'>
                  <h4>회차별 성적 관리</h4>
                </div>
                <div className='lectures-list'>
                  {(classroomLectures[classroom.uid] || [])
                    .sort((a, b) => {
                      const dateA = a.lectureDate
                        ? new Date(a.lectureDate)
                        : new Date('9999-12-31');
                      const dateB = b.lectureDate
                        ? new Date(b.lectureDate)
                        : new Date('9999-12-31');

                      if (dateA.getTime() !== dateB.getTime()) {
                        return dateA.getTime() - dateB.getTime();
                      }

                      const nameA = (a.lectureName || '').toLowerCase();
                      const nameB = (b.lectureName || '').toLowerCase();
                      return nameA.localeCompare(nameB);
                    })
                    .map(lecture => {
                      const status = getLectureStatus(lecture.lectureDate);
                      const isCompleted = status === 'completed';
                      const hasResults = lecture.resultEntered || false;

                      // 디버깅을 위한 로그
                      console.log(
                        `강의 ${lecture.lectureName}: resultEntered = ${lecture.resultEntered}, hasResults = ${hasResults}`
                      );

                      return (
                        <div
                          key={lecture.uid || lecture.id}
                          className='lecture-item'
                        >
                          <div className='lecture-info'>
                            <div className='lecture-title'>
                              <h5>{lecture.lectureName}</h5>
                              <span className='lecture-date'>
                                {lecture.lectureDate
                                  ? lecture.lectureDate.split('T')[0]
                                  : ''}
                              </span>
                            </div>
                            <div className='lecture-status'>
                              <span className={`status ${status}`}>
                                {getLectureStatusText(lecture.lectureDate)}
                              </span>
                            </div>
                          </div>
                          <div className='lecture-actions'>
                            {isCompleted && hasResults ? (
                              <button
                                className='btn btn-view'
                                onClick={() => handleViewResults(lecture)}
                              >
                                결과 보기
                              </button>
                            ) : isCompleted && !hasResults ? (
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
                      );
                    })}
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

      <ResultViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        selectedLecture={selectedLecture}
      />
    </div>
  );
}

export default ResultListComponent;
