"use client";

import { useMemo, useState } from "react";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  PackageSearch,
  Loader2,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Ban,
  Power,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CategoryGroup {
  categoryName: string;
  categoryId: number;
  isActive: boolean;
  imageUrl?: string;
  items: StockItem[];
  totalStock: number;
  totalValue: number;
}

// interface StockItem {
//   priceCategoryId: number;
//   name: string | null;
//   fixedPrice: number;
//   isActive: boolean;
//   category: { id: number; name: string; imageUrl?: string };
//   stock: {
//     quantity: number;
//     purchasePrice: number;
//   } | null;
// }


interface StockItem {
  priceCategoryId: number;
  name: string | null;
  fixedPrice: number;
  isActive: boolean;
  category: { id: number; name: string; imageUrl?: string };
  stock: {
    quantity: number;
    purchasePrice: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}



export default function StockTable({
  data,
  isLoading,
}: {
  data: { data: { items: StockItem[] } } | undefined;
  isLoading: boolean;
}) {

  const [editName, setEditName] = useState("");
const [editImage, setEditImage] = useState<File | null>(null);


// Near your other useState hooks
const [stockEditDialogOpen, setStockEditDialogOpen] = useState(false);
const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
const [editQuantity, setEditQuantity] = useState<string>("");
const [editPurchasePrice, setEditPurchasePrice] = useState<string>("");


  const queryClient = useQueryClient();

  const BASE_URL = "http://localhost:5000";

  const rawItems = useMemo(() => data?.data?.items || [], [data]);

  // ─── Mutations ────────────────────────────────────────
  // Variant (price category) mutations (unchanged)
  const updateStockMutation = useMutation({
    mutationFn: ({
      priceCategoryId,
      purchasePrice,
      quantity,
    }: {
      priceCategoryId: number;
      purchasePrice?: number;
      quantity?: number;
    }) => api.patch(`/stocks/${priceCategoryId}`, { purchasePrice, quantity }),
    onSuccess: () => {
      toast.success("Stock updated");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Update failed"),
  });

  const deleteStockMutation = useMutation({
    mutationFn: (priceCategoryId: number) =>
      api.delete(`/stocks/${priceCategoryId}`),
    onSuccess: () => {
      toast.success("Stock deleted");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || "Cannot delete — sales exist",
      ),
  });

  const deactivateVariant = useMutation({
    mutationFn: (id: number) => api.patch(`/price-categories/${id}/deactivate`),
    onSuccess: () => {
      toast.success("Variant deactivated");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Cannot deactivate"),
  });

  const activateVariant = useMutation({
    mutationFn: (id: number) => api.patch(`/price-categories/${id}/activate`),
    onSuccess: () => {
      toast.success("Variant activated");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Activation failed"),
  });

 

  const updateCategoryMutation = useMutation({
  mutationFn: ({ id, name, image }: { id: number; name?: string; image?: File }) => {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (image) formData.append("image", image);
    return api.put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  onSuccess: () => {
    toast.success("Category updated");
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  },
  onError: (err: any) => {
    const backendError = err?.response?.data?.error?.message;
    
    const standardMessage = err?.response?.data?.message;
    
    toast.error(backendError || standardMessage || "Update failed");
  },
});

  const deactivateCategoryMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/categories/${id}/deactivate`),
    onSuccess: () => {
      toast.success("Category deactivated");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || "Cannot deactivate — has active stock",
      ),
  });

  const activateCategoryMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/categories/${id}/activate`),
    onSuccess: () => {
      toast.success("Category activated");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Activation failed"),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Cannot delete — this category has variants or stock.";
      toast.error(msg, {
        duration: 6000,
        style: { background: "#7f1d1d", color: "#fee2e2" },
      });
    },
  });

  // ─── Grouped Data with Category Info ──────────────────
  const groupedItems = useMemo(() => {
    const map = new Map<number, CategoryGroup>();

    rawItems.forEach((item: StockItem) => {
      const cat = item.category;
      if (!map.has(cat.id)) {
        map.set(cat.id, {
          categoryName: cat.name,
          categoryId: cat.id,
          isActive: true, // you need to fetch real isActive from category if available
          imageUrl: cat.imageUrl,
          items: [],
          totalStock: 0,
          totalValue: 0,
        });
      }

      const group = map.get(cat.id)!;
      group.items.push(item);
      group.totalStock += item.stock?.quantity ?? 0;
      group.totalValue += (item.stock?.quantity ?? 0) * (item.fixedPrice ?? 0);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName),
    );
  }, [rawItems]);

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryGroup | null>(null);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  // ─── Category Action Handlers ─────────────────────────
 

  const handleDeleteCategory = (group: CategoryGroup) => {
    setSelectedCategory(group);
    setDeleteCategoryOpen(true);
  };

  const handleEditCategory = (group: CategoryGroup) => {
  setSelectedCategory(group);
  setEditName(group.categoryName);       
  setEditImage(null);                   
  setEditCategoryOpen(true);
};

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    setActionLoading(true);
    try {
      await deleteCategoryMutation.mutateAsync(selectedCategory.categoryId);
      setDeleteCategoryOpen(false);
    } finally {
      setActionLoading(false);
    }
  };


  const handleEditStock = (item: StockItem) => {
  setSelectedStockItem(item);
  setEditQuantity(item.stock?.quantity.toString() || "0");
  setEditPurchasePrice(item.stock?.purchasePrice.toString() || "0");
  setStockEditDialogOpen(true);
};


  // ─── Loading & Empty ──────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-slate-900/50 rounded-3xl border border-slate-800 gap-4">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="text-slate-400 font-medium text-lg">
          Loading inventory...
        </p>
      </div>
    );
  }

  if (groupedItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-16 text-center flex flex-col items-center gap-6 bg-linear-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl">
        <PackageSearch size={80} className="text-slate-700" />
        <h2 className="text-3xl font-black text-white">No Stock Yet</h2>
        <p className="text-slate-400 max-w-md">
          Start building your inventory — add your first product using the
          button above.
        </p>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/70 flex justify-between items-center bg-slate-950/60">
          <h3 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <PackageSearch className="text-cyan-500" size={28} />
            Inventory Overview
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-4 py-1.5 rounded-full uppercase tracking-wide">
              {rawItems.length} Variants • {groupedItems.length} Categories
            </span>
          </div>
        </div>


      {/* <div className="max-h-[60vh] overflow-y-auto overscroll-contain border border-slate-800/50 rounded-b-3xl"> */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-slate-950/80 text-slate-300 text-xs uppercase font-black tracking-wider border-b border-slate-800">
                <th className="px-8 py-5">Category / Variant</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Qty</th>
                <th className="px-6 py-5 text-right">Avg Cost</th>
                <th className="px-6 py-5 text-right">Sell Price</th>
                <th className="px-6 py-5 text-right">Value</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>

         

            <tbody>
              {groupedItems.map((group) => {
                const isExpanded = expandedCategories.has(group.categoryId);
                const hasVariants = group.items.length > 0;

                return (
                  <Fragment key={group.categoryId}>
                    {/* Category Header Row */}
                    <tr
                      onClick={() => toggleCategory(group.categoryId)}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        group.isActive
                          ? "bg-linear-to-r from-slate-800/70 to-slate-800/40 hover:from-slate-700/70 hover:to-slate-700/50"
                          : "bg-slate-950/60 opacity-70 hover:opacity-90",
                      )}>
                      <td
                        colSpan={7}
                        className="px-8 py-5 font-bold text-slate-100 uppercase text-sm tracking-widest">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown
                                size={20}
                                className="text-cyan-400"
                              />
                            ) : (
                              <ChevronRight
                                size={20}
                                className="text-slate-500"
                              />
                            )}
                            {group.categoryName}
                            {!group.isActive && (
                              <span className="ml-3 text-xs bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>

                          {/* Category Actions */}
                          <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCategory(group);
                                  }}>
                                  <Edit size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Edit category name / image
                              </TooltipContent>
                            </Tooltip>

                            {group.isActive ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deactivateCategoryMutation.mutate(
                                        group.categoryId,
                                      );
                                    }}
                                    disabled={
                                      deactivateCategoryMutation.isPending
                                    }>
                                    {deactivateCategoryMutation.isPending ? (
                                      <Loader2
                                        size={16}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Ban size={16} />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Deactivate category
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      activateCategoryMutation.mutate(
                                        group.categoryId,
                                      );
                                    }}
                                    disabled={
                                      activateCategoryMutation.isPending
                                    }>
                                    {activateCategoryMutation.isPending ? (
                                      <Loader2
                                        size={16}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Power size={16} />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Activate category
                                </TooltipContent>
                              </Tooltip>
                            )}
                            <Tooltip>
  <TooltipTrigger asChild>
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={hasVariants || actionLoading}
        className={cn(
          "h-8 w-8 text-red-400",
          hasVariants && "opacity-40 cursor-not-allowed",
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteCategory(group);
        }}
      >
        <Trash2 size={16} />
      </Button>
      {hasVariants && <AlertCircle size={14} className="text-slate-500" />}
    </div>
  </TooltipTrigger>
  <TooltipContent>
    {hasVariants ? "Delete all variants first" : "Delete category"}
  </TooltipContent>
</Tooltip>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Variants */}
                    
