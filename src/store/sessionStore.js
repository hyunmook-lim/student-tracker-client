import { create } from 'zustand';

const useSessionStore = create((set, get) => ({
  // 상태
  sessions: [
    {
      id: 1,
      title: '1회차 - 수학 기초',
      description: '수학의 기본 개념과 연산법칙',
      date: '2024-01-15',
      classroomId: 1,
    },
    {
      id: 2,
      title: '2회차 - 방정식',
      description: '1차 방정식 풀이 방법',
      date: '2024-01-22',
      classroomId: 1,
    },
    {
      id: 3,
      title: '3회차 - 함수',
      description: '함수의 개념과 그래프',
      date: '2024-01-29',
      classroomId: 1,
    },
    {
      id: 4,
      title: '1회차 - 영어 기초',
      description: '알파벳과 기본 인사말',
      date: '2024-01-16',
      classroomId: 2,
    },
    {
      id: 5,
      title: '2회차 - 문법 기초',
      description: '기본 문법 구조',
      date: '2024-01-23',
      classroomId: 2,
    },
  ],
  selectedSession: null,
  expandedClasses: new Set(),
  isSessionModalOpen: false,
  isQuestionModalOpen: false,
  newSessionData: {
    title: '',
    description: '',
    date: '',
    classroomId: null,
  },
  questions: [
    {
      id: 1,
      mainUnit: '',
      subUnit: '',
      type: '',
      difficulty: '',
      points: '',
    },
  ],

  // 액션
  setSelectedSession: session => set({ selectedSession: session }),

  toggleClassExpansion: classId =>
    set(state => {
      const newExpandedClasses = new Set(state.expandedClasses);
      if (newExpandedClasses.has(classId)) {
        newExpandedClasses.delete(classId);
      } else {
        newExpandedClasses.add(classId);
      }
      return { expandedClasses: newExpandedClasses };
    }),

  openSessionModal: () => set({ isSessionModalOpen: true }),
  closeSessionModal: () =>
    set({
      isSessionModalOpen: false,
      newSessionData: {
        title: '',
        description: '',
        date: '',
        classroomId: null,
      },
    }),

  openQuestionModal: () => set({ isQuestionModalOpen: true }),
  closeQuestionModal: () => set({ isQuestionModalOpen: false }),

  updateNewSessionData: (field, value) =>
    set(state => ({
      newSessionData: {
        ...state.newSessionData,
        [field]: value,
      },
    })),

  addSession: () => {
    const { newSessionData } = get();
    if (
      !newSessionData.title ||
      !newSessionData.date ||
      !newSessionData.classroomId
    ) {
      alert('모든 필드를 입력해주세요.');
      return false;
    }

    set(state => ({
      sessions: [
        ...state.sessions,
        {
          ...newSessionData,
          id: Date.now(),
        },
      ],
      isSessionModalOpen: false,
      newSessionData: {
        title: '',
        description: '',
        date: '',
        classroomId: null,
      },
    }));
    return true;
  },

  updateSession: (sessionId, updates) =>
    set(state => ({
      sessions: state.sessions.map(session =>
        session.id === sessionId ? { ...session, ...updates } : session
      ),
    })),

  deleteSession: sessionId =>
    set(state => ({
      sessions: state.sessions.filter(session => session.id !== sessionId),
    })),

  getSessionsByClassroom: classroomId => {
    const { sessions } = get();
    return sessions.filter(session => session.classroomId === classroomId);
  },

  // 문제 관리
  addQuestion: () =>
    set(state => ({
      questions: [
        ...state.questions,
        {
          id: Date.now(),
          mainUnit: '',
          subUnit: '',
          type: '',
          difficulty: '',
          points: '',
        },
      ],
    })),

  updateQuestion: (questionId, field, value) =>
    set(state => ({
      questions: state.questions.map(question =>
        question.id === questionId ? { ...question, [field]: value } : question
      ),
    })),

  removeQuestion: questionId =>
    set(state => ({
      questions: state.questions.filter(question => question.id !== questionId),
    })),

  resetQuestions: () =>
    set({
      questions: [
        {
          id: 1,
          mainUnit: '',
          subUnit: '',
          type: '',
          difficulty: '',
          points: '',
        },
      ],
    }),
}));

export default useSessionStore;
