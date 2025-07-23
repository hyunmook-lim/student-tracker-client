import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  // 상태
  userType: 'teacher', // 'teacher' 또는 'student'
  isLoggedIn: false,
  formData: {
    id: '',
    password: '',
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

  login: () => {
    const { formData } = get();
    // 아이디와 비밀번호가 모두 'admin'인지 확인
    if (formData.id === 'admin' && formData.password === 'admin') {
      set({ isLoggedIn: true });
      return true;
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      return false;
    }
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
}));

export default useAuthStore;
