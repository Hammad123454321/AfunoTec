// "use client";

// import { useState } from "react";

// interface GiftCardFormData {
//   image?: string;
//   amount?: number | string;
//   recipientName?: string;
//   recipientEmail?: string;
//   senderName?: string;
//   message?: string;
//   deliveryName?: string;
//   quantity?: number;
// }

// const PRESET_AMOUNTS = [20000, 20000, 20000, 20000];

// export default function GiftCardForm() {
//   const [formData, setFormData] = useState<GiftCardFormData>({
//     image: "/img5.png",
//   });
//   const [customAmount, setCustomAmount] = useState("");

//   //   const { data } = useGiftCardQuery();
//   // setFormData(data);

//   const labelClass =
//     "text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1.5";
//   const inputClass =
//     "w-full h-9 px-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500";
//   const subLabelClass = "text-xs text-gray-600 mb-1.5";

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-[1200px] mx-auto px-8 py-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//           GIFT CARD PREVIEW
//           <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
//         </h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* ================= LEFT PREVIEW ================= */}
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-250">
//             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
//               <img
//                 src={formData.image || "/img5.png"}
//                 alt="Gift Card"
//                 className="w-full h-[220px] object-cover"
//               />
//             </div>

//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between items-start pb-3 border-b border-gray-200">
//                 <span className="text-gray-600">Gift Card</span>
//                 <span className="text-red-500 font-semibold text-base">
//                   AR {formData.amount || "00000"}
//                 </span>
//               </div>

//               <div className="space-y-1">
//                 <p className="text-gray-600 text-xs">From:</p>
//                 <p className="text-gray-800 min-h-[20px]">
//                   {formData.senderName || ""}
//                 </p>
//               </div>

//               <div className="space-y-1">
//                 <p className="text-gray-600 text-xs">To:</p>
//                 <p className="text-gray-800 min-h-[20px]">
//                   {formData.recipientName || ""}
//                 </p>
//               </div>

//               <div className="space-y-1">
//                 <p className="text-gray-600 text-xs">Personalized Greeting:</p>
//                 <p className="text-gray-800 min-h-[20px] text-sm">
//                   {formData.message || ""}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ================= RIGHT FORM ================= */}
//           <div className="space-y-6">
//             {/* Image selection */}
//             <div>
//               <div className="grid grid-cols-5 gap-3 mb-3">
//                 {["/img1.png", "/img2.png", "/img3.png", "/img4.png"].map(
//                   (img, i) => (
//                     <button
//                       key={i}
//                       onClick={() =>
//                         setFormData((prev) => ({ ...prev, image: img }))
//                       }
//                       className={`aspect-[4/3] border-2 rounded-lg overflow-hidden transition-all ${
//                         formData.image === img
//                           ? "border-green-500 ring-2 ring-green-200"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <img
//                         src={img}
//                         alt=""
//                         className="w-full h-full object-cover"
//                       />
//                     </button>
//                   )
//                 )}
//                 <div className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs font-medium">
//                   64+
//                 </div>
//               </div>

//               <button className="text-green-600 text-sm font-medium border-2 border-green-600 px-4 py-1.5 rounded hover:bg-green-50 transition-colors">
//                 Upload your image
//               </button>
//             </div>

//             {/* Amount */}
//             <div>
//               <label className={labelClass}>
//                 Set an amount
//                 <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
//               </label>

//               <div className="flex flex-wrap gap-2.5">
//                 {PRESET_AMOUNTS.map((amt, i) => (
//                   <button
//                     key={i}
//                     onClick={() => {
//                       setCustomAmount("");
//                       setFormData((prev) => ({ ...prev, amount: amt }));
//                     }}
//                     className={`px-5 py-2 text-sm font-medium border-2 rounded transition-all ${
//                       formData.amount === amt && !customAmount
//                         ? "border-green-600 bg-green-600 text-white"
//                         : "border-green-600 text-green-600 hover:bg-green-50"
//                     }`}
//                   >
//                     AR {amt}
//                   </button>
//                 ))}

//                 <input
//                   type="text"
//                   placeholder="Enter Price"
//                   value={customAmount}
//                   onChange={(e) => {
//                     const value = e.target.value.replace(/[^\d]/g, "");
//                     setCustomAmount(value);
//                     setFormData((p) => ({ ...p, amount: value || "" }));
//                   }}
//                   className="w-32 h-9 text-sm border-2 border-gray-300 rounded px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>
//             </div>

