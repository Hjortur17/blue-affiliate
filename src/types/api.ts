export interface AffiliateProfile {
  id: string;
  name: string;
  email: string;
  affiliateLink: string;
}

export interface LoginResponse {
  token: string;
  affiliate: AffiliateProfile;
}

export interface DashboardSummary {
  totalBookings: { value: number; changePercent: number };
  totalRevenue: { value: number };
  expectedCommission: { value: number };
  totalClicks: { value: number; conversionPercent: number };
  bookingTypeDistribution: { standard: number; premium: number; luxury: number };
  topCars: { rank: number; model: string }[];
}

export interface DailyDataPoint {
  date: string;
  value: number;
}

export interface EngagementData {
  clicksPerDay: DailyDataPoint[];
  bookingsPerDay: DailyDataPoint[];
}

export interface RentalsData {
  upcomingByPickupDate: DailyDataPoint[];
  completedByDropoffDate: DailyDataPoint[];
}

export type PayoutStatus = "Pending" | "Approved" | "Paid" | "Rejected";

export interface PayoutRecord {
  id: string;
  requestDate: string;
  amount: number;
  status: PayoutStatus;
  paidDate: string | null;
}

export interface PayoutsData {
  availableBalance: number;
  history: PayoutRecord[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
}
