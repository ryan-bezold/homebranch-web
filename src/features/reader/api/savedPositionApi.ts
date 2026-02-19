import {config} from "@/shared";
import type {SavedPosition} from "../types/SavedPosition";

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshResponse = await fetch(`${config.authenticationUrl}/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (refreshResponse.ok) {
            response = await fetch(url, options);
        } else {
            window.location.href = "/login";
            throw new Error("Session expired");
        }
    }

    return response;
}

function getUserId(): string {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) throw new Error("User ID not found in session storage");
    return userId;
}

export async function getAllSavedPositions(): Promise<SavedPosition[]> {
    const userId = getUserId();
    const response = await fetchWithRetry(
        `${config.apiUrl}/users/${userId}/saved-positions`,
        {method: "GET", credentials: "include"},
    );

    if (!response.ok) throw new Error("Failed to fetch saved positions");

    const result = await response.json();
    return result.value as SavedPosition[];
}

export async function getSavedPosition(bookId: string): Promise<SavedPosition | null> {
    const userId = getUserId();
    const response = await fetchWithRetry(
        `${config.apiUrl}/users/${userId}/saved-positions/${bookId}`,
        {method: "GET", credentials: "include"},
    );

    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch saved position");

    const result = await response.json();
    return result.value as SavedPosition;
}

export async function savePosition(bookId: string, position: string, deviceName: string): Promise<void> {
    const userId = getUserId();
    const response = await fetchWithRetry(
        `${config.apiUrl}/users/${userId}/saved-positions/${bookId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({position, deviceName}),
        },
    );

    if (!response.ok) throw new Error("Failed to save position");
}

export async function deleteSavedPosition(bookId: string): Promise<void> {
    const userId = getUserId();
    const response = await fetchWithRetry(
        `${config.apiUrl}/users/${userId}/saved-positions/${bookId}`,
        {method: "DELETE", credentials: "include"},
    );

    if (!response.ok) throw new Error("Failed to delete saved position");
}
