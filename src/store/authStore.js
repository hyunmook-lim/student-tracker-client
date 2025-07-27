import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  // 상태
  userType: 'teacher', // 'teacher' 또는 'student'
  isLoggedIn: false,
  isSignupMode: false, // 회원가입 모드 여부
  formData: {
    id: '',
    password: '',
  },
  signupData: {
    name: '',
    id: '',
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

  login: () => {
    const { formData } = get();
    // 선생님 로그인: admin/admin
    if (formData.id === 'admin' && formData.password === 'admin') {
      set({ isLoggedIn: true });
      return true;
    }
    // 학생 로그인: student/student
    else if (formData.id === 'student' && formData.password === 'student') {
      set({ isLoggedIn: true });
      return true;
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      return false;
    }
  },

  signup: () => {
    const { signupData, userType } = get();

    // 유효성 검사
    if (
      !signupData.name ||
      !signupData.id ||
      !signupData.password ||
      !signupData.confirmPassword ||
      !signupData.phone
    ) {
      alert('모든 필드를 입력해주세요.');
      return false;
    }

    // 학생인 경우 반 선택 필수
    if (userType === 'student' && !signupData.class) {
      alert('반을 선택해주세요.');
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
        id: '',
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
    }),

  resetForm: () =>
    set({
      formData: { id: '', password: '' },
    }),

  resetSignupForm: () =>
    set({
      signupData: {
        name: '',
        id: '',
        password: '',
        confirmPassword: '',
        class: '',
        phone: '',
      },
    }),
}));

export default useAuthStore;
