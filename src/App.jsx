import './App.css';
import Home from './pages/Home';
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
    return <Home userType={userType} />;
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
            <button onClick={() => setUserType('teacher')}>선생님</button>
            <button onClick={() => setUserType('student')}>학생</button>
          </div>

          {/* 로그인 폼 */}
          <form className='login-form' onSubmit={handleLogin}>
            <h2 className='form-title'>
              {userType === 'teacher' ? '선생님 로그인' : '학생 로그인'}
            </h2>

            <div className='input-group'>
              <input
                type='text'
                id='id'
                name='id'
                value={formData.id}
                onChange={handleInputChange}
                placeholder='아이디를 입력하세요'
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
                placeholder='비밀번호를 입력하세요'
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
            <button onClick={() => setUserType('teacher')}>선생님</button>
            <button onClick={() => setUserType('student')}>학생</button>
          </div>

          {/* 회원가입 폼 */}
          <form className='signup-form' onSubmit={handleSignup}>
            <h2 className='form-title'>
              {userType === 'teacher' ? '선생님 회원가입' : '학생 회원가입'}
            </h2>

            <div className='input-group'>
              <input
                type='text'
                id='signup-name'
                name='name'
                value={signupData.name}
                onChange={handleSignupInputChange}
                placeholder='이름을 입력하세요'
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
                placeholder='아이디를 입력하세요'
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
                placeholder='비밀번호를 입력하세요'
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
                placeholder='비밀번호를 다시 입력하세요'
                required
              />
            </div>

            <div className='button-group'>
              <button
                type='button'
                className='back-btn'
                onClick={toggleSignupMode}
              >
                뒤로가기
              </button>
              <button type='submit' className='signup-submit-btn'>
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