<AnimatePresence>
  {isExpanded && (
    <>
      {group.items.map((item, idx) => {
        const qty = item.stock?.quantity ?? 0;
        const avgCost = item.stock?.purchasePrice ?? 0;
        const sellPrice = item.fixedPrice ?? 0;

        const isLow = qty > 0 && qty < 3;
        const isOut = qty === 0;

        const displayName =
          item.name || `Standard (${sellPrice.toLocaleString()} ETB)`;

        return (
          <motion.tr
            key={item.priceCategoryId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: idx * 0.04 }}
            className="group hover:bg-linear-to-r hover:from-blue-950/30 hover:to-transparent transition-all duration-300"
          >
            <td className="px-8 py-5 pl-16">
              <div className="flex flex-col">
              <span className="text-slate-100 font-medium group-hover:text-cyan-300 transition-colors">
                {displayName}
              </span>
              {/* New activity indicator below the name */}
       <StockActivityDetails item={item} />
       </div>
            </td>

            <td className="px-6 py-5">
              <div className="flex justify-center">
                {isLow ? (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/30 text-red-400 border border-red-700/40 text-xs font-bold uppercase">
                    <AlertCircle size={14} /> Low
                  </div>
                ) : isOut ? (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/70 text-slate-400 border border-slate-700 text-xs font-bold uppercase">
                    <TrendingDown size={14} /> Out
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-700/40 text-xs font-bold uppercase">
                    <CheckCircle2 size={14} /> OK
                  </div>
                )}
              </div>
            </td>

            <td className="px-6 py-5 text-right">
              <span
                className={`text-xl font-black ${
                  isLow
                    ? "text-red-500"
                    : isOut
                    ? "text-slate-500"
                    : "text-white"
                }`}
              >
                {qty.toLocaleString()}
              </span>
            </td>

            <td className="px-6 py-5 text-right font-mono text-slate-300">
              {avgCost > 0
                ? avgCost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                : "—"}
            </td>

            <td className="px-6 py-5 text-right text-slate-300 font-mono">
              {sellPrice.toLocaleString()}
            </td>

            <td className="px-6 py-5 text-right">
              <div className="text-cyan-400 font-black font-mono">
                {(qty * sellPrice).toLocaleString()}
              </div>
            </td>

            {/* <td className="px-6 py-5">
              <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">


                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40"
                >
                  <Edit size={16} />
                </Button>

             

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/40"
                >
                  <Trash2 size={16} />
                </Button>

                {item.isActive ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
                  >
                    <Ban size={16} />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40"
                  >
                    <Power size={16} />
                  </Button>
                )}
              </div>
            </td> */}

            <td className="px-6 py-5">
  <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">

    {/* EDIT */}
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40"
      onClick={() => handleEditStock(item)}
    >
      <Edit size={16} />
    </Button>

    {/* DELETE */}
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/40"
      disabled={deleteStockMutation.isPending}
      onClick={() => deleteStockMutation.mutate(item.priceCategoryId)}
    >
      {deleteStockMutation.isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </Button>

    {/* ACTIVATE / DEACTIVATE */}
    {/* {item.isActive ? (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
        onClick={() => deactivateVariant.mutate(item.priceCategoryId)}
        disabled={deactivateVariant.isPending}
      >
        {deactivateVariant.isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Ban size={16} />
        )}
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40"
        onClick={() => activateVariant.mutate(item.priceCategoryId)}
        disabled={activateVariant.isPending}
      >
        {activateVariant.isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Power size={16} />
        )}
      </Button>
    )} */}

  </div>
</td>
          </motion.tr>
        );
      })}

      {/* Category Total Row */}
      <tr className="bg-linear-to-r from-slate-800/60 to-slate-900/40 font-bold border-t border-slate-700/50">
        <td className="px-8 py-5 pl-16 text-slate-200">
          Category Total
        </td>

        <td></td>

        <td className="px-6 py-5 text-right text-cyan-300 text-lg">
          {group.totalStock.toLocaleString()}
        </td>

        <td></td>
        <td></td>

        <td className="px-6 py-5 text-right text-cyan-300 text-lg font-mono">
          {group.totalValue.toLocaleString()}
        </td>

        <td></td>
      </tr>
    </>
  )}
