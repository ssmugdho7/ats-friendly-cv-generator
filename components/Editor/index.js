'use client';

import ResumeFields from '@/config/ResumeFields';
import SingleEditor from './SingleEditor';
import MultiEditor from './MultiEditor';
import SectionManager from './SectionManager';
import TemplateSelector from './TemplateSelector';
import LayoutSelector from './LayoutSelector';
import ContactOrderEditor from './ContactOrderEditor';
import { useDispatch } from 'react-redux';
import { saveResume } from '@/store/slices/resumeSlice';
import { useEffect } from 'react';

const Editor = ({ tab }) => {
    const dispatch = useDispatch();
    const stateKey = tab === 'typography' ? 'font' : tab;

    // Auto-save every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(saveResume());
        }, 10000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const { custom, multiple } = ResumeFields[stateKey] || {};

    if (custom === 'SectionManager') {
        return (
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 shadow-xl backdrop-blur-sm md:p-6">
                <SectionManager />
            </div>
        );
    }

    if (custom === 'TemplateSelector') {
        return (
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 shadow-xl backdrop-blur-sm md:p-6">
                <TemplateSelector />
            </div>
        );
    }

    if (custom === 'LayoutSelector') {
        return (
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 shadow-xl backdrop-blur-sm md:p-6">
                <LayoutSelector />
            </div>
        );
    }

    if (custom === 'ContactOrderEditor') {
        return (
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 shadow-xl backdrop-blur-sm md:p-6">
                <ContactOrderEditor />
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 shadow-xl backdrop-blur-sm md:p-6">
            {multiple && <MultiEditor tab={stateKey} />}
            {!multiple && <SingleEditor tab={stateKey} />}
        </div>
    );
};

export default Editor;
