/**
 * Layout registry — five fully custom, structurally distinct resume layouts.
 *
 * Each layout is its own component under `components/Resume/pdf/layouts/`
 * reading from ONE shared normalized schema (see `normalizeResume` in
 * `components/Resume/pdf/layouts/normalize.js`):
 *
 *   name, title, contact, summary,
 *   experience[], education[], skills[], languages[],
 *   projects[], certifications[], achievements[]
 *
 * Switching `layout` never touches how data is entered or stored — it only
 * changes which component renders the shared schema. The color-theme system
 * in `config/templates.js` is layered on top of every layout via the derived
 * theme object (`getLayoutTheme`), so each layout supports all 8 themes.
 */
export const LAYOUTS = {
    'sidebar-executive': {
        name: 'Sidebar Executive',
        reference: 'Richard Sanchez style',
        description: 'Dark accent sidebar (contact, skills, languages) with executive main column.',
        sidebarWidth: '32%',
        sidebarSide: 'left',
        photo: true,
    },
    'photo-header': {
        name: 'Photo Header Duo',
        reference: 'Korina Villanueva style',
        description: 'Circular photo + name header band over a two-column body.',
        sidebarWidth: '38%',
        sidebarSide: 'right',
        photo: true,
    },
    'minimal-timeline': {
        name: 'Minimal Timeline',
        reference: 'Timothy Ricketts style',
        description: 'Single column with vertical timeline connectors and dot markers.',
        sidebarWidth: null,
        sidebarSide: null,
        photo: false,
    },
    'stat-highlight': {
        name: 'Stat Highlight',
        reference: 'Karan Malhotra style',
        description: 'Achievement stat boxes with icon badges beside section headers.',
        sidebarWidth: '34%',
        sidebarSide: 'right',
        photo: false,
    },
    'compact-sidebar': {
        name: 'Compact Sidebar',
        reference: 'Compact variant',
        description: 'Dense single-page layout with a narrow tinted sidebar.',
        sidebarWidth: '28%',
        sidebarSide: 'right',
        photo: true,
    },
};

export const LAYOUT_KEYS = Object.keys(LAYOUTS);

export const DEFAULT_LAYOUT = 'sidebar-executive';
