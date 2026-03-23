"use client";

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from "@/api/axios";

import StockSummaryCards from '@/components/stock/StockSummaryCard';
import AddStockModal from '@/components/stock/AddStockModal';
import StockTable from '@/components/stock/StockTable';

export default function StockPage() {
  const queryClient = useQueryClient();

  
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    lowStockOnly: false,
    sortBy: 'quantity',
    sortOrder: 'desc',
  });

  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => {
      // Logic to remove undefined/empty filters so the API doesn't get confused
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
      );
      return api.get('/reports/inventory', { params: cleanParams }).then(r => r.data);
    },
  });
  
  const { data: purchaseVal } = useQuery({
    queryKey: ['valuation', 'purchase'],
    queryFn: () => api.get('/stocks/valuation/purchase').then(r => r.data),
  });

  // Fixed value total
  const { data: fixedVal } = useQuery({
    queryKey: ['valuation', 'fixed'],
    queryFn: () => api.get('/stocks/valuation/fixed').then(r => r.data),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock / Inventory</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
        >
          + Add Stock
        </button>
      </div>

     

<StockSummaryCards
        totalQuantity={data?.data?.summary?.totalQuantity ?? 0}
        purchaseValue={data?.data?.summary?.totalPurchaseValue ?? 0} 
        fixedValue={data?.data?.summary?.totalFixedValue ?? 0}      
        potentialProfit={
          (data?.data?.summary?.totalFixedValue || 0) - (data?.data?.summary?.totalPurchaseValue || 0)
        }
        lowStockCount={data?.data?.summary?.lowStockCount ?? 0}
        totalSkus={data?.data?.summary?.totalSKUs ?? 0}
      />

    

      <div className="pt-4">
         <StockTable data={data} isLoading={isLoading} />
      </div>
    

      {/* Add Stock Modal */}
      <AddStockModal
  open={addModalOpen}
  onClose={() => setAddModalOpen(false)}
  onSuccess={() => {
    refetch();

    queryClient.invalidateQueries({ queryKey: ['inventory'] });

    queryClient.invalidateQueries({ queryKey: ['valuation', 'purchase'] });
    queryClient.invalidateQueries({ queryKey: ['valuation', 'fixed'] });
  }}
/>
    </div>
  );
}

