import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { DEFAULT_TEMPLATE } from '@/config/templates';

const defaultResume = {
    contact: {},
    tagline: { tagline: '' },
    summary: {},
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certificates: [],
    languages: [],
    references: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    template: DEFAULT_TEMPLATE,
    font: { family: 'Times-Roman', size: 10, titleSize: 13, descSize: 10, nameSize: 20, sectionGap: 8, sectionMarginBefore: 6, sectionMarginAfter: 4, linkColor: '#555555', linkUnderline: false },

    saved: false,
};

const resumeSlice = createSlice({
    name: 'resume',
    initialState: defaultResume,
    reducers: {
        updateResumeValue: (state, action) => {
            const { tab, name, value, index } = action.payload;
            if (index != null) {
                state[tab][index][name] = value;
            } else if (name) {
                state[tab][name] = value;
            } else {
                state[tab] = value;
            }

            state.saved = false;
        },

        addNewIndex: (state, action) => {
            const { tab, name, value } = action.payload;
            state[tab].push({});
            // state[tab].push({ [name]: [value] });
            state.saved = false;
        },

        deleteIndex: (state, action) => {
            const { index, tab } = action.payload;
            console.log('deleting', index, 'from', tab);
            state[tab].splice(index, 1);
            state.saved = false;
        },

        // for move index
        moveIndex: (state, action) => {
            const { index, tab, dir } = action.payload;

            const newIndex = dir === 'up' ? index - 1 : index + 1;

            const temp = state[tab][index];
            state[tab][index] = state[tab][newIndex];
            state[tab][newIndex] = temp;
            state.saved = false;
        },

        saveResume: state => {
            state.saved = true;
        },

        moveSection: (state, action) => {
            const { index, dir } = action.payload;
            const order = state.sectionOrder;
            if (!Array.isArray(order)) return;
            const j = dir === 'up' ? index - 1 : index + 1;
            if (index < 0 || index >= order.length || j < 0 || j >= order.length) return;
            [order[index], order[j]] = [order[j], order[index]];
            state.saved = false;
        },
    },
});

export const { updateResumeValue, addNewIndex, deleteIndex, moveSection, saveResume, moveIndex } = resumeSlice.actions;
export default resumeSlice.reducer;
