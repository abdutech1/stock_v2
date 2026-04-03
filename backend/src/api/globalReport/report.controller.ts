import { getOrgGlobalOverview } from "@/services/reports.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getGlobalOverviewController = catchAsync(async (req, res) => {
  const organizationId = req.user.organizationId;
  
  const data = await getOrgGlobalOverview(organizationId);

  res.status(200).json({
    status: "success",
    data
  });
});