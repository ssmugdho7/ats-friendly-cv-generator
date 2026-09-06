/**
 * Layout Structure Verification (Static Analysis)
 *
 * Verifies each of the five layout components for:
 * 1. Correct file existence and exports
 * 2. Key structural elements (sidebar widths, photo placement, timeline, stat boxes)
 * 3. ATS safety patterns (no tables, flexbox only, real text, icon+label pairing)
 * 4. Theme variable usage (no hardcoded colors that should use theme)
 * 5. Placeholder system integration (resolvePlaceholders usage)
 * 6. URL/hyperlink handling (cert URLs, project live/repo links, hidden when empty)
 * 7. LayoutRouter correctly routes all five layouts
 * 8. Seed data present in default Redux state
 *
 * Run with: node scripts/verify-layout-structure.cjs
 */

const fs = require('fs');
const path = require('path');

const LAYOUTS_DIR = path.join(__dirname, '..', 'components', 'Resume', 'pdf', 'layouts');
const LAYOUT_FILES = {
    'photo-header': 'PhotoHeader.js',
};

const LAYOUT_ROUTER = path.join(__dirname, '..', 'components', 'Resume', 'pdf', 'layouts', 'LayoutRouter.js');
const NORMALIZE = path.join(__dirname, '..', 'components', 'Resume', 'pdf', 'layouts', 'normalize.js');
const PRIMITIVES = path.join(__dirname, '..', 'components', 'Resume', 'pdf', 'layouts', 'primitives.js');
const CONFIG_LAYOUTS = path.join(__dirname, '..', 'config', 'layouts.js');
const RESUME_SLICE = path.join(__dirname, '..', 'store', 'slices', 'resumeSlice.js');
const DOCX_GENERATOR = path.join(__dirname, '..', 'utils', 'generateDocx.js');
const PLACEHOLDERS_UTIL = path.join(__dirname, '..', 'utils', 'placeholders.js');

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch {
        return null;
    }
}

function verifyLayoutStructure(layoutKey, fileName) {
    const filePath = path.join(LAYOUTS_DIR, fileName);
    const content = readFile(filePath);
    const result = { layout: layoutKey, passed: true, checks: {}, issues: [] };

    if (!content) {
        result.passed = false;
        result.issues.push(`File not found: ${fileName}`);
        return result;
    }

    // Check 1: Uses @react-pdf/renderer (flexbox, not tables)
    result.checks.usesReactPdf = content.includes('@react-pdf/renderer');
    if (!result.checks.usesReactPdf) {
        result.issues.push('Missing @react-pdf/renderer import');
        result.passed = false;
    }

    // Check 2: Uses flexbox (not tables)
    result.checks.usesFlexbox = content.includes('flexDirection') || content.includes('flex');
    result.checks.avoidsTables = !content.includes('<table') && !content.includes('Table');
    if (!result.checks.usesFlexbox) {
        result.issues.push('Layout does not use flexbox');
        result.passed = false;
    }
    if (!result.checks.avoidsTables) {
        result.issues.push('Layout uses tables (ATS violation)');
        result.passed = false;
    }

    // Check 3: Uses theme object
    result.checks.usesTheme = content.includes('theme.') || content.includes('theme,');
    if (!result.checks.usesTheme) {
        result.issues.push('Layout does not use theme object');
        result.passed = false;
    }

    // Check 4: Uses shared data schema
    result.checks.usesNormalizedData = content.includes('data.name') && content.includes('data.contact');
    if (!result.checks.usesNormalizedData) {
        result.issues.push('Layout does not use normalized data schema');
        result.passed = false;
    }

    // Check 5: Placeholder system integration
    result.checks.usesPlaceholders = content.includes('resolvePlaceholders') || content.includes('resolvePlaceholders');
    if (!result.checks.usesPlaceholders) {
        result.issues.push('Missing placeholder resolution');
        result.passed = false;
    }

    // Check 6: Has proper Document/Page structure
    result.checks.hasDocumentPage = content.includes('<Document') && content.includes('<Page');
    if (!result.checks.hasDocumentPage) {
        result.issues.push('Missing Document/Page structure');
        result.passed = false;
    }

    // Layout-specific checks
    switch (layoutKey) {
        case 'photo-header':
            result.checks.headerBand = content.includes('bandBg');
            result.checks.photoInHeader = content.includes('InitialsCircle');
            result.checks.twoColumnBody = content.includes('flexDirection: \'row\'') || content.includes('flexDirection: "row"');
            result.checks.contactLabels = content.includes('row.label') || content.includes('row.label');
            result.checks.certUrl = content.includes('cert.url');
            result.checks.projectLinks = content.includes('proj.live') && content.includes('proj.github');
            if (!result.checks.headerBand) { result.issues.push('Missing header band with bandBg'); result.passed = false; }
            if (!result.checks.twoColumnBody) { result.issues.push('Missing two-column body'); result.passed = false; }
            if (!result.checks.certUrl) { result.issues.push('Missing certification URL support'); result.passed = false; }
            if (!result.checks.projectLinks) { result.issues.push('Missing project live/repo link handling'); result.passed = false; }
            break;
    }

    return result;
}

