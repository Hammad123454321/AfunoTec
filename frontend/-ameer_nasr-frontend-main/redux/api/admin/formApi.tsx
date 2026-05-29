// // features/forms/formsApi.ts
// import { baseApi } from "../baseApi";

// export interface VisaForm {
//   id: string;
//   country: string;
//   visaCategory: string;
//   visaFormNumber: string;
//   formUrl: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface VisaFormsApiResponse {
//   success: boolean;
//   message: string;
//   data: VisaForm[];
// }

// export interface CreateVisaFormDto {
//   country: string;
//   visaCategory: string;
//   visaFormNumber: string;
//   formUrl: string;
// }

// export const formsApi = baseApi.injectEndpoints({
//   overrideExisting: true,
//   endpoints: (builder) => ({
//     getAllVisaForms: builder.query<VisaForm[], void>({
//       query: () => "/visaforms",
//       providesTags: ["VisaForm"],
//       // Transform response to extract only the array
//       transformResponse: (response: VisaFormsApiResponse) => response.data,
//     }),

//     createVisaForm: builder.mutation<VisaForm, CreateVisaFormDto>({
//       query: (body) => ({
//         url: "/visaforms",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["VisaForm"],
//     }),

//     deleteVisaForm: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `/visaforms/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["VisaForm"],
//     }),
//     updateVisaForm: builder.mutation<VisaForm, Partial<CreateVisaFormDto> & { id: string }>({
//   query: ({ id, ...body }) => ({
//     url: `/visaforms/${id}`,
//     method: "PUT",
//     body,
//   }),
//   invalidatesTags: ["VisaForm"],
// }),
//   }),
// });

// export const {
//   useGetAllVisaFormsQuery,
//   useCreateVisaFormMutation,
//   useDeleteVisaFormMutation,
//   useUpdateVisaFormMutation
// } = formsApi;

// features/forms/formsApi.ts

import { baseApi } from "../baseApi";

// === Types for Downloaded Visa Forms ===
export interface DownloadedVisaForm {
  id: string;
  userId: string;
  formUrl: string; //"https://your-cdn.com/uploads/visaform_001.pdf"
  createdAt: string;
  updatedAt: string;
}

export interface DownloadedVisaFormsResponse {
  success: boolean;
  message: string;
  data: DownloadedVisaForm[];
}

// === Existing Types (আপনার আগেরগুলো) ===
export interface VisaForm {
  id: string;
  country: string;
  visaCategory: string;
  visaFormNumber: string;
  formUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface VisaFormsApiResponse {
  success: boolean;
  message: string;
  data: VisaForm[];
}

export interface CreateVisaFormDto {
  userId: string;
  pdfUrl: string;
}

export const formsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllVisaForms: builder.query<VisaForm[], void>({
      query: () => "/visaforms",
      providesTags: ["VisaForm"],
      transformResponse: (response: VisaFormsApiResponse) => response.data,
    }),

    // create form visa
    createVisaForm: builder.mutation<void, { userId: string; pdfUrl: string }>({
      query: (body) => ({
        url: "/downloaded-visa-forms", // your backend endpoint
        method: "POST",
        body,
      })    
    }),

    deleteVisaForm: builder.mutation<void, string>({
      query: (id) => ({
        url: `/visaforms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VisaForm"],
    }),

    updateVisaForm: builder.mutation<
      VisaForm,
      Partial<CreateVisaFormDto> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/visaforms/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["VisaForm"],
    }),

    // New: Get My Downloaded Visa Forms
    getMyDownloadedVisaForms: builder.query<DownloadedVisaFormsResponse, string>({
      query: (id) => ({
        url: `/downloaded-visa-forms/user/${id}`,
        method: "GET",
      }),
      providesTags: ["VisaForm"],
    }),

    // features/forms/formsApi.ts (আপনার আগের ফাইলে যোগ করুন)

    // Delete a downloaded visa form (user's own)
    deleteDownloadedVisaForm: builder.mutation<void, string>({
      query: (downloadedFormId) => ({
        url: `/downloaded-visa-forms/${downloadedFormId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DownloadedForm", id },
        "DownloadedForm",
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAllVisaFormsQuery,
  useCreateVisaFormMutation,
  useDeleteVisaFormMutation,
  useUpdateVisaFormMutation,
  useGetMyDownloadedVisaFormsQuery,
  useDeleteDownloadedVisaFormMutation, // New hook
} = formsApi;