</AnimatePresence>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      {/* </div> */}
      </motion.div>

      {/* Category Edit Dialog */}
      <Dialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
  <DialogContent className="sm:max-w-lg bg-slate-950 border-slate-800 text-white">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-cyan-400">
        <Edit /> Edit Category
      </DialogTitle>
    </DialogHeader>

    {selectedCategory && (
      <div className="space-y-6 py-6">
        {/* Category Name */}
        <div className="space-y-2">
          <Label className="text-slate-300">Category Name *</Label>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white text-lg font-medium"
            placeholder="e.g. Men's Shoes"
          />
        </div>

        {/* Image Upload + Preview */}
        <div className="space-y-2">
          <Label className="text-slate-300">Category Image</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Current Image Preview */}
            <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900 shrink-0">
              {selectedCategory.imageUrl ? (
                <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900 shrink-0">

  <img
  src={selectedCategory.imageUrl 
    ? `${BASE_URL}${selectedCategory.imageUrl}` 
    : "/placeholder-category.jpg"
  }
  alt={selectedCategory.categoryName}
  className="w-full h-full object-cover"
  onError={(e) => {
    const img = e.target as HTMLImageElement;
    img.src = "/placeholder-category.jpg"; 
  }}
/>
</div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <ImageIcon size={40} />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImage(e.target.files?.[0] ?? null)}
                className="bg-slate-900 border-slate-700 text-slate-300 file:bg-cyan-950 file:text-cyan-300 file:border-0 file:rounded file:px-4 file:py-2 cursor-pointer"
              />
              {editImage && (
                <p className="text-xs text-cyan-400 truncate">
                  Selected: {editImage.name}
                </p>
              )}
              <p className="text-xs text-slate-500">
                Max 2MB • JPG, PNG, WebP
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => {
              setEditCategoryOpen(false);
              setEditName("");
              setEditImage(null);
            }}
          >
            Cancel
          </Button>

          <Button
            className="bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500"
            disabled={updateCategoryMutation.isPending || (!editName.trim() && !editImage)}
            onClick={async () => {
              if (!selectedCategory) return;

              try {
                await updateCategoryMutation.mutateAsync({
                  id: selectedCategory.categoryId,
                  name: editName.trim() || undefined,   // only send if changed
                  image: editImage ?? undefined,
                });

                setEditName("");
                setEditImage(null);
                setEditCategoryOpen(false);
              } catch (err) {
              }
            }}
          >
            {updateCategoryMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </div>
    )}
  </DialogContent>
