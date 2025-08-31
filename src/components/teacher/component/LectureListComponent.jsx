import React, { useEffect, useState } from 'react';
import { useLectureStore } from '../../../store';
import { useAuthStore } from '../../../store';
import { getTeacherClassrooms } from '../../../api/classroomApi';
import {
  getLecturesByClassroom as apiGetLecturesByClassroom,
  deleteLecture,
} from '../../../api/lectureApi';
import LectureAddModal from '../modal/LectureAddModal';
import QuestionAddModal from '../modal/QuestionAddModal';
import LectureDetailModal from '../modal/LectureDetailModal';
import ConfirmModal from '../../ConfirmModal';
import './LectureListComponent.css';

function LectureListComponent() {
  const {
    expandedClasses,
    toggleClassExpansion,
    isLectureModalOpen,
    isQuestionModalOpen,
    openLectureModal,
    closeLectureModal,
    closeQuestionModal,
    newLectureData,
    updateNewLectureData,
    addLecture,
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    resetQuestions,
    saveQuestions,
  } = useLectureStore();

  const { currentUser } = useAuthStore();
  const [apiClassrooms, setApiClassrooms] = useState([]);
  const [classroomLectures, setClassroomLectures] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    lectureId: null,
    classroomId: null,
  });
  const [lectureDetailModal, setLectureDetailModal] = useState({
    isOpen: false,
    lecture: null,
  });

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
      const result = await apiGetLecturesByClassroom(classroomId);
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
    toggleClassExpansion(classroomId);
    if (!expandedClasses.has(classroomId) && !classroomLectures[classroomId]) {
      fetchLecturesForClassroom(classroomId);
    }
  };

  const handleAddLecture = async () => {
    const success = await addLecture();
    if (success) {
      resetQuestions();
      // 강의 추가 후 해당 반의 강의 목록 새로고침
      if (newLectureData.classroomId) {
        fetchLecturesForClassroom(newLectureData.classroomId);
      }
    }
  };

  const [questionCount, setQuestionCount] = React.useState(1);

  const handleAddQuestions = () => {
    const count = parseInt(questionCount);
    if (count > 0 && count <= 50) {
      for (let i = 0; i < count; i++) {
        addQuestion();
      }
      setQuestionCount(1);
    } else {
      alert('1-50 사이의 숫자를 입력해주세요.');
    }
  };

  const handleSaveQuestions = async () => {
    const success = await saveQuestions();
    if (success && newLectureData.classroomId) {
      fetchLecturesForClassroom(newLectureData.classroomId);
    }
  };

  const handleDeleteClick = (lectureId, classroomId) => {
    setConfirmModal({
      isOpen: true,
      lectureId,
      classroomId,
    });
  };

  const handleDeleteConfirm = async () => {
    const { lectureId, classroomId } = confirmModal;

    try {
      const result = await deleteLecture(lectureId);
      if (result.success) {
        alert('강의가 삭제되었습니다.');
        fetchLecturesForClassroom(classroomId);
      } else {
        alert(`강의 삭제 실패: ${result.error}`);
      }
    } catch (error) {
      console.error('강의 삭제 중 오류:', error);
      alert('강의 삭제 중 오류가 발생했습니다.');
    }

    setConfirmModal({ isOpen: false, lectureId: null, classroomId: null });
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, lectureId: null, classroomId: null });
  };

  const handleLectureClick = lecture => {
    setLectureDetailModal({
      isOpen: true,
      lecture: lecture,
    });
  };

  const handleLectureDetailClose = () => {
    setLectureDetailModal({
      isOpen: false,
      lecture: null,
    });
  };

  const handleRemoveQuestion = id => {
    if (questions.length > 1) {
      removeQuestion(id);
    }
  };

  const handleAddRound = classroomId => {
    updateNewLectureData('classroomId', classroomId);
    openLectureModal();
  };

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

  // 로딩 중 표시
  if (loading) {
    return (
      <div className='lecture-list-container'>
        <div className='lecture-list-header'>
          <h2>수업 관리</h2>
        </div>
        <div className='loading-message'>반 목록을 불러오는 중...</div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className='lecture-list-container'>
        <div className='lecture-list-header'>
          <h2>수업 관리</h2>
        </div>
        <div className='error-message'>
          반 목록을 불러오는데 실패했습니다: {error}
        </div>
      </div>
    );
  }

  return (
    <div className='lecture-list-container'>
      <div className='lecture-list-header'>
        <h2>수업 관리</h2>
      </div>

      <div className='classroom-list'>
        {apiClassrooms.map(classroom => (
          <div key={classroom.uid} className='classroom-item'>
            <div
              className='classroom-header'
              onClick={() => handleClassroomClick(classroom.uid)}
            >
              <div className='classroom-info'>
                <h3>{classroom.classroomName}</h3>
                <p>{classroom.description}</p>
                <span className='student-count'>
                  학생 수:{' '}
                  {classroom.studentIds ? classroom.studentIds.length : 0}명
                </span>
              </div>
              <div className='classroom-actions'>
                <button
                  className='add-round-btn'
                  onClick={e => {
                    e.stopPropagation();
                    handleAddRound(classroom.uid);
                  }}
                >
                  + 새 회차
                </button>
              </div>
            </div>

            {expandedClasses.has(classroom.uid) && (
              <div className='lectures-section'>
                <div className='lectures-header'>
                  <h4>회차별 수업 관리</h4>
                </div>
                <div className='lectures-list'>
                  {(classroomLectures[classroom.uid] || [])
                    .sort((a, b) => {
                      // 날짜 기준 정렬 (없으면 맨 뒤로)
                      const dateA = a.lectureDate
                        ? new Date(a.lectureDate)
                        : new Date('9999-12-31');
                      const dateB = b.lectureDate
                        ? new Date(b.lectureDate)
                        : new Date('9999-12-31');

                      if (dateA.getTime() !== dateB.getTime()) {
                        return dateA.getTime() - dateB.getTime();
                      }

                      // 날짜가 같으면 강의명 기준 정렬
                      const nameA = (a.lectureName || '').toLowerCase();
                      const nameB = (b.lectureName || '').toLowerCase();
                      return nameA.localeCompare(nameB);
                    })
                    .map(lecture => (
                      <div
                        key={lecture.uid || lecture.id}
                        className='lecture-item'
                        onClick={() => handleLectureClick(lecture)}
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
                            <span
                              className={`status ${getLectureStatus(
                                lecture.lectureDate
                              )}`}
                            >
                              {getLectureStatusText(lecture.lectureDate)}
                            </span>
                          </div>
                        </div>
                        <div className='lecture-actions'>
                          <button
                            className='btn btn-delete'
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteClick(
                                lecture.uid || lecture.id,
                                classroom.uid
                              );
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <LectureAddModal
        isOpen={isLectureModalOpen}
        onClose={closeLectureModal}
        newLectureData={newLectureData}
        updateNewLectureData={updateNewLectureData}
        onSave={handleAddLecture}
      />

      <QuestionAddModal
        isOpen={isQuestionModalOpen}
        onClose={closeQuestionModal}
        questions={questions}
        updateQuestion={updateQuestion}
        handleRemoveQuestion={handleRemoveQuestion}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        handleAddQuestions={handleAddQuestions}
        onSave={handleSaveQuestions}
        lectureData={newLectureData}
        resetQuestions={resetQuestions}
      />

      <LectureDetailModal
        isOpen={lectureDetailModal.isOpen}
        onClose={handleLectureDetailClose}
        lecture={lectureDetailModal.lecture}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='강의 삭제'
        message='정말로 이 강의를 삭제하시겠습니까?'
      />
    </div>
  );
}

export default LectureListComponent;
