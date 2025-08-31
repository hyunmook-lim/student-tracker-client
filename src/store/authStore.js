import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  // 상태
  userType: 'teacher', // 'teacher' 또는 'student'
  isLoggedIn: false,
  isSignupMode: false, // 회원가입 모드 여부
  currentUser: null, // 현재 로그인한 사용자 정보
  formData: {
    id: '',
    password: '',
  },
  signupData: {
    name: '',
    loginId: '',
    password: '',
    confirmPassword: '',
    class: '',
    phone: '',
  },

  // 액션
  setUserType: userType => set({ userType }),

  setFormData: formData => set({ formData }),

  updateFormField: (name, value) =>
    set(state => ({
      formData: {
        ...state.formData,
        [name]: value,
      },
    })),

  updateSignupField: (name, value) =>
    set(state => ({
      signupData: {
        ...state.signupData,
        [name]: value,
      },
    })),

  toggleSignupMode: () => set(state => ({ isSignupMode: !state.isSignupMode })),

  login: (apiResult = null) => {
    const { formData, userType } = get();

    // API 검증 결과가 있는 경우 (교사 또는 학생)
    if (apiResult) {
      console.log('authStore login - apiResult:', apiResult);
      console.log('authStore login - apiResult.data:', apiResult.data);
      console.log('authStore login - userType:', userType);

      if (apiResult.success) {
        const currentUserData = {
          type: userType,
          ...apiResult.data,
        };
        console.log('authStore login - currentUserData:', currentUserData);

        set({
          isLoggedIn: true,
          // 로그인된 사용자 정보 저장
          currentUser: currentUserData,
        });
        return true;
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        return false;
      }
    }

    // 교사 모드이지만 API 검증 결과가 없는 경우 (임시)
    if (userType === 'teacher') {
      // 선생님 로그인: admin/admin (임시)
      if (formData.id === 'admin' && formData.password === 'admin') {
        set({
          isLoggedIn: true,
          currentUser: {
            type: 'teacher',
            id: 'admin',
            name: '관리자',
          },
        });
        return true;
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        return false;
      }
    }

    // 학생 모드 - 하드코딩된 로그인
    if (userType === 'student') {
      if (formData.id === 'student' && formData.password === 'student') {
        set({
          isLoggedIn: true,
          currentUser: {
            type: 'student',
            id: 1, // 테스트용 학생 ID - 백엔드에 실제 존재하는 학생 ID로 변경 필요
            name: '김학생',
            loginId: 'student',
          },
        });
        return true;
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        return false;
      }
    }

    return false;
  },

  signup: () => {
    const { signupData, userType } = get();

    // 유효성 검사
    if (
      !signupData.name ||
      !signupData.loginId ||
      !signupData.password ||
      !signupData.confirmPassword ||
      !signupData.phone
    ) {
      alert('모든 필드를 입력해주세요.');
      return false;
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (signupData.password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }

    // 회원가입 성공 (실제로는 서버에 저장)
    alert(
      `${userType === 'teacher' ? '선생님' : '학생'} 회원가입이 완료되었습니다!`
    );
    set({
      isSignupMode: false,
      signupData: {
        name: '',
        loginId: '',
        password: '',
        confirmPassword: '',
        class: '',
        phone: '',
      },
    });
    return true;
  },

  logout: () =>
    set({
      isLoggedIn: false,
      formData: { id: '', password: '' },
      currentUser: null,
    }),

  resetForm: () =>
    set({
      formData: { id: '', password: '' },
    }),

  resetSignupForm: () =>
    set({
      signupData: {
        name: '',
        loginId: '',
        password: '',
        confirmPassword: '',
        class: '',
        phone: '',
      },
    }),
}));

export default useAuthStore;
