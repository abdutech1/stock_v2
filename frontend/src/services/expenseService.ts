import api from "@/api/axios";

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  expenseDate: string;
}

export interface ExpenseResponse {
  summary: {
    totalAmount: number;
    count: number;
  };
  data: Expense[];
}

export const expenseService = {
  list: (startDate?: string, endDate?: string): Promise<ExpenseResponse> => 
    api.get("/expenses", { params: { startDate, endDate } }).then(res => res.data),
  
  create: (data: any) => api.post("/expenses", data).then(res => res.data),
    
  update: (id: number, data: any) => api.put(`/expenses/${id}`, data).then(res => res.data), // Added
    
  delete: (id: number) => api.delete(`/expenses/${id}`).then(res => res.data),
};