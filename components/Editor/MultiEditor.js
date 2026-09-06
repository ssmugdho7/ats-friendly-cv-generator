'use client';

import { useDispatch } from 'react-redux';
import Input from '../UI/Input';
import { useSelector } from 'react-redux';
import { addNewIndex, deleteIndex, moveIndex, updateResumeValue } from '@/store/slices/resumeSlice';
import ResumeFields from '@/config/ResumeFields';
import { LuPlus } from 'react-icons/lu';
import { useState } from 'react';
import { FaArrowUp, FaPencil, FaTrash } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa';
import { TbArrowsMinimize } from 'react-icons/tb';

const MultiEditor = ({ tab }) => {
    const stateKey = tab === 'typography' ? 'font' : tab;
    const { fields } = ResumeFields[stateKey] || {};
    const [selectedCard, setSelectedCard] = useState(null);

    const dispatch = useDispatch();
    const resumeData = useSelector(state => state.resume[stateKey]);

    const handleChange = (e, i) => {
        const { name, value } = e.target;

        dispatch(
            updateResumeValue({
                tab: stateKey,
                name,
                value,
                index: i,
            }),
        );
    };

    const addNew = () => {
        dispatch(
            addNewIndex({
                tab: stateKey,
                name: 'degree',
                value: 'new',
            }),
        );

        setSelectedCard(resumeData.length);
    };

    const deleteCard = index => {
        dispatch(deleteIndex({ tab: stateKey, index }));
        setSelectedCard(null);
    };

    return (
        <div>
            <button
                type="button"
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-600/50 bg-gray-700/25 px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:border-primary-500/50 hover:bg-primary-400/10 hover:text-primary-400"
                onClick={addNew}
            >
                <LuPlus className="h-4 w-4" />
                <span>Add New {ResumeFields[stateKey]?.name || tab}</span>
            </button>

            {resumeData?.length === 0 && (
                <div className="my-16 flex flex-col items-center gap-2">
                    <div className="text-4xl text-gray-600">📝</div>
                    <p className="text-center text-sm text-gray-500">No items yet. Click the button above to add one.</p>
                </div>
            )}

            <div className="space-y-3">
                {resumeData.map((e, i) => (
                    <div
                        key={i}
                        className={`group rounded-lg border transition-all duration-200 ${
                            selectedCard === i
                                ? 'border-primary-500/30 bg-gray-700/50 shadow-lg shadow-primary-500/5'
                                : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600/50 hover:bg-gray-700/30'
                        }`}
                        onClick={() => setSelectedCard(i)}
                    >
                        {/* Card header */}
                        <div className="flex items-center gap-3 px-4 py-3">
                            <span className="mr-auto truncate text-sm font-medium text-gray-200">
                                {Object.values(e)[0] || 'Untitled'}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                    disabled={i === 0}
                                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-600/50 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-30"
                                    onClick={e => {
                                        e.stopPropagation();
                                        dispatch(moveIndex({ tab: stateKey, index: i, dir: 'up' }));
                                    }}
                                >
                                    <FaArrowUp className="h-3.5 w-3.5" />
                                </button>

                                <button
                                    disabled={i === resumeData.length - 1}
                                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-600/50 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-30"
                                    onClick={e => {
                                        e.stopPropagation();
                                        dispatch(moveIndex({ tab: stateKey, index: i, dir: 'down' }));
                                    }}
                                >
                                    <FaArrowDown className="h-3.5 w-3.5" />
                                </button>

                                {selectedCard === i ? (
                                    <button
                                        type="button"
                                        className="rounded p-1.5 text-primary-400 transition-colors hover:bg-primary-400/10"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setSelectedCard(null);
                                        }}
                                    >
                                        <TbArrowsMinimize className="h-3.5 w-3.5" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="rounded p-1.5 text-primary-400 transition-colors hover:bg-primary-400/10"
                                    >
                                        <FaPencil className="h-3.5 w-3.5" />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="rounded p-1.5 text-red-400 transition-colors hover:bg-red-400/10"
                                    onClick={e => {
                                        e.stopPropagation();
                                        deleteCard(i);
                                    }}
                                >
                                    <FaTrash className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Expanded content */}
                        {selectedCard === i && (
                            <div className="border-t border-gray-700/50 px-4 py-4">
                                <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                                    {fields.map(field => (
                                        <Input
                                            key={field.name}
                                            {...field}
                                            onChange={e => handleChange(e, i)}
                                            value={resumeData[i][field.name]}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiEditor;
