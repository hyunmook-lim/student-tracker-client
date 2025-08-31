import React, { useState, useEffect } from 'react';
import { getClassroomStudents } from '../../../api/classroomStudentApi';
import { getQuestionsByLecture } from '../../../api/questionApi';
import { getStudentLectureResultsByLecture } from '../../../api/studentLectureResultApi';
import StudentResultViewModal from './StudentResultViewModal';
import './ResultViewModal.css';

function ResultViewModal({ isOpen, onClose, selectedLecture }) {
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

        // 학생 목록, 문제 목록, 학생 결과를 동시에 가져오기
        const [studentsResult, questionsResult, resultsResult] =
          await Promise.all([
            getClassroomStudents(classroomId),
            getQuestionsByLecture(lectureId),
            getStudentLectureResultsByLecture(lectureId),
          ]);

        if (!studentsResult.success) {
          throw new Error(studentsResult.error);
        }

        if (!questionsResult.success) {
          throw new Error(questionsResult.error);
        }

        console.log('반 학생 목록 조회 성공:', studentsResult.data);
        console.log('강의 문제 목록 조회 성공:', questionsResult.data);
        console.log(
          '학생 결과 조회 성공:',
          resultsResult.success,
          resultsResult.data
        );

        // 승인된 학생들만 필터링
        const approvedStudents = studentsResult.data.filter(
          student => student.status === 'APPROVED'
        );

        setStudents(approvedStudents);
        setQuestions(questionsResult.data);

        // 실제 서버 데이터로 학생 결과 설정
        const actualResults = {};
        if (resultsResult.success && resultsResult.data) {
          // 서버에서 받은 결과 데이터를 가공
          resultsResult.data.forEach(result => {
            const studentId = result.studentId;

            // 문제별 답안 정리
            const answers = {};
            if (result.questionResults) {
              result.questionResults.forEach(qResult => {
                answers[qResult.questionId] = qResult.studentAnswer || '';
              });
            }

            actualResults[studentId] = {
              attendance: result.isAttended ? '출석' : '결석',
              answers: answers,
              assignmentGrade: result.assignmentScore || '',
              isCompleted: true,
              questionResults: result.questionResults || [],
            };
          });
        }

        // 결과가 없는 학생들은 빈 데이터로 초기화
        approvedStudents.forEach(studentData => {
          const student = studentData.student || studentData;
          const studentId = student.uid || student.studentId || studentData.uid;

          if (!actualResults[studentId]) {
            actualResults[studentId] = {
              attendance: '출석',
              answers: questionsResult.data.reduce((acc, question) => {
                acc[question.uid || question.id] = '';
                return acc;
              }, {}),
              assignmentGrade: '',
              isCompleted: false,
              questionResults: [],
            };
          }
        });

        setStudentResults(actualResults);
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

  const handleStudentModalClose = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
  };

  if (!isOpen || !selectedLecture) return null;

  return (
    <>
      <div className='result-view-modal-overlay' onClick={onClose}>
        <div
          className='result-view-modal-content'
          onClick={e => e.stopPropagation()}
        >
          <div className='result-view-modal-header'>
            <h3>
              {selectedLecture.lectureName || selectedLecture.title} - 결과 보기
            </h3>
            <button className='result-view-modal-close' onClick={onClose}>
              ×
            </button>
          </div>
          <div className='result-view-modal-body'>
            {loading ? (
              <div className='loading-message'>학생 목록을 불러오는 중...</div>
            ) : error ? (
              <div className='error-message'>데이터 조회 실패: {error}</div>
            ) : (
              <div className='student-cards-container'>
                <div className='student-cards-header'>
                  <h4>학생 목록 ({students.length}명)</h4>
                  <p>카드를 클릭하여 각 학생의 결과를 확인하세요</p>
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
                            {isCompleted ? '결과 있음' : '결과 없음'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='result-view-actions'>
                  <button
                    className='result-view-btn result-view-btn-close'
                    onClick={onClose}
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 개별 학생 결과 보기 모달 */}
      <StudentResultViewModal
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
      />
    </>
  );
}

export default ResultViewModal;
