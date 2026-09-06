import { configureStore } from '@reduxjs/toolkit';
import resumeSlice from './slices/resumeSlice';
import ResumeFields, { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { DEFAULT_TEMPLATE, TEMPLATE_KEYS } from '@/config/templates';
import { DEFAULT_LAYOUT, LAYOUT_KEYS } from '@/config/layouts';

/**
 * Bring states saved by older app versions up to the current shape:
 * - ensure sectionOrder exists (and contains every swappable section)
 * - ensure the tagline section exists
 * - convert skills from the legacy `{ skills: '...' }` shape to grouped entries
 * - default existing project/experience descriptions to bullet mode
 * - ensure layout exists and is a valid key
 * - ensure achievements array exists
 */
const migrateState = state => {
    if (!state || !state.resume) return state;
    const r = state.resume;

    const swappable = k => ResumeFields[k] && k !== 'contact' && k !== 'tagline' && k !== 'sections';
    if (!Array.isArray(r.sectionOrder)) {
        r.sectionOrder = [...DEFAULT_SECTION_ORDER];
    } else {
        const seen = new Set();
        r.sectionOrder = r.sectionOrder.filter(k => swappable(k) && !seen.has(k) && (seen.add(k), true));
        DEFAULT_SECTION_ORDER.forEach(k => {
            if (!seen.has(k)) r.sectionOrder.push(k);
        });
    }

    if (!r.tagline || typeof r.tagline !== 'object' || Array.isArray(r.tagline)) {
        r.tagline = { tagline: '' };
    }

    if (r.skills && !Array.isArray(r.skills)) {
        const legacy = typeof r.skills === 'string' ? r.skills : r.skills.skills;
        r.skills =
            typeof legacy === 'string' && legacy.trim() ? [{ title: 'Skills', skills: legacy }] : [];
    }
    if (!Array.isArray(r.skills)) r.skills = [];
    if (!Array.isArray(r.references)) r.references = [];
    if (!Array.isArray(r.achievements)) r.achievements = [];

    if (!r.template || !TEMPLATE_KEYS.includes(r.template)) {
        r.template = DEFAULT_TEMPLATE;
    }

    if (!r.layout || !LAYOUT_KEYS.includes(r.layout)) {
        r.layout = DEFAULT_LAYOUT;
    }

    ['experience', 'projects'].forEach(tab => {
        if (Array.isArray(r[tab])) {
            r[tab].forEach(entry => {
                if (entry && entry.bullets === undefined) entry.bullets = true;
            });
        }
    });

    if (!r.font || typeof r.font !== 'object' || Array.isArray(r.font)) {
        r.font = { family: 'Times-Roman', size: 10, titleSize: 13, descSize: 10, nameSize: 20, sectionGap: 8, sectionMarginBefore: 6, sectionMarginAfter: 4, linkColor: '#555555', linkUnderline: false };
    }
    // Fill any missing font keys from older saves
    const fontDefaults = { family: 'Times-Roman', size: 10, titleSize: 13, descSize: 10, nameSize: 20, sectionGap: 8, sectionMarginBefore: 6, sectionMarginAfter: 4, linkColor: '#555555', linkUnderline: false };
    Object.keys(fontDefaults).forEach(k => {
        if (r.font[k] === undefined || r.font[k] === null) r.font[k] = fontDefaults[k];
    });

    return state;
};

const loadState = () => {
    console.info('Loading State from Local Storage...');

    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) return undefined;
        console.info('State Loaded Successfully from Local Storage');
        return migrateState(JSON.parse(serializedState));
    } catch (err) {
        console.warn('Error Loading State from Local Storage');
        return undefined;
    }
};

const store = configureStore({
    devTools: true,
    preloadedState: loadState(),
    reducer: {
        resume: resumeSlice,
    },
});

function debounce(func, timeout = 2500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const saveState = debounce(() => {
    console.info('Saving State to Local Storage...');
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

store.subscribe(saveState);

export default store;
