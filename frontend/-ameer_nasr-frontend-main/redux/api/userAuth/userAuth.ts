/* eslint-disable @typescript-eslint/no-explicit-any */
// import { UsersResponse } from "@/types/global";
// import { baseApi } from "../baseApi";

// export const userApi = baseApi.injectEndpoints({
//   overrideExisting: true, // ✅ add this
//   endpoints: (builder) => ({
//     // get all users
//     getUsers: builder.query<UsersResponse, { page: string; limit: string }>({
//       query: ({ page, limit }) => ({
//         url: `/users?page=${page}&limit=${limit}`,
//         method: "GET",
//       }),
//       providesTags: ["User"],
//     }),

//      // update role
//     updateUser: builder.mutation({
//       query: ({id, body }) => ({
//          url: `/users/${id}`,// dynamic id
//         method: "PUT",
//         body,
//       }),
//       invalidatesTags: ["User"],
//     }),

//     // delete user
//     deleteUser: builder.mutation({
//       query: ({ id }) => ({
//         url: `/users/${id}`, // dynamic id
//         method: "DELETE"
//       }),
//       invalidatesTags: ["User"],
//     }),
//   }),
// });

// export const { useGetUsersQuery ,useUpdateUserMutation ,useDeleteUserMutation } = userApi;








import { UsersResponse } from "@/types/global";
import { baseApi } from "../baseApi";

type AuthSuccessResponse = {
  success: boolean;
  message: string;
  data?: any;
};

type ManagerRegistrationRequest = {
  name: string;
  email: string;
  role: "admin" | "manager";
};

export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all users with pagination
    getUsers: builder.query<UsersResponse, { page: string; limit: string }>({
      query: ({ page, limit }) => ({
        url: `/users?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"]
    }),

    // Register manager/admin by super_admin (uses existing register endpoint)
    registerManager: builder.mutation<
      AuthSuccessResponse,
      ManagerRegistrationRequest
    >({
      query: (body) => ({
        url: "/users/register-manager",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Update user (uses existing update endpoint)
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete user (uses existing delete endpoint)
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useRegisterManagerMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;