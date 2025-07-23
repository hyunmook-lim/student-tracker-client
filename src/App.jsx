import './App.css';
import Home from './pages/Home';
import { useAuthStore } from './store';

function App() {
  const {
    userType,
    isLoggedIn,
    formData,
    setUserType,
    updateFormField,
    login,
  } = useAuthStore();

  const handleInputChange = e => {
    const { name, value } = e.target;
    updateFormField(name, value);
  };

  const handleLogin = e => {
    e.preventDefault();
    console.log('로그인 시도:', { userType, ...formData });
    login();
  };

  // 로그인 상태에 따라 홈화면 또는 로그인 화면 렌더링
  if (isLoggedIn) {
    return <Home userType={userType} />;
  }

  return (
    <div className='login-container'>
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

          <button type='submit' className='login-btn'>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
