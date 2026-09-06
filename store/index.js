import { configureStore } from '@reduxjs/toolkit';
import resumeSlice from './slices/resumeSlice';
import ResumeFields, { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { DEFAULT_TEMPLATE, TEMPLATE_KEYS } from '@/config/templates';

/**
 * Bring states saved by older app versions up to the current shape:
 * - ensure sectionOrder exists (and contains every swappable section)
 * - ensure the tagline section exists
 * - convert skills from the legacy `{ skills: '...' }` shape to grouped entries
 * - default existing project/experience descriptions to bullet mode
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
    if (!Array.isArray(r.education)) r.education = [];
    if (!Array.isArray(r.experience)) r.experience = [];
    if (!Array.isArray(r.projects)) r.projects = [];
    if (!Array.isArray(r.certificates)) r.certificates = [];
    if (!Array.isArray(r.languages)) r.languages = [];

    if (!r.template || !TEMPLATE_KEYS.includes(r.template)) {
        r.template = DEFAULT_TEMPLATE;
    }

    ['experience', 'projects'].forEach(tab => {
        if (Array.isArray(r[tab])) {
            r[tab].forEach(entry => {
                if (entry && entry.bullets === undefined) entry.bullets = true;
            });
        }
    });

    if (!r.font || typeof r.font !== 'object' || Array.isArray(r.font)) {
        r.font = { family: 'Times-Roman', size: 10, titleSize: 13, titleWeight: 'bold', breakerSize: 1, sectionBreakerColor: '#e0e0e0', descSize: 10, nameSize: 20, companySize: 10, roleSize: 12, sectionMarginBefore: 8, sectionMarginAfter: 6, linkColor: '#555555', headerAlign: 'center', imageBottomGap: 8 };
    }
    // Fill any missing font keys from older saves
    const fontDefaults = { family: 'Times-Roman', size: 10, titleSize: 13, titleWeight: 'bold', breakerSize: 1, sectionBreakerColor: '#e0e0e0', descSize: 10, nameSize: 20, companySize: 10, roleSize: 12, sectionMarginBefore: 8, sectionMarginAfter: 6, linkColor: '#555555', headerAlign: 'center', imageBottomGap: 8 };
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
