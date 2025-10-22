function initThemeToggle() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'dark';
  
    if (savedTheme === 'light') {
        root.classList.add('light');
    } else {
        root.classList.remove('light');
    }
    updateThemeIcon(savedTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            root.classList.add('theme-transition');
            const isLight = root.classList.toggle('light');
            const newTheme = isLight ? 'light' : 'dark';  
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            setTimeout(() => root.classList.remove('theme-transition'), 500);
        });
    }
  
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        } else if (toggleBtn) {
            // Fallback if there's no separate icon element
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
}

function initTimeUpdate() {
    const timeElement = document.querySelector('[data-testid="test-user-time"]');
    
    if (timeElement) {
        function updateTime() {
            const now = Date.now();
            timeElement.textContent = now;
        }
        updateTime();
        setInterval(updateTime, 1000);
    }
  
    const timeEl = document.getElementById('userTime');
    if (timeEl) {
        function updateTimeAlt() {
            timeEl.textContent = Date.now();
        }
        updateTimeAlt();
        setInterval(updateTimeAlt, 1000);
    }
}

function initFormValidation() {
    const form = document.getElementById('contact-form');  
    if (!form) return; 
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const contactReasonInputs = document.querySelectorAll('input[name="contactReason"]');
    const messageInput = document.getElementById('message');
    const consentInput = document.getElementById('consent');
    const successMessage = document.getElementById('success-message');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validationRules = {
        firstName: {
            element: firstNameInput,
            errorElement: document.getElementById('first-name-error'),
            validate: (value) => {
                if (!value.trim()) {
                    return 'First name is required.';
                }
                if (value.trim().length < 2) {
                    return 'First name must be at least 2 characters long.';
                }
                return '';
            }
        },
        lastName: {
            element: lastNameInput,
            errorElement: document.getElementById('last-name-error'),
            validate: (value) => {
                if (!value.trim()) {
                    return 'Last name is required.';
                }
                if (value.trim().length < 2) {
                    return 'Last name must be at least 2 characters long.';
                }
                return '';
            }
        },
        email: {
            element: emailInput,
            errorElement: document.getElementById('email-error'),
            validate: (value) => {
                if (!value.trim()) {
                    return 'Email is required.';
                }
                if (!emailRegex.test(value.trim())) {
                    return 'Please enter a valid email address.';
                }
                return '';
            }
        },
        contactReason: {
            element: contactReasonInputs,
            errorElement: document.getElementById('contact-reason-error'),
            validate: () => {
                const checked = Array.from(contactReasonInputs).some(input => input.checked);
                if (!checked) {
                    return 'Please select the purpose of your message.';
                }
                return '';
            }
        },
        message: {
            element: messageInput,
            errorElement: document.getElementById('message-error'),
            validate: (value) => {
                if (!value.trim()) {
                    return 'Message is required.';
                }
                if (value.trim().length < 10) {
                    return 'Message must be at least 10 characters long.';
                }
                return '';
            }
        },
        consent: {
            element: consentInput,
            errorElement: document.getElementById('consent-error'),
            validate: () => {
                if (!consentInput.checked) {
                    return 'You must consent to being contacted.';
                }
                return '';
            }
        }
    };

    function validateField(fieldName) {
        const rule = validationRules[fieldName];
        let value;
        if (fieldName === 'contactReason') {
            value = null; // Not used for radio buttons
        } else if (fieldName === 'consent') {
            value = null; // Not used for checkbox
        } else {
            value = rule.element.value;
        }
        const errorMessage = rule.validate(value);

        if (errorMessage) {
            rule.errorElement.textContent = errorMessage;     
            if (fieldName === 'contactReason') {
                contactReasonInputs.forEach(input => {
                    input.classList.add('invalid');
                    input.setAttribute('aria-invalid', 'true');
                });
            } else {
                rule.element.classList.add('invalid');
                rule.element.setAttribute('aria-invalid', 'true');
            }
            return false;
        } else {
            rule.errorElement.textContent = '';
            
            if (fieldName === 'contactReason') {
                contactReasonInputs.forEach(input => {
                    input.classList.remove('invalid');
                    input.setAttribute('aria-invalid', 'false');
                });
            } else {
                rule.element.classList.remove('invalid');
                rule.element.setAttribute('aria-invalid', 'false');
            }
            return true;
        }
    }

    function validateForm() {
        let isValid = true;
        for (const fieldName in validationRules) {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        }
        return isValid;
    }
  
    function clearErrors() {
        for (const fieldName in validationRules) {
            const rule = validationRules[fieldName];
            rule.errorElement.textContent = '';
          
            if (fieldName === 'contactReason') {
                contactReasonInputs.forEach(input => {
                    input.classList.remove('invalid');
                    input.removeAttribute('aria-invalid');
                });
            } else {
                rule.element.classList.remove('invalid');
                rule.element.removeAttribute('aria-invalid');
            }
        }
        successMessage.hidden = true;
    }
  
    function handleSuccess() {
        form.reset();
        clearErrors();
        successMessage.hidden = false;
        successMessage.focus();
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  
    firstNameInput.addEventListener('blur', () => validateField('firstName'));
    lastNameInput.addEventListener('blur', () => validateField('lastName'));
    emailInput.addEventListener('blur', () => validateField('email'));
    messageInput.addEventListener('blur', () => validateField('message'));
    consentInput.addEventListener('change', () => validateField('consent'));
    
    contactReasonInputs.forEach(input => {
        input.addEventListener('change', () => validateField('contactReason'));
    });

    firstNameInput.addEventListener('input', () => {
        if (firstNameInput.classList.contains('invalid')) {
            validateField('firstName');
        }
    });
    lastNameInput.addEventListener('input', () => {
        if (lastNameInput.classList.contains('invalid')) {
            validateField('lastName');
        }
    });
    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('invalid')) {
            validateField('email');
        }
    });
    messageInput.addEventListener('input', () => {
        if (messageInput.classList.contains('invalid')) {
            validateField('message');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        successMessage.hidden = true;
    
        if (validateForm()) {
            handleSuccess();
        } else {
            for (const fieldName in validationRules) {
                const rule = validationRules[fieldName];
                
                if (fieldName === 'contactReason') {
                    if (rule.errorElement.textContent) {
                        contactReasonInputs[0].focus();
                        break;
                    }
                } else {
                    if (rule.element.classList.contains('invalid')) {
                        rule.element.focus();
                        break;
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initTimeUpdate();
    initFormValidation();
});

