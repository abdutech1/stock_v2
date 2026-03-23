import api from "./axios";

const AUTH_PREFIX = "/auth";

export async function login(phoneNumber: string, password: string) {
  const res = await api.post(`${AUTH_PREFIX}/login`, {
    phoneNumber,
    password,
  });
  return res.data;
}

export async function logout() {
  await api.post(`${AUTH_PREFIX}/logout`);
}

export async function getMe() {
  const res = await api.get(`${AUTH_PREFIX}/me`);
  return res.data;
}