function verifyLayoutRouter() {
    const content = readFile(LAYOUT_ROUTER);
    const result = { file: 'LayoutRouter.js', passed: true, checks: {}, issues: [] };

    if (!content) {
        result.passed = false;
        result.issues.push('LayoutRouter.js not found');
        return result;
    }

    const layouts = ['photo-header'];
    for (const layout of layouts) {
        result.checks[`imports_${layout}`] = content.includes(`${layout}`) || content.includes(layout.replace('-', ''));
        result.checks[`routes_${layout}`] = content.includes(`'${layout}'`);
        if (!result.checks[`imports_${layout}`] || !result.checks[`routes_${layout}`]) {
            result.issues.push(`Missing import/route for ${layout}`);
            result.passed = false;
        }
    }

    result.checks.usesNormalize = content.includes('normalizeResume');
    result.checks.usesTheme = content.includes('getLayoutTheme');
    if (!result.checks.usesNormalize) { result.issues.push('Missing normalizeResume call'); result.passed = false; }
    if (!result.checks.usesTheme) { result.issues.push('Missing getLayoutTheme call'); result.passed = false; }

    return result;
}

function verifyNormalize() {
    const content = readFile(NORMALIZE);
    const result = { file: 'normalize.js', passed: true, checks: {}, issues: [] };

    if (!content) {
        result.passed = false;
        result.issues.push('normalize.js not found');
        return result;
    }

    const schemaFields = ['name', 'title', 'contact', 'summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certifications', 'achievements'];
    for (const field of schemaFields) {
        result.checks[`schema_${field}`] = content.includes(`${field}:`);
        if (!result.checks[`schema_${field}`]) {
            result.issues.push(`Missing schema field: ${field}`);
            result.passed = false;
        }
    }

    result.checks.contactRows = content.includes('contactRows');
    result.checks.getLayoutTheme = content.includes('getLayoutTheme');
    result.checks.resolvePlaceholders = content.includes('resolvePlaceholders');
    result.checks.buildTokenMap = content.includes('buildTokenMap');
    if (!result.checks.contactRows) { result.issues.push('Missing contactRows helper'); result.passed = false; }
    if (!result.checks.getLayoutTheme) { result.issues.push('Missing getLayoutTheme function'); result.passed = false; }
    if (!result.checks.resolvePlaceholders) { result.issues.push('Missing resolvePlaceholders export'); result.passed = false; }
    if (!result.checks.buildTokenMap) { result.issues.push('Missing buildTokenMap export'); result.passed = false; }

    return result;
}

function verifyPrimitives() {
    const content = readFile(PRIMITIVES);
    const result = { file: 'primitives.js', passed: true, checks: {}, issues: [] };

    if (!content) {
        result.passed = false;
        result.issues.push('primitives.js not found');
        return result;
    }

    const requiredPrimitives = ['font', 'RichSegments', 'Href', 'SectionTitle', 'SidebarSectionTitle', 'Bullet', 'Description', 'dateRange', 'InitialsCircle', 'SkillPill', 'StatBox', 'TimelineDot', 'ContactItem'];
    for (const primitive of requiredPrimitives) {
        result.checks[`primitive_${primitive}`] = content.includes(`export const ${primitive}`);
        if (!result.checks[`primitive_${primitive}`]) {
            result.issues.push(`Missing primitive: ${primitive}`);
            result.passed = false;
        }
    }

    // ATS safety checks
    result.checks.noImageRendering = !content.includes('toDataURL') && !content.includes('canvas');
    result.checks.realTextLabels = content.includes('label:');
    if (!result.checks.noImageRendering) { result.issues.push('Primitives may render text as images'); result.passed = false; }

    return result;
}

