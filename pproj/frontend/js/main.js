// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// DOM Elements
const loginBtn = document.querySelector('.btn-login');
const signupBtn = document.querySelector('.btn-signup');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const searchInput = document.querySelector('.hero-search input');
const searchBtn = document.querySelector('.btn-search');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load featured courses
    loadFeaturedCourses();
    // Load categories
    loadCategories();
    // Check authentication status
    checkAuthStatus();
});

// Modal Event Listeners
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === signupModal) {
        signupModal.style.display = 'none';
    }
});

// Form Submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            loginModal.style.display = 'none';
            updateAuthUI();
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Registration successful! Please login.');
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        } else {
            const data = await response.json();
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
});

// Search Functionality
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        window.location.href = `/courses?search=${encodeURIComponent(searchTerm)}`;
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// API Functions
async function loadFeaturedCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/featured/`);
        if (response.ok) {
            const courses = await response.json();
            displayCourses(courses);
        }
    } catch (error) {
        console.error('Error loading featured courses:', error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/categories/`);
        if (response.ok) {
            const categories = await response.json();
            displayCategories(categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// UI Update Functions
function displayCourses(courses) {
    const courseGrid = document.getElementById('featured-courses');
    courseGrid.innerHTML = courses.map(course => `
        <div class="course-card">
            <img src="${course.thumbnail || 'images/default-course.jpg'}" alt="${course.title}">
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description.substring(0, 100)}...</p>
                <div class="course-meta">
                    <span><i class="fas fa-user"></i> ${course.instructor}</span>
                    <span><i class="fas fa-star"></i> ${course.rating || 'New'}</span>
                </div>
                <a href="/courses/${course.id}" class="btn btn-primary">View Course</a>
            </div>
        </div>
    `).join('');
}

function displayCategories(categories) {
    const categoryGrid = document.getElementById('categories');
    categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card">
            <i class="fas ${getCategoryIcon(category.name)}"></i>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <a href="/categories/${category.id}" class="btn btn-outline">Browse Courses</a>
        </div>
    `).join('');
}

function getCategoryIcon(categoryName) {
    const icons = {
        'Programming': 'fa-code',
        'Design': 'fa-palette',
        'Business': 'fa-briefcase',
        'Marketing': 'fa-bullhorn',
        'Music': 'fa-music',
        'Photography': 'fa-camera',
        'default': 'fa-book'
    };
    return icons[categoryName] || icons.default;
}

function updateAuthUI() {
    const token = localStorage.getItem('access_token');
    if (token) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        // Add user profile button
        const profileBtn = document.createElement('button');
        profileBtn.className = 'btn btn-profile';
        profileBtn.innerHTML = '<i class="fas fa-user"></i> Profile';
        profileBtn.onclick = () => window.location.href = '/profile';
        document.querySelector('.nav-auth').appendChild(profileBtn);
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem('access_token');
    if (token) {
        updateAuthUI();
    }
}

// Error Handling
function handleApiError(error) {
    console.error('API Error:', error);
    if (error.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }
} 