//             {/* Recipient Info */}
//             <div>
//               <label className={labelClass}>
//                 Recipient info
//                 <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
//               </label>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className={subLabelClass}>Name:</p>
//                   <input
//                     placeholder="Enter recipient name"
//                     className={inputClass}
//                     value={formData.recipientName || ""}
//                     onChange={(e) =>
//                       setFormData((p) => ({
//                         ...p,
//                         recipientName: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>
//                 <div>
//                   <p className={subLabelClass}>Email:</p>
//                   <input
//                     placeholder="Enter recipient name"
//                     className={inputClass}
//                     value={formData.recipientEmail || ""}
//                     onChange={(e) =>
//                       setFormData((p) => ({
//                         ...p,
//                         recipientEmail: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>
//               </div>

//               <button className="text-red-500 text-xs font-medium mt-2.5 hover:underline">
//                 + Add another recipient
//               </button>
//             </div>

//             {/* Your Info */}
//             <div>
//               <label className={labelClass}>
//                 Your Info
//                 <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
//               </label>
//               <p className={subLabelClass}>Name:</p>
//               <input
//                 placeholder="Enter name"
//                 className={inputClass}
//                 value={formData.senderName || ""}
//                 onChange={(e) =>
//                   setFormData((p) => ({ ...p, senderName: e.target.value }))
//                 }
//               />
//             </div>

//             {/* Message */}
//             <div>
//               <label className={labelClass}>
//                 Gift Card message
//                 <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
//               </label>
//               <textarea
//                 rows={4}
//                 placeholder="Enter a message for the recipient"
//                 className="w-full text-sm border border-gray-300 rounded p-3 resize-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
//                 value={formData.message || ""}
//                 onChange={(e) =>
//                   setFormData((p) => ({ ...p, message: e.target.value }))
//                 }
//               />
//             </div>

//             {/* Delivery */}
//             <div>
//               <label className={labelClass}>
//                 Delivery info
//                 <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
//               </label>
//               <p className="text-xs text-gray-600 mb-2">
//                 Choose the date on which the Gift Card is to be sent to the
//                 recipient.
//               </p>
//               <p className={subLabelClass}>Name:</p>
//               <input
//                 placeholder="Enter name"
//                 className={inputClass}
//                 value={formData.deliveryName || ""}
//                 onChange={(e) =>
//                   setFormData((p) => ({ ...p, deliveryName: e.target.value }))
//                 }
//               />
//             </div>

//             {/* Quantity */}
//             <div>
//               <label className={labelClass}>
//                 Gift Card Quantity
//                 <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
//               </label>
//               <p className="text-xs text-gray-600 mb-2">
//                 Choose Number of Gift Cards
//               </p>
//               <input
//                 type="number"
//                 placeholder="Enter number"
//                 className={inputClass}
//                 value={formData.quantity || ""}
//                 onChange={(e) =>
//                   setFormData((p) => ({
//                     ...p,
//                     quantity: Number(e.target.value) || undefined,
//                   }))
//                 }
//               />
//             </div>

//             {/* CTA */}
//             <div className="flex justify-end pt-4">
//               <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-8 py-2.5 rounded transition-colors shadow-sm">
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

interface GiftCardFormData {
  image?: string;
  amount?: number | string;
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  message?: string;
  deliveryName?: string;
  quantity?: number;
}

const PRESET_AMOUNTS = [20000, 20000, 20000, 20000];

