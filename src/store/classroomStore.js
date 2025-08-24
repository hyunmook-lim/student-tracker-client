import { create } from 'zustand';

const useClassroomStore = create((set, get) => ({
  // 상태
  classrooms: [
    {
      id: 1,
      name: '1학년 1반',
      description: '수학 기초 과정',
      studentCount: 25,
      students: [
        {
          id: 1,
          name: '김철수',
          studentId: '2024001',
          status: 'approved',
          attendance: '출석',
          examScore: 85,
          examTotal: 100,
          assignmentGrade: 'A',
        },
        {
          id: 2,
          name: '이영희',
          studentId: '2024002',
          status: 'approved',
          attendance: '출석',
          examScore: 92,
          examTotal: 100,
          assignmentGrade: 'A',
        },
        {
          id: 3,
          name: '박민수',
          studentId: '2024003',
          status: 'pending',
          attendance: '출석',
          examScore: 78,
          examTotal: 100,
          assignmentGrade: 'B',
        },
        {
          id: 4,
          name: '정수진',
          studentId: '2024004',
          status: 'approved',
          attendance: '출석',
          examScore: 88,
          examTotal: 100,
          assignmentGrade: 'B',
        },
        {
          id: 5,
          name: '최동현',
          studentId: '2024005',
          status: 'pending',
          attendance: '결석',
          examScore: null,
          examTotal: null,
          assignmentGrade: null,
        },
        {
          id: 12,
          name: '한지민',
          studentId: '2024012',
          status: 'approved',
          attendance: '출석',
          examScore: 95,
          examTotal: 100,
          assignmentGrade: 'A',
        },
        {
          id: 13,
          name: '박서준',
          studentId: '2024013',
          status: 'approved',
          attendance: '결석',
          examScore: null,
          examTotal: null,
          assignmentGrade: null,
        },
      ],
    },
    {
      id: 2,
      name: '1학년 2반',
      description: '영어 기초 과정',
      studentCount: 23,
      students: [
        {
          id: 6,
          name: '강지영',
          studentId: '2024006',
          status: 'approved',
          attendance: '출석',
          examScore: 90,
          examTotal: 100,
          assignmentGrade: 'A',
        },
        {
          id: 7,
          name: '윤서준',
          studentId: '2024007',
          status: 'pending',
          attendance: '출석',
          examScore: 82,
          examTotal: 100,
          assignmentGrade: 'C',
        },
        {
          id: 8,
          name: '임하나',
          studentId: '2024008',
          status: 'approved',
          attendance: '출석',
          examScore: 75,
          examTotal: 100,
          assignmentGrade: 'C',
        },
        {
          id: 9,
          name: '송태현',
          studentId: '2024009',
          status: 'pending',
          attendance: '결석',
          examScore: null,
          examTotal: null,
          assignmentGrade: null,
        },
        {
          id: 14,
          name: '김민지',
          studentId: '2024014',
          status: 'approved',
          attendance: '출석',
          examScore: 87,
          examTotal: 100,
          assignmentGrade: 'B',
        },
      ],
    },
    {
      id: 3,
      name: '2학년 1반',
      description: '과학 심화 과정',
      studentCount: 20,
      students: [
        {
          id: 10,
          name: '이정호',
          studentId: '2024010',
          status: 'approved',
          attendance: '출석',
          examScore: 93,
          examTotal: 100,
          assignmentGrade: 'A',
        },
        {
          id: 11,
          name: '김미영',
          studentId: '2024011',
          status: 'approved',
          attendance: '출석',
          examScore: 89,
          examTotal: 100,
          assignmentGrade: 'B',
        },
        {
          id: 15,
          name: '정우진',
          studentId: '2024015',
          status: 'approved',
          attendance: '결석',
          examScore: null,
          examTotal: null,
          assignmentGrade: null,
        },
      ],
    },
  ],
  expandedClass: null,
  selectedClassroom: null,
  isAddModalOpen: false,
  newClassData: {
    name: '',
    description: '',
  },

  // 액션
  setExpandedClass: classId =>
    set(state => {
      console.log('=== Store setExpandedClass ===');
      console.log(
        '현재 expandedClass:',
        state.expandedClass,
        '타입:',
        typeof state.expandedClass
      );
      console.log('새로 설정할 classId:', classId, '타입:', typeof classId);
      console.log('같은가?', state.expandedClass === classId);

      const newValue = state.expandedClass === classId ? null : classId;
      console.log('새로 설정될 값:', newValue);

      return {
        expandedClass: newValue,
      };
    }),

  setSelectedClassroom: classroom => set({ selectedClassroom: classroom }),

  openAddModal: () => set({ isAddModalOpen: true }),

  closeAddModal: () =>
    set({
      isAddModalOpen: false,
      newClassData: {
        name: '',
        description: '',
      },
    }),

  updateNewClassData: (field, value) =>
    set(state => ({
      newClassData: {
        ...state.newClassData,
        [field]: value,
      },
    })),

  addClass: () => {
    const { newClassData } = get();
    if (!newClassData.name || !newClassData.description) {
      alert('반 이름과 설명을 입력해주세요.');
      return false;
    }

    set(state => ({
      classrooms: [
        ...state.classrooms,
        {
          ...newClassData,
          id: Date.now(),
          studentCount: 0,
          students: [],
        },
      ],
      isAddModalOpen: false,
      newClassData: {
        name: '',
        description: '',
      },
    }));
    return true;
  },

  updateClassroom: (classroomId, updates) =>
    set(state => ({
      classrooms: state.classrooms.map(classroom =>
        classroom.id === classroomId ? { ...classroom, ...updates } : classroom
      ),
    })),

  deleteClassroom: classroomId =>
    set(state => ({
      classrooms: state.classrooms.filter(
        classroom => classroom.id !== classroomId
      ),
    })),

  addStudentToClassroom: (classroomId, student) =>
    set(state => ({
      classrooms: state.classrooms.map(classroom =>
        classroom.id === classroomId
          ? {
              ...classroom,
              students: [...classroom.students, student],
              studentCount: classroom.studentCount + 1,
            }
          : classroom
      ),
    })),

  removeStudentFromClassroom: (classroomId, studentId) =>
    set(state => ({
      classrooms: state.classrooms.map(classroom =>
        classroom.id === classroomId
          ? {
              ...classroom,
              students: classroom.students.filter(
                student => student.id !== studentId
              ),
              studentCount: classroom.studentCount - 1,
            }
          : classroom
      ),
    })),

  updateStudentStatus: (classroomId, studentId, status) =>
    set(state => ({
      classrooms: state.classrooms.map(classroom =>
        classroom.id === classroomId
          ? {
              ...classroom,
              students: classroom.students.map(student =>
                student.id === studentId ? { ...student, status } : student
              ),
            }
          : classroom
      ),
    })),

  // 학생 결과 업데이트 함수
  updateStudentResults: (classroomId, results) =>
    set(state => ({
      classrooms: state.classrooms.map(classroom =>
        classroom.id === classroomId
          ? {
              ...classroom,
              students: classroom.students.map(student => {
                const result = results.find(r => r.id === student.id);
                if (result) {
                  return {
                    ...student,
                    attendance: result.attendance,
                    examScore: result.examScore,
                    examTotal: result.examTotal,
                    assignmentGrade: result.assignmentGrade,
                  };
                }
                return student;
              }),
            }
          : classroom
      ),
    })),

  getClassroomById: classroomId => {
    const { classrooms } = get();
    return classrooms.find(classroom => classroom.id === classroomId);
  },

  getStudentsByClassroom: classroomId => {
    const classroom = get().getClassroomById(classroomId);
    return classroom ? classroom.students : [];
  },
}));

export default useClassroomStore;
