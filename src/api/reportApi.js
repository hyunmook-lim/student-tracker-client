// 성적표 관련 API 함수들

// 성적표 생성 (백엔드 CreateReportRequest 구조에 맞춤)
export const createReport = async reportData => {
  try {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportTitle: reportData.title,
        reportDescription: reportData.description,
        classroomId: reportData.classroomId,
        lectureIds: reportData.lectureIds,
        studentIds: reportData.studentIds,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error: data.message || '성적표 생성에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('성적표 생성 API 오류:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
};

// 특정 교실의 성적표 목록 조회
export const getReportsByClassroom = async classroomId => {
  try {
    const response = await fetch(`/api/reports/classrooms/${classroomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error: data.message || '성적표 목록 조회에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('성적표 목록 조회 API 오류:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
};

// 특정 성적표 상세 조회
export const getReportById = async reportId => {
  try {
    const response = await fetch(`/api/reports/${reportId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error: data.message || '성적표 조회에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('성적표 조회 API 오류:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
};

// 성적표 삭제
export const deleteReport = async reportId => {
  try {
    const response = await fetch(`/api/reports/${reportId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return {
        success: true,
        data: null,
      };
    } else {
      const data = await response.json();
      return {
        success: false,
        error: data.message || '성적표 삭제에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('성적표 삭제 API 오류:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
};

// 특정 학생의 성적표 목록 조회
export const getReportsByStudent = async studentId => {
  try {
    const response = await fetch(`/api/reports/students/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error: data.message || '학생 성적표 조회에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('학생 성적표 조회 API 오류:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
};

// 학생별 피드백 업데이트
export const updateStudentFeedback = async (reportId, studentId, feedback) => {
  try {
    const response = await fetch(
      `/api/reports/${reportId}/students/${studentId}/feedback`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback,
        }),
      }
    );

    if (response.ok) {
      return {
        success: true,
        data: null,
      };
    } else {
      const data = await response.json();
      return {
        success: false,
        error: data.message || '피드백 업데이트에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('피드백 업데이트 API 오류:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
};
