export const LAYOUTS = {
    classic: {
        name: 'Classic',
        description: 'Simple single-column layout with clean formatting',
        sidebarWidth: 0,
    },
    modern: {
        name: 'Modern',
        description: 'Two-column with photo header at top',
        sidebarWidth: 0,
        photoPosition: 'header',
    },
};

export const DEFAULT_LAYOUT = 'classic';

export const LAYOUT_KEYS = Object.keys(LAYOUTS);