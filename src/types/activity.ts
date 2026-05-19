export type DailyActivityItem = {
  id: string;
  agent_uuid: string;
  agent_full_name: string;
  location: string;
  applications: number;
  total_amount: number;
  submitted: string;
  date: string;
};

export type ActivityPagination = {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
};

export type DailyActivitySummary = {
  total_updates: number;
  total_loan_amount: number;
  total_applications: number;
  last_update: string | null;
};

export type MyDailyActivityResponse = {
  items: DailyActivityItem[];
  pagination: ActivityPagination;
  summary: DailyActivitySummary;
};

export type DailyActivityDetailResponse = {
  daily_activity: DailyActivityItem;
};

export type CreateDailyActivityPayload = {
  agent_uuid: string;
  agent_full_name: string;
  location: string;
  applications_count: number;
  loan_amount: number;
  update_date: string;
};

/** At least one field required when patching. */
export type UpdateDailyActivityPayload = {
  applications_count?: number;
  loan_amount?: number;
  update_date?: string;
};

export type DailyActivityQueryParams = {
  page?: number;
  page_size?: number;
  date_from?: string;
  date_to?: string;
  loan_min?: number;
  loan_max?: number;
  location?: string;
  name?: string;
};

/** Agent-scoped list (GET /activity/daily/me). */
export type MyDailyActivityParams = DailyActivityQueryParams;

/** Admin list all agents (GET /activity/daily). */
export type AllDailyActivityParams = DailyActivityQueryParams & {
  agent_uuid?: string;
};
