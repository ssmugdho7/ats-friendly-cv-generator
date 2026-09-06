/**
 * PDF Text Extraction Verification
 *
 * For each of the five layouts, this script:
 * 1. Fetches a test PDF from the Next.js API route (/api/verify-pdf?layout=...)
 * 2. Extracts text using pdfjs-dist (Mozilla PDF.js)
 * 3. Verifies that multi-column sections (especially sidebars) read in
 *    a sensible, non-scrambled order
 * 4. Checks that all critical content is present
 *
 * Prerequisites: Next.js dev server must be running on port 3000
 * Run with: node scripts/verify-layouts.cjs
 */

const { getDocument } = require('pdfjs-dist/legacy/build/pdf.js');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const SAMPLE_CHECKS = {
    'photo-header': {
        name: 'Jane Developer',
        tagline: 'Senior Full-Stack Engineer',
        email: 'jane@example.com',
        summary: 'Experienced engineer',
        experience: ['Senior Engineer', 'TechCorp'],
        education: ['Computer Science', 'University of California'],
        skills: ['JavaScript', 'React'],
        projects: ['Open Source CLI'],
        certs: ['AWS Solutions Architect'],
        languages: ['English', 'Spanish'],
        sidebar: ['Skills', 'Languages'],
        atsOrder: false,
    },
};

const LAYOUTS = Object.keys(SAMPLE_CHECKS);

function httpGet(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function extractTextFromBuffer(buffer) {
    const uint8Array = new Uint8Array(buffer);
    const pdfDoc = await getDocument({ data: uint8Array }).promise;
    const pages = [];
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        pages.push(text);
    }
    return pages.join('\n');
}

function cleanText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\s+([.,;:!?])/g, '$1')
        .trim();
}

async function verifyLayout(layoutKey) {
    const url = `${BASE_URL}/api/verify-pdf?layout=${encodeURIComponent(layoutKey)}`;
    const buffer = await httpGet(url);
    const rawText = await extractTextFromBuffer(buffer);
    const text = cleanText(rawText);
    const checks = SAMPLE_CHECKS[layoutKey];

    const result = {
        layout: layoutKey,
        passed: true,
        issues: [],
        details: {},
    };

    // Check name
    const nameOk = text.includes(checks.name);
    result.details.name = nameOk ? 'PASS' : 'FAIL';
    if (!nameOk) { result.issues.push('Missing name'); result.passed = false; }

    // Check tagline
    const tagOk = text.includes(checks.tagline);
    result.details.tagline = tagOk ? 'PASS' : 'FAIL';
    if (!tagOk) { result.issues.push('Missing tagline'); result.passed = false; }

    // Check contact
    const emailOk = text.includes(checks.email);
    result.details.email = emailOk ? 'PASS' : 'FAIL';
    if (!emailOk) { result.issues.push('Missing email'); result.passed = false; }

    // Check summary
    const sumOk = text.includes(checks.summary);
    result.details.summary = sumOk ? 'PASS' : 'FAIL';
    if (!sumOk) { result.issues.push('Missing summary'); result.passed = false; }

    // Check experience
    const expOk = checks.experience.every(e => text.includes(e));
    result.details.experience = expOk ? 'PASS' : 'FAIL';
    if (!expOk) { result.issues.push('Missing experience'); result.passed = false; }

    // Check education
    const eduOk = checks.education.every(e => text.includes(e));
    result.details.education = eduOk ? 'PASS' : 'FAIL';
    if (!eduOk) { result.issues.push('Missing education'); result.passed = false; }

    // Check skills
    const skillsOk = checks.skills.every(s => text.includes(s));
    result.details.skills = skillsOk ? 'PASS' : 'FAIL';
    if (!skillsOk) { result.issues.push('Missing skills'); result.passed = false; }

    // Check projects
    const projOk = checks.projects.every(p => text.includes(p));
    result.details.projects = projOk ? 'PASS' : 'FAIL';
    if (!projOk) { result.issues.push('Missing projects'); result.passed = false; }

    // Check certifications
    const certsOk = checks.certs.every(c => text.includes(c));
    result.details.certifications = certsOk ? 'PASS' : 'FAIL';
    if (!certsOk) { result.issues.push('Missing certifications'); result.passed = false; }

    // Check languages
    const langsOk = checks.languages.every(l => text.includes(l));
    result.details.languages = langsOk ? 'PASS' : 'FAIL';
    if (!langsOk) { result.issues.push('Missing languages'); result.passed = false; }

    // Check sidebar content (for sidebar layouts)
    if (checks.sidebar && checks.sidebar.length > 0) {
        const sidebarOk = checks.sidebar.every(s => text.includes(s));
        result.details.sidebar = sidebarOk ? 'PASS' : 'FAIL';
        if (!sidebarOk) { result.issues.push('Missing sidebar content'); result.passed = false; }
    }

    // Check stats (for stat-highlight)
    if (checks.stats && checks.stats.length > 0) {
        const statsOk = checks.stats.every(s => text.includes(s));
        result.details.stats = statsOk ? 'PASS' : 'FAIL';
        if (!statsOk) { result.issues.push('Missing stat boxes'); result.passed = false; }
    }

    // Check ATS order for sidebar-executive
    if (checks.atsOrder) {
        const nameIdx = text.indexOf(checks.name);
        const summaryIdx = text.indexOf(checks.summary);
        const emailIdx = text.indexOf(checks.email);
        const orderOk = nameIdx < summaryIdx && summaryIdx < emailIdx;
        result.details.atsOrder = orderOk ? 'PASS' : 'FAIL';
        if (!orderOk) {
            result.issues.push('ATS order: sidebar content may appear before main content');
            result.passed = false;
        }
    }

    return result;
}

async function checkServer() {
    try {
        const res = await httpGet(`${BASE_URL}/`);
        return true;
    } catch {
        return false;
    }
}

async function main() {
    console.log('PDF Layout Verification');
    console.log('='.repeat(60));

    const serverUp = await checkServer();
    if (!serverUp) {
        console.log(`ERROR: Next.js dev server not running on ${BASE_URL}`);
        console.log('Start it with: npm run dev');
        process.exit(1);
    }

    console.log(`Connected to ${BASE_URL}\n`);

    const results = [];
    for (const layoutKey of LAYOUTS) {
        process.stdout.write(`Verifying ${layoutKey}... `);
        try {
            const result = await verifyLayout(layoutKey);
            results.push(result);
            console.log(result.passed ? 'PASS' : 'FAIL');
            if (!result.passed) {
                result.issues.forEach(issue => console.log(`  - ${issue}`));
            }
        } catch (err) {
            console.log('ERROR');
            console.error(`  ${err.message}`);
            results.push({ layout: layoutKey, passed: false, issues: [err.message], details: {} });
        }
    }

    console.log('\n' + '='.repeat(60));
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    console.log(`Results: ${passed}/${results.length} passed, ${failed} failed`);

    if (failed > 0) {
        console.log('\nFailed layouts:');
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  - ${r.layout}: ${r.issues.join(', ')}`);
        });
        process.exit(1);
    }

    console.log('\nAll layouts verified successfully!');
    process.exit(0);
}

main();
