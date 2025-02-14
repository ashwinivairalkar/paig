import { useState, useEffect } from 'react';

// Mock implementation of useApiConfig for MUI v4
// You might be using a store (like Redux or Zustand), so adjust this based on your setup
const useApiConfig = () => {
  // This should be replaced with your actual API config fetching logic
  return { apiBaseUrl: 'https://your-api-base-url.com' }; // Mocked apiBaseUrl
};

export async function callApi(path, options = {}) {
  const { apiBaseUrl } = useApiConfig(); // Adjusted to call useApiConfig hook correctly
  return fetch(`${apiBaseUrl}/api${path}`, options);
}

export async function fetchUserEmail() {
  try {
    const response = await callApi('/user/email', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user email');
    }

    const data = await response.json();
    return data.email;
  } catch (error) {
    console.error('Error fetching user email:', error);
    return null;
  }
}

export async function updateEvalAuthor(evalId, author) {
  const response = await callApi(`/eval/${evalId}/author`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ author }),
  });

  if (!response.ok) {
    throw new Error('Failed to update eval author');
  }

  return response.json();
}
