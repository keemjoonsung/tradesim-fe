<template>
  <header class="header">
    <div class="header-container">
      <div class="left-section">
        <router-link to="/" class="logo-link">
          모두의투자
        </router-link>
        <nav class="nav-menu">
          <router-link to="/market" class="nav-link">거래소</router-link>
          <router-link to="/portfolio" class="nav-link">포트폴리오</router-link>
          <router-link to="/ranking" class="nav-link">랭킹</router-link>
        </nav>
      </div>

      <div class="auth-buttons">
        <button class="btn-login" @click="$emit('showLogin')">로그인</button>
        <button class="btn-signup" @click="$emit('showSignup')">회원가입</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'MainHeader'
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 48px;
}

/* router-link 공통 스타일 */
a {
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.logo-link {
  font-size: 24px;
  font-weight: bold;
  color: #333D4B;
  transition: color 0.2s ease;
  white-space: nowrap;
  cursor: pointer;
}

.logo-link:hover {
  color: #4E5968;
}

.nav-menu {
  display: flex;
  gap: 40px;
}

.nav-link {
  color: #4E5968;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 0;
}

.nav-link:hover {
  color: #333D4B;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #333D4B;
  transition: width 0.2s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.auth-buttons {
  display: flex;
  gap: 16px;
}

.btn-login {
  padding: 8px 20px;
  background: none;
  border: none;
  color: #4E5968;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-login:hover {
  color: #333D4B;
}

.btn-signup {
  padding: 8px 20px;
  background-color: #333D4B;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-signup:hover {
  background-color: #4E5968;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .header-container {
    padding: 0 16px;
  }
  
  .auth-buttons {
    gap: 8px;
  }
  
  .btn-login, .btn-signup {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style> 