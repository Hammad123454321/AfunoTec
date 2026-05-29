import { SubscriptionPlansResponse } from "@/types/global";
import baseApi from "../baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create payment
    createSubcription: builder.mutation({
      query: (body) => ({
        url: "/subscription-plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plan"],
    }),

    // get all plans
    getPlan: builder.query<SubscriptionPlansResponse, void>({
      query: () => ({
        url: `/subscription-plans`,
        method: "GET",
      }),
      providesTags: ["Plan"],
    }),

    // update plans
    updatePlan: builder.mutation({
      query: ({ id, body }) => ({
        url: `/subscription-plans/${id}`, // dynamic id
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Plan"],
    }),
  }),
});

export const {
  useCreateSubcriptionMutation,
  useGetPlanQuery,
  useUpdatePlanMutation,
} = profileApi;
