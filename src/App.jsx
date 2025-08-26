import './App.css';
import TeacherHome from './pages/TeacherHome';
import StudentHome from './pages/StudentHome';
import { useAuthStore } from './store';
import { signupTeacher, loginTeacher } from './api/teacherApi';
import { signupStudent, loginStudent } from './api/studentApi';

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
  } = useAuthStore();

  const handleInputChange = e => {
    const { name, value } = e.target;
    updateFormField(name, value);
  };

  const handleSignupInputChange = e => {
    const { name, value } = e.target;
    updateSignupField(name, value);
  };

  const handleLogin = async e => {
    e.preventDefault();
    console.log('로그인 시도:', { userType, ...formData });

    // 교사 로그인인 경우 API 호출
    if (userType === 'teacher') {
      try {
        const loginData = {
          loginId: formData.id,
          password: formData.password,
        };

        const result = await loginTeacher(loginData);

        if (result.success) {
          alert(
            `교사 로그인이 완료되었습니다!\n환영합니다, ${result.data.name}님!`
          );
          console.log('로그인 성공:', result.data);
          // 로그인 성공 시 상태 업데이트 (API 결과 전달)
          login(result);
        } else {
          alert(`로그인 실패: ${result.error}`);
          console.error('로그인 실패 상세:', result);
        }
      } catch (error) {
        console.error('로그인 오류:', error);
        alert('로그인 중 오류가 발생했습니다.');
      }
    } else {
      // 학생 로그인 API 호출
      try {
        const loginData = {
          loginId: formData.id,
          password: formData.password,
        };

        const result = await loginStudent(loginData);

        if (result.success) {
          console.log('학생 로그인 API 응답 전체:', result);
          console.log('학생 로그인 API 응답 데이터:', result.data);
          console.log('학생 로그인 API 응답 데이터 타입:', typeof result.data);

          alert(
            `학생 로그인이 완료되었습니다!\n환영합니다, ${result.data.name}님!`
          );
          console.log('학생 로그인 성공:', result.data);
          // 로그인 성공 시 상태 업데이트 (API 결과 전달)
          login(result);
        } else {
          alert(`로그인 실패: ${result.error}`);
          console.error('학생 로그인 실패 상세:', result);
        }
      } catch (error) {
        console.error('학생 로그인 오류:', error);
        alert('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSignup = async e => {
    e.preventDefault();
    console.log('회원가입 시도:', { userType, ...signupData });

    // 비밀번호 확인
    if (signupData.password !== signupData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 교사 회원가입인 경우 API 호출
    if (userType === 'teacher') {
      try {
        const teacherData = {
          name: signupData.name,
          loginId: signupData.loginId,
          phone: signupData.phone,
          password: signupData.password,
        };

        const result = await signupTeacher(teacherData);

        if (result.success) {
          alert('교사 회원가입이 완료되었습니다!');
          console.log('회원가입 성공:', result.data);
          // 회원가입 성공 후 로그인 화면으로 돌아가기
          toggleSignupMode();
          // 폼 데이터 초기화
          Object.keys(signupData).forEach(key => {
            updateSignupField(key, '');
          });
        } else {
          alert(`회원가입 실패: ${result.error}`);
        }
      } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    } else {
      // 학생 회원가입 API 호출
      try {
        const studentData = {
          name: signupData.name,
          loginId: signupData.loginId,
          phone: signupData.phone,
          password: signupData.password,
        };

        const result = await signupStudent(studentData);

        if (result.success) {
          alert('학생 회원가입이 완료되었습니다!');
          console.log('학생 회원가입 성공:', result.data);
          // 회원가입 성공 후 로그인 화면으로 돌아가기
          toggleSignupMode();
          // 폼 데이터 초기화
          Object.keys(signupData).forEach(key => {
            updateSignupField(key, '');
          });
        } else {
          alert(`회원가입 실패: ${result.error}`);
        }
      } catch (error) {
        console.error('학생 회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
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
                name='loginId'
                value={signupData.loginId}
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
