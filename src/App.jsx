import './App.css';
import TeacherHome from './pages/TeacherHome';
import StudentHome from './pages/StudentHome';
import { useAuthStore } from './store';

function App() {
  const {
    userType,
    isLoggedIn,
    isSignupMode,
    formData,
    signupData,
    setUserType,
    updateFormField,
    updateSignupField,
    toggleSignupMode,
    login,
    signup,
  } = useAuthStore();

  const handleInputChange = e => {
    const { name, value } = e.target;
    updateFormField(name, value);
  };

  const handleSignupInputChange = e => {
    const { name, value } = e.target;
    updateSignupField(name, value);
  };

  const handleLogin = e => {
    e.preventDefault();
    console.log('로그인 시도:', { userType, ...formData });
    login();
  };

  const handleSignup = e => {
    e.preventDefault();
    console.log('회원가입 시도:', { userType, ...signupData });
    signup();
  };

  // 로그인 상태에 따라 홈화면 또는 로그인 화면 렌더링
  if (isLoggedIn) {
    return userType === 'teacher' ? <TeacherHome /> : <StudentHome />;
  }

  return (
    <div className='login-container'>
      <div className={`card-container ${isSignupMode ? 'flipped' : ''}`}>
        {/* 로그인 카드 */}
        <div className='login-card'>
          <h1 className='login-title'>학생 관리 시스템</h1>

          {/* 사용자 타입 토글 */}
          <div className='user-type-toggle'>
            <div className={`toggle-indicator ${userType}`} />
            <button onClick={() => setUserType('teacher')}>교사</button>
            <button onClick={() => setUserType('student')}>학생</button>
          </div>

          {/* 로그인 폼 */}
          <form className='login-form' onSubmit={handleLogin}>
            <h2 className='form-title'>
              {userType === 'teacher' ? '교사 로그인' : '학생 로그인'}
            </h2>

            <div className='input-group'>
              <input
                type='text'
                id='id'
                name='id'
                value={formData.id}
                onChange={handleInputChange}
                placeholder='아이디'
                required
              />
            </div>
            <div className='input-group'>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='비밀번호'
                required
              />
            </div>

            <div className='button-group'>
              <button
                type='button'
                className='signup-btn'
                onClick={toggleSignupMode}
              >
                회원가입
              </button>
              <button type='submit' className='login-btn'>
                로그인
              </button>
            </div>
          </form>
        </div>

        {/* 회원가입 카드 */}
        <div className='signup-card'>
          {/* 사용자 타입 토글 */}
          <div className='user-type-toggle'>
            <div className={`toggle-indicator ${userType}`} />
            <button onClick={() => setUserType('teacher')}>교사</button>
            <button onClick={() => setUserType('student')}>학생</button>
          </div>

          {/* 회원가입 폼 */}
          <form className='signup-form' onSubmit={handleSignup}>
            <h2 className='form-title'>
              {userType === 'teacher' ? '교사 회원가입' : '학생 회원가입'}
            </h2>

            <div className='input-group'>
              <input
                type='text'
                id='signup-name'
                name='name'
                value={signupData.name}
                onChange={handleSignupInputChange}
                placeholder='이름'
                required
              />
            </div>
            <div className='input-group'>
              <input
                type='text'
                id='signup-id'
                name='id'
                value={signupData.id}
                onChange={handleSignupInputChange}
                placeholder='아이디'
                required
              />
            </div>
            <div className='input-group'>
              <input
                type='tel'
                id='signup-phone'
                name='phone'
                value={signupData.phone}
                onChange={handleSignupInputChange}
                placeholder='전화번호'
                required
              />
            </div>
            <div className='input-group'>
              <input
                type='password'
                id='signup-password'
                name='password'
                value={signupData.password}
                onChange={handleSignupInputChange}
                placeholder='비밀번호'
                required
              />
            </div>
            <div className='input-group'>
              <input
                type='password'
                id='signup-confirm-password'
                name='confirmPassword'
                value={signupData.confirmPassword}
                onChange={handleSignupInputChange}
                placeholder='비밀번호 확인'
                required
              />
            </div>

            {userType === 'student' && (
              <div className='input-group'>
                <select
                  id='signup-class'
                  name='class'
                  value={signupData.class}
                  onChange={handleSignupInputChange}
                  required
                >
                  <option value=''>반을 선택하세요</option>
                  <option value='1-1'>1학년 1반</option>
                  <option value='1-2'>1학년 2반</option>
                  <option value='1-3'>1학년 3반</option>
                  <option value='2-1'>2학년 1반</option>
                  <option value='2-2'>2학년 2반</option>
                  <option value='2-3'>2학년 3반</option>
                  <option value='3-1'>3학년 1반</option>
                  <option value='3-2'>3학년 2반</option>
                  <option value='3-3'>3학년 3반</option>
                </select>
              </div>
            )}

            <div className='button-group'>
              <button
                type='button'
                className='back-btn'
                onClick={toggleSignupMode}
              >
                뒤로가기
              </button>
              <button type='submit' className='signup-submit-btn'>
                {userType === 'teacher' ? '회원가입' : '회원가입 신청'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
