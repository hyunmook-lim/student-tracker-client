import React from 'react';
import './Home.css';

function Home({ userType }) {
  const handleLogout = () => {
    // 로그아웃 시 로그인 페이지로 돌아가기
    window.location.reload();
  };

  return (
    <div className='home-container'>
      <header className='home-header'>
        <h1 className='home-title'>학생 관리 시스템</h1>
        <div className='user-info'>
          <span className='user-type'>
            {userType === 'teacher' ? '선생님' : '학생'} 모드
          </span>
          <button className='logout-btn' onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className='home-main'>
        <div className='welcome-section'>
          <h2 className='welcome-title'>
            환영합니다! {userType === 'teacher' ? '선생님' : '학생'}님
          </h2>
          <p className='welcome-message'>
            {userType === 'teacher'
              ? '학생들을 관리하고 성적을 확인할 수 있습니다.'
              : '내 성적과 출석 현황을 확인할 수 있습니다.'}
          </p>
        </div>

        <div className='dashboard-section'>
          <h3 className='dashboard-title'>대시보드</h3>
          <div className='dashboard-grid'>
            {userType === 'teacher' ? (
              <>
                <div className='dashboard-card'>
                  <h4>전체 학생</h4>
                  <p className='card-number'>25명</p>
                </div>
                <div className='dashboard-card'>
                  <h4>오늘 출석</h4>
                  <p className='card-number'>23명</p>
                </div>
                <div className='dashboard-card'>
                  <h4>평균 성적</h4>
                  <p className='card-number'>85.2점</p>
                </div>
                <div className='dashboard-card'>
                  <h4>미제출 과제</h4>
                  <p className='card-number'>3건</p>
                </div>
              </>
            ) : (
              <>
                <div className='dashboard-card'>
                  <h4>내 평균 성적</h4>
                  <p className='card-number'>88.5점</p>
                </div>
                <div className='dashboard-card'>
                  <h4>출석률</h4>
                  <p className='card-number'>96%</p>
                </div>
                <div className='dashboard-card'>
                  <h4>완료한 과제</h4>
                  <p className='card-number'>12개</p>
                </div>
                <div className='dashboard-card'>
                  <h4>남은 과제</h4>
                  <p className='card-number'>2개</p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
