import { create } from 'zustand';

const useUIStore = create(set => ({
  // 상태
  currentView: 'dashboard', // 'dashboard', 'students', 'grades', 'attendance', 'settings'
  selectedStudent: null,
  selectedClass: { grade: 1, class: 1 },
  isModalOpen: false,
  modalType: null, // 'addStudent', 'editStudent', 'gradeInput', 'attendanceInput'
  isLoading: false,
  sidebarCollapsed: false,

  // 액션
  setCurrentView: view => set({ currentView: view }),

  setSelectedStudent: student => set({ selectedStudent: student }),

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
    }),

  setLoading: loading => set({ isLoading: loading }),

  toggleSidebar: () =>
    set(state => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  resetUI: () =>
    set({
      currentView: 'dashboard',
      selectedStudent: null,
      selectedClass: { grade: 1, class: 1 },
      isModalOpen: false,
      modalType: null,
      isLoading: false,
      sidebarCollapsed: false,
    }),
}));

export default useUIStore;
