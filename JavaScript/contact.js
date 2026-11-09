// Contact Form Validation & Processing Response
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();


        const errorElements = contactForm.querySelectorAll('.error-msg');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });

        if (formResponse) {
            formResponse.classList.add('hidden');
            formResponse.textContent = '';
        }


        const fullname = document.getElementById('fullname')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        let isValid = true;

        if (!fullname) {
            showError('fullname-error', 'Please enter your full name.');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('email-error', 'Please enter your email address.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email-error', 'Please enter a valid email address (e.g., name@domain.com).');
            isValid = false;
        }

        if (!subject) {
            showError('subject-error', 'Please specify a subject for your enquiry.');
            isValid = false;
        }

        if (!message) {
            showError('message-error', 'Please enter your enquiry message.');
            isValid = false;
        } else if (message.length < 10) {
            showError('message-error', 'Message must be at least 10 characters long.');
            isValid = false;
        }

        if (isValid) {
            if (formResponse) {
                formResponse.textContent = `Thank you, ${fullname}! Your enquiry regarding "${subject}" has been received. We will respond to ${email} shortly.`;
                formResponse.style.backgroundColor = 'var(--action-accent)';
                formResponse.style.color = 'var(--text-inverse)';
                formResponse.classList.remove('hidden');
            }
            contactForm.reset();
        }
    });

    function showError(elementId, message) {
        const errEl = document.getElementById(elementId);
        if (errEl) {
            errEl.textContent = message;
            errEl.style.display = 'block';
        }
    }
});