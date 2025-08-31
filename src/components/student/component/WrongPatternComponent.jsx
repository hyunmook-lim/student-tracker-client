import React, { useEffect, useCallback } from 'react';
import WrongPatternModal from '../modal/WrongPatternModal';
import WrongPatternStatsComponent from './WrongPatternStatsComponent';
import { useWrongPatternStore, useAuthStore } from '../../../store';
import './WrongPatternComponent.css';

function WrongPatternComponent() {
  const {
    isLoading,
    error,
    selectedClass,
    isModalOpen,
    fetchStudentAnalytics,
    fetchClassroomStudentAnalytics,
    selectClassAndOpenModal,
    closeModal,
    getProcessedAnalytics,
    getProcessedClassroomAnalytics,
  } = useWrongPatternStore();

  const { currentUser } = useAuthStore();

  const loadAnalytics = useCallback(() => {
    console.log('WrongPatternComponent - loadAnalytics 함수 호출됨');
    console.log('WrongPatternComponent - currentUser 전체:', currentUser);

    const studentId = currentUser?.uid || currentUser?.id;
    console.log('WrongPatternComponent - studentId 추출 결과:', studentId);
    console.log('WrongPatternComponent - currentUser?.uid:', currentUser?.uid);
    console.log('WrongPatternComponent - currentUser?.id:', currentUser?.id);

    if (studentId) {
      console.log(
        'WrongPatternComponent - fetchStudentAnalytics 호출 시작, ID:',
        studentId
      );
      fetchStudentAnalytics(studentId)
        .then(result => {
          console.log(
            'WrongPatternComponent - fetchStudentAnalytics 완료:',
            result
          );
        })
        .catch(error => {
          console.error(
            'WrongPatternComponent - fetchStudentAnalytics 에러:',
            error
          );
        });
    } else {
      console.warn(
        'WrongPatternComponent - studentId를 찾을 수 없음, currentUser:',
        currentUser
      );
    }
  }, [currentUser?.uid, currentUser?.id, fetchStudentAnalytics]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    console.log('WrongPatternComponent mounted - 오답패턴 분석 탭 클릭됨');

    // 임시 테스트: currentUser가 없으면 테스트 ID 사용
    if (!currentUser?.uid && !currentUser?.id) {
      console.log(
        'WrongPatternComponent - currentUser 없음, 테스트 ID로 API 호출'
      );
      fetchStudentAnalytics(1); // 임시 테스트 ID
    } else {
      loadAnalytics();
    }
  }, []);

  const handleTopicClick = async (classroomId, classroomName) => {
    console.log('WrongPatternComponent - handleTopicClick 호출됨');
    console.log(
      'WrongPatternComponent - classroomId:',
      classroomId,
      'classroomName:',
      classroomName
    );

    const studentId = currentUser?.uid || currentUser?.id;

    if (!studentId) {
      console.error('WrongPatternComponent - studentId를 찾을 수 없음');
      return;
    }

    try {
      // 반별 분석 데이터 조회
      console.log('WrongPatternComponent - 반별 분석 데이터 조회 시작');
      await fetchClassroomStudentAnalytics(studentId, classroomId);

      // 처리된 데이터 가져오기
      const processedData = getProcessedClassroomAnalytics(classroomId);
      console.log('WrongPatternComponent - 처리된 반별 데이터:', processedData);

      if (processedData) {
        selectClassAndOpenModal(processedData);
      } else {
        console.error('WrongPatternComponent - 반별 데이터 처리 실패');
      }
    } catch (error) {
      console.error('WrongPatternComponent - 반별 데이터 조회 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='wrong-pattern-container'>
        <div className='loading-state'>
          <div className='loading-spinner'></div>
          <p>오답 패턴을 분석하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='wrong-pattern-container'>
        <div className='error-state'>
          <h3>❌ 데이터를 불러올 수 없습니다</h3>
          <p>{error}</p>
          <button
            onClick={() => {
              const studentId = currentUser?.uid || currentUser?.id;
              if (studentId) fetchStudentAnalytics(studentId);
            }}
            className='retry-button'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const processedData = getProcessedAnalytics();

  if (!processedData) {
    return (
      <div className='wrong-pattern-container'>
        <div className='no-data-state'>
          <h3>📊 분석할 데이터가 없습니다</h3>
          <p>문제를 풀어보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className='wrong-pattern-container'>
      <div className='wrong-pattern-header'>
        <h2>오답패턴 분석</h2>
      </div>

      {/* 전체 통계 섹션 */}
      <WrongPatternStatsComponent />

      {/* 수강 중인 수업 목록 */}
      <div className='classes-grid'>
        {currentUser?.classroomNames && currentUser.classroomNames.length > 0
          ? currentUser.classroomNames.map((classroomName, index) => {
              const classroomId = currentUser.classroomIds?.[index];

              return (
                <div
                  key={classroomId || index}
                  className='class-card'
                  onClick={() => handleTopicClick(classroomId, classroomName)}
                >
                  <div className='class-info'>
                    <h3>📚 {classroomName}</h3>
                    <p>{classroomName} 수업의 오답 패턴 분석</p>
                  </div>
                </div>
              );
            })
          : // 반 정보가 없는 경우 샘플 반 데이터 표시
            [
              {
                name: 'JavaScript 기초반',
                description: 'JavaScript 기본 문법과 개념을 학습하는 반입니다',
              },
              {
                name: 'React 심화반',
                description: 'React 고급 기능과 상태 관리를 배우는 반입니다',
              },
              {
                name: '알고리즘 문제해결반',
                description:
                  '코딩테스트와 알고리즘 문제 해결 능력을 기르는 반입니다',
              },
            ].map((classInfo, index) => {
              return (
                <div
                  key={index}
                  className='class-card'
                  onClick={() => handleTopicClick(index + 1, classInfo.name)}
                >
                  <div className='class-info'>
                    <h3>📚 {classInfo.name}</h3>
                    <p>{classInfo.description}</p>
                  </div>
                </div>
              );
            })}
      </div>

      <WrongPatternModal
        classData={selectedClass}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default WrongPatternComponent;
