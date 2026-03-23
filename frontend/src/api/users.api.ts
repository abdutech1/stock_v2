import api from "./axios";

const USERS_PREFIX = "/users";

export interface Employee {
  id: number;
  name: string;
  phoneNumber: string;
  baseSalary: number;
  role: "EMPLOYEE" | "OWNER";
  isActive: boolean;
  createdAt: string;
}

export interface CreateEmployeeInput {
  name: string;
  phoneNumber: string;
  baseSalary?: number;
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  isActive?: boolean;
}

export async function createEmployee(data: CreateEmployeeInput) {
  const res = await api.post(USERS_PREFIX, data);
  return res.data;
}

export async function getEmployees(): Promise<Employee[]> {
  const res = await api.get(USERS_PREFIX);
  return res.data;
}

// export async function deactivateEmployee(id: number) {
//   const res = await api.delete(`${USERS_PREFIX}/${id}`);
//   return res.data;
// }


// export async function activateEmployee(id: number) {
//   const res = await api.patch(`${USERS_PREFIX}/${id}/activate`);
//   return res.data;
// }


export const updateEmployee = async (id: number, data: UpdateEmployeeInput) => {
  const response = await api.patch(`${USERS_PREFIX}/${id}`, data);
  return response.data;
};

export const deactivateEmployee = async (id: number) => {
  const response = await api.delete(`${USERS_PREFIX}/${id}`);
  return response.data;
};

export const activateEmployee = async (id: number) => {
  const response = await api.patch(`${USERS_PREFIX}/${id}/activate`);
  return response.data;
};

