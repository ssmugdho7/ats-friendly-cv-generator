'use client';

import ResumeFields from '@/config/ResumeFields';
import Link from 'next/link';
import { FaCog, FaBars } from 'react-icons/fa';
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
    FaStackExchange,
    FaFont,
    FaUsers,
    FaPalette,
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
    sections: FaStackExchange,
    template: FaPalette,
    font: FaFont,
};

const CONTENT_TABS = ['contact', 'tagline', 'summary', 'education', 'experience', 'projects', 'skills', 'certificates', 'languages', 'references'];
const SETTINGS_TABS = ['sections', 'template', 'font'];

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
    return (
        <div className="mb-6 space-y-3">
            {/* Primary content tabs */}
            <div className="flex flex-wrap gap-1.5">
                {CONTENT_TABS.map(tab => (
                    <TabButton key={tab} tab={tab} activeTab={activeTab} />
                ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-700/50" />
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaCog className="h-3 w-3" />
                    Settings
                </span>
                <div className="h-px flex-1 bg-gray-700/50" />
            </div>

            {/* Settings tabs */}
            <div className="flex gap-1.5">
                {SETTINGS_TABS.map(tab => (
                    <TabButton key={tab} tab={tab} activeTab={activeTab} small />
                ))}
            </div>
        </div>
    );
};

export default Tabs;
