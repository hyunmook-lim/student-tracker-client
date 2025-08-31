import React, { useState, useEffect } from 'react';
import GradeDetailModal from '../modal/GradeDetailModal';
import { getStudentClassrooms } from '../../../api/classroomStudentApi';
import { getReportsByStudent } from '../../../api/reportApi';
import { useAuthStore } from '../../../store';
import './GradeReportComponent.css';

function GradeReport() {
  const { currentUser } = useAuthStore();
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [studentReports, setStudentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        setError(null);

        // 학생이 수강하는 반 목록 조회
        const classroomResponse = await getStudentClassrooms(currentUser.uid);
        console.log('학생 수업 목록:', classroomResponse);

        if (classroomResponse.success) {
          // 승인된 수업만 필터링
          const approvedClasses = classroomResponse.data.filter(
            item => item.status === 'APPROVED'
          );
          setClasses(approvedClasses);

          // 학생의 성적표 조회
          const reportsResponse = await getReportsByStudent(currentUser.uid);
          console.log('학생 성적표:', reportsResponse);

          if (reportsResponse.success) {
            setStudentReports(reportsResponse.data);
          } else {
            console.warn('성적표를 가져올 수 없습니다:', reportsResponse.error);
            setStudentReports([]);
          }
        } else {
          setError(
            classroomResponse.error || '수업 목록을 불러올 수 없습니다.'
          );
        }
      } catch (err) {
        console.error('데이터 조회 중 오류 발생:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const toggleClassExpansion = classId => {
    if (expandedClasses.has(classId)) {
      setExpandedClasses(new Set());
    } else {
      setExpandedClasses(new Set([classId]));
    }
  };

  const handleGradeClick = grade => {
    // reportId 추가하여 모달에 전달
    const gradeWithReportId = {
      ...grade,
      reportId: grade.uid, // report의 uid가 reportId
      title: grade.reportTitle,
    };
    setSelectedGrade(gradeWithReportId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGrade(null);
  };

  // 특정 반의 성적표 목록 가져오기
  const getReportsForClass = classroomUid => {
    // 해당 교실의 성적표만 필터링
    return studentReports.filter(report => report.classroomId === classroomUid);
  };

  if (loading) {
    return (
      <div className='grade-report-container'>
        <div className='grade-report-header'>
          <h2>성적 확인</h2>
        </div>
        <div className='loading-message'>
          <p>성적 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='grade-report-container'>
        <div className='grade-report-header'>
          <h2>성적 확인</h2>
        </div>
        <div className='error-message'>
          <p>오류: {error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className='grade-report-container'>
        <div className='grade-report-header'>
          <h2>성적 확인</h2>
        </div>
        <div className='empty-message'>
          <p>승인된 수업이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='grade-report-container'>
        <div className='grade-report-header'>
          <h2>성적 확인</h2>
        </div>

        <div className='classes-list'>
          {classes.map(classItem => {
            const classReports = getReportsForClass(classItem.classroom.uid);

            return (
              <div key={classItem.uid} className='class-section'>
                <div
                  className='class-header'
                  onClick={() => toggleClassExpansion(classItem.uid)}
                >
                  <div className='class-info'>
                    <h3>{classItem.classroom.classroomName}</h3>
                    <p>
                      {classItem.classroom.description ||
                        '수업 설명이 없습니다.'}
                    </p>
                  </div>
                  <div
                    className={`class-expand-icon ${
                      expandedClasses.has(classItem.uid) ? 'expanded' : ''
                    }`}
                  >
                    {'>'}
                  </div>
                </div>

                {expandedClasses.has(classItem.uid) && (
                  <div className='grade-cards-grid'>
                    {classReports.length > 0 ? (
                      classReports.map(report => (
                        <div
                          key={report.uid}
                          className='grade-card'
                          onClick={() => handleGradeClick(report)}
                        >
                          <div className='grade-header'>
                            <h4>{report.reportTitle}</h4>
                            <span className='grade-subject'>
                              {classItem.classroom.classroomName}
                            </span>
                          </div>
                          <div className='grade-content'>
                            <div className='grade-summary'>
                              <div className='summary-item'>
                                <span className='summary-label'>생성일:</span>
                                <span className='summary-value'>
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className='summary-item'>
                                <span className='summary-label'>설명:</span>
                                <span className='summary-value'>
                                  {report.reportDescription || '설명 없음'}
                                </span>
                              </div>
                              {report.studentReport?.feedback && (
                                <div className='summary-item'>
                                  <span className='summary-label'>피드백:</span>
                                  <span className='summary-value'>
                                    {report.studentReport.feedback}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='grade-actions'>
                            <button className='view-detail-btn'>
                              자세히 보기
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='no-grades-message'>
                        <p>아직 성적표가 없습니다.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 성적 상세 모달 */}
      <GradeDetailModal
        grade={selectedGrade}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default GradeReport;
