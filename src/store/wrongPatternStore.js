import { create } from 'zustand';
import {
  getStudentAnalytics,
  getClassroomStudentAnalytics,
} from '../api/studentAnalyticsApi';

const useWrongPatternStore = create((set, get) => ({
  // 상태
  analyticsData: null,
  classroomAnalyticsData: {}, // classroomId별 분석 데이터를 저장
  isLoading: false,
  error: null,
  selectedClass: null,
  isModalOpen: false,

  // API 연동 액션
  fetchStudentAnalytics: async studentId => {
    console.log('wrongPatternStore - fetchStudentAnalytics 호출됨');
    console.log('wrongPatternStore - studentId:', studentId);

    set({ isLoading: true, error: null });
    console.log('wrongPatternStore - 로딩 상태로 변경');

    try {
      console.log('wrongPatternStore - getStudentAnalytics 호출 시작');
      const result = await getStudentAnalytics(studentId);
      console.log('wrongPatternStore - API 응답 전체:', result);

      if (result.success) {
        const data = result.data;
        console.log('wrongPatternStore - API 응답 성공:', data);

        set({
          analyticsData: data,
          isLoading: false,
          error: null,
        });
        console.log('wrongPatternStore - store 상태 업데이트 완료');
        return data;
      } else {
        console.error('wrongPatternStore - API 응답 실패:', result.error);
        set({
          error: result.error || '데이터를 불러오는데 실패했습니다.',
          isLoading: false,
        });
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('wrongPatternStore - API 요청 실패:', error);
      set({
        error: error.message || '데이터를 불러오는데 실패했습니다.',
        isLoading: false,
      });
      console.error('wrongPatternStore - 에러 상태로 변경:', error.message);
      throw error;
    }
  },

  // 반별 분석 데이터 조회
  fetchClassroomStudentAnalytics: async (studentId, classroomId) => {
    console.log('wrongPatternStore - fetchClassroomStudentAnalytics 호출됨');
    console.log(
      'wrongPatternStore - studentId:',
      studentId,
      'classroomId:',
      classroomId
    );

    set(state => ({
      ...state,
      isLoading: true,
      error: null,
    }));

    try {
      console.log('wrongPatternStore - getClassroomStudentAnalytics 호출 시작');
      const result = await getClassroomStudentAnalytics(studentId, classroomId);
      console.log('wrongPatternStore - 반별 API 응답 전체:', result);

      if (result.success) {
        const data = result.data;
        console.log('wrongPatternStore - 반별 API 응답 성공:', data);

        set(state => ({
          ...state,
          classroomAnalyticsData: {
            ...state.classroomAnalyticsData,
            [classroomId]: data,
          },
          isLoading: false,
          error: null,
        }));
        console.log('wrongPatternStore - 반별 데이터 store 상태 업데이트 완료');
        return data;
      } else {
        console.error('wrongPatternStore - 반별 API 응답 실패:', result.error);
        set(state => ({
          ...state,
          error: result.error || '반별 데이터를 불러오는데 실패했습니다.',
          isLoading: false,
        }));
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('wrongPatternStore - 반별 API 요청 실패:', error);
      set(state => ({
        ...state,
        error: error.message || '반별 데이터를 불러오는데 실패했습니다.',
        isLoading: false,
      }));
      console.error(
        'wrongPatternStore - 반별 에러 상태로 변경:',
        error.message
      );
      throw error;
    }
  },

  // 모달 관련 액션
  setSelectedClass: classData => set({ selectedClass: classData }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, selectedClass: null }),
  selectClassAndOpenModal: classData =>
    set({ selectedClass: classData, isModalOpen: true }),

  // 데이터 변환 헬퍼 함수
  getProcessedAnalytics: () => {
    const state = get();
    const { analyticsData } = state;

    if (!analyticsData) return null;

    return {
      overview: {
        totalClassrooms: analyticsData.totalClassrooms,
        totalQuestions: analyticsData.totalQuestions,
        totalWrongAnswers: analyticsData.totalWrongAnswers,
        wrongAnswerRate: analyticsData.wrongAnswerRate,
      },
      mainTopicPatterns: analyticsData.wrongAnswersByMainTopic || [],
      subTopicPatterns: analyticsData.wrongAnswersBySubTopic || [],
      difficultyPatterns: analyticsData.wrongAnswersByDifficulty || [],
    };
  },

  // 반별 분석 데이터 조회
  getClassroomAnalytics: classroomId => {
    const state = get();
    return state.classroomAnalyticsData[classroomId] || null;
  },

  // 반별 데이터를 모달용으로 반환 (원본 API 데이터 그대로 전달)
  getProcessedClassroomAnalytics: classroomId => {
    const state = get();
    const classroomData = state.classroomAnalyticsData[classroomId];

    if (!classroomData) return null;

    // 원본 API 응답 데이터를 그대로 반환
    return classroomData;
  },

  // UI 헬퍼 함수
  getWrongRateColor: rate => {
    if (rate <= 10) return '#10b981';
    if (rate <= 20) return '#f59e0b';
    return '#ef4444';
  },

  getSeverityColor: percentage => {
    if (percentage >= 30) return '#ef4444';
    if (percentage >= 15) return '#f59e0b';
    return '#10b981';
  },

  getSeverityText: percentage => {
    if (percentage >= 30) return '높음';
    if (percentage >= 15) return '중간';
    return '낮음';
  },

  // 차트 데이터 변환
  getChartData: () => {
    const state = get();
    const analytics = state.getProcessedAnalytics();

    if (!analytics) return null;

    return {
      mainTopicChart: analytics.mainTopicPatterns.map(item => ({
        name: item.topic,
        value: item.count,
        percentage: item.percentage,
      })),
      subTopicChart: analytics.subTopicPatterns.map(item => ({
        name: item.topic,
        value: item.count,
        percentage: item.percentage,
      })),
      difficultyChart: analytics.difficultyPatterns.map(item => ({
        name: item.difficulty,
        value: item.count,
        percentage: item.percentage,
      })),
    };
  },
}));

export default useWrongPatternStore;