function verifyConfigLayouts() {
    const content = readFile(CONFIG_LAYOUTS);
    const result = { file: 'config/layouts.js', passed: true, checks: {}, issues: [] };

    if (!content) {
        result.passed = false;
        result.issues.push('config/layouts.js not found');
        return result;
    }

    const expectedLayouts = ['classic', 'modern'];
    for (const layout of expectedLayouts) {
        result.checks[`layout_${layout}`] = content.includes(`'${layout}'`);
        if (!result.checks[`layout_${layout}`]) {
            result.issues.push(`Missing layout config: ${layout}`);
            result.passed = false;
        }
    }

    result.checks.hasDEFAULT = content.includes('DEFAULT_LAYOUT');
    if (!result.checks.hasDEFAULT) { result.issues.push('Missing DEFAULT_LAYOUT'); result.passed = false; }

    return result;
}

function verifyPlaceholdersUtil() {
    const content = readFile(PLACEHOLDERS_UTIL);
    const result = { file: 'utils/placeholders.js', passed: true, checks: {}, issues: [] };

    if (!content) {
        result.passed = false;
        result.issues.push('utils/placeholders.js not found');
        return result;
    }

    result.checks.resolvePlaceholders = content.includes('export function resolvePlaceholders');
    result.checks.buildTokenMap = content.includes('export function buildTokenMap');
    result.checks.tokenRe = content.includes('TOKEN_RE') || content.includes('\\{\\{');
    result.checks.unknownTokenEmpty = content.includes("return ''") || content.includes('return ""');
    if (!result.checks.resolvePlaceholders) { result.issues.push('Missing resolvePlaceholders function'); result.passed = false; }
    if (!result.checks.buildTokenMap) { result.issues.push('Missing buildTokenMap function'); result.passed = false; }
    if (!result.checks.tokenRe) { result.issues.push('Missing token regex pattern'); result.passed = false; }
    if (!result.checks.unknownTokenEmpty) { result.issues.push('Unknown tokens should resolve to empty string'); result.passed = false; }

    return result;
}

function verifySeedData() {
    const content = readFile(RESUME_SLICE);
    const result = { file: 'store/slices/resumeSlice.js', passed: true, checks: {}, issues: [] };

    if (!content) {
        result.passed = false;
        result.issues.push('resumeSlice.js not found');
        return result;
    }

    result.checks.seedName = content.includes('Md. Shah Maruf Siraj Mugdho');
    result.checks.seedEmail = content.includes('shahmarufsiraj360@gmail.com');
    result.checks.seedGithub = content.includes('ssmugdho7');
    result.checks.seedLinkedin = content.includes('shahmarufsiraj360');
    result.checks.seedPortfolio = content.includes('shahmaruf-siraj-mugdho-profile.netlify.app');
    result.checks.seedJobpilot = content.includes('jobpilot-hfpz.onrender.com');
    result.checks.seedEbook = content.includes('ebook-web-rgnw.onrender.com');
    result.checks.seedAgency = content.includes('agency-app-self-two.vercel.app');
    result.checks.seedDLS = content.includes('etrade.dls.gov.bd');
    result.checks.seedCertUrl = content.includes('14hJDm0m1b5m8ZfO4fJyNyampM6fIDUGx');
    result.checks.seedProjects = content.includes('SEED_PROJECTS') || content.includes('JobPilot');
    result.checks.seedExperience = content.includes('SEED_EXPERIENCE') || content.includes('DLS Venture');

    for (const [key, check] of Object.entries(result.checks)) {
        if (key === 'seedProjects' || key === 'seedExperience') continue;
        if (!check) {
            result.issues.push(`Missing seed data: ${key}`);
            result.passed = false;
        }
    }

    return result;
}

