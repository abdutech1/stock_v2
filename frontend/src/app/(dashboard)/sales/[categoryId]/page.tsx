"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation,  useQueryClient} from "@tanstack/react-query";
import {
  Plus,
  Minus,
  DollarSign,
  CreditCard,
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Trash2
} from "lucide-react";
import api from "@/api/axios";
import { getEmployees } from "@/api/users.api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const API_URL = "http://localhost:5000";

interface Variant {
  id: number;
  name: string | null;
  fixedPrice: number;
  imageUrl?: string;
  stock: { quantity: number } | null;
}

interface CartItem {
  variant: Variant;
  quantity: number;
  soldPrice: number;
}

interface BankPayment {
  id: string;
  amount: number;
  bankName: string;
}

export default function SalesPOSPage() {
  const { categoryId } = useParams();
  const router = useRouter();
const queryClient = useQueryClient();

const { user, role } = useAuth();
  const isOwner = role === "OWNER";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [saleId, setSaleId] = useState<number | null>(null);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [bankPayments, setBankPayments] = useState<BankPayment[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);


  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);





  const { data: sellers = [] } = useQuery({
  queryKey: ["sellers"],
  queryFn: () => api.get("/users").then((r) => r.data),
});


const { data: employees = [] } = useQuery({
  queryKey: ["employees"],
  queryFn: getEmployees,
  
});



