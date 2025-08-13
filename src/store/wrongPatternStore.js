import { create } from 'zustand';

const useWrongPatternStore = create((set, get) => ({
  // 상태
  classes: [
    {
      id: 1,
      name: '웹 개발 기초',
      description: 'HTML, CSS, JavaScript 기초부터 심화까지',
      totalQuestions: 120,
      wrongQuestions: 18,
      wrongRate: 15,
      wrongPatterns: [
        { pattern: 'JavaScript 변수 스코프', count: 5, percentage: 28 },
        { pattern: 'CSS Flexbox 레이아웃', count: 4, percentage: 22 },
        { pattern: 'HTML 시맨틱 태그', count: 3, percentage: 17 },
        { pattern: '이벤트 버블링', count: 3, percentage: 17 },
        { pattern: '비동기 처리', count: 3, percentage: 17 },
      ],
    },
    {
      id: 2,
      name: 'React 심화',
      description: 'React Hooks, 상태 관리, 최적화 기법',
      totalQuestions: 85,
      wrongQuestions: 12,
      wrongRate: 14,
      wrongPatterns: [
        { pattern: 'useEffect 의존성 배열', count: 4, percentage: 33 },
        { pattern: 'Context API 사용법', count: 3, percentage: 25 },
        { pattern: '메모이제이션 최적화', count: 2, percentage: 17 },
        { pattern: '커스텀 훅 설계', count: 2, percentage: 17 },
        { pattern: '상태 관리 패턴', count: 1, percentage: 8 },
      ],
    },
    {
      id: 3,
      name: '데이터베이스 설계',
      description: 'SQL, 데이터 모델링, 성능 최적화',
      totalQuestions: 95,
      wrongQuestions: 8,
      wrongRate: 8,
      wrongPatterns: [
        { pattern: '복합 인덱스 설계', count: 3, percentage: 38 },
        { pattern: '정규화 과정', count: 2, percentage: 25 },
        { pattern: '트랜잭션 격리 수준', count: 2, percentage: 25 },
        { pattern: '서브쿼리 최적화', count: 1, percentage: 12 },
      ],
    },
    {
      id: 4,
      name: '알고리즘 기초',
      description: '자료구조, 정렬, 검색 알고리즘',
      totalQuestions: 150,
      wrongQuestions: 25,
      wrongRate: 17,
      wrongPatterns: [
        { pattern: '재귀 함수 구현', count: 8, percentage: 32 },
        { pattern: '그래프 탐색', count: 6, percentage: 24 },
        { pattern: '동적 프로그래밍', count: 5, percentage: 20 },
        { pattern: '이진 탐색', count: 3, percentage: 12 },
        { pattern: '정렬 알고리즘', count: 3, percentage: 12 },
      ],
    },
    {
      id: 5,
      name: '네트워크 보안',
      description: 'HTTP, HTTPS, 인증, 암호화',
      totalQuestions: 110,
      wrongQuestions: 15,
      wrongRate: 14,
      wrongPatterns: [
        { pattern: 'JWT 토큰 구조', count: 5, percentage: 33 },
        { pattern: 'HTTPS 핸드셰이크', count: 4, percentage: 27 },
        { pattern: 'CORS 정책', count: 3, percentage: 20 },
        { pattern: 'XSS 공격 방어', count: 2, percentage: 13 },
        { pattern: 'SQL 인젝션', count: 1, percentage: 7 },
      ],
    },
    {
      id: 6,
      name: '클라우드 컴퓨팅',
      description: 'AWS, Docker, Kubernetes',
      totalQuestions: 130,
      wrongQuestions: 20,
      wrongRate: 15,
      wrongPatterns: [
        { pattern: 'Docker 컨테이너 네트워킹', count: 6, percentage: 30 },
        { pattern: 'Kubernetes Pod 관리', count: 5, percentage: 25 },
        { pattern: 'AWS IAM 정책', count: 4, percentage: 20 },
        { pattern: '로드 밸런서 설정', count: 3, percentage: 15 },
        { pattern: '스토리지 클래스', count: 2, percentage: 10 },
      ],
    },
  ],

  selectedClass: null,
  isModalOpen: false,

  // 액션
  setSelectedClass: classData => set({ selectedClass: classData }),

  openModal: () => set({ isModalOpen: true }),

  closeModal: () => set({ isModalOpen: false, selectedClass: null }),

  selectClassAndOpenModal: classData =>
    set({ selectedClass: classData, isModalOpen: true }),

  // 수업 관련 액션
  addClass: classData =>
    set(state => ({
      classes: [...state.classes, { ...classData, id: Date.now() }],
    })),

  updateClass: (id, updates) =>
    set(state => ({
      classes: state.classes.map(classItem =>
        classItem.id === id ? { ...classItem, ...updates } : classItem
      ),
    })),

  deleteClass: id =>
    set(state => ({
      classes: state.classes.filter(classItem => classItem.id !== id),
    })),

  // 오답패턴 관련 액션
  addWrongPattern: (classId, pattern) =>
    set(state => ({
      classes: state.classes.map(classItem =>
        classItem.id === classId
          ? {
              ...classItem,
              wrongPatterns: [...classItem.wrongPatterns, pattern],
              wrongQuestions: classItem.wrongQuestions + pattern.count,
              totalQuestions: classItem.totalQuestions + pattern.count,
            }
          : classItem
      ),
    })),

  updateWrongPattern: (classId, patternIndex, updates) =>
    set(state => ({
      classes: state.classes.map(classItem =>
        classItem.id === classId
          ? {
              ...classItem,
              wrongPatterns: classItem.wrongPatterns.map((pattern, index) =>
                index === patternIndex ? { ...pattern, ...updates } : pattern
              ),
            }
          : classItem
      ),
    })),

  deleteWrongPattern: (classId, patternIndex) =>
    set(state => ({
      classes: state.classes.map(classItem =>
        classItem.id === classId
          ? {
              ...classItem,
              wrongPatterns: classItem.wrongPatterns.filter(
                (_, index) => index !== patternIndex
              ),
            }
          : classItem
      ),
    })),

  // 통계 계산 헬퍼 함수
  getClassStats: classId => {
    const state = get();
    const classItem = state.classes.find(c => c.id === classId);
    if (!classItem) return null;

    return {
      totalQuestions: classItem.totalQuestions,
      wrongQuestions: classItem.wrongQuestions,
      wrongRate: classItem.wrongRate,
      patternsCount: classItem.wrongPatterns.length,
    };
  },

  getWrongRateColor: rate => {
    if (rate <= 10) return '#10b981'; // 녹색
    if (rate <= 20) return '#f59e0b'; // 주황색
    return '#ef4444'; // 빨간색
  },

  getSeverityColor: percentage => {
    if (percentage >= 30) return '#ef4444'; // 높음 - 빨간색
    if (percentage >= 15) return '#f59e0b'; // 중간 - 주황색
    return '#10b981'; // 낮음 - 녹색
  },

  getSeverityText: percentage => {
    if (percentage >= 30) return '높음';
    if (percentage >= 15) return '중간';
    return '낮음';
  },

  // 필터링 및 정렬
  getClassesByWrongRate: (minRate = 0, maxRate = 100) =>
    get().classes.filter(
      classItem =>
        classItem.wrongRate >= minRate && classItem.wrongRate <= maxRate
    ),

  getTopWrongPatterns: (classId, limit = 5) => {
    const state = get();
    const classItem = state.classes.find(c => c.id === classId);
    if (!classItem) return [];

    return classItem.wrongPatterns
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, limit);
  },

  // 전체 통계
  getOverallStats: () => {
    const state = get();
    const totalQuestions = state.classes.reduce(
      (sum, classItem) => sum + classItem.totalQuestions,
      0
    );
    const totalWrongQuestions = state.classes.reduce(
      (sum, classItem) => sum + classItem.wrongQuestions,
      0
    );
    const averageWrongRate =
      state.classes.reduce((sum, classItem) => sum + classItem.wrongRate, 0) /
      state.classes.length;

    return {
      totalClasses: state.classes.length,
      totalQuestions,
      totalWrongQuestions,
      averageWrongRate: Math.round(averageWrongRate * 10) / 10,
    };
  },
}));

export default useWrongPatternStore;
