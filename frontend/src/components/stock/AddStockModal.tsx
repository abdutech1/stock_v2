"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Search,
  History,
  X,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  FolderPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────

interface AddStockModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  id: number;
  name: string;
}

interface PriceCategory {
  id: number;
  name: string | null;
  fixedPrice: number;
  category: {
    id: number;
    name: string;
  };
}

type Mode = "search" | "new-product" | "new-variant";

export default function AddStockModal({
  open,
  onClose,
  onSuccess,
}: AddStockModalProps) {
  const queryClient = useQueryClient();

  // ─── Mode & Search ───────────────────────────────────────
  const [mode, setMode] = useState<Mode>("search");
  const [searchTerm, setSearchTerm] = useState("");

  // ─── Common form fields ──────────────────────────────────
  const [purchasePrice, setPurchasePrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // ─── Selected existing price-category ────────────────────
  const [selectedPriceCategoryId, setSelectedPriceCategoryId] = useState<string | null>(null);

  // ─── New product (category + variant) ────────────────────
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [newVariantName, setNewVariantName] = useState("");
  const [newFixedPrice, setNewFixedPrice] = useState("");
  const [newVariantImage, setNewVariantImage] = useState<File | null>(null);

  // ─── New variant under existing category ─────────────────
  const [selectedExistingCategoryId, setSelectedExistingCategoryId] = useState<number | null>(null);
  const [newVariantNameForExisting, setNewVariantNameForExisting] = useState("");
  const [newFixedPriceForExisting, setNewFixedPriceForExisting] = useState("");
  const [newVariantImageForExisting, setNewVariantImageForExisting] = useState<File | null>(null);

  // ─── Error handling for uploads ──────────────────────────
  const [uploadErrors, setUploadErrors] = useState<{
    categoryImage?: string;
    variantImage?: string;
    variantImageExisting?: string;
  }>({});

  // ─── UI states ───────────────────────────────────────────
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // ─── Data ────────────────────────────────────────────────
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data?.data?.items || r.data || []),
  });

  const { data: priceCategories = [] } = useQuery<PriceCategory[]>({
    queryKey: ["price-categories"],
    queryFn: () => api.get("/price-categories").then((r) => r.data?.data?.items || r.data || []),
  });

  const { data: stockInfo } = useQuery({
    queryKey: ["stock-detail", selectedPriceCategoryId],
    enabled: !!selectedPriceCategoryId && mode === "search",
    queryFn: () => api.get(`/stocks/subcategory/${selectedPriceCategoryId}`).then((r) => r.data),
  });

  // ─── Search / Fuse ───────────────────────────────────────
  const fuse = useMemo(
    () =>
      new Fuse(priceCategories, {
        keys: ["category.name", "name", "fixedPrice"],
        threshold: 0.4,
      }),
    [priceCategories]
  );

  const groupedPriceCategories = useMemo(() => {
    const map = new Map<string, PriceCategory[]>();
    priceCategories.forEach((pc) => {
      const catName = pc.category?.name ?? "Uncategorized";
      if (!map.has(catName)) map.set(catName, []);
      map.get(catName)!.push(pc);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([catName, items]) => ({
        categoryName: catName,
        items: items.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")),
      }));
  }, [priceCategories]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim() || mode !== "search") return groupedPriceCategories;

    const results = fuse.search(searchTerm.trim());
    const map = new Map<string, PriceCategory[]>();
    results.forEach(({ item }) => {
      const cat = item.category?.name ?? "Uncategorized";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    });
    return Array.from(map.entries()).map(([catName, items]) => ({ categoryName: catName, items }));
  }, [searchTerm, groupedPriceCategories, fuse, mode]);

  // ─── Mutations ───────────────────────────────────────────
  const restockMutation = useMutation({
    mutationFn: async () => {
      let targetPriceCategoryId: number;

      if (mode === "search" && selectedPriceCategoryId) {
        targetPriceCategoryId = Number(selectedPriceCategoryId);
      } else if (mode === "new-product") {
        // 1. Create category
        const catForm = new FormData();
        catForm.append("name", newCategoryName.trim());
        if (newCategoryImage) catForm.append("image", newCategoryImage);

        const catRes = await api.post("/categories", catForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const newCategoryId = catRes.data.id ?? catRes.data?.data?.id;

        // 2. Create price category (variant)
        const pcForm = new FormData();
        pcForm.append("categoryId", newCategoryId.toString());
        pcForm.append("fixedPrice", newFixedPrice);
        if (newVariantName.trim()) {
          pcForm.append("name", newVariantName.trim());
        }
        if (newVariantImage) {
          pcForm.append("image", newVariantImage);
        }

        const pcRes = await api.post("/price-categories", pcForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        targetPriceCategoryId = pcRes.data.id ?? pcRes.data?.data?.id;
      } else if (mode === "new-variant" && selectedExistingCategoryId) {
        const pcForm = new FormData();
        pcForm.append("categoryId", selectedExistingCategoryId.toString());
        pcForm.append("fixedPrice", newFixedPriceForExisting);
        if (newVariantNameForExisting.trim()) {
          pcForm.append("name", newVariantNameForExisting.trim());
        }
        if (newVariantImageForExisting) {
          pcForm.append("image", newVariantImageForExisting);
        }

        const pcRes = await api.post("/price-categories", pcForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        targetPriceCategoryId = pcRes.data.id ?? pcRes.data?.data?.id;
      } else {
        throw new Error("Invalid form state");
      }

      // 3. Create stock entry
      return api.post("/stocks", {
        priceCategoryId: targetPriceCategoryId,
        purchasePrice: Number(purchasePrice) || 0,
        quantity: Number(quantity) || 0,
      });
    },

    onSuccess: () => {
      toast.success("Stock added successfully");
      queryClient.invalidateQueries({ queryKey: ["price-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onSuccess();
      handleResetAndClose();
      setUploadErrors({});
    },

    onError: (err: any) => {
      setUploadErrors({});

      const serverError = err?.response?.data?.error;
      let toastMessage = "Failed to add stock. Please try again.";

      const newErrors: typeof uploadErrors = {};

      if (serverError?.message) {
        toastMessage = serverError.message;

        const isSizeError =
          serverError.code === "LIMIT_FILE_SIZE" ||
          /too large/i.test(serverError.message) ||
          /file size/i.test(serverError.message);

        if (isSizeError || /image/i.test(serverError.message)) {
          if (mode === "new-product") {
            newErrors.categoryImage = serverError.message;
            newErrors.variantImage = serverError.message;
          } else if (mode === "new-variant") {
            newErrors.variantImageExisting = serverError.message;
          }
        }
      } else if (err.message) {
        toastMessage = err.message;
      }

      setUploadErrors(newErrors);

      toast.error(toastMessage, {
        duration: 6000,
        style: {
          background: "#7f1d1d",
          color: "#fee2e2",
          border: "1px solid #991b1b",
        },
      });
    },
  });

  // ─── Handlers ────────────────────────────────────────────
  const handleResetAndClose = () => {
    setMode("search");
    setSearchTerm("");
    setSelectedPriceCategoryId(null);
    setPurchasePrice("");
    setQuantity("");
    setNewCategoryName("");
    setNewCategoryImage(null);
    setNewVariantName("");
    setNewFixedPrice("");
    setNewVariantImage(null);
    setSelectedExistingCategoryId(null);
    setNewVariantNameForExisting("");
    setNewFixedPriceForExisting("");
    setNewVariantImageForExisting(null);
    setExpandedGroups(new Set());
    setUploadErrors({});
    onClose();
  };

  const selectPriceCategory = (pc: PriceCategory) => {
    setSelectedPriceCategoryId(pc.id.toString());
    setSearchTerm(`${pc.category.name} – ${pc.name || "Standard"} (${pc.fixedPrice} ETB)`);
  };

  const isFormValid = useMemo(() => {
    if (mode === "search") {
      return !!selectedPriceCategoryId && !!quantity.trim() && Number(quantity) > 0;
    }
    if (mode === "new-product") {
      return (
        newCategoryName.trim().length >= 2 &&
        newFixedPrice.trim() &&
        Number(newFixedPrice) > 0 &&
        !!quantity.trim() &&
        Number(quantity) > 0
      );
    }
    if (mode === "new-variant") {
      return (
        !!selectedExistingCategoryId &&
        newFixedPriceForExisting.trim() &&
        Number(newFixedPriceForExisting) > 0 &&
        !!quantity.trim() &&
        Number(quantity) > 0
      );
    }
    return false;
  }, [
    mode,
    selectedPriceCategoryId,
    quantity,
    newCategoryName,
    newFixedPrice,
    selectedExistingCategoryId,
    newFixedPriceForExisting,
  ]);

  // ─── Render ──────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleResetAndClose}>
      <DialogContent className="sm:max-w-lg bg-linear-to-b from-slate-950 to-slate-900 border-slate-800 text-slate-100 rounded-2xl p-6 max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
            <CheckCircle2 className="text-emerald-500 h-7 w-7" />
            Restock / Add Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Mode & Search */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 font-medium">
                {mode === "search" && "Find existing product"}
                {mode === "new-product" && "Create new product"}
                {mode === "new-variant" && "Add variant to existing category"}
              </Label>

              {mode !== "search" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-200"
                  onClick={() => {
                    setMode("search");
                    setSearchTerm("");
                    setUploadErrors({});
                  }}
                >
                  <X size={16} className="mr-1" /> Cancel new
                </Button>
              )}
            </div>

            {mode === "search" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search product or variant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-950 border-slate-700 h-11"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {/* SEARCH MODE */}
            {mode === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 max-h-64 overflow-y-auto"
              >
                <div className="grid grid-cols-2 gap-px bg-slate-800">
                  <button
                    onClick={() => setMode("new-product")}
                    className="p-4 bg-slate-900/60 hover:bg-blue-950/40 flex flex-col items-center gap-1 text-blue-400"
                  >
                    <FolderPlus size={20} />
                    <span className="text-xs font-medium">New Product</span>
                  </button>
                  <button
                    onClick={() => setMode("new-variant")}
                    className="p-4 bg-slate-900/60 hover:bg-indigo-950/40 flex flex-col items-center gap-1 text-indigo-400"
                  >
                    <PlusCircle size={20} />
                    <span className="text-xs font-medium">New Variant</span>
                  </button>
                </div>

                {filteredGroups.map((group) => (
                  <div key={group.categoryName} className="border-t border-slate-800">
                    <button
                      onClick={() =>
                        setExpandedGroups((prev) => {
                          const next = new Set(prev);
                          if (next.has(group.categoryName)) next.delete(group.categoryName);
                          else next.add(group.categoryName);
                          return next;
                        })
                      }
                      className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium bg-slate-900/40 hover:bg-slate-800/60"
                    >
                      <span>{group.categoryName}</span>
                      {expandedGroups.has(group.categoryName) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {expandedGroups.has(group.categoryName) &&
                      group.items.map((pc) => (
                        <button
                          key={pc.id}
                          onClick={() => selectPriceCategory(pc)}
                          className={cn(
                            "w-full px-9 py-2.5 text-left text-sm transition-colors",
                            selectedPriceCategoryId === String(pc.id)
                              ? "bg-blue-950/40 text-blue-300"
                              : "hover:bg-slate-800/50 text-slate-300"
                          )}
                        >
                          {pc.name || "Standard"} — {pc.fixedPrice} ETB
                        </button>
                      ))}
                  </div>
                ))}

                {searchTerm.trim() && filteredGroups.length === 0 && !selectedPriceCategoryId && (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No matching products found
                  </div>
                )}
              </motion.div>
            )}

            {/* NEW PRODUCT */}
            {mode === "new-product" && (
              <motion.div
                key="new-product"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 p-5 bg-linear-to-b from-blue-950/30 to-transparent border border-blue-900/40 rounded-xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-blue-300">CATEGORY NAME *</Label>
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Shoes"
                      className="bg-slate-950 border-slate-700 h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-blue-300">SELLING PRICE (ETB) *</Label>
                    <Input
                      type="number"
                      value={newFixedPrice}
                      onChange={(e) => setNewFixedPrice(e.target.value)}
                      placeholder="0.00"
                      className="bg-slate-950 border-slate-700 h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category Image */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-blue-300">Category Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setNewCategoryImage(e.target.files?.[0] ?? null);
                        setUploadErrors((prev) => ({ ...prev, categoryImage: undefined }));
                      }}
                      className={cn(
                        "h-10 text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-blue-950 file:text-blue-300 hover:file:bg-blue-900/70",
                        uploadErrors.categoryImage && "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
                      )}
                    />
                    {uploadErrors.categoryImage && (
                      <p className="text-xs text-red-400 mt-1">{uploadErrors.categoryImage}</p>
                    )}
                    {newCategoryImage && (
                      <p className="text-xs text-slate-500 mt-1 truncate">{newCategoryImage.name}</p>
                    )}
                  </div>

                  {/* Variant Image */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-blue-300">Variant Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setNewVariantImage(e.target.files?.[0] ?? null);
                        setUploadErrors((prev) => ({ ...prev, variantImage: undefined }));
                      }}
                      className={cn(
                        "h-10 text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-indigo-950 file:text-indigo-300 hover:file:bg-indigo-900/70",
                        uploadErrors.variantImage && "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
                      )}
                    />
                    {uploadErrors.variantImage && (
                      <p className="text-xs text-red-400 mt-1">{uploadErrors.variantImage}</p>
                    )}
                    {newVariantImage && (
                      <p className="text-xs text-slate-500 mt-1 truncate">{newVariantImage.name}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* NEW VARIANT */}
            {mode === "new-variant" && (
              <motion.div
                key="new-variant"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 p-5 bg-linear-to-b from-indigo-950/30 to-transparent border border-indigo-900/40 rounded-xl"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-indigo-300">SELECT CATEGORY *</Label>
                  <select
                    value={selectedExistingCategoryId ?? ""}
                    onChange={(e) => setSelectedExistingCategoryId(Number(e.target.value) || null)}
                    className="w-full bg-slate-950 border-slate-700 h-10 px-3 rounded-md text-sm"
                  >
                    <option value="" disabled>
                      Choose existing category...
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-indigo-300">SELLING PRICE (ETB) *</Label>
                    <Input
                      type="number"
                      value={newFixedPriceForExisting}
                      onChange={(e) => setNewFixedPriceForExisting(e.target.value)}
                      className="bg-slate-950 border-slate-700 h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-indigo-300">Variant Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setNewVariantImageForExisting(e.target.files?.[0] ?? null);
                        setUploadErrors((prev) => ({ ...prev, variantImageExisting: undefined }));
                      }}
                      className={cn(
                        "h-10 text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-indigo-950 file:text-indigo-300 hover:file:bg-indigo-900/70",
                        uploadErrors.variantImageExisting &&
                          "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
                      )}
                    />
                    {uploadErrors.variantImageExisting && (
                      <p className="text-xs text-red-400 mt-1">{uploadErrors.variantImageExisting}</p>
                    )}
                    {newVariantImageForExisting && (
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {newVariantImageForExisting.name}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cost + Quantity */}
          {(selectedPriceCategoryId || mode !== "search") && (
            <div className="grid grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-black text-slate-400">Unit Cost (ETB)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="bg-slate-950 border-slate-700 h-11 text-center font-bold"
                    placeholder="0.00"
                  />
                  {mode === "search" && stockInfo?.purchasePrice && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-blue-400 hover:text-blue-300"
                      onClick={() => setPurchasePrice(String(stockInfo.purchasePrice))}
                    >
                      <History size={16} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-black text-slate-400">Quantity to Add</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-slate-950 border-slate-700 h-11 text-center font-bold"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={handleResetAndClose} className="flex-1">
              Cancel
            </Button>

            <Button
              disabled={restockMutation.isPending || !isFormValid}
              onClick={() => restockMutation.mutate()}
              className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold shadow-lg shadow-blue-950/30"
            >
              {restockMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : mode === "search" ? (
                "Restock"
              ) : (
                "Create & Add Stock"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
