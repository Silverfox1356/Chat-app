export function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("chat-app-user");
    if (!storedUser) return null;
    const parsed = JSON.parse(storedUser);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch (err) {
    console.error("Failed to parse stored user", err);
  }
  return null;
}
