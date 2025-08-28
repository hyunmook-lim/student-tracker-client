import React, { useState, useEffect } from 'react';
import { getClassroomStudents } from '../../../api/classroomStudentApi';
import { getQuestionsByLecture } from '../../../api/questionApi';
import { createStudentLectureResult } from '../../../api/studentLectureResultApi';
import {
  updateLectureResultStatus,
  getLecturesByClassroom,
} from '../../../api/lectureApi';
import StudentResultModal from './StudentResultModal';
import './ResultInputModal.css';

function ResultInputModal({ isOpen, onClose, selectedLecture, onSave }) {
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [studentResults, setStudentResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !selectedLecture) {
        return;
      }

      const classroomId = selectedLecture?.classroomId;
      const lectureId = selectedLecture.uid || selectedLecture.id;

      if (!classroomId || !lectureId) {
        setError('반 또는 강의 정보를 찾을 수 없습니다.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 학생 목록과 문제 목록을 동시에 가져오기
        const [studentsResult, questionsResult] = await Promise.all([
          getClassroomStudents(classroomId),
          getQuestionsByLecture(lectureId),
        ]);

        if (!studentsResult.success) {
          throw new Error(studentsResult.error);
        }

        if (!questionsResult.success) {
          throw new Error(questionsResult.error);
        }

        console.log('반 학생 목록 조회 성공:', studentsResult.data);
        console.log('강의 문제 목록 조회 성공:', questionsResult.data);

        // 승인된 학생들만 필터링
        const approvedStudents = studentsResult.data.filter(
          student => student.status === 'APPROVED'
        );

        setStudents(approvedStudents);
        setQuestions(questionsResult.data);

        // 각 학생별로 초기 결과 데이터 생성
        const initialResults = {};
        approvedStudents.forEach(studentData => {
          // StudentClassroomResponse 구조: { student: { uid, name, ... }, classroom: {...}, status: ... }
          const student = studentData.student || studentData;
          const studentId = student.uid || student.studentId || studentData.uid;

          console.log('학생 데이터 구조:', studentData);
          console.log('추출된 학생 ID:', studentId);

          initialResults[studentId] = {
            attendance: '출석',
            answers: questionsResult.data.reduce((acc, question) => {
              acc[question.uid || question.id] = '';
              return acc;
            }, {}),
            assignmentGrade: '',
            isCompleted: false,
          };
        });
        setStudentResults(initialResults);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, selectedLecture]);

  // 학생 결과 완료 여부 확인
  const isStudentResultCompleted = studentData => {
    const student = studentData.student || studentData;
    const studentId = student.uid || student.studentId || studentData.uid;

    const result = studentResults[studentId];
    if (!result) return false;

    if (result.attendance === '결석') return true;

    // 출석한 경우 모든 답과 과제 등급이 입력되었는지 확인
    const hasAllAnswers = questions.every(question => {
      const questionId = question.uid || question.id;
      return (
        result.answers[questionId] && result.answers[questionId].trim() !== ''
      );
    });

    return hasAllAnswers && result.assignmentGrade !== '';
  };

  const handleStudentClick = student => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleStudentResultSave = (studentId, resultData) => {
    console.log('학생 결과 저장:', studentId, resultData);
    setStudentResults(prev => ({
      ...prev,
      [studentId]: {
        ...resultData,
        isCompleted: true,
      },
    }));
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
  };

  const handleStudentModalClose = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveAll = async () => {
    // 모든 학생의 결과가 완료되었는지 확인
    const incompleteStudents = students.filter(studentData => {
      return !isStudentResultCompleted(studentData);
    });

    if (incompleteStudents.length > 0) {
      const names = incompleteStudents.map(studentData => {
        const student = studentData.student || studentData;
        return student.name || student.studentName;
      });
      alert(`다음 학생들의 결과를 완료해주세요: ${names.join(', ')}`);
      return;
    }

    try {
      setLoading(true);

      const lectureId = selectedLecture.uid || selectedLecture.id;

      // 각 학생별로 순차적으로 API 호출
      for (const studentData of students) {
        const student = studentData.student || studentData;
        const studentId = student.uid || student.studentId || studentData.uid;
        const result = studentResults[studentId];

        console.log('처리 중인 학생:', {
          studentData,
          extractedStudent: student,
          studentId,
          result,
        });

        // 출석 여부 확인
        const isAttended = result.attendance === '출석';

        // 문제 결과 데이터 생성
        const questionResults = questions.map(question => {
          const questionId = question.uid || question.id;
          const studentAnswer = result.answers[questionId] || '';

          // 정답 여부 계산 (대소문자 구분 없이, 앞뒤 공백 제거 후 비교)
          const correctAnswer = question.answer || '';
          const isCorrect =
            correctAnswer.trim().toLowerCase() ===
            studentAnswer.trim().toLowerCase();

          return {
            questionId: questionId,
            isCorrect: isCorrect,
            studentAnswer: studentAnswer,
          };
        });

        // API 요청 데이터 생성
        const requestData = {
          studentId: studentId,
          lectureId: lectureId,
          isAttended: isAttended,
          assignmentScore: result.assignmentGrade || '',
          questionResults: questionResults,
        };

        console.log(`${student.studentName} 학생 결과 전송:`, requestData);

        // API 호출
        const response = await createStudentLectureResult(requestData);

        if (!response.success) {
          throw new Error(
            `${student.name || student.studentName} 학생 결과 저장 실패: ${response.error}`
          );
        }

        console.log(
          `${student.name || student.studentName} 학생 결과 저장 성공:`,
          response.data
        );
      }

      // 모든 학생 결과 저장 완료 후 강의 상태 업데이트
      console.log('강의 결과 입력 상태를 완료로 업데이트합니다.');

      const updateStatusResponse = await updateLectureResultStatus(
        lectureId,
        true
      );

      if (!updateStatusResponse.success) {
        console.warn('강의 상태 업데이트 실패:', updateStatusResponse.error);
        // 상태 업데이트 실패해도 결과는 저장되었으므로 경고만 표시
      } else {
        console.log(
          '강의 결과 입력 상태 업데이트 성공:',
          updateStatusResponse.data
        );
        console.log('업데이트된 강의 정보:', {
          id: updateStatusResponse.data.uid || updateStatusResponse.data.id,
          name: updateStatusResponse.data.lectureName,
          resultEntered: updateStatusResponse.data.resultEntered,
        });
      }

      // 강의 목록 다시 조회하여 최신 정보 반영
      try {
        const classroomId = selectedLecture?.classroomId;
        if (classroomId) {
          const lecturesResponse = await getLecturesByClassroom(classroomId);
          if (lecturesResponse.success) {
            console.log('강의 목록 재조회 성공:', lecturesResponse.data);
            console.log(
              '업데이트된 강의들의 resultEntered 상태:',
              lecturesResponse.data.map(lecture => ({
                id: lecture.uid || lecture.id,
                name: lecture.lectureName,
                resultEntered: lecture.resultEntered,
              }))
            );
            // 강의 목록에서 현재 강의의 resultEntered 상태를 수동으로 업데이트
            const updatedLectures = lecturesResponse.data.map(lecture => {
              const lectureId = lecture.uid || lecture.id;
              const currentLectureId =
                selectedLecture.uid || selectedLecture.id;

              if (lectureId === currentLectureId) {
                return {
                  ...lecture,
                  resultEntered: true,
                };
              }
              return lecture;
            });

            console.log('수동으로 업데이트된 강의 목록:', updatedLectures);

            // 부모 컴포넌트에 업데이트된 강의 목록 전달
            if (onSave) {
              onSave({
                type: 'lectures_updated',
                lectures: updatedLectures,
                results: students.map(studentData => {
                  const student = studentData.student || studentData;
                  const studentId =
                    student.uid || student.studentId || studentData.uid;
                  const result = studentResults[studentId];
                  return {
                    id: studentId,
                    name: student.name || student.studentName,
                    ...result,
                  };
                }),
              });
            }
          } else {
            console.warn('강의 목록 재조회 실패:', lecturesResponse.error);
          }
        }
      } catch (error) {
        console.warn('강의 목록 재조회 중 오류:', error);
      }

      alert('모든 학생의 결과가 성공적으로 저장되었습니다.');
      onClose();
    } catch (error) {
      console.error('결과 저장 오류:', error);
      alert(`결과 저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !selectedLecture) return null;

  return (
    <>
      <div className='result-input-modal-overlay' onClick={onClose}>
        <div
          className='result-input-modal-content'
          onClick={e => e.stopPropagation()}
        >
          <div className='result-input-modal-header'>
            <h3>
              {selectedLecture.lectureName || selectedLecture.title} - 결과 입력
            </h3>
            <button className='result-input-modal-close' onClick={onClose}>
              ×
            </button>
          </div>
          <div className='result-input-modal-body'>
            {loading ? (
              <div className='loading-message'>학생 목록을 불러오는 중...</div>
            ) : error ? (
              <div className='error-message'>데이터 조회 실패: {error}</div>
            ) : (
              <div className='student-cards-container'>
                <div className='student-cards-header'>
                  <h4>학생 목록 ({students.length}명)</h4>
                  <p>카드를 클릭하여 각 학생의 결과를 입력하세요</p>
                </div>
                <div className='student-cards-grid'>
                  {students.map(studentData => {
                    const student = studentData.student || studentData;
                    const studentId =
                      student.uid || student.studentId || studentData.uid;
                    const isCompleted = isStudentResultCompleted(studentData);

                    return (
                      <div
                        key={studentId}
                        className={`student-card ${isCompleted ? 'completed' : 'incomplete'}`}
                        onClick={() => handleStudentClick(studentData)}
                      >
                        <div className='student-card-header'>
                          <h5>{student.name || student.studentName}</h5>
                          <div
                            className={`status-indicator ${isCompleted ? 'completed' : 'incomplete'}`}
                          >
                            {isCompleted ? '완료' : '미완료'}
                          </div>
                        </div>
                        <div className='student-card-info'>
                          <div className='question-count'>
                            문제 수: {questions.length}개
                          </div>
                          <div className='completion-status'>
                            {isCompleted ? '입력 완료' : '입력 필요'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='result-input-actions'>
                  <button
                    className='result-input-btn result-input-btn-cancel'
                    onClick={onClose}
                  >
                    취소
                  </button>
                  <button
                    className='result-input-btn result-input-btn-save'
                    onClick={handleSaveAll}
                    disabled={
                      loading ||
                      students.some(studentData => {
                        return !isStudentResultCompleted(studentData);
                      })
                    }
                  >
                    {loading ? '저장 중...' : '전체 저장'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 개별 학생 결과 입력 모달 */}
      <StudentResultModal
        isOpen={isStudentModalOpen}
        onClose={handleStudentModalClose}
        student={selectedStudent}
        questions={questions}
        initialData={
          selectedStudent
            ? (() => {
                const student = selectedStudent.student || selectedStudent;
                const studentId =
                  student.uid || student.studentId || selectedStudent.uid;
                return studentResults[studentId];
              })()
            : null
        }
        onSave={resultData => {
          const student = selectedStudent.student || selectedStudent;
          const studentId =
            student.uid || student.studentId || selectedStudent.uid;
          handleStudentResultSave(studentId, resultData);
        }}
      />
    </>
  );
}

export default ResultInputModal;