export default function GiftCardForm() {
  const [formData, setFormData] = useState<GiftCardFormData>({
    image: "/img5.png",
  });
  const [customAmount, setCustomAmount] = useState("");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  //   const { data } = useGiftCardQuery();
  // setFormData(data);

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      // 🔌 Replace with your real API endpoint
      const res = await fetch("/api/upload-gift-card-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Expected response:
      // { imageUrl: "https://..." }

      setFormData((prev) => ({
        ...prev,
        image: data.imageUrl,
      }));

      setIsUploadOpen(false);
      setSelectedFile(null);
    } catch {
      alert("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const labelClass =
    "text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5";
  const inputClass =
    "w-full h-8 px-2.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500";
  const subLabelClass = "text-[11px] text-gray-600 mb-1";

  return (
    <div className="min-h-screen bg-white text-start">
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          GIFT CARD PREVIEW
          <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ================= LEFT PREVIEW ================= */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 sticky top-8">
            <div className="bg-white border border-gray-200 rounded overflow-hidden mb-3">
              <img
                src={formData.image || "/img5.png"}
                alt="Gift Card"
                className="w-full h-[180px] object-cover"
              />
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-start pb-2.5 border-b border-gray-200">
                <span className="text-gray-600 text-xs">Gift Card</span>
                <span className="text-red-500 font-semibold text-sm font-currency">
                  AR {formData.amount || "00000"}
                </span>
              </div>

              <div className="space-y-0.5">
                <p className="text-gray-600 text-[11px]">From:</p>
                <p className="text-gray-800 text-xs min-h-[16px]">
                  {formData.senderName || ""}
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="text-gray-600 text-[11px]">To:</p>
                <p className="text-gray-800 text-xs min-h-[16px]">
                  {formData.recipientName || ""}
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="text-gray-600 text-[11px]">
                  Personalized Greeting:
                </p>
                <p className="text-gray-800 text-xs min-h-[16px]">
                  {formData.message || ""}
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT FORM ================= */}
          <div className="space-y-6">
            {/* Image selection */}
            <div>
              <div className="grid grid-cols-4 gap-2.5 mb-3">
                {["/img1.png", "/img2.png", "/img3.png", "/img4.png"].map(
                  (img, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: img }))
                      }
                      className={`aspect-[4/3] border-2 rounded overflow-hidden transition-all ${formData.image === img
                        ? "border-green-500 ring-2 ring-green-200"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="text-green-600 text-xs font-medium border border-green-600 px-3 py-1 rounded hover:bg-green-50 transition-colors"
              >
                Upload your image
              </button>
            </div>
            <hr className="border-0.5 border-t-gray-400"></hr>

            {/* Amount */}
            <div>
              <label className={labelClass}>
                Set an amount
                <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {PRESET_AMOUNTS.map((amt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCustomAmount("");
                      setFormData((prev) => ({ ...prev, amount: amt }));
                    }}
                    className={`px-5 py-2 text-sm font-medium border-2 rounded transition-all font-currency ${formData.amount === amt && !customAmount
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-green-600 text-green-600 hover:bg-green-50"
                      }`}
                  >
                    AR {amt}
                  </button>
                ))}

                <input
                  type="text"
                  placeholder="Enter Price"
                  value={customAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, "");
                    setCustomAmount(value);
                    setFormData((p) => ({ ...p, amount: value || "" }));
                  }}
                  className="w-32 h-9 text-sm border-2 border-gray-300 rounded px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <hr className="border-0.5 border-t-gray-400"></hr>

            {/* Recipient Info */}
            <div>
              <label className={labelClass}>
                Recipient info
                <span className="text-gray-400 text-xs cursor-help text-start">
                  ⓘ
                </span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={subLabelClass}>Name:</p>
                  <input
                    placeholder="Enter recipient name"
                    className={inputClass}
                    value={formData.recipientName || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        recipientName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <p className={subLabelClass}>Email:</p>
                  <input
                    placeholder="Enter recipient name"
                    className={inputClass}
                    value={formData.recipientEmail || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        recipientEmail: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <button className="text-red-500 text-start text-xs font-medium mt-2.5 hover:underline">
                + Add another recipient
              </button>
            </div>
            <hr className="border-0.5 border-t-gray-400"></hr>

            {/* Your Info */}
            <div>
              <label className={labelClass}>
                Your Info
                <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
              </label>
              <p className={subLabelClass}>Name:</p>
              <input
                placeholder="Enter name"
                className={inputClass}
                value={formData.senderName || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, senderName: e.target.value }))
                }
              />
            </div>

            <hr className="border-0.5 border-t-gray-400"></hr>

            {/* Message */}
            <div>
              <label className={labelClass}>
                Gift Card message
                <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
              </label>
              <textarea
                rows={4}
                placeholder="Enter a message for the recipient"
                className="w-full text-sm border border-gray-300 rounded p-3 resize-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                value={formData.message || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, message: e.target.value }))
                }
              />
            </div>
            <hr className="border-0.5 border-t-gray-400"></hr>

            {/* Delivery */}
            <div>
              <label className={labelClass}>
                Delivery info
                <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Choose the date on which the Gift Card is to be sent to the
                recipient.
              </p>
              <p className={subLabelClass}>Name:</p>
              <input
                placeholder="Enter name"
                className={inputClass}
                value={formData.deliveryName || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, deliveryName: e.target.value }))
                }
              />
            </div>
            <hr className="border-0.5 border-t-gray-400"></hr>

            {/* Quantity */}
            <div>
              <label className={labelClass}>
                Gift Card Quantity
                <span className="text-gray-400 text-xs cursor-help">ⓘ</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Choose Number of Gift Cards
              </p>
              <input
                type="number"
                placeholder="Enter number"
                className={inputClass}
                value={formData.quantity || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    quantity: Number(e.target.value) || undefined,
                  }))
                }
              />
            </div>

            {/* CTA */}
            <div className="flex justify-end pt-4">
              <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-8 py-2.5 rounded transition-colors shadow-sm">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[360px] rounded shadow-lg p-4">
            <h3 className="text-sm font-semibold mb-3">
              Upload Gift Card Image
            </h3>

            <input
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />

            {/* Preview */}
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="mt-3 w-full h-32 object-cover rounded border"
              />
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setSelectedFile(null);
                }}
                className="text-xs px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleImageUpload}
                disabled={isUploading || !selectedFile}
                className="text-xs px-4 py-1 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
