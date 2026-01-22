export const STATUS_MAP = {
  OPEN: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
} as const;

export type BackendStatus = keyof typeof STATUS_MAP;
export type UIStatus = typeof STATUS_MAP[BackendStatus];