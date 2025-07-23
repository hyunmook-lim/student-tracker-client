import { create } from 'zustand';

const useStudentsStore = create((set, get) => ({
  // 상태
  students: [
    {
      id: 1,
      name: '김철수',
      grade: 1,
      class: 1,
      studentNumber: '001',
      attendance: 95,
      grades: {
        korean: 85,
        math: 90,
        english: 88,
        science: 92,
        social: 87,
      },
      attendanceRecord: [
        { date: '2024-01-15', status: 'present' },
        { date: '2024-01-16', status: 'present' },
        { date: '2024-01-17', status: 'absent' },
        { date: '2024-01-18', status: 'present' },
        { date: '2024-01-19', status: 'present' },
      ],
    },
    {
      id: 2,
      name: '이영희',
      grade: 1,
      class: 1,
      studentNumber: '002',
      attendance: 98,
      grades: {
        korean: 92,
        math: 88,
        english: 95,
        science: 89,
        social: 91,
      },
      attendanceRecord: [
        { date: '2024-01-15', status: 'present' },
        { date: '2024-01-16', status: 'present' },
        { date: '2024-01-17', status: 'present' },
        { date: '2024-01-18', status: 'present' },
        { date: '2024-01-19', status: 'present' },
      ],
    },
    {
      id: 3,
      name: '박민수',
      grade: 1,
      class: 2,
      studentNumber: '003',
      attendance: 92,
      grades: {
        korean: 78,
        math: 95,
        english: 82,
        science: 88,
        social: 85,
      },
      attendanceRecord: [
        { date: '2024-01-15', status: 'present' },
        { date: '2024-01-16', status: 'late' },
        { date: '2024-01-17', status: 'present' },
        { date: '2024-01-18', status: 'present' },
        { date: '2024-01-19', status: 'present' },
      ],
    },
  ],

  // 액션
  addStudent: student =>
    set(state => ({
      students: [...state.students, { ...student, id: Date.now() }],
    })),

  updateStudent: (id, updates) =>
    set(state => ({
      students: state.students.map(student =>
        student.id === id ? { ...student, ...updates } : student
      ),
    })),

  deleteStudent: id =>
    set(state => ({
      students: state.students.filter(student => student.id !== id),
    })),

  updateStudentGrade: (studentId, subject, grade) =>
    set(state => ({
      students: state.students.map(student =>
        student.id === studentId
          ? {
              ...student,
              grades: {
                ...student.grades,
                [subject]: grade,
              },
            }
          : student
      ),
    })),

  updateAttendance: (studentId, date, status) =>
    set(state => ({
      students: state.students.map(student =>
        student.id === studentId
          ? {
              ...student,
              attendanceRecord: [
                ...student.attendanceRecord.filter(
                  record => record.date !== date
                ),
                { date, status },
              ],
            }
          : student
      ),
    })),

  getStudentById: id => {
    const { students } = get();
    return students.find(student => student.id === id);
  },

  getStudentsByClass: (grade, classNum) => {
    const { students } = get();
    return students.filter(
      student => student.grade === grade && student.class === classNum
    );
  },

  calculateAverageGrade: studentId => {
    const student = get().getStudentById(studentId);
    if (!student) return 0;

    const grades = Object.values(student.grades);
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  },

  calculateClassAverage: (grade, classNum) => {
    const classStudents = get().getStudentsByClass(grade, classNum);
    if (classStudents.length === 0) return 0;

    const totalAverage = classStudents.reduce((sum, student) => {
      const grades = Object.values(student.grades);
      const studentAverage =
        grades.reduce((s, grade) => s + grade, 0) / grades.length;
      return sum + studentAverage;
    }, 0);

    return totalAverage / classStudents.length;
  },
}));

export default useStudentsStore;
