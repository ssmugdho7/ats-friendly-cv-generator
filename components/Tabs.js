'use client';

import ResumeFields from '@/config/ResumeFields';
import Link from 'next/link';
import { useState } from 'react';
import {
    FaUser,
    FaTag,
    FaFileLines,
    FaGraduationCap,
    FaBriefcase,
    FaDiagramProject,
    FaCode,
    FaCertificate,
    FaLanguage,
    FaUsers,
    FaPalette,
    FaTableColumns,
    FaFont as FaTypography,
    FaSliders,
    FaChevronDown,
} from 'react-icons/fa6';

const TAB_ICONS = {
    contact: FaUser,
    tagline: FaTag,
    summary: FaFileLines,
    education: FaGraduationCap,
    experience: FaBriefcase,
    projects: FaDiagramProject,
    skills: FaCode,
    certificates: FaCertificate,
    languages: FaLanguage,
    references: FaUsers,
    sections: FaUsers,
    template: FaPalette,
    typography: FaTypography,
    layout: FaTableColumns,
};

const CONTENT_TABS = ['contact', 'tagline', 'summary', 'education', 'experience', 'projects', 'skills', 'certificates', 'languages', 'references'];
const SETTINGS_TABS = ['sections', 'template', 'layout', 'typography'];

const TabButton = ({ tab, activeTab, small }) => {
    const Icon = TAB_ICONS[tab];
    const isActive = activeTab === tab;

    return (
        <Link
            className={`group flex items-center gap-2 rounded-lg transition-all duration-200 ${
                small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
            } ${
                isActive
                    ? 'bg-primary-400/15 text-primary-400 ring-1 ring-primary-400/30'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
            }`}
            href={`/editor/?tab=${tab}`}
        >
            {Icon && (
                <Icon
                    className={`h-3.5 w-3.5 transition-colors ${
                        isActive ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                />
            )}
            <span className="capitalize">{tab}</span>
        </Link>
    );
};

const Tabs = ({ activeTab }) => {
    const [showTools, setShowTools] = useState(false);

    return (
        <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Content Sections</span>
            </div>
            <div className="mb-5 flex flex-wrap gap-1.5">
                {CONTENT_TABS.map(tab => (
                    <TabButton key={tab} tab={tab} activeTab={activeTab} />
                ))}
            </div>

            <div className="mb-3">
                <button
                    type="button"
                    onClick={() => setShowTools(prev => !prev)}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-300"
                >
                    <FaSliders className="h-3.5 w-3.5" />
                    <span>Explore Tools</span>
                    <FaChevronDown className={`h-3 w-3 transition-transform ${showTools ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {showTools && (
                <div className="flex flex-wrap gap-1.5 rounded-xl border border-gray-700/50 bg-gray-800/30 p-3">
                    {SETTINGS_TABS.map(tab => (
                        <TabButton key={tab} tab={tab} activeTab={activeTab} small />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tabs;
