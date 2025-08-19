import { create } from 'zustand';

const useLectureStore = create((set, get) => ({
  // 상태
  lectures: [
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
  selectedLecture: null,
  expandedClasses: new Set(),
  isLectureModalOpen: false,
  isQuestionModalOpen: false,
  newLectureData: {
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
      difficulty: '',
      points: '',
    },
  ],

  // 액션
  setSelectedLecture: lecture => set({ selectedLecture: lecture }),

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

  openLectureModal: () => set({ isLectureModalOpen: true }),
  closeLectureModal: () =>
    set({
      isLectureModalOpen: false,
      newLectureData: {
        title: '',
        description: '',
        date: '',
        classroomId: null,
      },
    }),

  openQuestionModal: () => set({ isQuestionModalOpen: true }),
  closeQuestionModal: () => set({ isQuestionModalOpen: false }),

  updateNewLectureData: (field, value) =>
    set(state => ({
      newLectureData: {
        ...state.newLectureData,
        [field]: value,
      },
    })),

  addLecture: () => {
    const { newLectureData } = get();
    if (
      !newLectureData.title ||
      !newLectureData.date ||
      !newLectureData.classroomId
    ) {
      alert('모든 필드를 입력해주세요.');
      return false;
    }

    set(state => ({
      lectures: [
        ...state.lectures,
        {
          ...newLectureData,
          id: Date.now(),
        },
      ],
      isLectureModalOpen: false,
      isQuestionModalOpen: true,
      newLectureData: {
        title: '',
        description: '',
        date: '',
        classroomId: null,
      },
    }));
    return true;
  },

  updateLecture: (lectureId, updates) =>
    set(state => ({
      lectures: state.lectures.map(lecture =>
        lecture.id === lectureId ? { ...lecture, ...updates } : lecture
      ),
    })),

  deleteLecture: lectureId =>
    set(state => ({
      lectures: state.lectures.filter(lecture => lecture.id !== lectureId),
    })),

  getLecturesByClassroom: classroomId => {
    const { lectures } = get();
    return lectures.filter(lecture => lecture.classroomId === classroomId);
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
          difficulty: '',
          points: '',
        },
      ],
    }),
}));

export default useLectureStore;