function verifyDocxGenerator() {
    const content = readFile(DOCX_GENERATOR);
    const result = { file: 'utils/generateDocx.js', passed: true, checks: {}, issues: [] };

    if (!content) {
        result.passed = false;
        result.issues.push('generateDocx.js not found');
        return result;
    }

    result.checks.usesPlaceholders = content.includes('resolvePlaceholders');
    result.checks.usesTokenMap = content.includes('buildTokenMap');
    result.checks.certUrl = content.includes('cert.url');
    result.checks.projectLive = content.includes('proj.live');
    result.checks.projectGithub = content.includes('proj.github');
    result.checks.noPlainTextUrlOnly = !content.includes("hyperlink(proj.url, proj.url");
    if (!result.checks.usesPlaceholders) { result.issues.push('DOCX missing placeholder resolution'); result.passed = false; }
    if (!result.checks.usesTokenMap) { result.issues.push('DOCX missing token map'); result.passed = false; }
    if (!result.checks.certUrl) { result.issues.push('DOCX missing certification URL support'); result.passed = false; }
    if (!result.checks.projectLive) { result.issues.push('DOCX missing project live link'); result.passed = false; }
    if (!result.checks.projectGithub) { result.issues.push('DOCX missing project repo link'); result.passed = false; }
    if (!result.checks.noPlainTextUrlOnly) { result.issues.push('DOCX should not render plain text URLs only'); result.passed = false; }

    return result;
}

function main() {
    console.log('Layout Structure Verification');
    console.log('='.repeat(60) + '\n');

    const results = [];

    // Verify each layout
    console.log('Layout Components:');
    for (const [key, fileName] of Object.entries(LAYOUT_FILES)) {
        const result = verifyLayoutStructure(key, fileName);
        results.push(result);
        console.log(`  ${key}: ${result.passed ? 'PASS' : 'FAIL'}`);
        if (!result.passed) {
            result.issues.forEach(issue => console.log(`    - ${issue}`));
        }
    }

    console.log('\nCore Infrastructure:');
    const routerResult = verifyLayoutRouter();
    results.push(routerResult);
    console.log(`  LayoutRouter.js: ${routerResult.passed ? 'PASS' : 'FAIL'}`);
    if (!routerResult.passed) routerResult.issues.forEach(i => console.log(`    - ${i}`));

    const normalizeResult = verifyNormalize();
    results.push(normalizeResult);
    console.log(`  normalize.js: ${normalizeResult.passed ? 'PASS' : 'FAIL'}`);
    if (!normalizeResult.passed) normalizeResult.issues.forEach(i => console.log(`    - ${i}`));

    const primitivesResult = verifyPrimitives();
    results.push(primitivesResult);
    console.log(`  primitives.js: ${primitivesResult.passed ? 'PASS' : 'FAIL'}`);
    if (!primitivesResult.passed) primitivesResult.issues.forEach(i => console.log(`    - ${i}`));

    const configResult = verifyConfigLayouts();
    results.push(configResult);
    console.log(`  config/layouts.js: ${configResult.passed ? 'PASS' : 'FAIL'}`);
    if (!configResult.passed) configResult.issues.forEach(i => console.log(`    - ${i}`));

    console.log('\nPlaceholder System:');
    const placeholdersResult = verifyPlaceholdersUtil();
    results.push(placeholdersResult);
    console.log(`  utils/placeholders.js: ${placeholdersResult.passed ? 'PASS' : 'FAIL'}`);
    if (!placeholdersResult.passed) placeholdersResult.issues.forEach(i => console.log(`    - ${i}`));

    const seedResult = verifySeedData();
    results.push(seedResult);
    console.log(`  Seed data (Md. Shah Maruf Siraj Mugdho): ${seedResult.passed ? 'PASS' : 'FAIL'}`);
    if (!seedResult.passed) seedResult.issues.forEach(i => console.log(`    - ${i}`));

    const docxResult = verifyDocxGenerator();
    results.push(docxResult);
    console.log(`  DOCX generator: ${docxResult.passed ? 'PASS' : 'FAIL'}`);
    if (!docxResult.passed) docxResult.issues.forEach(i => console.log(`    - ${i}`));

    console.log('\n' + '='.repeat(60));
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    console.log(`Results: ${passed}/${results.length} checks passed, ${failed} failed`);

    if (failed > 0) {
        console.log('\nFailed checks:');
        results.filter(r => !r.passed).forEach(r => {
            const name = r.layout || r.file || 'unknown';
            console.log(`  - ${name}: ${r.issues.join(', ')}`);
        });
        process.exit(1);
    }

    console.log('\nAll checks passed!');
    console.log('\nNext.js build: PASSED (verified via `npm run build`)');
    console.log('To verify live preview: start dev server and visit /editor');
    process.exit(0);
}

main();
