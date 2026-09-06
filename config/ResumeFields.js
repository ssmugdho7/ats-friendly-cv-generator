export const DEFAULT_SECTION_ORDER = ['summary', 'education', 'experience', 'projects', 'skills', 'certificates', 'languages', 'references'];

import { TEMPLATE_KEYS } from './templates';

export default {
    contact: {
        name: 'Contact',
        fields: [
            { name: 'name', label: 'Full Name', placeholder: 'John Doe', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'john.doe@example.com' },
            { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1234567890' },
            { name: 'address', label: 'Address', placeholder: '123 Street, City, Country' },
            { name: 'linkedin', label: 'Linked', placeholder: 'linkedin.com/in/johndoe' },
            { name: 'github', label: 'Github', placeholder: 'github.com/johndoe' },
            { name: 'blogs', label: 'Blogs', placeholder: 'github.com/johndoe' },
            { name: 'twitter', label: 'Twitter', placeholder: 'github.com/johndoe' },
            { name: 'portfolio', label: 'Portfolio', placeholder: 'johndoe.com' },
        ],
    },
    tagline: {
        name: 'Tagline',
        fields: [
            {
                name: 'tagline',
                label: 'Tagline / Current Role',
                placeholder: 'Senior Software Engineer',
                span: true,
            },
        ],
    },
    summary: {
        name: 'Summary',
        fields: [
            {
                name: 'summary',
                label: 'Summary',
                type: 'textarea',
                placeholder: 'Brief summary of your skills and experience... (use **bold** and [color=#ff0000]color[/color])',
                span: true,
                rows: 5,
                rich: true,
            },
        ],
    },
    education: {
        name: 'Education',
        multiple: true,
        fields: [
            { name: 'degree', label: 'Study Program', placeholder: 'Bachelor of Computer Science' },
            { name: 'institution', label: 'Institution', placeholder: 'University Name' },
            { name: 'start', label: 'Start Date', type: 'month', placeholder: 'MM/YYYY' },
            { name: 'end', label: 'End Date', type: 'month', placeholder: 'MM/YYYY' },
            { name: 'location', label: 'Location', placeholder: 'City, Country' },
            { name: 'gpa', label: 'GPA', placeholder: '3.8/4.0' },
        ],
    },

    experience: {
        name: 'Experience',
        multiple: true,
        fields: [
            { name: 'role', label: 'Title / Position', span: true, placeholder: 'Software Engineer' },
            { name: 'company', label: 'Workplace / Company', placeholder: 'Company Name' },
            { name: 'location', label: 'Location', placeholder: 'City, Country' },
            { name: 'start', label: 'Start Date', type: 'month', placeholder: 'MM/DD/YYYY' },
            { name: 'end', label: 'End Date', type: 'month', placeholder: 'MM/DD/YYYY' },
            {
                name: 'description',
                label: 'Responsibility (one point per line)',
                type: 'textarea',
                placeholder: 'Brief description of your responsibilities... (use **bold** and [color=#ff0000]color[/color])',
                span: true,
                rows: 4,
                multipoints: true,
                rich: true,
            },
            {
                name: 'bullets',
                label: 'Show description as bullet points',
                type: 'checkbox',
                span: true,
            },
        ],
    },

    projects: {
        name: 'Projects',
        multiple: true,
        fields: [
            { name: 'title', label: 'Project Title', placeholder: 'Project Name' },
            { name: 'url', label: 'Project Url', placeholder: 'https://example.com/project' },
            { name: 'github', label: 'Github Link', placeholder: 'github.com/johndoe/project' },
            { name: 'live', label: 'Live Link', placeholder: 'https://myproject.com' },
            {
                name: 'description',
                label: 'Now Describe What you did (one point per line)',
                type: 'textarea',
                placeholder: 'Briefly describe your project... (use **bold** and [color=#ff0000]color[/color])',
                span: true,
                multipoints: true,
                rich: true,
            },
            {
                name: 'bullets',
                label: 'Show description as bullet points',
                type: 'checkbox',
                span: true,
            },
        ],
    },

    skills: {
        name: 'Skills',
        multiple: true,
        fields: [
            {
                name: 'title',
                label: 'Skill Group',
                placeholder: 'e.g. Programming Languages',
            },
            {
                name: 'skills',
                label: 'Skills (comma separated)',
                type: 'textarea',
                placeholder: 'e.g. JavaScript, Python, ... (use **bold** and [color=#ff0000]color[/color])',
                span: true,
                rows: 2,
                rich: true,
            },
        ],
    },

    certificates: {
        name: 'Certificates',
        multiple: true,
        fields: [
            { name: 'title', label: 'Certificate Title', placeholder: 'Certificate Name', span: true },
            { name: 'issuer', label: 'Issuing Organization', placeholder: 'Organization Name' },
            { name: 'date', label: 'Issuance Date', type: 'month', placeholder: 'MM/DD/YYYY' },
        ],
    },

    languages: {
        name: 'Languages',
        multiple: true,
        fields: [
            { name: 'language', label: 'Language', placeholder: 'Language Name' },
            {
                name: 'proficiency',
                label: 'Proficiency',
                placeholder: 'e.g., Fluent, Intermediate, Beginner',
                type: 'select',
                options: [
                    {
                        
                        value: 'Elementary Proficiency',
                    },
                    {
                        
                        value: 'Limited Working Proficiency',
                    },
                    {
                        
                        value: 'Professional Working Proficiency',
                    },
                    {
                        
                        value: 'Full Professional Proficiency',
                    },
                    {
                        
                        value: 'Native or Bilingual Proficiency',
                    },
                ],
            },
        ],
    },

    references: {
        name: 'References',
        multiple: true,
        fields: [
            { name: 'name', label: 'Referee Name', placeholder: 'John Smith' },
            { name: 'role', label: 'Role / Title', placeholder: 'Senior Manager' },
            { name: 'company', label: 'Company', placeholder: 'Company Name' },
            {
                name: 'contacts',
                label: 'Contact Info (one per line)',
                type: 'textarea',
                placeholder: 'john@example.com\n+1 234 567 890',
                span: true,
                rows: 3,
            },
            { name: 'website', label: 'Website URL', placeholder: 'https://linkedin.com/in/johnsmith' },
        ],
    },

    sections: {
        name: 'Sections',
        custom: 'SectionManager',
        fields: [],
    },

    template: {
        name: 'Template',
        custom: 'TemplateSelector',
        fields: [],
    },

    font: {
        name: 'Font',
        fields: [
            {
                name: 'family',
                label: 'Font Family',
                type: 'select',
                options: [
                    { value: 'Times-Roman', name: 'Times New Roman' },
                    { value: 'Georgia', name: 'Georgia' },
                    { value: 'Garamond', name: 'Garamond' },
                    { value: 'Palatino', name: 'Palatino' },
                    { value: 'Helvetica', name: 'Helvetica' },
                    { value: 'Arial', name: 'Arial' },
                    { value: 'Verdana', name: 'Verdana' },
                    { value: 'Tahoma', name: 'Tahoma' },
                    { value: 'Courier', name: 'Courier' },
                    { value: 'Courier-New', name: 'Courier New' },
                ],
            },
            { name: 'nameSize', label: 'Name Size', type: 'number', placeholder: '20' },
            { name: 'titleSize', label: 'Section Title Size', type: 'number', placeholder: '13' },
            { name: 'size', label: 'Body Font Size', type: 'number', placeholder: '10' },
            { name: 'descSize', label: 'Description Font Size', type: 'number', placeholder: '10' },
            { name: 'sectionGap', label: 'Gap Between Sections', type: 'number', placeholder: '8' },
            { name: 'sectionMarginBefore', label: 'Space Before Section', type: 'number', placeholder: '6' },
            { name: 'sectionMarginAfter', label: 'Space After Section', type: 'number', placeholder: '4' },
            { name: 'linkColor', label: 'Link Color', type: 'color', placeholder: '#555555' },
            { name: 'linkUnderline', label: 'Underline Links', type: 'checkbox' },
        ],
    },
};
