import { create } from 'zustand';

const useAttendanceStore = create((set, get) => ({
  // 상태
  attendanceData: [
    {
      sessionId: 1,
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
      sessionId: 2,
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
  selectedSession: null,

  // 액션
  setSelectedClass: classData => set({ selectedClass: classData }),

  setSelectedSession: sessionData => set({ selectedSession: sessionData }),

  updateAttendance: (sessionId, studentId, status, time = null) =>
    set(state => ({
      attendanceData: state.attendanceData.map(session =>
        session.sessionId === sessionId
          ? {
              ...session,
              attendance: session.attendance.map(record =>
                record.studentId === studentId
                  ? {
                      ...record,
                      status,
                      time: time || (status === '결석' ? '-' : record.time),
                    }
                  : record
              ),
            }
          : session
      ),
    })),

  addAttendanceSession: (sessionId, classroomId, date, students) =>
    set(state => ({
      attendanceData: [
        ...state.attendanceData,
        {
          sessionId,
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

  getAttendanceBySession: sessionId => {
    const { attendanceData } = get();
    return attendanceData.find(session => session.sessionId === sessionId);
  },

  getAttendanceByClassroom: classroomId => {
    const { attendanceData } = get();
    return attendanceData.filter(
      session => session.classroomId === classroomId
    );
  },

  getStudentAttendanceHistory: studentId => {
    const { attendanceData } = get();
    return attendanceData
      .map(session => ({
        sessionId: session.sessionId,
        date: session.date,
        attendance: session.attendance.find(
          record => record.studentId === studentId
        ),
      }))
      .filter(record => record.attendance);
  },

  calculateAttendanceRate: (classroomId, studentId = null) => {
    const sessions = get().getAttendanceByClassroom(classroomId);

    if (studentId) {
      // 특정 학생의 출석률
      const studentRecords = sessions
        .map(session =>
          session.attendance.find(record => record.studentId === studentId)
        )
        .filter(record => record && record.status !== '미체크');

      if (studentRecords.length === 0) return 0;

      const presentCount = studentRecords.filter(
        record => record.status === '출석' || record.status === '지각'
      ).length;

      return Math.round((presentCount / studentRecords.length) * 100);
    } else {
      // 전체 반의 평균 출석률
      if (sessions.length === 0) return 0;

      const totalStudents = sessions[0]?.attendance.length || 0;
      if (totalStudents === 0) return 0;

      let totalPresentCount = 0;
      let totalRecords = 0;

      sessions.forEach(session => {
        session.attendance.forEach(record => {
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
    const sessions = get().getAttendanceByClassroom(classroomId);

    const stats = {
      totalSessions: sessions.length,
      totalStudents: sessions[0]?.attendance.length || 0,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
    };

    sessions.forEach(session => {
      session.attendance.forEach(record => {
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
