// lib/api/auth.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const register = (payload: RegisterPayload) => {
  return axios.post("/register", payload);
};

export const login = (payload: { email: string; password: string }) => {
  return axios.post(`/login`, payload)
}


// log the API_BASE_URL to verify correctness
console.log(API_BASE_URL); // must be backend URL
console.log(`${API_BASE_URL}/login`); // must be /api/login

// not working
export async function sendVerificationEmail() {
  return axios.post(
    `/email/verification-notification`,
    {},
    {
      withCredentials: true,
    }
  );
}

export async function checkIfEmailVerified() {
  return axios.get(`${API_BASE_URL}/email/is-verified`, {
    withCredentials: true,
  });
}

export async function logout() {
  return axios.post(
    `${API_BASE_URL}/logout`,
    {},
    {
      withCredentials: true,
    }
  );
}
