import React, { useState, useEffect } from 'react';
import { getLecturesByClassroom } from '../../../api/lectureApi';
import StudentFeedbackModal from './StudentFeedbackModal';
import './ReportGenerationModal.css';

function ReportGenerationModal({ isOpen, onClose, selectedClassroom }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLectures, setSelectedLectures] = useState(new Set());
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (isOpen && selectedClassroom) {
      fetchLectures();
    }
  }, [isOpen, selectedClassroom]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const result = await getLecturesByClassroom(selectedClassroom.uid);
      if (result.success) {
        console.log('강의 목록 가져오기 성공:', result.data);
        setLectures(
          result.data.sort((a, b) => {
            const dateA = a.lectureDate
              ? new Date(a.lectureDate)
              : new Date('9999-12-31');
            const dateB = b.lectureDate
              ? new Date(b.lectureDate)
              : new Date('9999-12-31');
            return dateA.getTime() - dateB.getTime();
          })
        );
      } else {
        console.error('강의 목록 가져오기 실패:', result.error);
        setLectures([]);
      }
    } catch (error) {
      console.error('강의 목록 가져오기 오류:', error);
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLectureSelect = lectureId => {
    const newSelected = new Set(selectedLectures);
    if (newSelected.has(lectureId)) {
      newSelected.delete(lectureId);
    } else {
      newSelected.add(lectureId);
    }
    setSelectedLectures(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedLectures.size === lectures.length) {
      setSelectedLectures(new Set());
    } else {
      setSelectedLectures(
        new Set(lectures.map(lecture => lecture.uid || lecture.id))
      );
    }
  };

  const handleGenerateReport = () => {
    if (!reportTitle.trim()) {
      alert('성적표 제목을 입력해주세요.');
      return;
    }

    if (selectedLectures.size === 0) {
      alert('성적표를 생성할 회차를 선택해주세요.');
      return;
    }

    const selectedLectureData = lectures.filter(lecture =>
      selectedLectures.has(lecture.uid || lecture.id)
    );

    const reportInfo = {
      title: reportTitle,
      description: reportDescription,
      classroom: selectedClassroom,
      lectures: selectedLectureData,
    };

    setReportData(reportInfo);
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setReportData(null);
    // 성적표 생성이 완료되면 ReportGenerationModal도 닫기
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='report-generation-modal-overlay'>
      <div className='report-modal'>
        <div className='modal-header'>
          <h2>성적표 생성</h2>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='modal-content'>
          <div className='report-info-section'>
            <div className='input-group'>
              <label htmlFor='report-title'>제목</label>
              <input
                id='report-title'
                type='text'
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
                placeholder='예: 2024년 1학기 중간고사 성적표'
                maxLength={50}
              />
            </div>

            <div className='input-group'>
              <label htmlFor='report-description'>설명</label>
              <textarea
                id='report-description'
                value={reportDescription}
                onChange={e => setReportDescription(e.target.value)}
                placeholder='예: 중간고사 범위는 1-5단원이며, 객관식 20문항, 주관식 5문항으로 구성되었습니다.'
                maxLength={200}
                rows={3}
              />
            </div>
          </div>

          <div className='lectures-selection-section'>
            <div className='lectures-header'>
              <h4>회차 선택</h4>
              <div className='selection-controls'>
                <button className='select-all-btn' onClick={handleSelectAll}>
                  {selectedLectures.size === lectures.length
                    ? '전체 해제'
                    : '전체 선택'}
                </button>
                <span className='selection-count'>
                  {selectedLectures.size}/{lectures.length}개 선택됨
                </span>
              </div>
            </div>

            {loading ? (
              <div className='loading-message'>회차 목록을 불러오는 중...</div>
            ) : (
              <div className='lectures-grid'>
                {lectures.map((lecture, index) => {
                  const isSelected = selectedLectures.has(
                    lecture.uid || lecture.id
                  );
                  const hasResults = lecture.resultEntered || false;

                  return (
                    <div
                      key={lecture.uid || lecture.id}
                      className={`lecture-card ${isSelected ? 'selected' : ''} ${!hasResults ? 'no-results' : ''}`}
                      onClick={() =>
                        handleLectureSelect(lecture.uid || lecture.id)
                      }
                    >
                      <div className='lecture-card-content'>
                        <div className='lecture-number'>{index + 1}회차</div>
                        <div className='lecture-info-row'>
                          <h5>{lecture.lectureName}</h5>
                          <p className='lecture-date'>
                            {lecture.lectureDate
                              ? lecture.lectureDate.split('T')[0]
                              : '날짜 미정'}
                          </p>
                        </div>
                        {!hasResults && (
                          <p className='no-results-warning'>성적 미입력</p>
                        )}
                      </div>

                      <div className='selection-indicator'>
                        {isSelected && <span>✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className='modal-footer'>
          <button className='cancel-btn' onClick={onClose}>
            취소
          </button>
          <button
            className='generate-btn'
            onClick={handleGenerateReport}
            disabled={selectedLectures.size === 0 || !reportTitle.trim()}
          >
            성적표 생성 ({selectedLectures.size}개 회차)
          </button>
        </div>
      </div>

      {/* StudentFeedbackModal */}
      <StudentFeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedbackModal}
        reportData={reportData}
      />
    </div>
  );
}

export default ReportGenerationModal;
