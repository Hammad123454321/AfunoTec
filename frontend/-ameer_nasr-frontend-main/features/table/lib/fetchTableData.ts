// import { safeAsync } from "@/lib/safeAsync";

// type BaseApiResponse = {
//   success?: boolean;
//   message?: string;
// };

// export default async function fetchTableData<T>(
//   url: string,
//   options?: {
//     headers?: Record<string, string>;
//     cache?: RequestCache; // keep flexibility
//   }
// ): Promise<T[]> {
//   const { headers = {}, cache = "no-cache" } = options ?? {};

//   const { data, error } = await safeAsync(async () => {
//     const response = await fetch(url, {
//       method: "GET",
//       cache,
//       headers,
//     });

//     if (!response.ok) {
//       throw new Error(response.statusText);
//     }

//     const json: unknown = await response.json();

//     if (
//       typeof json === "object" &&
//       json !== null &&
//       "success" in json &&
//       (json as BaseApiResponse).success === false
//     ) {
//       throw new Error((json as BaseApiResponse).message ?? "Request failed");
//     }

//     return json as T[];
//   });

//   return error || !data ? [] : data;
// }
