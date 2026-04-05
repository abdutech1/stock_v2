import axios from './axios'

export interface Branch {
  id: number;
  name: string;
  location?: string;
  organizationId: number;
}

/**
 * Fetch all branches belonging to the user's organization
 */
export const getBranches = async (): Promise<Branch[]> => {
  const response = await axios.get("/branches");
  // Assuming your backend returns { status: "success", data: [...] }
  return response.data.data;
};

/**
 * Fetch a single branch by ID
 */
export const getBranchById = async (id: number): Promise<Branch> => {
  const response = await axios.get(`/branches/${id}`);
  return response.data.data;
};