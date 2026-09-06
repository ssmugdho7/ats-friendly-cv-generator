'use client';

import { useDispatch, useSelector } from 'react-redux';
import { updateResumeValue } from '@/store/slices/resumeSlice';
import { LAYOUTS } from '@/config/layouts';

const LayoutSelector = () => {
    const dispatch = useDispatch();
    const selectedLayout = useSelector(state => state.resume.layout);

    return (
        <div>
            <p className="mb-4 text-sm text-gray-400">
                Choose a layout for your resume. Each layout has a unique structure. All are ATS-friendly.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(LAYOUTS).map(([key, layout]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => dispatch(updateResumeValue({ tab: 'layout', value: key }))}
                        className={`group relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                            selectedLayout === key
                                ? 'border-primary-500 bg-primary-500/10 shadow-lg'
                                : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-700/30'
                        }`}
                    >
                        {/* Layout mini diagram */}
                        <div className="flex h-16 w-full gap-1 rounded-lg bg-gray-900/80 p-2">
                            {layout.sidebarSide === 'left' && (
                                <div
                                    className="h-full rounded-sm"
                                    style={{
                                        width: layout.sidebarWidth || '30%',
                                        backgroundColor: selectedLayout === key ? '#3b82f6' : '#4b5563',
                                    }}
                                />
                            )}
                            <div className="flex-1 flex flex-col gap-1">
                                <div
                                    className="h-3 rounded-sm"
                                    style={{
                                        backgroundColor: selectedLayout === key ? '#3b82f6' : '#6b7280',
                                        width: layout.photo ? '100%' : '60%',
                                    }}
                                />
                                <div className="flex-1 flex gap-1">
                                    <div className="flex-1 flex flex-col gap-0.5">
                                        <div className="h-1 rounded-sm bg-gray-600 w-full" />
                                        <div className="h-1 rounded-sm bg-gray-600 w-3/4" />
                                        <div className="h-1 rounded-sm bg-gray-600 w-5/6" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-0.5">
                                        <div className="h-1 rounded-sm bg-gray-600 w-full" />
                                        <div className="h-1 rounded-sm bg-gray-600 w-2/3" />
                                    </div>
                                </div>
                            </div>
                            {layout.sidebarSide === 'right' && (
                                <div
                                    className="h-full rounded-sm"
                                    style={{
                                        width: layout.sidebarWidth || '30%',
                                        backgroundColor: selectedLayout === key ? '#3b82f6' : '#4b5563',
                                    }}
                                />
                            )}
                        </div>

                        {/* Layout name + description */}
                        <div>
                            <span
                                className={`text-sm font-medium ${
                                    selectedLayout === key ? 'text-gray-100' : 'text-gray-300 group-hover:text-gray-100'
                                }`}
                            >
                                {layout.name}
                            </span>
                            <p className="mt-0.5 text-xs text-gray-500">{layout.description}</p>
                        </div>

                        {/* Selected indicator */}
                        {selectedLayout === key && (
                            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
                                ✓
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LayoutSelector;
