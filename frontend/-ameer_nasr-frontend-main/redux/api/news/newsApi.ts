import { NewsResponse ,SingleJobResponse } from "./../../../types/global";
import baseApi from "../baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create news
    createNews: builder.mutation({
      query: (body) => {
        return {
          url: "/news",
          method: "POST",
          body,
        };
      },
    }),

   

    // get all news
    getAllNews: builder.query<NewsResponse, void>({
      query: () => ({
        url: `/news`,
        method: "GET",
      }),
    }),


     // get single news
    getSingleNews: builder.query<SingleJobResponse, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "GET",
      }),
    }),
  }),
   overrideExisting: true, 
});

export const { useCreateNewsMutation ,useGetAllNewsQuery ,useGetSingleNewsQuery } = profileApi;
