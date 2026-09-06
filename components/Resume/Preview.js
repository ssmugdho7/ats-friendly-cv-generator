'use client';

import { useEffect, useRef, useState } from 'react';
import Resume from './pdf';
import { useSelector } from 'react-redux';
import { CgSpinner } from 'react-icons/cg';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaExpand, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import DownloadModal from './DownloadModal';

if (typeof window !== 'undefined' && pdfjs?.GlobalWorkerOptions) {
    try {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
    } catch {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    }
}

const Loader = () => (
    <div className="flex min-h-[40rem] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <CgSpinner className="animate-spin text-4xl text-primary-400" />
            <span className="text-sm text-gray-400">Generating preview...</span>
        </div>
    </div>
);

const preview = url => {
    window.open(
        url,
        'Resume Preview',
        `toolbar=no, location=no, menubar=no, scrollbars=no, status=no, titlebar=no, resizable=no, width=600, height=800, left=${window.innerWidth / 2 - 300}, top=100`,
    );
};

const Preview = () => {
    const parentRef = useRef(null);
    const resumeData = useSelector(state => state.resume);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Debounced PDF generation - wait 300ms after last change
    useEffect(() => {
        let cancelled = false;
        let timeout;

        const generate = () => {
            setLoading(true);
            const doc = <Resume data={resumeData} />;
            pdf(doc)
                .toBlob()
                .then(blob => {
                    if (cancelled) return;
                    const url = URL.createObjectURL(blob);
                    setPdfUrl(prev => {
                        if (prev) URL.revokeObjectURL(prev);
                        return url;
                    });
                    setPageNumber(1);
                    setLoading(false);
                });
        };

        timeout = setTimeout(generate, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [resumeData]);

    const onDocumentLoad = ({ numPages: loaded }) => {
        setNumPages(loaded || null);
        setPageNumber(1);
    };

    const goPrev = () => setPageNumber(p => Math.max(1, p - 1));
    const goNext = () => setPageNumber(p => (numPages ? Math.min(numPages, p + 1) : p + 1));

    return (
        <div ref={parentRef} className="relative flex w-full flex-col">
            {/* PDF Preview */}
            <div className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900/50 shadow-2xl shadow-black/20">
                {loading || !pdfUrl ? (
                    <Loader />
                ) : (
                    <Document loading={<Loader />} file={pdfUrl} onLoadSuccess={onDocumentLoad}>
                        <Page
                            pageNumber={pageNumber}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={<Loader />}
                            width={parentRef.current?.clientWidth}
                            className="mx-auto"
                        />
                    </Document>
                )}

                {/* Page navigation overlay */}
                {!loading && !!numPages && numPages > 1 && (
                    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-gray-600/50 bg-gray-900/80 px-3 py-1.5 text-xs text-gray-300 backdrop-blur-sm">
                        <button
                            onClick={goPrev}
                            disabled={pageNumber <= 1}
                            className="rounded p-0.5 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <FaChevronLeft />
                        </button>
                        <span className="min-w-[4rem] text-center">
                            {pageNumber} / {numPages}
                        </span>
                        <button
                            onClick={goNext}
                            disabled={pageNumber >= numPages}
                            className="rounded p-0.5 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>

            {/* Action bar */}
            {!loading && (
                <div className="mt-4 flex items-center gap-2">
                    <button
                        onClick={() => preview(pdfUrl)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-600/50 bg-gray-700/50 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-gray-500 hover:bg-gray-700 hover:text-white"
                    >
                        <FaExpand className="h-3.5 w-3.5" />
                        <span>Fullscreen</span>
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary-600/50 bg-primary-600/20 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-600/30 hover:text-primary-300"
                    >
                        <FaDownload className="h-3.5 w-3.5" />
                        <span>Download</span>
                    </button>
                </div>
            )}

            <DownloadModal open={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default Preview;
