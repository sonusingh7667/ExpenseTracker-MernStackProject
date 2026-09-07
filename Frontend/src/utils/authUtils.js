/**
 * Helper utilities for authentication token management and API error handling
 */

export const getToken = () => {
  try {
    return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
  } catch (err) {
    console.error("Error reading token from storage:", err);
    return null;
  }
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const clearAuth = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  } catch (err) {
    console.error("Error clearing auth storage:", err);
  }
};

export const handleAuthError = (err, navigate, onLogout) => {
  const status = err?.response?.status;
  const message = err?.response?.data?.message || err?.message || "";

  const isAuthError =
    status === 401 ||
    message.toLowerCase().includes("token") ||
    message.toLowerCase().includes("authorized") ||
    message.toLowerCase().includes("unauthorized");

  if (isAuthError) {
    clearAuth();
    if (typeof onLogout === "function") {
      onLogout();
    }
    alert("Your session has expired or is invalid. Please log in again.");
    if (typeof navigate === "function") {
      navigate("/login");
    } else {
      window.location.href = "/login";
    }
    return true;
  }

  return false;
};
