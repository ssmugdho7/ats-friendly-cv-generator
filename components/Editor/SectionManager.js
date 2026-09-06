'use client';

import { useDispatch, useSelector } from 'react-redux';
import { moveSection, toggleSectionVisibility } from '@/store/slices/resumeSlice';
import ResumeFields, { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { FaArrowUp, FaArrowDown, FaGripVertical, FaEye, FaEyeSlash } from 'react-icons/fa';

const REMOVABLE_SECTIONS = ['certificates', 'languages', 'references'];

const SectionManager = () => {
    const dispatch = useDispatch();
    const order = useSelector(state => state.resume.sectionOrder) || DEFAULT_SECTION_ORDER;
    const hiddenSections = useSelector(state => state.resume.hiddenSections) || [];

    const isRemovable = (key) => REMOVABLE_SECTIONS.includes(key);

    return (
        <div>
            <p className="mb-4 text-sm text-gray-400">
                Drag to reorder resume sections. The header always stays on top. Click the eye icon to show/hide sections.
            </p>
            <div className="space-y-2">
                {order.map((key, i) => {
                    const hidden = hiddenSections.includes(key);
                    return (
                        <div
                            key={key}
                            className={`group flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                                hidden
                                    ? 'border-gray-700/30 bg-gray-800/20 opacity-60'
                                    : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600/50 hover:bg-gray-700/30'
                            }`}
                        >
                            {isRemovable(key) && (
                                <button
                                    type="button"
                                    title={hidden ? 'Show section' : 'Hide section'}
                                    onClick={() => dispatch(toggleSectionVisibility({ section: key }))}
                                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-600/50 hover:text-gray-300"
                                >
                                    {hidden ? <FaEyeSlash className="h-3.5 w-3.5" /> : <FaEye className="h-3.5 w-3.5" />}
                                </button>
                            )}
                            <FaGripVertical className="h-4 w-4 text-gray-600 group-hover:text-gray-500" />
                            <span className="mr-auto text-sm font-medium text-gray-200">
                                {ResumeFields[key]?.name || key}
                            </span>
                            {hidden && (
                                <span className="text-xs text-gray-500 italic">hidden</span>
                            )}
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    title="Move up"
                                    disabled={i === 0}
                                    onClick={() => dispatch(moveSection({ index: i, dir: 'up' }))}
                                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-600/50 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <FaArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    type="button"
                                    title="Move down"
                                    disabled={i === order.length - 1}
                                    onClick={() => dispatch(moveSection({ index: i, dir: 'down' }))}
                                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-600/50 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <FaArrowDown className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SectionManager;