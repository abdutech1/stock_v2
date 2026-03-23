// // src/services/reports.service.ts
// // ... (keep all previous report functions)

// import { Prisma } from '@prisma/client';

// // Very strict allow-list to prevent injection / abuse
// const ALLOWED_MODELS = ['sale', 'saleItem', 'stock', 'pricecategory', 'category', 'expense', 'salarypayment', 'bonusPayment', 'attendance', 'user'] as const;

// const ALLOWED_FIELDS: Record<string, string[]> = {
//   sale: ['id', 'status', 'createdAt', 'updatedAt', 'employeeId'],
//   saleItem: ['id', 'quantity', 'soldPrice', 'priceCategoryId', 'saleId'],
//   stock: ['id', 'quantity', 'purchasePrice', 'createdAt', 'updatedAt'],
//   pricecategory: ['id', 'fixedPrice', 'categoryId'],
//   category: ['id', 'name'],
//   expense: ['id', 'amount', 'category', 'expenseDate'],
//   salarypayment: ['id', 'amount', 'userId', 'periodStart', 'periodEnd'],
//   bonusPayment: ['id', 'amount', 'userId', 'periodStart', 'periodEnd'],
//   attendance: ['id', 'status', 'date', 'userId'],
//   user: ['id', 'name', 'role', 'baseSalary'],
// };

// const ALLOWED_AGGREGATES = ['sum', 'avg', 'count', 'min', 'max'];

// interface CustomQueryReportInput {
//   models?: string;                    // comma-separated, e.g. "sale,saleItem"
//   fields?: string;                    // comma-separated, e.g. "sale.id,saleItem.quantity"
//   filters?: string;                   // simple key=value&key=value (we parse safely)
//   groupBy?: string;                   // e.g. "saleItem.priceCategoryId"
//   aggregate?: string;                 // e.g. "sum:saleItem.soldPrice,avg:saleItem.soldPrice"
//   startDate?: string;
//   endDate?: string;
//   page?: number;
//   limit?: number;
//   sortBy?: string;
// }

// export async function getCustomQueryReport(input: CustomQueryReportInput = {}) {
//   const {
//     models: modelsStr = '',
//     fields: fieldsStr = '',
//     filters: filtersStr = '',
//     groupBy = '',
//     aggregate: aggregateStr = '',
//     startDate,
//     endDate,
//     page = 1,
//     limit = 20,
//     sortBy = 'id:desc',
//   } = input;

//   // ── 1. Parse & Validate Models ──────────────────────────────────────
//   const requestedModels = modelsStr.split(',').map(m => m.trim().toLowerCase());
//   const validModels = requestedModels.filter(m => ALLOWED_MODELS.includes(m as any));

//   if (validModels.length === 0) {
//     throw new Error('No valid models specified. Allowed: ' + ALLOWED_MODELS.join(', '));
//   }

//   // ── 2. Parse Fields ─────────────────────────────────────────────────
//   const requestedFields = fieldsStr ? fieldsStr.split(',').map(f => f.trim()) : [];
//   const select: Record<string, any> = {};

//   requestedFields.forEach(field => {
//     const [model, col] = field.includes('.') ? field.split('.') : [validModels[0], field];
//     if (!validModels.includes(model) || !ALLOWED_FIELDS[model]?.includes(col)) {
//       throw new Error(`Invalid field: ${field}. Allowed for ${model}: ${ALLOWED_FIELDS[model]?.join(', ')}`);
//     }
//     if (!select[model]) select[model] = {};
//     select[model][col] = true;
//   });

//   // ── 3. Parse Filters (very safe parsing) ────────────────────────────
//   const where: Record<string, any> = {};
//   if (filtersStr) {
//     const filterPairs = filtersStr.split('&').map(p => p.split('='));
//     for (const [key, value] of filterPairs) {
//       const [model, field] = key.includes('.') ? key.split('.') : [validModels[0], key];
//       if (!validModels.includes(model) || !ALLOWED_FIELDS[model]?.includes(field)) continue;

//       // Basic sanitization
//       let parsedValue: any = value;
//       if (!isNaN(Number(value))) parsedValue = Number(value);
//       else if (value === 'true' || value === 'false') parsedValue = value === 'true';
//       else if (value.includes(',')) parsedValue = value.split(',').map(v => isNaN(Number(v)) ? v : Number(v));

