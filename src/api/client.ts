import type { Question, UserProfile } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchQuestionsFromApi = async (): Promise<Question[] | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/questions`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.log('ℹ️ PostgreSQL server offline, using client storage.');
  }
  return null;
};

export const syncQuestionToApi = async (question: Question | Question[]): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
      signal: AbortSignal.timeout(4000)
    });
    return res.ok;
  } catch (e) {
    console.log('ℹ️ PostgreSQL server offline, question saved locally.');
    return false;
  }
};

export const deleteQuestionFromApi = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const fetchUsersFromApi = async (): Promise<UserProfile[] | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.log('ℹ️ PostgreSQL server offline, using client storage for users.');
  }
  return null;
};

export const syncUserProfileToApi = async (profile: UserProfile): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
      signal: AbortSignal.timeout(4000)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};
