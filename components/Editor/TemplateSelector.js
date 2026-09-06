'use client';

import { useDispatch, useSelector } from 'react-redux';
import { updateResumeValue } from '@/store/slices/resumeSlice';
import { TEMPLATES } from '@/config/templates';

const TemplateSelector = () => {
    const dispatch = useDispatch();
    const selectedTemplate = useSelector(state => state.resume.template);

    return (
        <div>
            <p className="mb-4 text-sm text-gray-400">
                Choose a premium template for your resume. All templates are ATS-friendly.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(TEMPLATES).map(([key, template]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => dispatch(updateResumeValue({ tab: 'template', value: key }))}
                        className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                            selectedTemplate === key
                                ? 'border-current bg-opacity-10 shadow-lg'
                                : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-700/30'
                        }`}
                        style={selectedTemplate === key ? { borderColor: template.accent, backgroundColor: `${template.accent}15` } : {}}
                    >
                        {/* Color preview */}
                        <div className="flex gap-1">
                            <div
                                className="h-6 w-6 rounded-full shadow-md"
                                style={{ backgroundColor: template.accent }}
                            />
                            <div
                                className="h-6 w-6 rounded-full shadow-md"
                                style={{ backgroundColor: template.text }}
                            />
                            <div
                                className="h-6 w-6 rounded-full shadow-md"
                                style={{ backgroundColor: template.light }}
                            />
                        </div>

                        {/* Template name */}
                        <span
                            className={`text-sm font-medium ${
                                selectedTemplate === key ? 'text-gray-100' : 'text-gray-300 group-hover:text-gray-100'
                            }`}
                        >
                            {template.name}
                        </span>

                        {/* Selected indicator */}
                        {selectedTemplate === key && (
                            <div
                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                                style={{ backgroundColor: template.accent }}
                            >
                                ✓
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
