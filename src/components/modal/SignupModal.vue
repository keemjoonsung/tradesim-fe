<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">&times;</button>
      <h3>회원가입</h3>
      <form @submit.prevent="handleSignup">
        <div class="form-group email-section">
          <div class="email-input-group">
            <div class="input-wrapper">
              <input 
                type="email" 
                v-model="signupForm.email" 
                placeholder="이메일"
                required
                :disabled="isEmailVerified"
                @input="validateEmail"
              >
              <span v-if="emailError" class="error-message">{{ emailError }}</span>
              <span v-if="emailDuplicateStatus === 'checking'" class="info-message">중복 확인 중...</span>
              <span v-if="emailDuplicateStatus === 'duplicate'" class="error-message">이미 사용 중인 이메일입니다</span>
            </div>
            <button 
              v-if="!isEmailVerified"
              type="button" 
              class="btn-verify" 
              @click="sendVerificationCode"
              :disabled="shouldDisableVerifyButton"
            >
              {{ isEmailVerifying ? '재전송' : '인증하기' }}
            </button>
          
            <div v-else class="verification-success">
              <span class="success-icon">✓</span>
              인증완료
            </div>
          </div>
          
          <!-- 인증번호 입력 섹션 -->
          <div v-if="isEmailVerifying && !isEmailVerified" class="verification-section">
            <div class="verification-input-group">
              <input 
                type="text" 
                v-model="verificationCode" 
                placeholder="인증번호 6자리 입력"
                maxlength="6"
                required
              >
              <span class="timer" v-if="remainingTime">{{ formattedTime }}</span>
            </div>
            <button 
              type="button" 
              class="btn-confirm" 
              @click="verifyCode"
              :disabled="!verificationCode || verificationCode.length < 6"
            >
              인증확인
            </button>
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <input 
              type="text" 
              :value="signupForm.name"
              placeholder="닉네임 (영문, 숫자 3-12자)"
              required
              @input="handleNameInput"
              :class="{ 
                'valid-input': isNameValid, 
                'error-input': nameError 
              }"
            >
            <span v-if="nameError" class="error-message">{{ nameError }}</span>
          </div>
        </div>

        <div class="form-group password-section">
          <div class="input-wrapper">
            <input 
              type="password" 
              v-model="signupForm.password" 
              placeholder="비밀번호"
              required
              @input="validatePassword"
              :class="{ 'valid-input': isPasswordValid }"
            >
          </div>
          <div class="password-guide-static" v-if="!isPasswordValid">
            <div class="guide-item" :class="{ 'valid': passwordLength }">
              <span class="check-icon">{{ passwordLength ? '✓' : '·' }}</span>
              8자리 이상
            </div>
            <div class="guide-item" :class="{ 'valid': passwordCase }">
              <span class="check-icon">{{ passwordCase ? '✓' : '·' }}</span>
              영문 포함
            </div>
            <div class="guide-item" :class="{ 'valid': passwordNumber }">
              <span class="check-icon">{{ passwordNumber ? '✓' : '·' }}</span>
              숫자 포함
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <input 
              type="password" 
              v-model="signupForm.passwordConfirm" 
              placeholder="비밀번호 확인"
              required
              @input="validatePasswordConfirm"
              :class="{ 
                'valid-input': isPasswordConfirmValid, 
                'error-input': passwordConfirmError 
              }"
            >
            <span v-if="passwordConfirmError" class="error-message">{{ passwordConfirmError }}</span>
          </div>
        </div>
        <button 
          type="submit" 
          class="btn-primary btn-full"
          :disabled="!isFormValid"
        >
          회원가입
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'SignupModal',
  data() {
    return {
      signupForm: {
        email: '',
        password: '',
        passwordConfirm: '',
        name: ''
      },
      emailError: '',
      passwordError: '',
      passwordConfirmError: '',
      isEmailVerifying: false,
      isEmailVerified: false,
      verificationCode: '',
      remainingTime: 0,
      timerInterval: null,
      emailDuplicateStatus: null, // null | 'checking' | 'duplicate' | 'available'
      nameError: '',
      isNameValid: false,
    }
  },
  created() {
    // 디바운스된 이메일 중복 체크 함수 생성
    this.debouncedCheckEmailDuplicate = debounce(this.checkEmailDuplicate, 500)
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.remainingTime / 60)
      const seconds = this.remainingTime % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    passwordLength() {
      return this.signupForm.password.length >= 8
    },
    passwordCase() {
      return /[a-zA-Z]/.test(this.signupForm.password)  // 영문만 포함되면 됨
    },
    passwordNumber() {
      return /\d/.test(this.signupForm.password)
    },
    isPasswordValid() {
      return this.passwordLength && this.passwordCase && this.passwordNumber
    },
    isPasswordConfirmValid() {
      return this.signupForm.passwordConfirm && 
             this.signupForm.password === this.signupForm.passwordConfirm
    },
    isFormValid() {
      return this.isEmailVerified &&  // 이메일 인증 완료
             this.isPasswordValid &&   // 비밀번호 형식 일치
             this.isPasswordConfirmValid &&
             this.isNameValid  // 닉네임 유효성 조건 추가
    },
    shouldDisableVerifyButton() {
      // 재전송 상태일 때는 이메일 유효성만 체크
      if (this.isEmailVerifying) {
        return !this.signupForm.email || !!this.emailError
      }
      // 최초 인증 시에는 모든 조건 체크
      return !this.signupForm.email || 
             !!this.emailError || 
             this.emailDuplicateStatus === 'duplicate'
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.signupForm.email) {
        this.emailError = '이메일을 입력해주세요'
      } else if (!emailRegex.test(this.signupForm.email)) {
        this.emailError = '올바른 이메일 형식이 아닙니다'
      } else {
        this.emailError = ''
        // 유효한 이메일인 경우에만 중복 체크 실행
        this.debouncedCheckEmailDuplicate()
      }
    },

    validatePassword() {
      if (!this.signupForm.password) {
        this.passwordError = '비밀번호를 입력해주세요'
      } else {
        this.passwordError = ''
      }
      
      if (this.signupForm.passwordConfirm) {
        this.validatePasswordConfirm()
      }
    },

    validatePasswordConfirm() {
      if (!this.signupForm.passwordConfirm) {
        this.passwordConfirmError = ''
      } else if (this.signupForm.password !== this.signupForm.passwordConfirm) {
        this.passwordConfirmError = '비밀번호가 일치하지 않습니다'
      } else {
        this.passwordConfirmError = ''
      }
    },

    async checkEmailDuplicate() {
      if (!this.signupForm.email || this.emailError) return

      this.emailDuplicateStatus = 'checking'
      try {
        // TODO: 실제 API 구현
        const isDuplicate = await this.checkEmailDuplicateAPI(this.signupForm.email)
        this.emailDuplicateStatus = isDuplicate ? 'duplicate' : 'available'
      } catch (error) {
        console.error('이메일 중복 확인 실패:', error)
        this.emailDuplicateStatus = null
      }
    },

    async checkEmailDuplicateAPI(email) {
      // TODO: 실제 API 구현
      console.log('이메일 중복 확인:', email)
      return false // 임시 반환값
    },

    async sendVerificationCode() {
      try {
        this.isEmailVerifying = true
        this.remainingTime = 180 // 3분
        this.startTimer()
        
        // API 호출을 위한 준비
        await this.sendVerificationEmail(this.signupForm.email)
      } catch (error) {
        console.error('인증 코드 발송 실패:', error)
        // 에러 처리
      }
    },
    async verifyCode() {
      try {
        // API 호출을 위한 준비
        const isValid = await this.verifyEmailCode(this.signupForm.email, this.verificationCode)
        
        if (isValid) {
          this.isEmailVerified = true
          this.isEmailVerifying = false
          clearInterval(this.timerInterval)
        }
      } catch (error) {
        console.error('인증 코드 확인 실패:', error)
        // 에러 처리
      }
    },
    // API 호출 메서드들
    async sendVerificationEmail(email) {
      // TODO: 실제 API 구현
      console.log('인증 메일 발송:', email)
      return true
    },
    async verifyEmailCode(email, code) {
      // TODO: 실제 API 구현
      console.log('인증 코드 확인:', email, code)
      return true
    },
    async handleSignup() {
      if (!this.isEmailVerified) return
      
      try {
        // API 호출을 위한 준비
        await this.registerUser(this.signupForm)
        this.$emit('signup-success')
      } catch (error) {
        console.error('회원가입 실패:', error)
        // 에러 처리
      }
    },
    async registerUser(userData) {
      // TODO: 실제 API 구현
      console.log('회원가입:', userData)
      return true
    },
    startTimer() {
      clearInterval(this.timerInterval)
      this.timerInterval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--
        } else {
          clearInterval(this.timerInterval)
          this.isEmailVerifying = false
          this.verificationCode = ''
        }
      }, 1000)
    },
    handleNameInput(e) {
      const value = e.target.value
      // 먼저 유효성 검사를 수행
      const nameRegex = /^[a-zA-Z0-9]{3,12}$/
      
      if (!value) {
        this.nameError = '닉네임을 입력해주세요'
        this.isNameValid = false
      } else if (value.length < 3) {
        this.nameError = '닉네임은 3자 이상이어야 합니다'
        this.isNameValid = false
      } else if (value.length > 12) {
        this.nameError = '닉네임은 12자 이하여야 합니다'
        this.isNameValid = false
      } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value)) {
        this.nameError = '한글은 사용할 수 없습니다'
        this.isNameValid = false
      } else if (/[^a-zA-Z0-9]/.test(value)) {
        this.nameError = '특수문자는 사용할 수 없습니다'
        this.isNameValid = false
      } else if (!nameRegex.test(value)) {
        this.nameError = '영문, 숫자만 사용 가능합니다'
        this.isNameValid = false
      } else {
        this.nameError = ''
        this.isNameValid = true
      }
      
      // 값 업데이트
      this.signupForm.name = value
    },
  },
  beforeUnmount() {
    clearInterval(this.timerInterval)
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
  max-height: 90vh;
  overflow-y: visible;
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
  margin-bottom: 24px;
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
  margin-top: 8px;
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

.email-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.email-input-group {
  display: flex;
  gap: 8px;
}

.verification-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.verification-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.timer {
  position: absolute;
  right: 12px;
  color: #E03131;
  font-size: 14px;
  font-weight: 500;
}

.btn-verify, .btn-confirm {
  padding: 12px 20px;
  border: 1px solid #DFE3E8;
  border-radius: 8px;
  background-color: white;
  color: #333D4B;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-verify:hover, .btn-confirm:hover {
  background-color: #F8F9FA;
  border-color: #4E5968;
}

.btn-verify:disabled, .btn-confirm:disabled {
  background-color: #F8F9FA;
  border-color: #DFE3E8;
  color: #AEB5BC;
  cursor: not-allowed;
}

input:disabled {
  background-color: #F8F9FA;
  color: #4E5968;
  cursor: not-allowed;
}

.btn-primary:disabled {
  background-color: #AEB5BC;
  cursor: not-allowed;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .email-input-group {
    flex-direction: column;
  }
  
  .btn-verify, .btn-confirm {
    width: 100%;
  }
}

.verification-success {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background-color: #F4FFF4;
  border: 1px solid #2F9E44;
  border-radius: 8px;
  color: #2F9E44;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.success-icon {
  font-size: 16px;
  font-weight: bold;
}

.email-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 0;
}

