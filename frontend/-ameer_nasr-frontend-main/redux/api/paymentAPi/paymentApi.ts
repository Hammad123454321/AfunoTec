import { PaymentApiResponse } from "@/types/global";
import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  overrideExisting: true, // ✅ add this
  endpoints: (builder) => ({
    // get all users
    getPayment: builder.query<PaymentApiResponse, { page: string; limit: string }>({
      query: ({ page, limit }) => ({
        url: `/subscription-payments?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetPaymentQuery } = userApi;
