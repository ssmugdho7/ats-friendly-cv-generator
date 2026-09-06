'use client';

import { useEffect, useRef, useState } from 'react';
import Resume from './pdf';
import { useSelector } from 'react-redux';
import { CgSpinner } from 'react-icons/cg';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaXmark, FaDownload, FaFileWord, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { downloadResumeDocx } from '@/utils/generateDocx';

if (typeof window !== 'undefined' && pdfjs?.GlobalWorkerOptions) {
    try {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
    } catch {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    }
}

const PAPER_SIZES = {
    A4: { label: 'A4', width: 595.28, height: 841.89 },
    Letter: { label: 'Letter', width: 612, height: 792 },
};

const MARGIN_PRESETS = [
    { label: 'Default', value: 30 },
    { label: 'Small', value: 18 },
    { label: 'Medium', value: 36 },
    { label: 'Large', value: 54 },
    { label: 'Custom', value: -1 },
];

const Spinner = () => (
    <div className="flex h-[30rem] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <CgSpinner className="animate-spin text-4xl text-primary-400" />
            <span className="text-sm text-gray-400">Generating preview...</span>
        </div>
    </div>
);

const DownloadModal = ({ open, onClose }) => {
    const resumeData = useSelector(state => state.resume);
    const previewRef = useRef(null);

    const [paperSize, setPaperSize] = useState('A4');
    const [marginPreset, setMarginPreset] = useState(0);
    const [customMargin, setCustomMargin] = useState(30);
    const [scale, setScale] = useState(100);

    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [docxBusy, setDocxBusy] = useState(false);

    const margin = marginPreset === -1 ? customMargin : marginPreset;

    // Generate PDF preview whenever settings change
    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        let timeout;

        const generate = () => {
            setGenerating(true);
            const paper = PAPER_SIZES[paperSize];
            const doc = (
                <Resume
                    data={resumeData}
                    size={paperSize === 'Letter' ? [612, 792] : 'A4'}
                    padding={margin}
                />
            );
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
                    setGenerating(false);
                });
        };

        timeout = setTimeout(generate, 500);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [resumeData, paperSize, margin, open]);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setPdfUrl(null);
            setLoading(true);
            setPageNumber(1);
            setNumPages(null);
        }
    }, [open]);

    const onDocumentLoad = ({ numPages: loaded }) => {
        setNumPages(loaded || null);
        setPageNumber(1);
        setLoading(false);
    };

    const goPrev = () => setPageNumber(p => Math.max(1, p - 1));
    const goNext = () => setPageNumber(p => (numPages ? Math.min(numPages, p + 1) : p + 1));

    const handleDownloadPdf = () => {
        if (!pdfUrl) return;
        const a = window.document.createElement('a');
        a.href = pdfUrl;
        a.download = `${resumeData.contact?.name || 'resume'}.pdf`;
        window.document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleDownloadDocx = async () => {
        if (docxBusy) return;
        setDocxBusy(true);
        try {
            await downloadResumeDocx(resumeData, { paperSize, margin });
        } finally {
            setDocxBusy(false);
        }
    };

    const handleClose = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
        setLoading(true);
        setGenerating(false);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={handleClose}>
            <div
                className="relative mx-4 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-700/50 px-6 py-4">
                    <h2 className="text-lg font-semibold text-white">Download Resume</h2>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                    >
                        <FaXmark className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                    {/* Settings panel */}
                    <div className="flex w-full flex-col gap-6 overflow-y-auto border-b border-gray-700/50 p-6 lg:w-72 lg:border-b-0 lg:border-r lg:border-gray-700/50">
                        {/* Paper Size */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Paper Size</label>
                            <div className="flex gap-2">
                                {Object.entries(PAPER_SIZES).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        onClick={() => setPaperSize(key)}
                                        className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                                            paperSize === key
                                                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Margin */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Margin</label>
                            <div className="flex flex-wrap gap-2">
                                {MARGIN_PRESETS.map(preset => (
                                    <button
                                        key={preset.label}
                                        onClick={() => setMarginPreset(preset.value)}
                                        className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                                            marginPreset === preset.value
                                                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                            {marginPreset === -1 && (
                                <div className="mt-3 flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={customMargin}
                                        onChange={e => setCustomMargin(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                                        className="w-20 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                                    />
                                    <span className="text-sm text-gray-400">pt</span>
                                </div>
                            )}
                        </div>

                        {/* Scale */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Scale <span className="text-gray-500">({scale}%)</span>
                            </label>
                            <input
                                type="range"
                                min={50}
                                max={150}
                                step={5}
                                value={scale}
                                onChange={e => setScale(Number(e.target.value))}
                                className="w-full accent-primary-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>50%</span>
                                <span>100%</span>
                                <span>150%</span>
                            </div>
                        </div>

                        {/* Download buttons */}
                        <div className="mt-auto flex flex-col gap-3 pt-4">
                            <button
                                onClick={handleDownloadPdf}
                                disabled={!pdfUrl || generating}
                                className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FaDownload className="h-4 w-4" />
                                Download PDF
                            </button>
                            <button
                                onClick={handleDownloadDocx}
                                disabled={docxBusy}
                                className="flex items-center justify-center gap-2 rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 transition-all hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {docxBusy ? (
                                    <CgSpinner className="h-4 w-4 animate-spin" />
                                ) : (
                                    <FaFileWord className="h-4 w-4" />
                                )}
                                {docxBusy ? 'Generating...' : 'Download DOCX'}
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div ref={previewRef} className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto bg-gray-950/50 p-6">
                        {generating || !pdfUrl ? (
                            <Spinner />
                        ) : (
                            <div className="relative inline-block">
                                <Document
                                    file={pdfUrl}
                                    onLoadSuccess={onDocumentLoad}
                                    loading={<Spinner />}
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        scale={scale / 100}
                                        width={PAPER_SIZES[paperSize].width * 0.65}
                                        className="shadow-2xl"
                                    />
                                </Document>

                                {/* Page navigation */}
                                {numPages && numPages > 1 && (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;
