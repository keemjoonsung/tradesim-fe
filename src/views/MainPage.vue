<template>
  <div>
    <Header 
      @showLogin="showLoginModal = true"
      @showSignup="showSignupModal = true"
    />
    
    <div class="main-container">
      <!-- 메인 섹션 -->
      <main class="hero-section">
        <h2 class="hero-title">실전처럼 투자하세요</h2>
        <p class="hero-subtitle">실시간 시세로 모의투자를 경험해보세요</p>
        <button class="btn-primary btn-large" @click="showSignupModal = true">
          무료로 시작하기
        </button>
      </main>

      <!-- 모달 -->
      <LoginModal 
        v-if="showLoginModal" 
        @close="showLoginModal = false"
      />
      <SignupModal 
        v-if="showSignupModal" 
        @close="showSignupModal = false"
      />

      <!-- 푸터 -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>모두의투자</h3>
            <p>실전 같은 모의투자를 경험해보세요</p>
          </div>
          <div class="footer-section">
            <h4>문의</h4>
            <a href="mailto:kjs99014@naver.com" 
               class="email-link">
              <i class="far fa-envelope"></i>
              <span>kjs99014@naver.com</span>
            </a>
          </div>
          <div class="footer-section">
            <h4>바로가기</h4>
            <a href="https://github.com/keemjoonsung" 
               class="github-link" 
               target="_blank" 
               rel="noopener noreferrer">
              <i class="fab fa-github"></i>
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 모두의투자. All rights reserved.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import LoginModal from '@/components/modal/LoginModal.vue'
import SignupModal from '@/components/modal/SignupModal.vue'

export default {
  name: 'MainPage',
  components: {
    Header,
    LoginModal,
    SignupModal
  },
  data() {
    return {
      showLoginModal: false,
      showSignupModal: false
    }
  }
}
</script>

<style scoped>
.main-container {
  padding-top: 80px; /* 헤더 높이만큼 여백 추가 */
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 60px 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(to right, #333D4B, #4E5968);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.hero-title:hover {
  transform: scale(1.02);
}

.hero-subtitle {
  font-size: 24px;
  color: #4E5968;
  margin-bottom: 40px;
}

.btn-primary { 
  background-color: #333D4B;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  background-color: #4E5968;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(51, 61, 75, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-login {
  background: none;
  border: none;
  color: #333D4B;
  cursor: pointer;
  font-weight: bold;
  padding: 12px 24px;
  transition: all 0.2s ease;
  position: relative;
}

.btn-login:hover {
  color: #4E5968;
}

.btn-login::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 8px;
  left: 50%;
  background-color: #4E5968;
  transition: all 0.2s ease;
  transform: translateX(-50%);
}

.btn-login:hover::after {
  width: calc(100% - 48px);
}

.btn-large {
  padding: 16px 32px;
  font-size: 18px;
}

.btn-full {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.btn-full::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  transition: transform 0.5s ease;
}

.btn-full:hover::after {
  transform: translate(-50%, -50%) scale(2);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 20px;
  width: 400px;
  transform: translateY(20px);
  animation: slideUp 0.3s ease forwards;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
  position: relative;
}

.form-group input {
  transition: all 0.2s ease;
}

.form-group input:focus {
  transform: translateY(-1px);
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #DFE3E8;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background-color: #F8F9FA;
}

input:hover {
  border-color: #4E5968;
  background-color: white;
}

input:focus {
  outline: none;
  border-color: #333D4B;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(51, 61, 75, 0.1);
}

h3 {
  margin-bottom: 24px;
  font-size: 24px;
  color: #333D4B;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 모바일 반응형 스타일 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 20px;
  }
  
  .modal-content {
    width: 90%;
    margin: 0 20px;
  }
}

.footer {
  background-color: #F8F9FA;
  padding: 60px 0 20px;
  margin-top: 100px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-section h3 {
  font-size: 20px;
  margin-bottom: 16px;
}

.footer-section h4 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333D4B;
}

.footer-section p {
  color: #4E5968;
  margin-bottom: 8px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #4E5968;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section ul li a:hover {
  color: #333D4B;
}

.footer-bottom {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 20px;
  border-top: 1px solid #DFE3E8;
  text-align: center;
  color: #4E5968;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

.github-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4E5968;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-bottom: 8px;
}

.github-link:hover {
  color: #333D4B;
}

.github-link i {
  font-size: 20px;
}

.email-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4E5968;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-bottom: 8px;
}

.email-link:hover {
  color: #333D4B;
}

.email-link i {
  font-size: 20px;
}
</style>
