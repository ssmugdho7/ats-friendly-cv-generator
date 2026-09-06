'use client';

import { useDispatch, useSelector } from 'react-redux';
import { moveSection } from '@/store/slices/resumeSlice';
import ResumeFields, { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { FaArrowUp, FaArrowDown, FaGripVertical } from 'react-icons/fa';

const SectionManager = () => {
    const dispatch = useDispatch();
    const order = useSelector(state => state.resume.sectionOrder) || DEFAULT_SECTION_ORDER;

    return (
        <div>
            <p className="mb-4 text-sm text-gray-400">
                Drag to reorder resume sections. The header always stays on top.
            </p>
            <div className="space-y-2">
                {order.map((key, i) => (
                    <div
                        key={key}
                        className="group flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-800/50 px-4 py-3 transition-all hover:border-gray-600/50 hover:bg-gray-700/30"
                    >
                        <FaGripVertical className="h-4 w-4 text-gray-600 group-hover:text-gray-500" />
                        <span className="mr-auto text-sm font-medium text-gray-200">
                            {ResumeFields[key]?.name || key}
                        </span>
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
                ))}
            </div>
        </div>
    );
};

export default SectionManager;
