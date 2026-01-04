export async function logout() {
    try {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
    } catch {
        // ignore
    }

    // Always redirect
    window.location.href = "/login";
}
