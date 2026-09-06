'use client';

/**
 * Resume — top-level PDF component.
 *
 * Routes through LayoutRouter which selects one of five fully custom
 * layout components. Each layout reads from ONE shared normalized data
 * schema (name, title, contact, summary, experience[], education[],
 * skills[], languages[], projects[], certifications[], achievements[]).
 *
 * The color-theme system from config/templates.js is layered on top of
 * every layout via the derived theme object, so every layout supports
 * all 8 themes.
 *
 * ATS safety:
 *   - All text is real and selectable (never rendered as images)
 *   - No layout tables — all flexbox/grid via @react-pdf/renderer
 *   - Every icon has a paired text label
 *   - No critical content in headers/footers
 *   - Multi-column sections read in logical order (main first, sidebar second)
 */
import LayoutRouter from './layouts/LayoutRouter';

const Resume = ({ data, size = 'A4', padding = 30 }) => {
    return <LayoutRouter data={data} size={size} padding={padding} />;
};

export default Resume;
