import React, { useEffect, useState } from 'react';
import { useLectureStore } from '../../../store';
import { useAuthStore } from '../../../store';
import { getTeacherClassrooms } from '../../../api/classroomApi';
import LectureAddModal from '../modal/LectureAddModal';
import QuestionAddModal from '../modal/QuestionAddModal';
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
    getLecturesByClassroom,
  } = useLectureStore();

  const { currentUser } = useAuthStore();
  const [apiClassrooms, setApiClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAddLecture = () => {
    if (addLecture()) {
      resetQuestions();
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

  const handleRemoveQuestion = id => {
    if (questions.length > 1) {
      removeQuestion(id);
    }
  };

  const handleAddRound = classroomId => {
    updateNewLectureData('classroomId', classroomId);
    openLectureModal();
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
              onClick={() => toggleClassExpansion(classroom.uid)}
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
                  {getLecturesByClassroom(classroom.uid).map(lecture => (
                    <div key={lecture.id} className='lecture-item'>
                      <div className='lecture-info'>
                        <div className='lecture-title'>
                          <h5>{lecture.title}</h5>
                          <span className='lecture-date'>{lecture.date}</span>
                        </div>
                        <div className='lecture-status'>
                          <span className='status completed'>완료</span>
                        </div>
                      </div>
                      <div className='lecture-actions'>
                        <button className='btn btn-edit'>수정</button>
                        <button className='btn btn-delete'>삭제</button>
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
      />
    </div>
  );
}

export default LectureListComponent;
