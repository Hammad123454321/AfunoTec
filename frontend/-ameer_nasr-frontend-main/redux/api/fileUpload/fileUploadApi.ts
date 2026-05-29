import baseApi from "../baseApi";

const fileUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSingleFile: builder.mutation({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query: (body: any) => {
        return {
          url: "/images/single",
          method: "POST",
          body,
        };
      },
    }),

    //contact us

    createContact: builder.mutation({
      query: (body) => {
        return {
          url: "/contact-us",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useUploadSingleFileMutation, useCreateContactMutation } =
  fileUploadApi;