const activeSellers = employees.filter((emp) => {
  if (!emp.isActive) return false;

  if (role === "OWNER") return true;

  return emp.role === "EMPLOYEE";
});
  
  useEffect(() => {
    const savedCart = localStorage.getItem("pos_cart");
    const savedSaleId = localStorage.getItem("pos_saleId");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedSaleId) setSaleId(JSON.parse(savedSaleId));

    setIsInitialized(true);
  }, []);


  useEffect(() => {
  // If the logged in user is an employee, pre-select them
  if (user?.id && role === "EMPLOYEE" && !selectedSellerId) {
    setSelectedSellerId(user.id.toString());
  }
}, [user, role]);

  
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("pos_cart", JSON.stringify(cart));

    if (saleId) {
      localStorage.setItem("pos_saleId", JSON.stringify(saleId));
    } else {
      localStorage.removeItem("pos_saleId");
    }
  }, [cart, saleId, isInitialized]);

  
  const { data: variants = [], isLoading } = useQuery<Variant[]>({
    queryKey: ["variants", categoryId],
    queryFn: () =>
      api.get(`/price-categories/${categoryId}`).then((r) => r.data),
  });

 
  const ensureSaleSession = async (): Promise<number | null> => {
    if (saleId) return saleId;

    try {
      const res = await api.post("/sales", { status: "DRAFT" });
      const newId = res.data.id;
      setSaleId(newId);
      return newId;
    } catch {
      toast.error("Failed to start sale session");
      return null;
    }
  };

  
  const totalSoldAmount = cart.reduce(
    (sum, i) => sum + i.quantity * i.soldPrice,
    0
  );

  const totalBankAmount = bankPayments.reduce(
    (sum, b) => sum + b.amount,
    0
  );

  const remaining = totalSoldAmount - (cashAmount + totalBankAmount);

  const isBankInfoMissing = bankPayments.some(
    (b) => b.amount > 0 && !b.bankName.trim()
  );

  

  const isButtonDisabled =
  cart.length === 0 ||
  remaining !== 0 ||
  isBankInfoMissing ||
  !saleId ||
  !selectedSellerId;

 
  const addToCart = async (variant: Variant) => {
    const available = variant.stock?.quantity || 0;
    const currentInCart =
      cart.find((i) => i.variant.id === variant.id)?.quantity || 0;

    if (available <= 0) return toast.error("Out of stock");
    if (currentInCart >= available)
      return toast.error(`Limit: ${available}`);

    const currentSale = await ensureSaleSession();
    if (!currentSale) return;

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.variant.id === variant.id
      );

      if (existing) {
        return prev.map((i) =>
          i.variant.id === variant.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        { variant, quantity: 1, soldPrice: variant.fixedPrice },
      ];
    });
  };

 
  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.variant.id !== id) return i;

        const nextQty = i.quantity + delta;
        const available = i.variant.stock?.quantity || 0;

        return nextQty > available
          ? i
          : { ...i, quantity: Math.max(1, nextQty) };
      })
    );
  };

 
  const removeItem = async (id: number) => {
    setCart((prev) => {
      const newCart = prev.filter(
        (i) => i.variant.id !== id
      );

      if (newCart.length === 0 && saleId) {
        api.delete(`/sales/${saleId}`).catch(() => {});
        setSaleId(null);
      }

      return newCart;
    });
  };


  const confirmSaleMutation = useMutation({
  mutationFn: async () => {
    if (!saleId) throw new Error("No sale session");

    const payload = {
      sellerId: selectedSellerId ? Number(selectedSellerId) : undefined, // <--- Added this
      items: cart.map((item) => ({
        priceCategoryId: item.variant.id,
        quantity: item.quantity,
        soldPrice: item.soldPrice,
      })),
      payments: [
        ...(cashAmount > 0 ? [{ method: "CASH" as const, amount: cashAmount }] : []),
        ...bankPayments
          .filter((b) => b.amount > 0)
          .map((b) => ({
            method: "BANK" as const,
            amount: b.amount,
            bankName: b.bankName,
          })),
      ],
    };

    return await api.put(`/sales/${saleId}/sync`, payload);
  },
  onSuccess: () => {
    setCart([]);
    setSaleId(null);
    setCashAmount(0);
    setBankPayments([]);
    localStorage.removeItem("pos_cart");
    localStorage.removeItem("pos_saleId");

    toast.success("Sale Saved - Awaiting Owner Confirmation");
    router.push("/sales");
  },
  onError: (err: any) => {
    toast.error(err.response?.data?.message || "Sync failed");
  }
});

  const sidebarProps = {
    cart,
    updateQuantity,
    removeItem,
    totalSoldAmount,
    cashAmount,
    setCashAmount,
    bankPayments,
    setBankPayments,
    remaining,
    confirmSaleMutation,
    isButtonDisabled,
    updateSoldPrice: (id: number, price: number) =>
      setCart((p) =>
        p.map((i) =>
          i.variant.id === id
            ? { ...i, soldPrice: Math.max(0, price) }
            : i
        )
      ),
      sellers: activeSellers,
  selectedSellerId,
  setSelectedSellerId,
  };


  const updateImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("image", file);
      return await api.put(`/price-categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Image updated successfully");
      queryClient.invalidateQueries({ queryKey: ["variants"] }); 
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Upload failed";
      toast.error(errorMsg);
    }
  });



  

    return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/sales')} className="text-slate-400">
            <ArrowLeft size={20} className="mr-2"/> Exit POS
          </Button>
          <h1 className="text-lg font-black tracking-widest text-cyan-500 hidden md:block">POS TERMINAL</h1>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-cyan-600 font-bold">Cart ({cart.length})</Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md bg-slate-950 p-0 border-slate-800 border-l">
                <VisuallyHidden.Root><SheetTitle>Shopping Cart</SheetTitle></VisuallyHidden.Root>
                <CartSidebar {...sidebarProps} sellers={activeSellers} />
                
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6 lg:mr-[400px]">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
             Array(8).fill(0).map((_, i) => <div key={i} className="h-48 bg-slate-900 rounded-2xl animate-pulse" />)
          ) : (
            variants.map((v) => (
  <Card 
    key={v.id} 
    className={cn(
      "bg-slate-900 border-slate-800 cursor-pointer hover:border-cyan-500 transition-all", 
      (v.stock?.quantity || 0) <= 0 && "opacity-40 grayscale pointer-events-none"
    )}
    onClick={() => addToCart(v)}
  >
    <div className="h-32 bg-slate-800 relative overflow-hidden group">
      <img 
        src={v.imageUrl ? `${API_URL}${v.imageUrl}` : "/placeholder-pricecategory.png"} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        alt={v.name || ""} 
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-pricecategory.png";
        }}
      />
      <Badge className="absolute top-2 right-2 bg-black/80 text-white font-bold">
        {v.fixedPrice} ETB
      </Badge>
    </div>
    <CardContent className="p-4">
      <p className="font-bold text-sm truncate uppercase text-slate-100">{v.name}</p>
      <p className="text-[10px] text-cyan-500 mt-1 font-black">
        AVAILABLE STOCK: {v.stock?.quantity || 0}
      </p>
    </CardContent>
  </Card>
))
          )}
        </div>
      </main>

      <aside className="hidden lg:block fixed right-0 top-0 lg:top-16 h-full lg:h-[calc(100vh-64px)] w-[400px] bg-slate-950 border-l border-slate-800">
        
        <CartSidebar 
  {...sidebarProps} 
  sellers={activeSellers} 
  selectedSellerId={selectedSellerId}
  setSelectedSellerId={setSelectedSellerId}
/>
      </aside>
    </div>
  );
}




function CartSidebar({
  cart, updateQuantity, removeItem, updateSoldPrice, totalSoldAmount,
  cashAmount, setCashAmount, bankPayments, setBankPayments,
  remaining, confirmSaleMutation, isButtonDisabled, sellers,
  selectedSellerId,
  setSelectedSellerId,
}: any) {

  const bankOptions = ["CBE", "TELEBIR", "AWASH", "BOA", "DASHEN", "ZEMZEM", "HIJRA"];

  const addBankRow = () => {
    const initialAmount = remaining > 0 ? remaining : 0;
    setBankPayments([
      ...bankPayments,
      {
        id: crypto.randomUUID(),
        amount: initialAmount,
        bankName: ""
      }
    ]);
  };

  const removeBankRow = (id: string) => setBankPayments((prev: any) => prev.filter((b: any) => b.id !== id));

  const updateBankRow = (id: string, field: string, value: any) => {
    setBankPayments((prev: any) => prev.map((b: any) =>
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      
      <div className="flex-none bg-slate-900/50 border-b border-slate-800">
        <div className="p-4 flex items-center gap-3">
          <ShoppingCart className="text-cyan-500" size={18} />
          <h2 className="text-xs font-black uppercase tracking-widest text-white">Cart Summary</h2>
        </div>

        <div className="px-4 pb-4 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">
              Attributed To
            </label>
            {!selectedSellerId && (
              <span className="text-[9px] text-amber-500 animate-pulse font-bold">REQUIRED</span>
            )}
          </div>
          <Select value={selectedSellerId || ""} onValueChange={setSelectedSellerId}>
            <SelectTrigger className={cn(
              "h-9 bg-slate-950 border-slate-800 text-xs font-bold transition-colors",
              !selectedSellerId && "border-amber-500/50"
            )}>
              <SelectValue placeholder="CHOOSE SELLER" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              {sellers.length === 0 ? (
                <div className="p-2 text-[10px] text-slate-500 text-center font-bold">NO ACTIVE STAFF</div>
              ) : (
                sellers.map((seller: any) => (
                  <SelectItem key={seller.id} value={seller.id.toString()} className="text-xs font-bold focus:bg-cyan-600 text-white">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", seller.role === "OWNER" ? "bg-amber-500" : "bg-cyan-500")} />
                      {seller.name.toUpperCase()}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-30">
            <ShoppingCart size={40} />
            <p className="text-[10px] font-bold mt-2">CART IS EMPTY</p>
          </div>
        ) : (
          cart.map((item: any) => (
            <div key={item.variant.id} className="bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl space-y-3">
              <div className="flex justify-between items-start gap-2">
                <p className="text-[11px] font-black uppercase truncate text-white flex-1">{item.variant.name}</p>
                <button onClick={() => removeItem(item.variant.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-slate-500 block">UNIT PRICE</span>
                  <input
                    type="number"
                    value={item.soldPrice}
                    onChange={(e) => updateSoldPrice(item.variant.id, Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-cyan-400 text-[11px] font-bold focus:outline-none focus:border-cyan-600"
                  />
                </div>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.variant.id, -1)} className="px-2 py-1 text-slate-400 hover:bg-slate-800"><Minus size={12} /></button>
                  <span className="text-[10px] font-black w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variant.id, 1)} className="px-2 py-1 text-slate-400 hover:bg-slate-800"><Plus size={12} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- SECTION 3: CONTAINED PAYMENT FOOTER --- */}
      <div className="flex-none p-4 bg-slate-900 border-t border-slate-800 space-y-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase">Total Due</span>
          <span className="text-xl font-black text-white leading-none">
            {totalSoldAmount.toLocaleString()} <span className="text-[10px] text-slate-500">ETB</span>
          </span>
        </div>

        <div className="max-h-[30vh] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          
          <div className="space-y-1.5">
  <label className="text-[11px] font-bold text-green-500 uppercase flex items-center gap-1 tracking-wider">
    <DollarSign size={12} /> Cash Payment
  </label>
  <Input
    type="number"
    value={cashAmount || ""}
    onChange={(e) => setCashAmount(Number(e.target.value))}
    className="h-10 md:h-8 bg-slate-950 border-slate-800 text-base md:text-sm font-bold text-white"
    placeholder="0.00"
  />
</div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1">
                <CreditCard size={10} /> Bank Payments
              </label>
              <Button size="sm" onClick={addBankRow} className="h-5 px-2 text-[8px] bg-blue-600 font-black hover:bg-blue-500">
                + ADD BANK
              </Button>
            </div>

            <div className="space-y-2">
              {bankPayments.map((bank: any) => {
                const isOther = bank.bankName === "OTHER" || (!bankOptions.includes(bank.bankName) && bank.bankName !== "");

                return (
                  <div key={bank.id} className="p-2 bg-slate-950 border border-slate-800 rounded-lg space-y-2 border-l-2 border-blue-600 animate-in fade-in slide-in-from-right-1">
                    

                    <div className="flex gap-2 relative">
  <Input
    placeholder="Amount"
    type="number"
    value={bank.amount || ""}
    onChange={(e) => updateBankRow(bank.id, "amount", Number(e.target.value))}
    className="h-9 md:h-7 text-base md:text-[10px] bg-slate-900 border-slate-800 text-white pr-12"
  />
  <button
    onClick={() => updateBankRow(bank.id, "amount", bank.amount + remaining)}
    className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] md:text-[8px] text-blue-400 font-bold hover:text-white px-1"
  >
    MAX
  </button>
  <button onClick={() => removeBankRow(bank.id)} className="text-slate-600 hover:text-red-500 p-1">
    <Trash2 size={16} className="md:size-3" />
  </button>
</div>

                    {!isOther ? (
                      <Select value={bank.bankName} onValueChange={(val) => updateBankRow(bank.id, "bankName", val)}>
                        <SelectTrigger className="h-7 bg-slate-900 border-slate-800 text-[9px] font-bold uppercase">
                          <SelectValue placeholder="SELECT BANK" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          {bankOptions.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-[10px] font-bold">{opt}</SelectItem>
                          ))}
                          <SelectItem value="OTHER" className="text-[10px] font-bold text-cyan-400">+ OTHER</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      
                      <div className="flex gap-1 items-center">
  <Input
    autoFocus
    placeholder="Bank Name..."
    value={bank.bankName === "OTHER" ? "" : bank.bankName}
    onChange={(e) => updateBankRow(bank.id, "bankName", e.target.value.toUpperCase())}
    className="h-9 md:h-7 text-base md:text-[9px] bg-slate-900 border-cyan-900 text-cyan-400 font-bold"
  />
  <button 
    onClick={() => updateBankRow(bank.id, "bankName", "")} 
    className="text-[10px] md:text-[8px] text-slate-500 underline min-w-[40px]"
  >
    RESET
  </button>
</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className={cn(
          "py-1.5 rounded-md text-[9px] font-black border text-center tracking-widest transition-colors",
          remaining === 0 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
        )}>
          {remaining === 0 ? "PAYMENT BALANCED ✓" : `REMAINING: ${remaining.toLocaleString()} ETB`}
        </div>

        <Button
          disabled={isButtonDisabled || confirmSaleMutation.isPending}
          onClick={() => confirmSaleMutation.mutate()}
          className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98]"
        >
          {confirmSaleMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Complete Sale"}
        </Button>
      </div>
    </div>
  );
}