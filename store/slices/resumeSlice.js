import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { DEFAULT_TEMPLATE } from '@/config/templates';
import { DEFAULT_LAYOUT, LAYOUT_KEYS } from '@/config/layouts';

const SEED_CONTACT = {
    name: 'Md. Shah Maruf Siraj Mugdho',
    email: 'shahmarufsiraj360@gmail.com',
    phone: '+880-1712-XXXXXX',
    address: 'Dhaka, Bangladesh',
    linkedin: 'https://www.linkedin.com/in/shahmarufsiraj360/',
    github: 'https://github.com/ssmugdho7',
    portfolio: 'https://shahmaruf-siraj-mugdho-profile.netlify.app/',
    blogs: '',
    twitter: '',
};

const SEED_TAGLINE = { tagline: 'Full Stack Web Developer' };

const SEED_SUMMARY = { summary: 'Passionate full-stack web developer with hands-on experience building scalable web applications, AI-powered tools, and modern agency websites. Skilled in React, Next.js, Node.js, and Python with a strong focus on clean code, user experience, and ATS-friendly design.' };

const SEED_EXPERIENCE = [
    {
        role: 'Full Stack Developer',
        company: 'DLS Venture',
        location: 'Dhaka, Bangladesh',
        start: '2024-01',
        end: '',
        description: 'Developing and maintaining enterprise-grade e-trading platforms.\nCollaborating with cross-functional teams to deliver secure, scalable solutions.\nImplementing real-time data features and optimizing application performance.',
        bullets: true,
    },
];

const SEED_EDUCATION = [
    {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Dhaka',
        start: '2019-01',
        end: '2023-12',
        location: 'Dhaka, Bangladesh',
        gpa: '3.5/4.0',
    },
];

const SEED_PROJECTS = [
    {
        title: 'JobPilot',
        url: 'https://jobpilot-hfpz.onrender.com/',
        github: 'https://github.com/ssmugdho7/jobpilot',
        live: 'https://jobpilot-hfpz.onrender.com/',
        description: 'An intelligent job application tracking system with automated status updates and analytics dashboard.',
        bullets: true,
    },
    {
        title: 'AI Ebook Writer',
        url: 'https://ebook-web-rgnw.onrender.com/',
        github: 'https://github.com/ssmugdho7/ebook-generator-ai',
        live: 'https://ebook-web-rgnw.onrender.com/',
        description: 'AI-powered ebook generation platform with customizable templates, chapters, and export options.',
        bullets: true,
    },
    {
        title: 'Agency Website',
        url: '',
        github: '',
        live: 'https://agency-app-self-two.vercel.app/',
        description: 'Modern agency portfolio website with smooth animations, service showcases, and contact integration.',
        bullets: true,
    },
    {
        title: 'DLS Venture',
        url: 'https://etrade.dls.gov.bd/',
        github: '',
        live: 'https://etrade.dls.gov.bd/',
        description: 'Enterprise e-trading platform serving thousands of users with real-time market data and transaction processing.',
        bullets: true,
    },
    {
        title: 'KitQuest Web App',
        url: '',
        github: 'https://github.com/ssmugdho7/KitQuest-Web-App',
        live: '',
        description: 'Web-based kit management system for tracking inventory, requests, and deployments across teams.',
        bullets: true,
    },
];

const SEED_SKILLS = [
    { title: 'Frontend', skills: 'React, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3' },
    { title: 'Backend', skills: 'Node.js, Express.js, Python, Django, REST APIs' },
    { title: 'Database', skills: 'PostgreSQL, MongoDB, MySQL, Prisma' },
    { title: 'AI/ML', skills: 'OpenAI API, LangChain, TensorFlow, PyTorch' },
    { title: 'Tools', skills: 'Git, Docker, AWS, Vercel, Render, Figma' },
];

const SEED_CERTIFICATES = [
    {
        title: 'Web Development Bootcamp',
        issuer: 'Online Learning Platform',
        date: '2023-06',
        url: 'https://drive.google.com/file/d/14hJDm0m1b5m8ZfO4fJyNyampM6fIDUGx/view?usp=sharing',
    },
];

const SEED_LANGUAGES = [
    { language: 'Bengali', proficiency: 'Native or Bilingual Proficiency' },
    { language: 'English', proficiency: 'Professional Working Proficiency' },
];

const SEED_REFERENCES = [
    {
        name: 'Dr. A. K. M. Bahalul Haque',
        role: 'Professor',
        company: 'University of Dhaka',
        contacts: 'bahalul@du.ac.bd\n+880-1XXXXXXXXX',
        website: '',
    },
];

const SEED_ACHIEVEMENTS = [
    { label: 'Years Experience', value: '2+' },
    { label: 'Projects Built', value: '10+' },
    { label: 'Technologies', value: '15+' },
];

const defaultResume = {
    contact: SEED_CONTACT,
    tagline: SEED_TAGLINE,
    summary: SEED_SUMMARY,
    education: SEED_EDUCATION,
    experience: SEED_EXPERIENCE,
    projects: SEED_PROJECTS,
    skills: SEED_SKILLS,
    certificates: SEED_CERTIFICATES,
    languages: SEED_LANGUAGES,
    references: SEED_REFERENCES,
    achievements: SEED_ACHIEVEMENTS,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    template: DEFAULT_TEMPLATE,
    layout: DEFAULT_LAYOUT,
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
            state.saved = false;
        },

        deleteIndex: (state, action) => {
            const { index, tab } = action.payload;
            state[tab].splice(index, 1);
            state.saved = false;
        },

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
