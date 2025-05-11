// Course Management
class CourseManager {
    constructor() {
        this.currentCourse = null;
        this.currentModule = null;
        this.currentContent = null;
    }

    // Get course details
    async getCourseDetails(courseId) {
        try {
            const response = await authManager.authenticatedFetch(`${API_BASE_URL}/courses/${courseId}/`);
            if (response.ok) {
                this.currentCourse = await response.json();
                return this.currentCourse;
            }
            throw new Error('Failed to fetch course details');
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw error;
        }
    }

    // Get course modules
    async getCourseModules(courseId) {
        try {
            const response = await authManager.authenticatedFetch(`${API_BASE_URL}/courses/${courseId}/modules/`);
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch course modules');
        } catch (error) {
            console.error('Error fetching course modules:', error);
            throw error;
        }
    }

    // Get module content
    async getModuleContent(moduleId) {
        try {
            const response = await authManager.authenticatedFetch(`${API_BASE_URL}/modules/${moduleId}/content/`);
            if (response.ok) {
                this.currentModule = await response.json();
                return this.currentModule;
            }
            throw new Error('Failed to fetch module content');
        } catch (error) {
            console.error('Error fetching module content:', error);
            throw error;
        }
    }

    // Update progress
    async updateProgress(contentId, progress) {
        try {
            const response = await authManager.authenticatedFetch(`${API_BASE_URL}/progress/update/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content_id: contentId,
                    progress: progress,
                }),
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to update progress');
        } catch (error) {
            console.error('Error updating progress:', error);
            throw error;
        }
    }

    // Enroll in course
    async enrollInCourse(courseId) {
        try {
            const response = await authManager.authenticatedFetch(`${API_BASE_URL}/courses/${courseId}/enroll/`, {
                method: 'POST',
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to enroll in course');
        } catch (error) {
            console.error('Error enrolling in course:', error);
            throw error;
        }
    }

    // Get enrolled courses
    async getEnrolledCourses() {
        try {
            const response = await authManager.authenticatedFetch(`${API_BASE_URL}/courses/enrolled/`);
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch enrolled courses');
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            throw error;
        }
    }

    // Search courses
    async searchCourses(query, filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                q: query,
                ...filters,
            });

            const response = await fetch(`${API_BASE_URL}/courses/search/?${queryParams}`);
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to search courses');
        } catch (error) {
            console.error('Error searching courses:', error);
            throw error;
        }
    }
}

// Create global course manager instance
const courseManager = new CourseManager();

// Display course details
function displayCourseDetails(course) {
    const courseContainer = document.getElementById('course-details');
    if (!courseContainer) return;

    courseContainer.innerHTML = `
        <div class="course-header">
            <img src="${course.thumbnail || 'images/default-course.jpg'}" alt="${course.title}">
            <div class="course-info">
                <h1>${course.title}</h1>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-user"></i> ${course.instructor}</span>
                    <span><i class="fas fa-star"></i> ${course.rating || 'New'}</span>
                    <span><i class="fas fa-users"></i> ${course.enrolled_students} students</span>
                </div>
                <button class="btn btn-primary enroll-btn" onclick="enrollInCourse(${course.id})">
                    Enroll Now
                </button>
            </div>
        </div>
        <div class="course-content">
            <div class="course-modules" id="course-modules">
                <!-- Modules will be loaded here -->
            </div>
        </div>
    `;
}

// Display course modules
function displayCourseModules(modules) {
    const modulesContainer = document.getElementById('course-modules');
    if (!modulesContainer) return;

    modulesContainer.innerHTML = modules.map(module => `
        <div class="module-card" onclick="loadModuleContent(${module.id})">
            <h3>${module.title}</h3>
            <p>${module.description}</p>
            <div class="module-meta">
                <span><i class="fas fa-clock"></i> ${module.duration}</span>
                <span><i class="fas fa-list"></i> ${module.content_count} lessons</span>
            </div>
        </div>
    `).join('');
}

// Display module content
function displayModuleContent(content) {
    const contentContainer = document.getElementById('module-content');
    if (!contentContainer) return;

    contentContainer.innerHTML = content.map(item => `
        <div class="content-item" data-content-id="${item.id}">
            <h4>${item.title}</h4>
            ${renderContent(item)}
        </div>
    `).join('');

    // Add event listeners for content interaction
    document.querySelectorAll('.content-item').forEach(item => {
        item.addEventListener('click', () => {
            const contentId = item.dataset.contentId;
            handleContentInteraction(contentId);
        });
    });
}

// Render content based on type
function renderContent(content) {
    switch (content.content_type) {
        case 'video':
            return `
                <video controls>
                    <source src="${content.file}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        case 'pdf':
            return `
                <iframe src="${content.file}" width="100%" height="600px"></iframe>
            `;
        case 'text':
            return `<div class="text-content">${content.text_content}</div>`;
        default:
            return `<p>Unsupported content type</p>`;
    }
}

// Handle content interaction
async function handleContentInteraction(contentId) {
    try {
        await courseManager.updateProgress(contentId, 100);
        // Update UI to show completion
        const contentItem = document.querySelector(`[data-content-id="${contentId}"]`);
        if (contentItem) {
            contentItem.classList.add('completed');
        }
    } catch (error) {
        console.error('Error updating content progress:', error);
    }
}

// Enroll in course
async function enrollInCourse(courseId) {
    try {
        const result = await courseManager.enrollInCourse(courseId);
        if (result.success) {
            alert('Successfully enrolled in the course!');
            // Update UI to show enrollment
            const enrollBtn = document.querySelector('.enroll-btn');
            if (enrollBtn) {
                enrollBtn.textContent = 'Go to Course';
                enrollBtn.onclick = () => window.location.href = `/courses/${courseId}/learn`;
            }
        }
    } catch (error) {
        alert('Failed to enroll in the course. Please try again.');
    }
}

// Load module content
async function loadModuleContent(moduleId) {
    try {
        const content = await courseManager.getModuleContent(moduleId);
        displayModuleContent(content);
    } catch (error) {
        console.error('Error loading module content:', error);
    }
}

// Search courses
async function searchCourses(query, filters = {}) {
    try {
        const results = await courseManager.searchCourses(query, filters);
        displaySearchResults(results);
    } catch (error) {
        console.error('Error searching courses:', error);
    }
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No courses found matching your search criteria.</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(course => `
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

// Export functions
window.courseManager = courseManager;
window.displayCourseDetails = displayCourseDetails;
window.displayCourseModules = displayCourseModules;
window.displayModuleContent = displayModuleContent;
window.enrollInCourse = enrollInCourse;
window.loadModuleContent = loadModuleContent;
window.searchCourses = searchCourses; 