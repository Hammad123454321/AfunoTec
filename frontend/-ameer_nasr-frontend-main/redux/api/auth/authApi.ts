/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserResponse } from "@/types/global";
import baseApi from "../baseApi";

type AuthSuccessResponse = {
  success: boolean;
  message: string;
};

type UserRegistrationBase = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  success: boolean;
  message?: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
    token: string;
  };
};



const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<IUserResponse, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    logIn: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    signUp: builder.mutation<AuthSuccessResponse, UserRegistrationBase>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (body: any) => ({
        url: "/otp/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (body: any) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    resendOtp: builder.mutation({
      query: (body: any) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (body: { newPassword: string }) => {
        return {
          url: "/auth/change-password",
          method: "PUT",
          body,
        };
      },
    }),
    verifyOtp: builder.mutation({
      query: (body: any) => ({
        url: "/otp/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLogInMutation,
  useSignUpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
} = authApi;




















