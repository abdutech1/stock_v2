import api from "./axios";

const USERS_PREFIX = "/users";

export type BranchRole = "MANAGER" | "CASHIER" | "STOCK_KEEPER"; 

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
  branchRole: BranchRole;
  branchId: number;
  baseSalary?: number; 
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  isActive?: boolean;
}

export async function createEmployee(data: CreateEmployeeInput) {
  const res = await api.post(USERS_PREFIX, data);
  return res.data;
}



export const getEmployees = async (branchId?: number) => {
  // Pass branchId as a query parameter
  const response = await api.get(`/users`, {
    params: { branchId } 
  });
  return response.data;
};


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


export const transferEmployee = async (id: number, data: { newBranchId: number; newRole: string }) => {
  const response = await api.patch(`/users/${id}/transfer`, data);
  return response.data;
};

