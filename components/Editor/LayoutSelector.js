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
                Choose a layout style for your resume. All layouts support all color themes.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(LAYOUTS).map(([key, layout]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => dispatch(updateResumeValue({ tab: 'layout', value: key }))}
                        className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                            selectedLayout === key
                                ? 'text-gray-100'
                                : 'text-gray-300 group-hover:text-gray-100'
                        }`}
                        style={selectedLayout === key ? { borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' } : { borderColor: '#374151', backgroundColor: 'transparent' }}
                    >
                        <div className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-600/30 bg-gray-700/30">
                            <div className="flex h-8 w-full gap-1 px-1">
                                {layout.sidebarWidth > 0 ? (
                                    <>
                                        <div className="h-full w-1/3 rounded bg-gray-500/40" />
                                        <div className="h-full w-2/3 rounded bg-gray-400/30" />
                                    </>
                                ) : (
                                    <div className="h-full w-full rounded bg-gray-400/30" />
                                )}
                            </div>
                        </div>

                        <span className="text-sm font-medium">
                            {layout.name}
                        </span>

                        {selectedLayout === key && (
                            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ backgroundColor: '#3b82f6' }}>
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