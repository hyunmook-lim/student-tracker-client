import React, { useEffect, useState } from 'react';
import { useStudentsStore, useUIStore } from '../../../store';
import { useAuthStore } from '../../../store';
import { getTeacherClassrooms } from '../../../api/classroomApi';
import { getLecturesByClassroom } from '../../../api/lectureApi';
import './GradeFormComponent.css';

function GradeFormComponent() {
  const { updateStudentGrade } = useStudentsStore();
  const { closeModal, selectedStudent, gradeFormData, updateGradeFormData } =
    useUIStore();
  const { currentUser } = useAuthStore();

  const [apiClassrooms, setApiClassrooms] = useState([]);
  const [classroomLectures, setClassroomLectures] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClasses, setExpandedClasses] = useState(new Set());

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

  const handleGradeChange = (subject, value) => {
    updateGradeFormData(subject, value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (selectedStudent) {
      Object.entries(gradeFormData).forEach(([subject, grade]) => {
        updateStudentGrade(selectedStudent.id, subject, grade);
      });
    }

    closeModal();
  };

  const calculateAverage = () => {
    const values = Object.values(gradeFormData);
    return values.reduce((sum, grade) => sum + grade, 0) / values.length;
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className='grade-form'>
        <div className='form-header'>
          <h3>성적 입력</h3>
        </div>
        <div className='loading-message'>반 목록을 불러오는 중...</div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className='grade-form'>
        <div className='form-header'>
          <h3>성적 입력</h3>
        </div>
        <div className='error-message'>
          반 목록을 불러오는데 실패했습니다: {error}
        </div>
      </div>
    );
  }

  return (
    <div className='grade-form'>
      <div className='form-header'>
        <h3>성적 입력</h3>
      </div>

      <div className='classroom-list'>
        {apiClassrooms.map(classroom => (
          <div key={classroom.uid} className='classroom-item'>
            <div
              className='classroom-header'
              onClick={() => handleClassroomClick(classroom.uid)}
            >
              <div className='classroom-info'>
                <h4>{classroom.classroomName}</h4>
                <p>{classroom.description}</p>
                <span className='student-count'>
                  학생 수:{' '}
                  {classroom.studentIds ? classroom.studentIds.length : 0}명
                </span>
              </div>
            </div>

            {expandedClasses.has(classroom.uid) && (
              <div className='lectures-section'>
                <div className='lectures-header'>
                  <h5>회차별 수업 목록</h5>
                </div>
                <div className='lectures-grid'>
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
                    .map(lecture => (
                      <div
                        key={lecture.uid || lecture.id}
                        className='lecture-card'
                      >
                        <div className='lecture-info'>
                          <h6>{lecture.lectureName}</h6>
                          <span className='lecture-date'>
                            {lecture.lectureDate
                              ? lecture.lectureDate.split('T')[0]
                              : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedStudent && (
        <form onSubmit={handleSubmit} className='grade-input-section'>
          <div className='selected-student-info'>
            <h4>{selectedStudent.name} 성적 입력</h4>
          </div>

          <div className='grade-grid'>
            <div className='grade-item'>
              <label htmlFor='korean'>국어</label>
              <input
                type='number'
                id='korean'
                value={gradeFormData.korean}
                onChange={e => handleGradeChange('korean', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>

            <div className='grade-item'>
              <label htmlFor='math'>수학</label>
              <input
                type='number'
                id='math'
                value={gradeFormData.math}
                onChange={e => handleGradeChange('math', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>

            <div className='grade-item'>
              <label htmlFor='english'>영어</label>
              <input
                type='number'
                id='english'
                value={gradeFormData.english}
                onChange={e => handleGradeChange('english', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>

            <div className='grade-item'>
              <label htmlFor='science'>과학</label>
              <input
                type='number'
                id='science'
                value={gradeFormData.science}
                onChange={e => handleGradeChange('science', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>

            <div className='grade-item'>
              <label htmlFor='social'>사회</label>
              <input
                type='number'
                id='social'
                value={gradeFormData.social}
                onChange={e => handleGradeChange('social', e.target.value)}
                min='0'
                max='100'
                placeholder='0-100'
              />
            </div>
          </div>

          <div className='grade-summary'>
            <div className='average-display'>
              <span className='average-label'>평균:</span>
              <span className='average-value'>
                {calculateAverage().toFixed(1)}점
              </span>
            </div>
          </div>

          <div className='form-actions'>
            <button type='button' className='cancel-btn' onClick={closeModal}>
              취소
            </button>
            <button type='submit' className='submit-btn'>
              저장
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default GradeFormComponent;