//       if (!where[model]) where[model] = {};
//       where[model][field] = parsedValue;
//     }
//   }

//   // ── Date range filter (applied to main model) ───────────────────────
//   const mainModel = validModels[0];
//   if (startDate || endDate) {
//     const dateField = mainModel === 'sale' ? 'createdAt' :
//                       mainModel === 'expense' ? 'expenseDate' :
//                       mainModel === 'attendance' ? 'date' :
//                       mainModel === 'salarypayment' || mainModel === 'bonusPayment' ? 'periodStart' : null;

//     if (dateField) {
//       if (!where[mainModel]) where[mainModel] = {};
//       where[mainModel][dateField] = {};
//       if (startDate) where[mainModel][dateField].gte = new Date(startDate);
//       if (endDate) where[mainModel][dateField].lte = new Date(endDate);
//     }
//   }

//   // ── 4. Aggregations ─────────────────────────────────────────────────
//   const aggregate: Record<string, any> = {};
//   if (aggregateStr) {
//     aggregateStr.split(',').forEach(agg => {
//       const [op, field] = agg.split(':');
//       if (!ALLOWED_AGGREGATES.includes(op)) return;
//       const [model, col] = field.includes('.') ? field.split('.') : [mainModel, field];
//       if (!validModels.includes(model) || !ALLOWED_FIELDS[model]?.includes(col)) return;

//       if (!aggregate[`_${op}`]) aggregate[`_${op}`] = {};
//       aggregate[`_${op}`][`${model}_${col}`] = true; // Prisma uses _sum, _avg, etc.
//     });
//   }

//   // ── 5. Grouping ─────────────────────────────────────────────────────
//   const groupByFields = groupBy ? groupBy.split(',').map(g => g.trim()) : undefined;

//   // ── 6. Build Prisma query ───────────────────────────────────────────
//   const skip = (page - 1) * limit;
//   let result: any;

//   if (groupByFields && groupByFields.length > 0 && aggregate) {
//     // Grouped + aggregated query
//     result = await prisma[mainModel].groupBy({
//       by: groupByFields,
//       where: where[mainModel] || {},
//       _sum: aggregate._sum,
//       _avg: aggregate._avg,
//       _count: aggregate._count,
//       _min: aggregate._min,
//       _max: aggregate._max,
//       orderBy: { _count: { id: 'desc' } },
//       skip,
//       take: limit,
//     });
//   } else {
//     // Regular findMany with relations & select
//     const include: Record<string, any> = {};
//     validModels.slice(1).forEach(m => {
//       include[m] = { select: select[m] || true };
//     });

//     result = await prisma[mainModel].findMany({
//       where: where[mainModel] || {},
//       select: select[mainModel] || true,
//       include: Object.keys(include).length > 0 ? include : undefined,
//       orderBy: sortBy ? { [sortBy.split(':')[0]]: sortBy.split(':')[1] || 'desc' } : undefined,
//       skip,
//       take: limit,
//     });
//   }

//   // ── 7. Total count for pagination ───────────────────────────────────
//   const total = await prisma[mainModel].count({ where: where[mainModel] || {} });

//   return {
//     pagination: { page, limit, total },
//     data: result,
//     models: validModels,
//     usedFilters: where,
//     usedAggregates: aggregate,
//   };
// }



// Example API Calls


// # Total revenue & quantity sold per category (last year)
// GET /api/reports/custom?models=saleItem,pricecategory,category&fields=saleItem.quantity,saleItem.soldPrice,category.name&filters=sale.status=CONFIRMED&groupBy=category.id&aggregate=sum:saleItem.quantity,sum:saleItem.soldPrice&startDate=2025-01-01&endDate=2025-12-31

// # Top 10 employees by revenue generated
// GET /api/reports/custom?models=sale,saleItem,user&fields=user.name&aggregate=sum:saleItem.soldPrice&groupBy=user.id&sortBy=_sum.saleItem_soldPrice:desc&limit=10

// # Stock value per price category
// GET /api/reports/custom?models=stock,pricecategory&fields=stock.quantity,stock.purchasePrice,pricecategory.fixedPrice&aggregate=sum:stock.quantity*stock.purchasePrice