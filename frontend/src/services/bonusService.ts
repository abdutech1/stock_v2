import api from "@/api/axios";

export const bonusService = {
  // 1. Get all active rules
  getRules: () => 
    api.get("/bonus-rules").then(res => res.data),

  // 2. Create a new rule (Matches your POST controller)
  createRule: (data: { type: string; minAmount: number; bonusAmount: number }) =>
    api.post("/bonus-rules", data).then(res => res.data),

  // 3. Deactivate a rule (Matches your PATCH /:id/deactivate route)
  deactivateRule: (id: number) =>
    api.patch(`/bonus-rules/${id}/deactivate`).then(res => res.data),

  // 4. Run the automation logic
  applyRuleBased: ({ periodStart, periodEnd }: { periodStart: Date; periodEnd: Date }) => 
    api.post("/bonuses/apply", { 
      periodStart, 
      periodEnd, 
      mode: "RULE_BASED" 
    }).then(res => res.data),
};