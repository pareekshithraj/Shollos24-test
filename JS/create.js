document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthValue = document.getElementById('strengthValue');
  
    // Name field - allow only alphabets and spaces
    document.getElementById('fullName').addEventListener('input', function(e) {
      this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    });
  
    // Phone field - allow only numbers
    document.getElementById('phone').addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, '');
    });
  
    // Password toggle
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  
    // Confirm password toggle
    toggleConfirmPassword.addEventListener('click', function() {
      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordInput.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  
    // Password strength checker
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      
      // Length check
      if (password.length >= 8) strength++;
      // Contains numbers
      if (password.match(/\d/)) strength++;
      // Contains lowercase
      if (password.match(/[a-z]/)) strength++;
      // Contains uppercase
      if (password.match(/[A-Z]/)) strength++;
      // Contains special chars
      if (password.match(/[^a-zA-Z0-9]/)) strength++;
      
      // Update strength meter
      const width = (strength / 5) * 100;
      strengthBar.style.width = `${width}%`;
      
      // Update colors and text
      if (strength <= 2) {
        strengthBar.style.backgroundColor = '#ff4444';
        strengthValue.textContent = 'Weak';
      } else if (strength <= 4) {
        strengthBar.style.backgroundColor = '#ffbb33';
        strengthValue.textContent = 'Medium';
      } else {
        strengthBar.style.backgroundColor = '#00C851';
        strengthValue.textContent = 'Strong';
      }
    });
  
    // Password match checker
    confirmPasswordInput.addEventListener('input', function() {
      if (this.value !== passwordInput.value) {
        passwordError.style.display = 'block';
      } else {
        passwordError.style.display = 'none';
      }
    });
    
    // Email field validation
document.getElementById('email').addEventListener('input', function(e) {
    // Get current cursor position
    const start = this.selectionStart;
    const end = this.selectionEnd;
    
    // Allow only alphanumeric, @, and .
    this.value = this.value.replace(/[^a-zA-Z0-9@.]/g, '');
    
    // Handle @ symbol count
    const atCount = (this.value.match(/@/g) || []).length;
    
    // If more than one @, keep only the first one
    if (atCount > 1) {
        const parts = this.value.split('@');
        this.value = parts[0] + '@' + parts.slice(1).join('').replace(/@/g, '');
    }
    
    // Restore cursor position
    this.setSelectionRange(start, end);
});

// Handle paste for email field
document.getElementById('email').addEventListener('paste', function(e) {
    e.preventDefault();
    let pasteData = e.clipboardData.getData('text/plain');
    
    // Clean pasted data
    pasteData = pasteData.replace(/[^a-zA-Z0-9@.]/g, '');
    
    // Count existing @ in field and in pasted data
    const existingAts = (this.value.match(/@/g) || []).length;
    const newAts = (pasteData.match(/@/g) || []).length;
    
    // If pasting would result in >1 @, keep only first one
    if (existingAts + newAts > 1) {
        const firstAt = pasteData.indexOf('@');
        if (firstAt !== -1) {
            pasteData = pasteData.substring(0, firstAt + 1) + 
                       pasteData.substring(firstAt + 1).replace(/@/g, '');
        }
    }
    
    document.execCommand('insertText', false, pasteData);
});
  
    // Form submission
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Check if passwords match
      if (passwordInput.value !== confirmPasswordInput.value) {
        passwordError.style.display = 'block';
        return;
      }
      
      // If everything is valid
      alert('Account created successfully!');
      // You can add form submission logic here
    });
  });