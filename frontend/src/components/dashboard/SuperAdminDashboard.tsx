"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Building2,
  Users,
  Activity,
  Search,
  Settings,
  CheckCircle2,
  ShieldAlert,
  CreditCard,
  Copy,
  RefreshCcw,
  Check,
  X,
  Power,
  Trash2,
  ShieldCheck,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "react-hot-toast";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmModal } from "../ConfirmModal";
import FormInput from "../FormInput";
import Navbar from "../CommonNav";

const planStyles: Record<string, string> = {
  FREE: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  BASIC: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PRO: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  ENTERPRISE:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

interface OnboardData {
  name: string;
  slug: string;
  adminName: string;
  adminPhone: string;
  plan: string;
}

// Helper components (StatCard, FormInput, etc. should be imported or defined here)

export default function SuperAdminDashboard() {
  // const queryClient = useQueryClient();
  // const [searchTerm, setSearchTerm] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isManageOpen, setIsManageOpen] = useState(false);
  // const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const { t } = useApp();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [successData, setSuccessData] = useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    onConfirm: () => void;
    title: string;
    description: string;
    variant?: "default" | "destructive";
  }>({ isOpen: false, onConfirm: () => {}, title: "", description: "" });

  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    phoneNumber: "",
  });

  const [newOrgData, setNewOrgData] = useState<OnboardData>({
    name: "",
    slug: "",
    adminName: "",
    adminPhone: "",
    plan: "FREE",
  });

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const closeConfirm = () =>
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));

  // const { data: orgs, isLoading } = useQuery({
  //   queryKey: ["system-orgs"],
  //   queryFn: async () => {
  //     const res = await api.get("/system/organizations");
  //     return res.data.data;
  //   },
  //   enabled: isSuperAdmin,
  // });

  // Fetch details for the selected organization
  // const { data: orgDetails, isLoading: isDetailsLoading } = useQuery({
  //   queryKey: ["org-details", selectedOrgId],
  //   queryFn: async () => {
  //     const res = await api.get(`/system/organizations/${selectedOrgId}`);
  //     return res.data.data;
  //   },
  //   enabled: !!selectedOrgId && isManageOpen,
  // });

  const onboardMutation = useMutation({
    mutationFn: async (newOrg: any) => {
      const res = await api.post("/system/onboard", newOrg);
      return res.data.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["system-orgs"] });
      setSuccessData(data);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);

      setNewOrgData({
        name: "",
        slug: "",
        adminName: "",
        adminPhone: "",
        plan: "FREE",
      });
      setNewBranchName("");
      setNewAdminData({ name: "", phoneNumber: "" });

      toast.success("Organization onboarded successfully!");
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      const statusCode = error.response?.status;
      if (statusCode === 402) {
        toast.error("Subscription required to onboard new organizations.");
        return;
      }
      toast.error(
        serverMessage || "Something went wrong. Please try again later.",
      );
    },
  });

  const upgradePlanMutation = useMutation({
    mutationFn: async ({ id, plan }: { id: number; plan: string }) =>
      await api.post(`/system/organizations/${id}/upgrade`, { plan }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["system-orgs"] });
      queryClient.invalidateQueries({
        queryKey: ["org-details", variables.id],
      });
      toast.success("Subscription Upgraded");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Upgrade failed");
    },
  });

  const createBranchMutation = useMutation({
    mutationFn: async ({
      organizationId,
      branchName,
    }: {
      organizationId: number;
      branchName: string;
    }) =>
      await api.post(`/system/organizations/${organizationId}/branches`, {
        branchName,
        organizationId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-details", selectedOrgId],
      });
      toast.success("Branch Created");
      setNewBranchName("");
      setIsAddingBranch(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to create branch"),
  });

  const updateBranchMutation = useMutation({
    mutationFn: async ({
      branchId,
      name,
    }: {
      branchId: number;
      name: string;
    }) => await api.patch(`/system/branches/${branchId}`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-details", selectedOrgId],
      });
      toast.success("Branch Updated");
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({
      userId,
      isActive,
    }: {
      userId: number;
      isActive: boolean;
    }) => await api.patch(`/system/users/${userId}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-details", selectedOrgId],
      });
      toast.success("User Status Updated");
    },
  });

  const toggleOrgStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) =>
      await api.patch(`/system/organizations/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-orgs"] });
      queryClient.invalidateQueries({
        queryKey: ["org-details", selectedOrgId],
      });
      toast.success("Organization status updated");
    },
  });

  const deleteOrgMutation = useMutation({
    mutationFn: async (id: number) =>
      await api.delete(`/system/organizations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-orgs"] });
      setIsManageOpen(false);
      toast.success("Organization Deleted Permanently");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Delete failed"),
  });

  const addAdminMutation = useMutation({
    mutationFn: async ({
      orgId,
      data,
    }: {
      orgId: number;
      data: typeof newAdminData;
    }) => await api.post(`/system/organizations/${orgId}/admins`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-details", selectedOrgId],
      });
      toast.success("Additional Admin Added");
      setIsAddingAdmin(false);
      setNewAdminData({ name: "", phoneNumber: "" });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to add admin"),
  });

  const toggleBranchStatusMutation = useMutation({
    mutationFn: async ({
      branchId,
      isActive,
    }: {
      branchId: number;
      isActive: boolean;
    }) => {
      return await api.patch(`/system/branches/${branchId}/status`, {
        isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-details", selectedOrgId],
      });

      toast.success("Branch status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error updating status");
    },
  });

  const deleteBranchMutation = useMutation({
    mutationFn: async (branchId: number) => {
      return await api.delete(`/system/branches/${branchId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-details", selectedOrgId],
      });

      toast.success("Branch deleted");
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error deleting branch");
    },
  });

  const { data: orgs, isLoading: isOrgsLoading } = useQuery({
    queryKey: ["system-orgs"],
    queryFn: async () => {
      const res = await api.get("/system/organizations");
      return res.data.data;
    },
  });

  const { data: orgDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["org-details", selectedOrgId],
    queryFn: async () => {
      const res = await api.get(`/system/organizations/${selectedOrgId}`);
      return res.data.data;
    },
    enabled: !!selectedOrgId,
  });

  const filteredOrgs = orgs?.filter(
    (org: any) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const canAddBranch =
    (orgDetails?.plan === "PRO" && orgDetails?.branches.length < 5) ||
    orgDetails?.plan === "ENTERPRISE" ||
    ((orgDetails?.plan === "FREE" || orgDetails?.plan === "BASIC") &&
      orgDetails?.branches.length < 1);


    const handleManage = (id: number) => {
    setSelectedOrgId(id);
    setIsManageOpen(true);
  };

  return (
    // <div className="max-w-[1600px] mx-auto p-4 lg:p-8 space-y-8">
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Navbar/>
      {/* Header & Stats Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            {t.systemControl}
          </h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">
            {t.masterPanel}
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-widest h-12 px-8 rounded-2xl shadow-lg shadow-indigo-500/20 border-none">
          <Plus className="mr-2 h-4 w-4" /> {t.onboardOrg}
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t.totalOrgs}
          value={orgs?.length || 0}
          icon={<Building2 className="text-indigo-500" />}
          subtitle={t.registeredEntities}
        />
        <StatCard
          title={t.activeUsers}
          value={
            orgs?.reduce(
              (a: number, c: any) => a + (c._count?.users || 0),
              0,
            ) || 0
          }
          icon={<Users className="text-emerald-500" />}
          subtitle={t.acrossOrgs}
        />
        <StatCard
          title={t.systemStatus}
          value={t.healthy}
          icon={<Activity className="text-blue-500" />}
          subtitle={t.allOperational}
        />
      </div>

      {/* Table - Fixed Dark Mode Text Visibility */}
            <Card className="rounded-[2rem] overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900 transition-colors">
              <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                    {t.orgList}
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t.searchSlugs}
                      className="pl-10 w-64 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 ring-indigo-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                        <th className="px-8 py-4">{t.tableOrg}</th>
                        <th className="px-8 py-4">{t.tablePlan}</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4 text-right">{t.tableActions}</th>
                        <th className="px-8 py-4">Days Left</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredOrgs?.map((org: any) => (
                        <tr
                          key={org.id}
                          className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm uppercase">
                                    {org.name}
                                  </span>
                                  {/* The Dynamic Badge */}
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${planStyles[org.plan] || planStyles.FREE}`}>
                                    {org.plan}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold italic">
                                  @{org.slug}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${planStyles[org.plan] || planStyles.FREE}`}>
                              {org.plan}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <button className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              {org.isActive ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <ShieldAlert className="h-4 w-4 text-rose-500" />
                              )}
                              <span className="text-xs font-bold uppercase">
                                {org.isActive ? t.active : t.inactive}
                              </span>
                            </button>
                          </td>
                         
                          <td className="px-8 py-5 text-right">
                            <Button
                              onClick={() => handleManage(org.id)}
                              variant="ghost"
                              size="sm"
                              className="rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                              <Settings className="h-4 w-4 mr-2" /> {t.manage}
                            </Button>
                          </td>
                          {/* Change org.subscription to org.subscriptions[0] */}
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              {org.subscriptions?.[0]?.endsAt ? (
                                (() => {
                                  const days = Math.ceil(
                                    (new Date(org.subscriptions[0].endsAt).getTime() -
                                      new Date().getTime()) /
                                      (1000 * 60 * 60 * 24),
                                  );
                                  const isCritical = days <= 5;
      
                                  return (
                                    <span
                                      className={`text-[10px] font-black uppercase ${isCritical ? "text-rose-500 animate-pulse" : "text-slate-400"}`}>
                                      {days} Days Left
                                    </span>
                                  );
                                })()
                              ) : (
                                <span className="text-[10px] font-black uppercase text-slate-400">
                                  Lifetime Access
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && successData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-emerald-500/20 text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>

              <h2 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white mb-2">
                Onboarding Complete
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-8">
                Organization{" "}
                <span className="text-indigo-500">
                  @{successData.organization.slug}
                </span>{" "}
                has been created.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest text-left ml-2">
                  Admin Credentials
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Phone / Login
                      </p>
                      <p className="text-sm font-bold dark:text-white">
                        {successData.user.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Default Password
                      </p>
                      <p className="text-sm font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                        123456
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText("123456");
                        toast.success("Password Copied!");
                      }}
                      className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg h-10 w-10 p-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase rounded-2xl">
                Finish & Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal-on board  */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-black uppercase italic mb-6 text-slate-900 dark:text-white">
                {t.onboardNewOrg}
              </h2>

              <form
                className="space-y-4"
                onSubmit={(e: any) => {
                  e.preventDefault();
                  // Since we use controlled state, we can just send newOrgData directly!
                  onboardMutation.mutate(newOrgData);
                }}>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label={t.tableOrg}
                    name="name"
                    value={newOrgData.name}
                    onChange={(e: any) =>
                      setNewOrgData({ ...newOrgData, name: e.target.value })
                    }
                  />
                  <FormInput
                    label={t.orgSlug}
                    name="slug"
                    value={newOrgData.slug}
                    onChange={(e: any) =>
                      setNewOrgData({ ...newOrgData, slug: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2">
                    {t.selectPlan}
                  </label>
                  <div className="relative">
                    <select
                      name="plan"
                      value={newOrgData.plan}
                      onChange={(e) =>
                        setNewOrgData({ ...newOrgData, plan: e.target.value })
                      }
                      className="w-full h-11 px-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 ring-indigo-500 cursor-pointer font-bold text-sm transition-colors duration-200">
                      <option value="FREE">{t.free}</option>
                      <option value="BASIC">{t.basic}</option>
                      <option value="PRO">{t.pro}</option>
                      <option value="ENTERPRISE">{t.enterprise}</option>
                    </select>
                  </div>
                </div>

                <FormInput
                  label={t.adminName}
                  name="adminName"
                  value={newOrgData.adminName}
                  onChange={(e: any) =>
                    setNewOrgData({ ...newOrgData, adminName: e.target.value })
                  }
                />
                <FormInput
                  label={t.adminPhone}
                  name="adminPhone"
                  value={newOrgData.adminPhone}
                  onChange={(e: any) =>
                    setNewOrgData({ ...newOrgData, adminPhone: e.target.value })
                  }
                />

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl font-bold uppercase text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    {t.cancel}
                  </Button>
                  <Button
                    disabled={onboardMutation.isPending}
                    type="submit"
                    className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase">
                    {onboardMutation.isPending ? (
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                    ) : (
                      t.submit
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MANAGEMENT SIDE PANEL --- */}
      <Sheet open={isManageOpen} onOpenChange={setIsManageOpen}>
        <SheetContent className="w-full sm:max-w-xl bg-white dark:bg-slate-950 p-0 overflow-y-auto">
          <div className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <SheetHeader>
              <SheetTitle className="text-2xl font-black uppercase italic dark:text-white">
                {isDetailsLoading
                  ? "Loading..."
                  : orgDetails?.name || "Organization Management"}
              </SheetTitle>
              <SheetDescription className="font-bold text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                {isDetailsLoading
                  ? "Please wait..."
                  : `Control Panel for @${orgDetails?.slug}`}
              </SheetDescription>
            </SheetHeader>
          </div>

          {isDetailsLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCcw className="animate-spin text-indigo-500" />
            </div>
          ) : (
            orgDetails && (
              <div className="p-8 space-y-10 pb-20">
                {/* 1. SUBSCRIPTION */}
                <section>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2 tracking-tighter">
                    <CreditCard className="h-3 w-3" /> Subscription & Plan
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-black dark:text-white uppercase">
                        {orgDetails.plan}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold italic">
                        Valid until:{" "}
                        {new Date(
                          orgDetails.subscriptions[0]?.endsAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <select
                      value={orgDetails.plan}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfirmConfig({
                          isOpen: true,
                          title: "Update Plan?",
                          description: `Change @${orgDetails.slug} to ${val} plan?`,
                          onConfirm: () =>
                            upgradePlanMutation.mutate({
                              id: orgDetails.id,
                              plan: val,
                            }),
                        });
                      }}
                      className="text-xs font-black bg-white dark:bg-slate-800 border-none rounded-lg p-2 ring-1 ring-slate-200 dark:ring-slate-700 dark:text-white outline-none">
                      <option value="FREE">FREE</option>
                      <option value="BASIC">BASIC</option>
                      <option value="PRO">PRO</option>
                      <option value="ENTERPRISE">ENTERPRISE</option>
                    </select>
                  </div>
                </section>

                {/* 2. BRANCHES */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                      <Building2 className="h-3 w-3" /> Branches
                    </h4>

                    {canAddBranch && (
                      <Button
                        onClick={() => setIsAddingBranch(true)}
                        variant="ghost"
                        className="text-[10px] font-black uppercase h-7 text-indigo-600">
                        <Plus className="h-3 w-3 mr-1" /> Add Branch
                      </Button>
                    )}
                  </div>

                  {isAddingBranch && (
                    <div className="flex gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                      <Input
                        autoFocus
                        placeholder="Branch Name"
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                        className="h-8 text-xs font-bold dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newBranchName.trim()) {
                            createBranchMutation.mutate({
                              organizationId: orgDetails.id,
                              branchName: newBranchName,
                            });
                          }
                          if (e.key === "Escape") {
                            setIsAddingBranch(false);
                            setNewBranchName("");
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          createBranchMutation.mutate({
                            organizationId: orgDetails.id,
                            branchName: newBranchName,
                          })
                        }
                        className="h-8 bg-indigo-600">
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsAddingBranch(false)}
                        className="h-8 text-slate-400">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    {orgDetails.branches?.map((branch: any) => {
                      // 1. Logic check: Is this the protected main branch?
                      const isMainBranch = branch.name
                        .toLowerCase()
                        .includes("main");

                      return (
                        <div
                          key={branch.id}
                          className={`flex items-center justify-between p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl transition-opacity ${
                            !branch.isActive ? "opacity-60" : ""
                          }`}>
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              defaultValue={branch.name}
                              // Disable editing if branch is inactive OR if it's the main branch
                              // (optional: remove !isMainBranch if you want to allow renaming the main branch)
                              disabled={!branch.isActive}
                              className="h-7 text-xs font-bold border-none bg-transparent dark:text-white p-0 focus-visible:ring-0"
                              onBlur={(e) =>
                                e.target.value !== branch.name &&
                                updateBranchMutation.mutate({
                                  branchId: branch.id,
                                  name: e.target.value,
                                })
                              }
                            />
                            {!branch.isActive && (
                              <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 rounded font-black uppercase">
                                Disabled
                              </span>
                            )}
                            {isMainBranch && (
                              <span className="text-[8px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-1 rounded font-black uppercase">
                                System Default
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-mono text-slate-400 mr-2">
                              ID:{branch.id}
                            </span>

                            {/* TOGGLE BRANCH STATUS */}
                            <Button
                              onClick={() =>
                                toggleBranchStatusMutation.mutate({
                                  branchId: branch.id,
                                  isActive: !branch.isActive,
                                })
                              }
                              size="icon"
                              variant="ghost"
                              // We usually don't want to deactivate the main branch either
                              disabled={isMainBranch}
                              className={`h-7 w-7 ${
                                isMainBranch ? "opacity-20" : ""
                              } ${
                                branch.isActive
                                  ? "text-slate-300 hover:text-rose-500"
                                  : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                              }`}>
                              <Power className="h-3.5 w-3.5" />
                            </Button>

                            {/* DELETE BRANCH */}
                            <Button
                              // Disable the button based on the check
                              disabled={isMainBranch}
                              onClick={() =>
                                setConfirmConfig({
                                  isOpen: true,
                                  title: "Delete Branch?",
                                  description: `Are you sure you want to delete "${branch.name}"? This action is irreversible.`,
                                  variant: "destructive",
                                  onConfirm: () =>
                                    deleteBranchMutation.mutate(branch.id),
                                })
                              }
                              size="icon"
                              variant="ghost"
                              // Add conditional styling for the disabled state
                              className={`h-7 w-7 transition-all ${
                                isMainBranch
                                  ? "opacity-10 cursor-not-allowed grayscale"
                                  : "text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                              }`}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 3. ADMINS */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3" /> Org Admins
                    </h4>
                    <Button
                      onClick={() => setIsAddingAdmin(!isAddingAdmin)}
                      variant="ghost"
                      className="text-[10px] font-black uppercase h-7 text-indigo-600">
                      {isAddingAdmin ? (
                        <X className="h-3 w-3 mr-1" />
                      ) : (
                        <UserPlus className="h-3 w-3 mr-1" />
                      )}
                      {isAddingAdmin ? "Cancel" : "Add Admin"}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {isAddingAdmin && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6 space-y-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                        <Input
                          placeholder="Full Name"
                          value={newAdminData.name}
                          onChange={(e) =>
                            setNewAdminData({
                              ...newAdminData,
                              name: e.target.value,
                            })
                          }
                          className="h-9 text-xs font-bold dark:text-white"
                        />
                        <Input
                          placeholder="Phone Number (e.g. 09...)"
                          value={newAdminData.phoneNumber}
                          onChange={(e) =>
                            setNewAdminData({
                              ...newAdminData,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="h-9 text-xs font-bold dark:text-white"
                        />
                        <Button
                          className="w-full h-9 bg-indigo-600 text-xs font-bold text-white"
                          onClick={() =>
                            addAdminMutation.mutate({
                              orgId: orgDetails.id,
                              data: newAdminData,
                            })
                          }
                          disabled={
                            !newAdminData.name ||
                            !newAdminData.phoneNumber ||
                            addAdminMutation.isPending
                          }>
                          {addAdminMutation.isPending
                            ? "Creating..."
                            : "Confirm & Create Admin"}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    {orgDetails.users.map((admin: any) => (
                      <div
                        key={admin.id}
                        className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl">
                        <div>
                          <p className="text-xs font-bold dark:text-white flex items-center gap-2">
                            {admin.name}
                            {!admin.isActive && (
                              <span className="text-[8px] bg-rose-100 text-rose-600 px-1 rounded font-black">
                                INACTIVE
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {admin.phoneNumber}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          {/* RESET PASSWORD BUTTON */}
                          <Button
                            onClick={() =>
                              setConfirmConfig({
                                isOpen: true,
                                title: "Reset Password?",
                                description: `Generate new temporary password for ${admin.name}?`,
                                onConfirm: () => {
                                  toast.promise(
                                    api.post(
                                      `/system/users/${admin.id}/reset-password`,
                                    ),
                                    {
                                      loading: "Generating...",
                                      success: (res) => {
                                        const pwd = res.data.data.tempPassword;
                                        navigator.clipboard.writeText(pwd);
                                        return `Password: ${pwd} (Copied)`;
                                      },
                                      error: "Failed to reset password",
                                    },
                                    { duration: 6000 },
                                  );
                                },
                              })
                            }
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                            <RefreshCcw className="h-4 w-4" />
                          </Button>

                          {/* TOGGLE ACTIVE STATUS BUTTON */}
                          <Button
                            onClick={() =>
                              toggleUserStatusMutation.mutate({
                                userId: admin.id,
                                isActive: !admin.isActive,
                              })
                            }
                            size="icon"
                            variant="ghost"
                            className={`h-8 w-8 ${
                              admin.isActive
                                ? "text-slate-400 hover:text-rose-500"
                                : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            }`}>
                            <Power className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. DANGER ZONE */}
                <section className="pt-6 border-t-2 border-rose-100 dark:border-rose-900/20">
                  <h4 className="text-[10px] font-black uppercase text-rose-500 mb-4 italic flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" /> Critical Actions
                  </h4>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() =>
                        setConfirmConfig({
                          isOpen: true,
                          title: orgDetails.isActive
                            ? "Suspend Organization?"
                            : "Restore Access?",
                          description: `This will affect all ${orgDetails._count?.users || 0} users in this organization.`,
                          variant: "destructive",
                          onConfirm: () =>
                            toggleOrgStatusMutation.mutate({
                              id: orgDetails.id,
                              isActive: !orgDetails.isActive,
                            }),
                        })
                      }
                      variant="outline"
                      className={`w-full font-black uppercase text-[10px] h-12 border-2 ${orgDetails.isActive ? "text-rose-500 border-rose-100" : "text-emerald-600 border-emerald-100"}`}>
                      <Power className="h-4 w-4 mr-2" />{" "}
                      {orgDetails.isActive
                        ? "Suspend Organization"
                        : "Restore Organization"}
                    </Button>

                    <Button
                      onClick={() =>
                        setConfirmConfig({
                          isOpen: true,
                          title: "DELETE PERMANENTLY?",
                          description: `Type "DELETE" is no longer needed, just confirm here. All data for @${orgDetails.slug} will be lost forever.`,
                          variant: "destructive",
                          onConfirm: () =>
                            deleteOrgMutation.mutate(orgDetails.id),
                        })
                      }
                      variant="ghost"
                      className="w-full font-black uppercase text-[10px] h-10 text-slate-400 hover:text-rose-600">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Data Forever
                    </Button>
                  </div>
                </section>
              </div>
            )
          )}
        </SheetContent>
      </Sheet>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        onClose={closeConfirm}
        onConfirm={() => {
          confirmConfig.onConfirm();
          closeConfirm();
        }}
      />
    </div>
  );
}

function StatCard({ title, value, icon, subtitle }: any) {
  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden relative group transition-colors">
      <div className="absolute -right-4 -top-4 p-8 opacity-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <CardContent className="p-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
          {title}
        </p>
        <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1">
          {value}
        </h3>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 italic">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}
