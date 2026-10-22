import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { API_URL } from "../../../api/api";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type ResumePreviewProps = {
  resumeId: number;
};

const ResumePreview = ({ resumeId }: ResumePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setPageWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-w-0">
    <Document
      file={`${API_URL}/api/resumes/${resumeId}/preview`}
      suspense={false}
      loading={<p>Loading résumé…</p>}
      error={<p>Unable to load résumé.</p>}
      onLoadSuccess={({numPages}) => setNumPages(numPages)}
    >
     {pageWidth > 0 &&
  Array.from({ length: numPages }, (_, index) => (
    <Page
      key={index + 1}
      pageNumber={index + 1}
      width={pageWidth}
      className="mb-4"
    />
  ))}
    </Document>
    </div>
  );
};

export default ResumePreview;
