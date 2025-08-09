import React from 'react';
import { useClassroomStore } from '../store';
import './ResultList.css';

function ResultList() {
  const { classrooms, expandedClass, setExpandedClass } = useClassroomStore();

  const handleClassClick = classId => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  // 임시 결과 데이터 (실제로는 서버에서 가져올 데이터)
  const getResultsForClass = () => {
    const results = [
      {
        id: 1,
        sessionTitle: '1회차 - 수학 기초',
        date: '2024-01-15',
        students: [
          { id: 1, name: '김철수', score: 85, rank: 3, total: 100 },
          { id: 2, name: '이영희', score: 92, rank: 1, total: 100 },
          { id: 3, name: '박민수', score: 78, rank: 5, total: 100 },
          { id: 4, name: '정수진', score: 88, rank: 2, total: 100 },
          { id: 5, name: '최동현', score: 81, rank: 4, total: 100 },
        ],
      },
      {
        id: 2,
        sessionTitle: '2회차 - 방정식',
        date: '2024-01-22',
        students: [
          { id: 1, name: '김철수', score: 90, rank: 2, total: 100 },
          { id: 2, name: '이영희', score: 95, rank: 1, total: 100 },
          { id: 3, name: '박민수', score: 82, rank: 4, total: 100 },
          { id: 4, name: '정수진', score: 85, rank: 3, total: 100 },
          { id: 5, name: '최동현', score: 79, rank: 5, total: 100 },
        ],
      },
    ];
    return results;
  };

  const getGradeColor = score => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  };

  return (
    <div className='result-list-container'>
      <div className='result-list-header'>
        <h2>성적 결과</h2>
      </div>

      <div className='classroom-results'>
        {classrooms.map(classroom => (
          <div key={classroom.id} className='classroom-result-item'>
            <div
              className='classroom-header'
              onClick={() => handleClassClick(classroom.id)}
            >
              <div className='classroom-info'>
                <h3>{classroom.name}</h3>
                <p>{classroom.description}</p>
                <span>학생 수: {classroom.studentCount}명</span>
              </div>
              <div className='expand-icon'>
                {expandedClass === classroom.id ? '▼' : '▶'}
              </div>
            </div>

            {expandedClass === classroom.id && (
              <div className='results-section'>
                {getResultsForClass().map(result => (
                  <div key={result.id} className='session-result'>
                    <div className='session-info'>
                      <h4>{result.sessionTitle}</h4>
                      <span>{result.date}</span>
                    </div>
                    <div className='results-table'>
                      <div className='table-header'>
                        <span>순위</span>
                        <span>학생명</span>
                        <span>점수</span>
                        <span>만점</span>
                        <span>등급</span>
                      </div>
                      {result.students
                        .sort((a, b) => a.rank - b.rank)
                        .map(student => (
                          <div key={student.id} className='table-row'>
                            <span className='rank'>{student.rank}등</span>
                            <span className='name'>{student.name}</span>
                            <span className='score'>{student.score}점</span>
                            <span className='total'>{student.total}점</span>
                            <span
                              className={`grade ${getGradeColor(student.score)}`}
                            >
                              {student.score >= 90
                                ? 'A'
                                : student.score >= 80
                                  ? 'B'
                                  : student.score >= 70
                                    ? 'C'
                                    : 'D'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultList;
