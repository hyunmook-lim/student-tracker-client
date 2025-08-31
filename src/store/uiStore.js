import { create } from 'zustand';

const useUIStore = create(set => ({
  // 상태
  currentView: 'lecture-info', // 학생: 'lecture-info', 교사: 'class-management'
  selectedStudent: null,
  selectedClass: { grade: 1, class: 1 },
  isModalOpen: false,
  modalType: null, // 'addStudent', 'editStudent', 'gradeInput', 'attendanceInput'
  isLoading: false,
  sidebarCollapsed: false,

  // 폼 상태
  gradeFormData: {
    korean: 0,
    math: 0,
    english: 0,
    science: 0,
    social: 0,
  },
  studentFormData: {
    name: '',
    grade: 1,
    class: 1,
    studentNumber: '',
    attendance: 100,
    grades: {
      korean: 0,
      math: 0,
      english: 0,
      science: 0,
      social: 0,
    },
  },

  // 액션
  setCurrentView: view => set({ currentView: view }),

  setSelectedStudent: student =>
    set(state => ({
      selectedStudent: student,
      // 학생이 선택되면 해당 학생의 성적과 정보를 폼에 설정
      gradeFormData: student ? student.grades : state.gradeFormData,
      studentFormData: student ? student : state.studentFormData,
    })),

  setSelectedClass: (grade, classNum) =>
    set({
      selectedClass: { grade, class: classNum },
    }),

  openModal: modalType =>
    set({
      isModalOpen: true,
      modalType,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalType: null,
      // 모달 닫을 때 폼 데이터 초기화
      gradeFormData: {
        korean: 0,
        math: 0,
        english: 0,
        science: 0,
        social: 0,
      },
      studentFormData: {
        name: '',
        grade: 1,
        class: 1,
        studentNumber: '',
        attendance: 100,
        grades: {
          korean: 0,
          math: 0,
          english: 0,
          science: 0,
          social: 0,
        },
      },
    }),

  setLoading: loading => set({ isLoading: loading }),

  toggleSidebar: () =>
    set(state => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  // 성적 폼 데이터 업데이트
  updateGradeFormData: (subject, value) =>
    set(state => ({
      gradeFormData: {
        ...state.gradeFormData,
        [subject]: parseInt(value) || 0,
      },
    })),

  // 학생 폼 데이터 업데이트
  updateStudentFormData: (field, value) =>
    set(state => ({
      studentFormData: {
        ...state.studentFormData,
        [field]: value,
      },
    })),

  updateStudentFormGrades: (subject, value) =>
    set(state => ({
      studentFormData: {
        ...state.studentFormData,
        grades: {
          ...state.studentFormData.grades,
          [subject]: parseInt(value) || 0,
        },
      },
    })),

  resetUI: () =>
    set({
      currentView: 'lecture-info',
      selectedStudent: null,
      selectedClass: { grade: 1, class: 1 },
      isModalOpen: false,
      modalType: null,
      isLoading: false,
      sidebarCollapsed: false,
      gradeFormData: {
        korean: 0,
        math: 0,
        english: 0,
        science: 0,
        social: 0,
      },
      studentFormData: {
        name: '',
        grade: 1,
        class: 1,
        studentNumber: '',
        attendance: 100,
        grades: {
          korean: 0,
          math: 0,
          english: 0,
          science: 0,
          social: 0,
        },
      },
    }),
}));

export default useUIStore;
