// --- Frontend Logic for Student Portal ---

const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get data from form (Note: Make sure your HTML inputs have these IDs)
            const email = document.getElementById('username').value; // or 'email' ID
            const password = document.getElementById('password').value;
            const errorDisplay = document.getElementById('error-message');

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Success! Save token and name to LocalStorage
                    localStorage.setItem('token', data.token);
                    
                    // We can extract the name from the email for now 
                    // or get it from the server response if you update your API
                    const displayName = email.split('@')[0]; 
                    localStorage.setItem('userName', displayName);

                    // Redirect to Dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    // Show error message to user
                    if (errorDisplay) {
                        errorDisplay.innerText = data.error || "Login failed";
                        errorDisplay.style.display = 'block';
                    } else {
                        alert(data.error || "Login failed");
                    }
                }
            } catch (err) {
                console.error("Login Error:", err);
                alert("Cannot connect to server. Is your Backend running?");
            }
        });
    }

    // 2. Handle Logout (Global check)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear(); // Clears token and user info
            window.location.href = 'index.html';
        });
    }

    // 3. Authenticated Fetch Helper
    // Use this function whenever you need to fetch data that requires a login
    window.authFetch = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        return fetch(url, { ...options, headers });
    };
});
