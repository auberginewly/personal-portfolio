// form-validation.js - 表单验证功能

// 验证表单字段
function validateField(field, errorElement, validationFn) {
    const value = field.value.trim();
    const isValid = validationFn(value);
    
    if (isValid) {
        field.classList.remove('invalid');
        errorElement.style.display = 'none';
        return true;
    } else {
        field.classList.add('invalid');
        errorElement.style.display = 'block';
        return false;
    }
}

// 验证姓名
function validateName(name) {
    return name.length >= 2;
}

// 验证邮箱
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 验证消息
function validateMessage(message) {
    return message.length >= 10;
}

// 联系表单处理
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (!contactForm) return;
    
    const nameField = contactForm.querySelector('#name');
    const emailField = contactForm.querySelector('#email');
    const messageField = contactForm.querySelector('#message');
    const nameError = contactForm.querySelector('#name-error');
    const emailError = contactForm.querySelector('#email-error');
    const messageError = contactForm.querySelector('#message-error');
    
    if (nameField && nameError) {
        nameField.addEventListener('blur', () => {
            validateField(nameField, nameError, validateName);
        });
    }
    
    if (emailField && emailError) {
        emailField.addEventListener('blur', () => {
            validateField(emailField, emailError, validateEmail);
        });
    }
    
    if (messageField && messageError) {
        messageField.addEventListener('blur', () => {
            validateField(messageField, messageError, validateMessage);
        });
    }
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isNameValid = validateField(nameField, nameError, validateName);
        const isEmailValid = validateField(emailField, emailError, validateEmail);
        const isMessageValid = validateField(messageField, messageError, validateMessage);
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // 这里可以添加实际的表单提交逻辑
            alert('消息已发送！感谢您的联系。');
            contactForm.reset();
        }
    });
}

// 导出函数
export { initContactForm, validateField, validateName, validateEmail, validateMessage };
