import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store';
import { getTeacherClassrooms } from '../../../api/classroomApi';
import { getLecturesByClassroom } from '../../../api/lectureApi';
import { getReportsByClassroom } from '../../../api/reportApi';
import ReportGenerationModal from '../modal/ReportGenerationModal';
import './ReportGenerationComponent.css';

function ReportGenerationComponent() {
  const { currentUser } = useAuthStore();
  const [apiClassrooms, setApiClassrooms] = useState([]);
  const [classroomLectures, setClassroomLectures] = useState({});
  const [classroomReports, setClassroomReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [loadingReports, setLoadingReports] = useState({});

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

  // 특정 반의 성적표 목록 가져오기
  const fetchReportsForClassroom = async classroomId => {
    try {
      setLoadingReports(prev => ({ ...prev, [classroomId]: true }));

      const result = await getReportsByClassroom(classroomId);
      if (result.success) {
        console.log(
          `반 ${classroomId} 성적표 목록 가져오기 성공:`,
          result.data
        );
        setClassroomReports(prev => ({
          ...prev,
          [classroomId]: result.data,
        }));
      } else {
        console.error(
          `반 ${classroomId} 성적표 목록 가져오기 실패:`,
          result.error
        );
        // 실패 시 빈 배열로 설정
        setClassroomReports(prev => ({
          ...prev,
          [classroomId]: [],
        }));
      }
    } catch (error) {
      console.error(`반 ${classroomId} 성적표 목록 가져오기 오류:`, error);
      // 에러 시 빈 배열로 설정
      setClassroomReports(prev => ({
        ...prev,
        [classroomId]: [],
      }));
    } finally {
      setLoadingReports(prev => ({ ...prev, [classroomId]: false }));
    }
  };

  // 반을 클릭할 때 강의 목록과 성적표 목록 가져오기
  const handleClassroomClick = classroomId => {
    const newExpandedClasses = new Set(expandedClasses);
    if (expandedClasses.has(classroomId)) {
      newExpandedClasses.delete(classroomId);
    } else {
      newExpandedClasses.add(classroomId);
      if (!classroomLectures[classroomId]) {
        fetchLecturesForClassroom(classroomId);
      }
      if (!classroomReports[classroomId]) {
        fetchReportsForClassroom(classroomId);
      }
    }
    setExpandedClasses(newExpandedClasses);
  };

  const handleGenerateReport = classroom => {
    setSelectedClassroom(classroom);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClassroom(null);
  };

  // 성적표 삭제 함수 (추후 구현)
  const handleDeleteReport = async reportId => {
    // TODO: 실제 삭제 기능 구현
    console.log('성적표 삭제:', reportId);
    if (window.confirm('성적표를 삭제하시겠습니까?')) {
      alert('삭제 기능은 추후 구현될 예정입니다.');
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className='report-generation-container'>
        <div className='report-generation-header'>
          <h2>성적표 생성</h2>
        </div>
        <div className='loading-message'>반 목록을 불러오는 중...</div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className='report-generation-container'>
        <div className='report-generation-header'>
          <h2>성적표 생성</h2>
        </div>
        <div className='error-message'>
          반 목록을 불러오는데 실패했습니다: {error}
        </div>
      </div>
    );
  }

  return (
    <div className='report-generation-container'>
      <div className='report-generation-header'>
        <h2>성적표 생성</h2>
      </div>

      <div className='classroom-list'>
        {apiClassrooms.map(classroom => {
          const reports = classroomReports[classroom.uid] || [];
          const isLoadingReports = loadingReports[classroom.uid];

          return (
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
                    className='btn btn-generate'
                    onClick={e => {
                      e.stopPropagation();
                      handleGenerateReport(classroom);
                    }}
                  >
                    성적표 생성
                  </button>
                </div>
              </div>

              {expandedClasses.has(classroom.uid) && (
                <div className='reports-section'>
                  <div className='reports-header'>
                    <h4>생성된 성적표 목록</h4>
                  </div>

                  {isLoadingReports ? (
                    <div className='loading-reports'>
                      <p>성적표 목록을 불러오는 중...</p>
                    </div>
                  ) : (
                    <div className='reports-list'>
                      {reports.length > 0 ? (
                        reports.map(report => (
                          <div key={report.uid} className='report-card'>
                            <div className='report-card-header'>
                              <h5 className='report-title'>
                                {report.reportTitle}
                              </h5>
                              <div className='report-actions'>
                                <button
                                  className='btn btn-delete'
                                  onClick={() => handleDeleteReport(report.uid)}
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                            <div className='report-card-content'>
                              <p className='report-description'>
                                {report.reportDescription}
                              </p>
                              <div className='report-meta'>
                                <span className='report-date'>
                                  생성일:{' '}
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString('ko-KR')}
                                </span>
                                <span className='report-lectures'>
                                  포함 강의:{' '}
                                  {report.lectures ? report.lectures.length : 0}
                                  개
                                </span>
                                <span className='report-students'>
                                  대상 학생:{' '}
                                  {report.students ? report.students.length : 0}
                                  명
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='empty-message'>
                          <p>아직 생성된 성적표가 없습니다.</p>
                          <small>
                            위의 '성적표 생성' 버튼을 클릭하여 성적표를
                            생성해보세요.
                          </small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ReportGenerationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedClassroom={selectedClassroom}
      />
    </div>
  );
}

export default ReportGenerationComponent;
