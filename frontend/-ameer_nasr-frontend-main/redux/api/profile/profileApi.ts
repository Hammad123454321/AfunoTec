import { IUpdateProfilePayload, IUserResponse } from "@/types/global";
import baseApi from "../baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<IUserResponse, IUpdateProfilePayload>({
      query: (body) => {
        return {
          url: "/users/profile",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUpdateProfileMutation } = profileApi;
