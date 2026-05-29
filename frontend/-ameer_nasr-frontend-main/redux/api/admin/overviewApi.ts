

import baseApi from "../baseApi";



export interface Analytics {
  userGrowthPercent: number;
  formDropPercent: number;
  revenueGrowthPercent: number;
  latestRegGrowthPercent: number;
}

export interface DashboardSummary {
  totalUsers: number;
  totalFormsSubmitted: number;
  totalRevenue: number;
  latestRegistrationFrom: string[]; 
  analytics: Analytics; 
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    data: DashboardSummary;
    analytics: Analytics; 
  };
}

export interface MonthlyRevenueDay {
  day: number;
  amount: number;
}

export interface MonthlyRevenueResponse {
  success: boolean;
  message: string;
  data: MonthlyRevenueDay[];
}


export interface PopularVisaForm {
  country?: string;
  visaFormNumber?: string;
  visaName?: string;
  formName?: string;
  count?: number;
  submittedCount?: number;
  flag?: string;
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface PopularVisaResponse {
  success: boolean;
  message: string;
  data: PopularVisaForm[];
}

// === API Slice ===
const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSummary: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),

    getPopularVisa: builder.query<PopularVisaResponse, void>({
      query: () => "/dashboard/popular-visa-forms",
      providesTags: ["Dashboard"],
    }),

    getMonthlyDetails: builder.query<
      MonthlyRevenueResponse,
      { month: number; year: number }
    >({
      query: ({ month, year }) => ({
        url: "/dashboard/monthly-revenue-details",
        method: "GET",
        params: { month, year },
      }),
      providesTags: (result, error, arg) => [
        "Dashboard",
        { type: "Dashboard", id: `MONTHLY-${arg.year}-${arg.month}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSummaryQuery,
  useGetPopularVisaQuery,
  useGetMonthlyDetailsQuery,
} = overviewApi;

export default overviewApi;