.input-wrapper input {
  transition: all 0.2s ease;
}

.error-message {
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 4px;
  font-size: 12px;
  color: #E03131;
  white-space: nowrap;
}

.info-message {
  position: absolute;
  left: 0;
  bottom: -20px;
  font-size: 12px;
  color: #4E5968;
}

input.error {
  border-color: #E03131;
}

input.error:focus {
  box-shadow: 0 0 0 3px rgba(224, 49, 49, 0.1);
}

.email-input-group {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.btn-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-section {
  margin-bottom: 40px;
}

.password-guide-static {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #98A1AB;
  line-height: 1.2;
}

.guide-item.valid {
  color: #2F9E44;
}

.check-icon {
  font-size: 12px;
  line-height: 1;
  min-width: 12px;
}

.guide-item.valid .check-icon {
  color: #2F9E44;
}

.form-group:has(input[type="password"]) {
  margin-bottom: 10px;
}

.form-group:last-of-type {
  margin-bottom: 24px;
}

.input-wrapper {
  margin-bottom: 0;
}

.input-wrapper input {
  transition: all 0.2s ease;
}

.valid-input {
  border-color: #2F9E44 !important;
  background-color: #F4FFF4 !important;
}

.valid-input:focus {
  border-color: #2F9E44 !important;
  box-shadow: 0 0 0 3px rgba(47, 158, 68, 0.1) !important;
}

.error-input {
  border-color: #E03131 !important;
  background-color: #FFF5F5 !important;
}

.error-input:focus {
  border-color: #E03131 !important;
  box-shadow: 0 0 0 3px rgba(224, 49, 49, 0.1) !important;
}

.password-guide {
  margin-top: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #98A1AB;
  line-height: 1.2;
}

.guide-item.valid {
  color: #2F9E44;
}

.check-icon {
  font-size: 12px;
  line-height: 1;
  min-width: 12px;
}

.guide-item.valid .check-icon {
  color: #2F9E44;
}

.error-message {
  color: #E03131;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.password-group {
  margin-bottom: 80px;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.password-guide {
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0;
  background-color: white;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #98A1AB;
  line-height: 1;
  padding: 2px 0;
  position: relative;
  z-index: 1;
}

.guide-item.valid {
  color: #2F9E44;
}

.check-icon {
  font-size: 12px;
  line-height: 1;
  min-width: 12px;
}

.guide-item.valid .check-icon {
  color: #2F9E44;
}

.error-message {
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 4px;
  font-size: 12px;
  color: #E03131;
  white-space: nowrap;
}

.valid-input {
  border-color: #2F9E44 !important;
  background-color: #F4FFF4 !important;
}

.error-input {
  border-color: #E03131 !important;
  background-color: #FFF5F5 !important;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #DFE3E8;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.btn-primary {
  margin-top: 16px;
  width: 100%;
}

/* 마지막 form-group의 마진 조정 */
.form-group:last-of-type {
  margin-bottom: 24px;
}
</style> 