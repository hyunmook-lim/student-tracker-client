import React, { useState, useEffect } from 'react';
import { createReport, updateStudentFeedback } from '../../../api/reportApi';
import './StudentFeedbackModal.css';

function StudentFeedbackModal({ isOpen, onClose, reportData }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      if (isOpen && reportData?.classroom) {
        try {
          setLoading(true);

          // 백엔드 API 구조에 맞게 수정: /api/student-classrooms/classrooms/{classroomId}/students
          const response = await fetch(
            `/api/student-classrooms/classrooms/${reportData.classroom.uid}/students`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.ok) {
            const studentClassrooms = await response.json();
            // StudentClassroomResponse에서 student 정보 추출
            const studentList = studentClassrooms.map(sc => sc.student);
            console.log('학생 목록:', studentList); // 디버깅용
            setStudents(studentList);

            // Initialize feedbacks object
            const initialFeedbacks = {};
            studentList.forEach((student, index) => {
              const studentKey = student.uid || `student-${index}`;
              initialFeedbacks[studentKey] = '';
            });
            console.log('초기 피드백 객체:', initialFeedbacks); // 디버깅용
            setFeedbacks(initialFeedbacks);
          } else {
            console.error('학생 목록 가져오기 실패:', response.status);
            setStudents([]);
          }
        } catch (error) {
          console.error('학생 목록 가져오기 오류:', error);
          setStudents([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadStudents();
  }, [isOpen, reportData]);

  const handleFeedbackChange = (studentId, feedback) => {
    console.log('피드백 변경:', { studentId, feedback }); // 디버깅용
    setFeedbacks(prev => {
      const newFeedbacks = {
        ...prev,
        [studentId]: feedback,
      };
      console.log('업데이트된 피드백들:', newFeedbacks); // 디버깅용
      return newFeedbacks;
    });
  };

  const handleSaveReports = async () => {
    try {
      setSaving(true);

      // 1. 먼저 성적표를 생성
      const reportRequestData = {
        title: reportData.title,
        description: reportData.description,
        classroomId: reportData.classroom.uid,
        lectureIds: reportData.lectures.map(
          lecture => lecture.uid || lecture.id
        ),
        studentIds: students.map(student => student.uid),
      };

      const createResult = await createReport(reportRequestData);

      if (!createResult.success) {
        console.error('성적표 생성 실패:', createResult.error);
        alert('성적표 생성에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      const reportId = createResult.data.uid;

      // 2. 각 학생별로 피드백 업데이트
      const feedbackPromises = students.map(student => {
        const studentKey =
          student.uid || `student-${students.indexOf(student)}`;
        const feedback = feedbacks[studentKey] || '';

        return updateStudentFeedback(reportId, student.uid, feedback);
      });

      const feedbackResults = await Promise.all(feedbackPromises);

      // 3. 피드백 업데이트 결과 확인
      const failedFeedbacks = feedbackResults.filter(result => !result.success);

      if (failedFeedbacks.length > 0) {
        console.error('일부 피드백 저장 실패:', failedFeedbacks);
        alert('성적표는 생성되었지만, 일부 피드백 저장에 실패했습니다.');
      } else {
        alert('성적표와 피드백이 성공적으로 저장되었습니다!');
      }

      onClose();
    } catch (error) {
      console.error('성적표 저장 오류:', error);
      alert('성적표 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='student-feedback-modal-overlay'>
      <div className='student-feedback-modal'>
        <div className='modal-header'>
          <h2>학생별 피드백 작성</h2>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='modal-content'>
          {loading ? (
            <div className='loading-message'>학생 목록을 불러오는 중...</div>
          ) : (
            <div className='students-feedback-section'>
              <h4>학생별 피드백</h4>
              <div className='students-list'>
                {students.map((student, index) => {
                  const studentKey = student.uid || `student-${index}`;
                  return (
                    <div key={studentKey} className='student-feedback-item'>
                      <div className='student-info'>
                        <span className='student-number'>{index + 1}</span>
                        <span className='student-name'>{student.name}</span>
                      </div>
                      <div className='feedback-input-section'>
                        <label htmlFor={`feedback-${studentKey}`}>
                          교사 피드백
                        </label>
                        <textarea
                          id={`feedback-${studentKey}`}
                          value={feedbacks[studentKey] || ''}
                          onChange={e =>
                            handleFeedbackChange(studentKey, e.target.value)
                          }
                          placeholder='이 학생에 대한 피드백을 작성해주세요...'
                          rows={3}
                          maxLength={500}
                        />
                        <span className='char-count'>
                          {(feedbacks[studentKey] || '').length}/500
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className='modal-footer'>
          <button className='cancel-btn' onClick={onClose}>
            취소
          </button>
          <button
            className='save-btn'
            onClick={handleSaveReports}
            disabled={
              saving ||
              students.length === 0 ||
              students.some(student => {
                const studentKey =
                  student.uid || `student-${students.indexOf(student)}`;
                return (
                  !feedbacks[studentKey] || feedbacks[studentKey].trim() === ''
                );
              })
            }
          >
            {saving ? '저장 중...' : `성적표 생성 (${students.length}명)`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentFeedbackModal;
