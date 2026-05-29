// "use client";

// import { Document, Page, pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// export default function PdfPreview({ url }: { url: string }) {
//   return (
//     <Document file={url}>
//       <Page pageNumber={1} width={220} />
//     </Document>
//   );
// }


// utils/PdfPreview.tsx
"use client";
import { useEffect, useState } from "react";

interface PdfPreviewProps { url: string }

export default function PdfPreview({ url }: PdfPreviewProps) {
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [DocumentComponent, setDocument] = useState<any>(null);
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [PageComponent, setPage] = useState<any>(null);

  useEffect(() => {
    import("react-pdf").then((module) => {
      const { Document, Page, pdfjs } = module;
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setDocument(() => Document);
      setPage(() => Page);
    });
  }, []);

  if (!DocumentComponent || !PageComponent) return null;

  return (
    <DocumentComponent file={url}>
      <PageComponent pageNumber={1} width={300} />
    </DocumentComponent>
  );
}
