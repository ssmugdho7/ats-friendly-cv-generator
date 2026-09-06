import { PDFDocument } from 'pdf-lib';

export async function filterPdfPages(blob, mode = 'all') {
    const arrayBuffer = await blob.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    const total = pages.length;

    if (mode === 'all' || total <= 1) {
        return blob;
    }

    const keep = new Set();
    pages.forEach((_, idx) => {
        const pageNumber = idx + 1;
        if (mode === 'odd' && pageNumber % 2 === 1) {
            keep.add(idx);
        } else if (mode === 'even' && pageNumber % 2 === 0) {
            keep.add(idx);
        }
    });

    if (keep.size === total) {
        return blob;
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, Array.from(keep).map(i => i));
    copiedPages.forEach(page => newPdf.addPage(page));

    const newBytes = await newPdf.save();
    return new Blob([newBytes], { type: 'application/pdf' });
}
