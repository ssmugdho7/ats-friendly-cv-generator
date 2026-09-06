import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { DEFAULT_TEMPLATE } from '@/config/templates';
import { DEFAULT_LAYOUT } from '@/config/layouts';

const defaultResume = {
    contact: { phoneCountryCode: '+880', order: ['address', 'phone', 'email', 'linkedin', 'github', 'portfolio'] },
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
    hiddenSections: [],
    template: DEFAULT_TEMPLATE,
    layout: DEFAULT_LAYOUT,
    photo: null,
    font: { family: 'Times-Roman', size: 10, titleSize: 13, titleWeight: 'bold', breakerSize: 1, descSize: 10, nameSize: 20, companySize: 10, roleSize: 12, sectionMarginBefore: 8, sectionMarginAfter: 6, linkColor: '#555555', linkUnderline: false, sectionLineColor: '#e0e0e0', contactAlign: 'center', taglineAlign: 'center', imageBottomGap: 8 },

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

        toggleSectionVisibility: (state, action) => {
            const { section } = action.payload;
            const hidden = new Set(state.hiddenSections || []);
            if (hidden.has(section)) {
                hidden.delete(section);
            } else {
                hidden.add(section);
            }
            state.hiddenSections = Array.from(hidden);
            state.saved = false;
        },

        updateContactOrder: (state, action) => {
            state.contact.order = action.payload;
            state.saved = false;
        },

        loadDemoResume: state => {
            state.contact = {
                name: 'Md. Shah Maruf Siraj Mugdho',
                email: 'shahmarufsiraj@gmail.com',
                phone: '1758551245',
                phoneCountryCode: '+880',
                address: 'Dhaka',
                linkedin: 'linkedin.com/in/shahmarufsiraj360',
                github: 'github.com/ssmugdho7',
                portfolio: 'shahmaruf-siraj-mugdho-profile.netlify.app',
                order: ['address', 'phone', 'email', 'linkedin', 'github', 'portfolio'],
            };
            state.tagline = { tagline: 'Full Stack Developer & Creative Technologist' };
            state.summary = {
                summary: 'Experienced developer specializing in building exceptional digital experiences. Proficient in React, Node.js, and modern web technologies.'
            };
            state.education = [
                { degree: 'Bachelor of Science in Computer Science', institution: 'University of Technology', start: '2018-01', end: '2022-01', location: 'Dhaka, Bangladesh', gpa: '3.8/4.0' }
            ];
            state.experience = [
                { role: 'Senior Software Engineer', company: 'Tech Solutions Inc.', location: 'Dhaka, Bangladesh', start: '2022-01', end: 'Present', description: 'Leading development of web applications using React and Node.js', bullets: true },
                { role: 'Software Developer', company: 'Digital Innovations Ltd.', location: 'Dhaka, Bangladesh', start: '2020-01', end: '2022-01', description: 'Developed and maintained multiple client projects', bullets: true }
            ];
            state.projects = [
                { title: 'Resume Builder', url: 'https://resumave.com', github: 'github.com/mugdho/resumave', live: 'https://resumave.com', description: 'A modern resume builder with multiple templates and layouts', bullets: true },
                { title: 'Portfolio Website', url: 'https://mugdho.com', github: 'github.com/mugdho/portfolio', live: 'https://mugdho.com', description: 'Personal portfolio website with dark theme', bullets: true }
            ];
            state.skills = [
                { title: 'Programming Languages', skills: 'JavaScript, TypeScript, Python, Java' },
                { title: 'Frameworks', skills: 'React, Next.js, Node.js, Express' },
                { title: 'Tools', skills: 'Git, Docker, AWS, MongoDB' }
            ];
            state.certificates = [
                { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023-01' },
                { title: 'Google Cloud Professional', issuer: 'Google Cloud', date: '2022-06' }
            ];
            state.languages = [
                { language: 'English', proficiency: 'Native or Bilingual Proficiency' },
                { language: 'Bengali', proficiency: 'Native or Bilingual Proficiency' }
            ];
            state.references = [
                { name: 'John Smith', role: 'Senior Manager', company: 'Tech Corp', contacts: 'john@example.com\n+1 234 567 890', website: 'https://linkedin.com/in/johnsmith' }
            ];
            state.sectionOrder = [...DEFAULT_SECTION_ORDER];
            state.hiddenSections = [];
            state.template = DEFAULT_TEMPLATE;
            state.layout = DEFAULT_LAYOUT;
            state.font = { family: 'Times-Roman', size: 10, titleSize: 13, titleWeight: 'bold', breakerSize: 1, descSize: 10, nameSize: 20, companySize: 10, roleSize: 12, sectionMarginBefore: 8, sectionMarginAfter: 6, linkColor: '#555555', linkUnderline: false, sectionLineColor: '#e0e0e0', contactAlign: 'center', taglineAlign: 'center', imageBottomGap: 8 };
            state.saved = false;
        },

        clearResume: state => {
            state.contact = { phoneCountryCode: '+880', order: ['address', 'phone', 'email', 'linkedin', 'github', 'portfolio'] };
            state.tagline = { tagline: '' };
            state.summary = {};
            state.education = [];
            state.experience = [];
            state.projects = [];
            state.skills = [];
            state.certificates = [];
            state.languages = [];
            state.references = [];
            state.sectionOrder = [...DEFAULT_SECTION_ORDER];
            state.hiddenSections = [];
            state.template = DEFAULT_TEMPLATE;
            state.layout = DEFAULT_LAYOUT;
            state.font = { family: 'Times-Roman', size: 10, titleSize: 13, titleWeight: 'bold', breakerSize: 1, descSize: 10, nameSize: 20, companySize: 10, roleSize: 12, sectionMarginBefore: 8, sectionMarginAfter: 6, linkColor: '#555555', linkUnderline: false, sectionLineColor: '#e0e0e0', contactAlign: 'center', taglineAlign: 'center', imageBottomGap: 8 };
            state.photo = null;
            state.saved = false;
        },

        updatePhoto: (state, action) => {
            state.photo = action.payload;
            state.saved = false;
        },
    },
});

export const { updateResumeValue, addNewIndex, deleteIndex, moveSection, saveResume, moveIndex, toggleSectionVisibility, updateContactOrder, loadDemoResume, clearResume, updatePhoto } = resumeSlice.actions;
export default resumeSlice.reducer;
