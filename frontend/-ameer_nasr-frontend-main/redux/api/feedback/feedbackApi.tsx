import { IFeedbackResponse } from "@/types/global";
import baseApi from "../baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create feedback
    createFeedback: builder.mutation({
      query: (body) => {
        return {
          url: "/reviews",
          method: "POST",
          body,
        };
      },
    }),

    // get all feedback
    getAllFeedback: builder.query<IFeedbackResponse, void>({
      query: () => ({
        url: `/reviews`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateFeedbackMutation, useGetAllFeedbackQuery } = profileApi;
