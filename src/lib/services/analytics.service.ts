import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";


export interface PublishStatusSummary {
    draft: number;
    scheduled: number;
    published: number;
    archived: number;
    total: number;
}

export interface BatchJobsSummary {
    success: number;
    pending: number;
    failed: number;
    total: number;
}

export interface DashboardAnalytics {
    total_projects: number;
    new_projects_this_week: number;
    published_blogs: number;
    unread_messages: number;
    pending_jobs: number;
    publish_status_summary: PublishStatusSummary;
    batch_jobs_summary: BatchJobsSummary;
}

export interface RecentActivity {
    activity_id: string;
    type: 'batch_job' | 'schedule' | 'message' | 'draft';
    status: string;
    title: string;
    description: string;
    created_at: string;
}

export interface AnalyticsOverviewResponse {
    metrics: DashboardAnalytics;
    recentActivities: RecentActivity[];
}

export class AnalyticsService extends BaseService {
    private static instance: AnalyticsService;

    private constructor() {
        super();
    }

    public static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    // Mengambil data analytics overview
    public async getOverviewAnalytics(): Promise<AppResponse<AnalyticsOverviewResponse>> {
        return this.api.get<unknown, AppResponse<AnalyticsOverviewResponse>>("/analytics/overview");
    }
}

export const analyticsService = AnalyticsService.getInstance();