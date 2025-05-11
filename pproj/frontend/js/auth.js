// JWT Token Management
class AuthManager {
    constructor() {
        this.accessToken = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
        this.tokenRefreshTimeout = null;
    }

    // Set tokens
    setTokens(access, refresh) {
        this.accessToken = access;
        this.refreshToken = refresh;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        this.scheduleTokenRefresh();
    }

    // Clear tokens
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (this.tokenRefreshTimeout) {
            clearTimeout(this.tokenRefreshTimeout);
        }
    }

    // Get access token
    getAccessToken() {
        return this.accessToken;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.accessToken;
    }

    // Schedule token refresh
    scheduleTokenRefresh() {
        if (this.tokenRefreshTimeout) {
            clearTimeout(this.tokenRefreshTimeout);
        }

        // Refresh token 5 minutes before it expires
        const tokenData = this.parseJwt(this.accessToken);
        const expiresIn = tokenData.exp * 1000 - Date.now() - 5 * 60 * 1000;
        
        if (expiresIn > 0) {
            this.tokenRefreshTimeout = setTimeout(() => {
                this.refreshAccessToken();
            }, expiresIn);
        }
    }

    // Parse JWT token
    parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    // Refresh access token
    async refreshAccessToken() {
        try {
            const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: this.refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                this.setTokens(data.access, this.refreshToken);
                return true;
            } else {
                this.clearTokens();
                window.location.href = '/login';
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            this.clearTokens();
            window.location.href = '/login';
            return false;
        }
    }

    // Get authenticated fetch
    async authenticatedFetch(url, options = {}) {
        if (!this.accessToken) {
            throw new Error('No access token available');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.accessToken}`,
        };

        try {
            const response = await fetch(url, { ...options, headers });

            if (response.status === 401) {
                // Token expired, try to refresh
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry the request with new token
                    headers.Authorization = `Bearer ${this.accessToken}`;
                    return fetch(url, { ...options, headers });
                }
            }

            return response;
        } catch (error) {
            console.error('Authenticated fetch error:', error);
            throw error;
        }
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Logout function
function logout() {
    authManager.clearTokens();
    window.location.href = '/';
}

// Check if user is authenticated
function checkAuth() {
    if (!authManager.isAuthenticated()) {
        window.location.href = '/login';
    }
}

// Get user profile
async function getUserProfile() {
    try {
        const response = await authManager.authenticatedFetch(`${API_BASE_URL}/users/profile/`);
        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch user profile');
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

// Update user profile
async function updateUserProfile(profileData) {
    try {
        const response = await authManager.authenticatedFetch(`${API_BASE_URL}/users/profile/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to update user profile');
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

// Change password
async function changePassword(currentPassword, newPassword) {
    try {
        const response = await authManager.authenticatedFetch(`${API_BASE_URL}/users/change-password/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
            }),
        });

        if (response.ok) {
            return true;
        }
        throw new Error('Failed to change password');
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
}

// Export functions
window.authManager = authManager;
window.logout = logout;
window.checkAuth = checkAuth;
window.getUserProfile = getUserProfile;
window.updateUserProfile = updateUserProfile;
window.changePassword = changePassword; 