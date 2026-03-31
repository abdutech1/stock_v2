import api from "./axios";

const AUTH_PREFIX = "/auth";

export async function login(phoneNumber: string, password: string) {
  // Backend returns: { status: "success", data: { user: {...} } }
  const res = await api.post(`${AUTH_PREFIX}/login`, { phoneNumber, password });
  return res.data.data; 
}

export async function logout() {
  await api.post(`${AUTH_PREFIX}/logout`);
}

export async function getMe() {
  const res = await api.get(`${AUTH_PREFIX}/me`);
  return res.data.data;
}
