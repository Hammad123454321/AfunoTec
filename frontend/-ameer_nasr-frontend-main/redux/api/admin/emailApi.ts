// features/email/emailApi.ts
import { baseApi } from "../baseApi";

export interface EmailTemplate {
  id: string;
  name: "WelcomeEmail" | "PaymentReceiptEmail" | "ConfirmationEmail";
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplatesResponse {
  success: boolean;
  message: string;
  data: EmailTemplate[];
}

export interface SaveEmailTemplateDto {
  id?: string;                    // Optional: if exists → update, else → create
  name: "WelcomeEmail" | "PaymentReceiptEmail" | "ConfirmationEmail";
  subject: string;
  body: string;
}

// Single endpoint to create OR update (based on presence of id)
export const emailApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Fetch all email templates
    getEmailTemplates: builder.query<EmailTemplate[], void>({
      query: () => "/email-templates",
      providesTags: ["EmailTemplate"],
      transformResponse: (response: EmailTemplatesResponse) => response.data,
    }),

    // Save (Create or Update) a single template
   // features/email/emailApi.ts
saveEmailTemplate: builder.mutation<EmailTemplate, {
  id?: string;
  name?: string;        // only needed for create
  subject: string;
  body: string;
}>({
  query: (payload) => {
    const { id, name, subject, body } = payload;

    // For update: don't send "name"
    const bodyForUpdate = id ? { subject, body } : { name, subject, body };

    return {
      url: id ? `/email-templates/${id}` : `/email-templates`,
      method: id ? "PUT" : "POST",
      body: bodyForUpdate,
    };
  },
  invalidatesTags: ["EmailTemplate"],
}),

    // Optional: Get single template by name (useful for initial load)
    getEmailTemplateByName: builder.query<EmailTemplate | null, string>({
      query: (name) => `/email-templates/name/${name}`,
      providesTags: (result, error, name) => [{ type: "EmailTemplate", id: name }],
    }),
  }),
});

export const {
  useGetEmailTemplatesQuery,
  useSaveEmailTemplateMutation,
  useGetEmailTemplateByNameQuery,
} = emailApi;