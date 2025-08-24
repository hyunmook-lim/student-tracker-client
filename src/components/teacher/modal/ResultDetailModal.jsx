import React from 'react';
import './ResultDetailModal.css';

function ResultDetailModal({
  isOpen,
  onClose,
  selectedLecture,
  classrooms,
  expandedClass,
}) {
  if (!isOpen || !selectedLecture) return null;

  // 학생 데이터를 가져와서 정렬하는 함수
  const getSortedStudents = () => {
    const classroom = classrooms.find(c => c.id === expandedClass);
    if (!classroom?.students) return [];

    // 실제 데이터 구조에 맞게 학생 정보 매핑
    const studentsWithData = classroom.students.map(student => {
      const studentData = {
        id: student.id,
        name: student.name,
        attendance: student.attendance || '출석',
        examScore: student.examScore,
        examTotal: student.examTotal || 100,
        assignmentGrade: student.assignmentGrade,
      };

      return studentData;
    });

    // 출석한 학생들과 결석한 학생들을 분리
    const presentStudents = studentsWithData.filter(
      s => s.attendance !== '결석'
    );
    const absentStudents = studentsWithData.filter(
      s => s.attendance === '결석'
    );

    // 과제 등급을 점수로 변환하는 함수 (정렬용)
    const gradeToScore = grade => {
      switch (grade) {
        case 'A':
          return 4;
        case 'B':
          return 3;
        case 'C':
          return 2;
        case 'D':
          return 1;
        default:
          return 0;
      }
    };

    // 출석한 학생들을 정렬 (시험점수 → 과제등급 → 이름순)
    const sortedPresentStudents = presentStudents
      .sort((a, b) => {
        // 시험점수 순서대로 정렬 (높은 점수가 위로)
        if (a.examScore !== b.examScore) {
          return b.examScore - a.examScore;
        }
        // 시험점수가 같으면 과제 등급순 (A > B > C > D)
        const aGradeScore = gradeToScore(a.assignmentGrade);
        const bGradeScore = gradeToScore(b.assignmentGrade);
        if (aGradeScore !== bGradeScore) {
          return bGradeScore - aGradeScore;
        }
        // 과제등급까지 같으면 이름순
        return a.name.localeCompare(b.name);
      })
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }));

    // 결석한 학생들을 이름순으로 정렬하고 순위는 출석한 학생 다음부터
    const sortedAbsentStudents = absentStudents
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((student, index) => ({
        ...student,
        rank: sortedPresentStudents.length + index + 1,
      }));

    // 출석한 학생들을 먼저, 그 다음에 결석한 학생들을 배치
    return [...sortedPresentStudents, ...sortedAbsentStudents];
  };

  const sortedStudents = getSortedStudents();

  return (
    <div className='result-detail-modal-overlay' onClick={onClose}>
      <div
        className='result-detail-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='result-detail-modal-header'>
          <h3>{selectedLecture.title} - 학생 결과</h3>
          <button className='result-detail-modal-close' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='result-detail-modal-body'>
          <div className='result-detail-results-display'>
            <div className='result-detail-results-table'>
              <div className='result-detail-table-header'>
                <span>순위</span>
                <span>출석</span>
                <span>학생명</span>
                <span>시험 점수</span>
                <span>과제 점수</span>
              </div>
              {sortedStudents.map(student => (
                <div key={student.id} className='result-detail-table-row'>
                  <span className='result-detail-rank'>{student.rank}등</span>
                  <span
                    className={`result-detail-attendance ${
                      student.attendance === '출석' ? 'present' : 'absent'
                    }`}
                  >
                    {student.attendance}
                  </span>
                  <span className='result-detail-name'>{student.name}</span>
                  <span className='result-detail-exam-score'>
                    {student.examScore
                      ? `${student.examScore}점 / ${student.examTotal}점`
                      : '-'}
                  </span>
                  <span
                    className={`result-detail-assignment-score ${
                      student.assignmentGrade || ''
                    }`}
                  >
                    {student.assignmentGrade || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultDetailModal;
