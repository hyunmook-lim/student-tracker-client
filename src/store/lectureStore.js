import { create } from 'zustand';
import { createLecture } from '../api/lectureApi';

const useLectureStore = create((set, get) => ({
  // 상태
  lectures: [],
  selectedLecture: null,
  expandedClasses: new Set(),
  isLectureModalOpen: false,
  isQuestionModalOpen: false,
  newLectureData: {
    lectureName: '',
    description: '',
    lectureDate: '',
    classroomId: null,
  },
  questions: [
    {
      id: Date.now(),
      number: 1,
      mainTopic: '',
      subTopic: '',
      difficulty: '',
      score: '',
    },
  ],
  questionIdCounter: Date.now(),

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
        lectureName: '',
        description: '',
        lectureDate: '',
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
      !newLectureData.lectureName ||
      !newLectureData.lectureDate ||
      !newLectureData.classroomId
    ) {
      alert('모든 필드를 입력해주세요.');
      return false;
    }

    set({
      isLectureModalOpen: false,
      isQuestionModalOpen: true,
    });
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
    set(state => {
      const newId = state.questionIdCounter + 1;
      const nextNumber = state.questions.length + 1;
      return {
        questions: [
          ...state.questions,
          {
            id: newId,
            number: nextNumber,
            mainTopic: '',
            subTopic: '',
            difficulty: '',
            score: '',
          },
        ],
        questionIdCounter: newId,
      };
    }),

  updateQuestion: (questionId, field, value) =>
    set(state => ({
      questions: state.questions.map(question =>
        question.id === questionId ? { ...question, [field]: value } : question
      ),
    })),

  removeQuestion: questionId =>
    set(state => {
      const filteredQuestions = state.questions.filter(
        question => question.id !== questionId
      );
      // 문제 번호 재정렬
      const reorderedQuestions = filteredQuestions.map((question, index) => ({
        ...question,
        number: index + 1,
      }));
      return { questions: reorderedQuestions };
    }),

  resetQuestions: () => {
    const newId = Date.now();
    set({
      questions: [
        {
          id: newId,
          number: 1,
          mainTopic: '',
          subTopic: '',
          difficulty: '',
          score: '',
        },
      ],
      questionIdCounter: newId,
    });
  },

  saveQuestions: async () => {
    const { newLectureData, questions } = get();

    const lectureData = {
      ...newLectureData,
      questions: questions,
    };

    try {
      const result = await createLecture(lectureData);

      if (result.success) {
        const newId = Date.now();
        set(() => ({
          isQuestionModalOpen: false,
          newLectureData: {
            lectureName: '',
            description: '',
            lectureDate: '',
            classroomId: null,
          },
          questions: [
            {
              id: newId,
              number: 1,
              mainTopic: '',
              subTopic: '',
              difficulty: '',
              score: '',
            },
          ],
          questionIdCounter: newId,
        }));
        return true;
      } else {
        alert(`강의 생성 실패: ${result.error}`);
        return false;
      }
    } catch (error) {
      console.error('강의 생성 중 오류:', error);
      alert('강의 생성 중 오류가 발생했습니다.');
      return false;
    }
  },
}));

export default useLectureStore;
