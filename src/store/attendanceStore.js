import { create } from 'zustand';

const useAttendanceStore = create((set, get) => ({
  // 상태
  attendanceData: [
    {
      lectureId: 1,
      classroomId: 1,
      date: '2024-01-15',
      attendance: [
        { studentId: 1, name: '김철수', status: '출석', time: '09:00' },
        { studentId: 2, name: '이영희', status: '지각', time: '09:15' },
        { studentId: 3, name: '박민수', status: '출석', time: '08:55' },
        { studentId: 4, name: '정수진', status: '결석', time: '-' },
        { studentId: 5, name: '최동현', status: '출석', time: '09:02' },
      ],
    },
    {
      lectureId: 2,
      classroomId: 1,
      date: '2024-01-22',
      attendance: [
        { studentId: 1, name: '김철수', status: '출석', time: '09:00' },
        { studentId: 2, name: '이영희', status: '출석', time: '08:58' },
        { studentId: 3, name: '박민수', status: '지각', time: '09:20' },
        { studentId: 4, name: '정수진', status: '출석', time: '09:05' },
        { studentId: 5, name: '최동현', status: '결석', time: '-' },
      ],
    },
  ],
  selectedClass: null,
  selectedLecture: null,

  // 액션
  setSelectedClass: classData => set({ selectedClass: classData }),

  setSelectedLecture: lectureData => set({ selectedLecture: lectureData }),

  updateAttendance: (lectureId, studentId, status, time = null) =>
    set(state => ({
      attendanceData: state.attendanceData.map(lecture =>
        lecture.lectureId === lectureId
          ? {
              ...lecture,
              attendance: lecture.attendance.map(record =>
                record.studentId === studentId
                  ? {
                      ...record,
                      status,
                      time: time || (status === '결석' ? '-' : record.time),
                    }
                  : record
              ),
            }
          : lecture
      ),
    })),

  addAttendanceLecture: (lectureId, classroomId, date, students) =>
    set(state => ({
      attendanceData: [
        ...state.attendanceData,
        {
          lectureId,
          classroomId,
          date,
          attendance: students.map(student => ({
            studentId: student.id,
            name: student.name,
            status: '미체크',
            time: '-',
          })),
        },
      ],
    })),

  getAttendanceByLecture: lectureId => {
    const { attendanceData } = get();
    return attendanceData.find(lecture => lecture.lectureId === lectureId);
  },

  getAttendanceByClassroom: classroomId => {
    const { attendanceData } = get();
    return attendanceData.filter(
      lecture => lecture.classroomId === classroomId
    );
  },

  getStudentAttendanceHistory: studentId => {
    const { attendanceData } = get();
    return attendanceData
      .map(lecture => ({
        lectureId: lecture.lectureId,
        date: lecture.date,
        attendance: lecture.attendance.find(
          record => record.studentId === studentId
        ),
      }))
      .filter(record => record.attendance);
  },

  calculateAttendanceRate: (classroomId, studentId = null) => {
    const lectures = get().getAttendanceByClassroom(classroomId);

    if (studentId) {
      // 특정 학생의 출석률
      const studentRecords = lectures
        .map(lecture =>
          lecture.attendance.find(record => record.studentId === studentId)
        )
        .filter(record => record && record.status !== '미체크');

      if (studentRecords.length === 0) return 0;

      const presentCount = studentRecords.filter(
        record => record.status === '출석' || record.status === '지각'
      ).length;

      return Math.round((presentCount / studentRecords.length) * 100);
    } else {
      // 전체 반의 평균 출석률
      if (lectures.length === 0) return 0;

      const totalStudents = lectures[0]?.attendance.length || 0;
      if (totalStudents === 0) return 0;

      let totalPresentCount = 0;
      let totalRecords = 0;

      lectures.forEach(lecture => {
        lecture.attendance.forEach(record => {
          if (record.status !== '미체크') {
            totalRecords++;
            if (record.status === '출석' || record.status === '지각') {
              totalPresentCount++;
            }
          }
        });
      });

      return totalRecords > 0
        ? Math.round((totalPresentCount / totalRecords) * 100)
        : 0;
    }
  },

  getAttendanceStatistics: classroomId => {
    const lectures = get().getAttendanceByClassroom(classroomId);

    const stats = {
      totalLectures: lectures.length,
      totalStudents: lectures[0]?.attendance.length || 0,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
    };

    lectures.forEach(lecture => {
      lecture.attendance.forEach(record => {
        switch (record.status) {
          case '출석':
            stats.presentCount++;
            break;
          case '지각':
            stats.lateCount++;
            break;
          case '결석':
            stats.absentCount++;
            break;
        }
      });
    });

    return stats;
  },
}));

export default useAttendanceStore;
