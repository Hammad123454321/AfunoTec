// // utils/uploadImage.ts
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file); // REQUIRED key name

  const response = await fetch(
    "http://172.252.13.75:3000/api/v1/images/single",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return data?.data?.imageUrl;
}