</Dialog>


{/* Stock / Variant Edit Dialog */}
<Dialog open={stockEditDialogOpen} onOpenChange={setStockEditDialogOpen}>
  <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-white">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-cyan-400">
        <PackageSearch /> Update Stock
      </DialogTitle>
      <DialogDescription className="text-slate-400">
        Adjusting inventory for: {selectedStockItem?.name || "Standard Variant"}
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label htmlFor="quantity" className="text-slate-300">Total Quantity in Stock</Label>
        <Input
          id="quantity"
          type="number"
          value={editQuantity}
          onChange={(e) => setEditQuantity(e.target.value)}
          className="bg-slate-900 border-slate-700 text-white"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price" className="text-slate-300">Average Purchase Price (Cost)</Label>
        <Input
          id="price"
          type="number"
          value={editPurchasePrice}
          onChange={(e) => setEditPurchasePrice(e.target.value)}
          className="bg-slate-900 border-slate-700 text-white"
        />
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setStockEditDialogOpen(false)}>
        Cancel
      </Button>
      <Button
        className="bg-cyan-600 hover:bg-cyan-500"
        disabled={updateStockMutation.isPending}
        onClick={async () => {
          if (!selectedStockItem) return;
          await updateStockMutation.mutateAsync({
            priceCategoryId: selectedStockItem.priceCategoryId,
            quantity: Number(editQuantity),
            purchasePrice: Number(editPurchasePrice),
          });
          setStockEditDialogOpen(false);
        }}
      >
        {updateStockMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Inventory
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


      {/* Category Delete Confirmation */}
      <Dialog open={deleteCategoryOpen} onOpenChange={setDeleteCategoryOpen}>
        <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <Trash2 /> Delete Category?
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              This will permanently delete{" "}
              <strong>{selectedCategory?.categoryName}</strong> and all its
              variants. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteCategoryOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCategory}
              disabled={actionLoading}>
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}





const StockActivityDetails = ({ item }: { item: StockItem }) => {
  if (!item.stock) return null;

  const { createdAt, updatedAt, quantity } = item.stock;
  const isRestock = createdAt !== updatedAt;
  const date = new Date(updatedAt);

  return (
    <div className="flex flex-col gap-1 text-left min-w-[140px]">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-tighter">
          {isRestock ? "Restocked" : "Initial Load"}
        </span>
        <span className="text-[10px] text-slate-500 font-medium">
          {date.toLocaleDateString()}
        </span>
      </div>

      {isRestock ? (
        <div className="text-[11px] leading-tight">
          <span className="text-slate-400">Latest activity: </span>
          <span className="text-cyan-400 font-bold">Updated to {quantity}</span>
          {/* <p className="text-[9px] text-slate-500 italic">
            Last seen {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p> */}
        </div>
      ) : (
        <div className="text-[11px] leading-tight">
          <span className="text-slate-400">Added </span>
          <span className="text-emerald-400 font-bold">{quantity} units</span>
          <span className="text-slate-400"> initially</span>
        </div>
      )}
    </div>
  );
};