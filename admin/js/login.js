// Login page logic
redirectIfAuthenticated();

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    errorMessage.style.display = 'none';

    try {
        const response = await AuthAPI.login(email, password);

        if (response && response.access_token) {
            setToken(response.access_token);
            window.location.href = 'index.html';
        } else {
            throw new Error('No se recibió token de acceso');
        }
    } catch (error) {
        errorMessage.textContent = error.message || 'Email o contraseña incorrectos';
        errorMessage.style.display = 'block';

        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
});
