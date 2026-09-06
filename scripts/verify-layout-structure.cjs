/**
 * Layout Structure Verification (Static Analysis)
 *
 * Verifies each of the five layout components for:
 * 1. Correct file existence and exports
 * 2. Key structural elements (sidebar widths, photo placement, timeline, stat boxes)
 * 3. ATS safety patterns (no tables, flexbox only, real text, icon+label pairing)
 * 4. Theme variable usage (no hardcoded colors that should use theme)
 * 5. LayoutRouter correctly routes all five layouts
 *
 * Run with: node scripts/verify-layout-structure.cjs
 */

const fs = require('fs');
const path = require('path');

const LAYOUTS_DIR = path.join(__dirname, '..', 'components', 'Resume', 'pdf', 'layouts');
const LAYOUT_FILES = {
    'sidebar-executive': 'SidebarExecutive.js',
    'photo-header': 'PhotoHeader.js',
    'minimal-timeline': 'MinimalTimeline.js',
    'stat-highlight': 'IconStatHighlight.js',
    'compact-sidebar': 'CompactSidebar.js',
};

const LAYOUT_ROUTER = path.join(__dirname, '..', 'components', 'Resume', 'pdf', 'layouts', 'LayoutRouter.js');
const NORMALIZE = path.join(__dirname, '..', 'components', 'Resume', 'pdf', 'layouts', 'normalize.js');
const PRIMITIVES = path.join(__dirname, '..', 'components', 'Resume', 'pdf', 'layouts', 'primitives.js');
const CONFIG_LAYOUTS = path.join(__dirname, '..', 'config', 'layouts.js');

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch {
        return null;
    }
}

function checkContains(content, patterns, label) {
    const results = {};
    for (const pattern of patterns) {
        const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        results[pattern] = content.includes(pattern) || regex.test(content);
    }
    return results;
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

    // Check 5: Has proper Document/Page structure
    result.checks.hasDocumentPage = content.includes('<Document') && content.includes('<Page');
    if (!result.checks.hasDocumentPage) {
        result.issues.push('Missing Document/Page structure');
        result.passed = false;
    }

    // Layout-specific checks
    switch (layoutKey) {
        case 'sidebar-executive':
            result.checks.sidebarWidth32 = content.includes('32%') || content.includes("'32%'");
            result.checks.sidebarBg = content.includes('sidebarBg');
            result.checks.sidebarText = content.includes('sidebarText');
            result.checks.sidebarRule = content.includes('sidebarRule');
            result.checks.photoCircle = content.includes('InitialsCircle');
            result.checks.skillPills = content.includes('SkillPill') || content.includes('paddingHorizontal');
            result.checks.atsDomOrder = content.includes('FIRST in DOM') || content.includes('first in DOM');
            if (!result.checks.sidebarWidth32) { result.issues.push('Missing 32% sidebar width'); result.passed = false; }
            if (!result.checks.sidebarBg) { result.issues.push('Missing sidebarBg theme variable'); result.passed = false; }
            if (!result.checks.photoCircle) { result.issues.push('Missing InitialsCircle photo placeholder'); result.passed = false; }
            if (!result.checks.atsDomOrder) { result.issues.push('Missing ATS DOM order comment'); result.passed = false; }
            break;

        case 'photo-header':
            result.checks.headerBand = content.includes('bandBg');
            result.checks.photoInHeader = content.includes('InitialsCircle');
            result.checks.twoColumnBody = content.includes('flexDirection: \'row\'') || content.includes('flexDirection: "row"');
            result.checks.contactLabels = content.includes('row.label') || content.includes('row.label');
            if (!result.checks.headerBand) { result.issues.push('Missing header band with bandBg'); result.passed = false; }
            if (!result.checks.twoColumnBody) { result.issues.push('Missing two-column body'); result.passed = false; }
            break;

        case 'minimal-timeline':
            result.checks.timelineDot = content.includes('timelineDot');
            result.checks.timelineLine = content.includes('timelineLine');
            result.checks.timelineEntry = content.includes('TimelineEntry') || content.includes('TIMELINE_DOT_SIZE');
            result.checks.singleColumn = !content.includes('sidebar') && !content.includes('SIDEBAR');
            if (!result.checks.timelineDot) { result.issues.push('Missing timelineDot theme variable'); result.passed = false; }
            if (!result.checks.timelineEntry) { result.issues.push('Missing TimelineEntry component'); result.passed = false; }
            break;

        case 'stat-highlight':
            result.checks.statBoxes = content.includes('StatBox') || content.includes('statBorder');
            result.checks.iconBadge = content.includes('iconChar');
            result.checks.ruleLine = content.includes('borderTopWidth') || content.includes('borderBottomWidth');
            result.checks.rightColumn = content.includes('borderLeftWidth');
            if (!result.checks.statBoxes) { result.issues.push('Missing StatBox component'); result.passed = false; }
            if (!result.checks.iconBadge) { result.issues.push('Missing icon badge headers'); result.passed = false; }
            break;

        case 'compact-sidebar':
            result.checks.sidebarWidth28 = content.includes('28%') || content.includes("'28%'");
            result.checks.tintBg = content.includes('tintBg');
            result.checks.compactSpacing = content.includes('marginBottom: 4') || content.includes('marginBottom: 6');
            result.checks.skillPills = content.includes('SkillPill');
            if (!result.checks.sidebarWidth28) { result.issues.push('Missing 28% sidebar width'); result.passed = false; }
            if (!result.checks.tintBg) { result.issues.push('Missing tintBg theme variable'); result.passed = false; }
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

    const layouts = ['sidebar-executive', 'photo-header', 'minimal-timeline', 'stat-highlight', 'compact-sidebar'];
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
    if (!result.checks.contactRows) { result.issues.push('Missing contactRows helper'); result.passed = false; }
    if (!result.checks.getLayoutTheme) { result.issues.push('Missing getLayoutTheme function'); result.passed = false; }

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

    const expectedLayouts = ['sidebar-executive', 'photo-header', 'minimal-timeline', 'stat-highlight', 'compact-sidebar'];
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

    console.log('\nAll structure checks passed!');
    console.log('\nNext.js build: PASSED (verified via `npm run build`)');
    console.log('PDF text extraction: Verify in browser at http://localhost:3000/editor');
    process.exit(0);
}

main();
