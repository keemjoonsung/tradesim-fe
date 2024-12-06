<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">&times;</button>
      <h3>회원가입</h3>
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <input 
            type="text" 
            v-model="signupForm.name" 
            placeholder="이름"
            required
          >
        </div>
        <div class="form-group">
          <input 
            type="email" 
            v-model="signupForm.email" 
            placeholder="이메일"
            required
          >
        </div>
        <div class="form-group">
          <input 
            type="password" 
            v-model="signupForm.password" 
            placeholder="비밀번호"
            required
          >
        </div>
        <div class="form-group">
          <input 
            type="password" 
            v-model="signupForm.passwordConfirm" 
            placeholder="비밀번호 확인"
            required
          >
        </div>
        <button type="submit" class="btn-primary btn-full">회원가입</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupModal',
  data() {
    return {
      signupForm: {
        email: '',
        password: '',
        passwordConfirm: '',
        name: ''
      }
    }
  },
  methods: {
    handleSignup() {
      console.log('회원가입 시도:', this.signupForm)
      // 회원가입 로직 구현
    }
  }
}
</script>

<style scoped>
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
  position: relative;
  transform: translateY(20px);
  animation: slideUp 0.3s ease forwards;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #4E5968;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: #F8F9FA;
  color: #333D4B;
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

.btn-full {
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    margin: 0 20px;
  }
}
</style> 