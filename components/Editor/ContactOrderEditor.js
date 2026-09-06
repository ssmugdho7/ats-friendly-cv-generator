'use client';

import { useDispatch, useSelector } from 'react-redux';
import { updateResumeValue, updateContactOrder, updatePhoto } from '@/store/slices/resumeSlice';
import ResumeFields from '@/config/ResumeFields';
import { useState, useRef, useEffect } from 'react';

const CONTACT_FIELD_ORDER = ['name', 'email', 'phone', 'phoneCountryCode', 'address', 'linkedin', 'github', 'portfolio'];

const CONTACT_ITEMS = [
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
    { key: 'portfolio', label: 'Portfolio' },
];

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const ContactOrderEditor = () => {
    const dispatch = useDispatch();
    const contact = useSelector(state => state.resume.contact || {});
    const photo = useSelector(state => state.resume.photo);
    const order = contact.order || CONTACT_ITEMS.map(item => item.key);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const move = (index, direction) => {
        const newOrder = [...order];
        const target = index + direction;
        if (target < 0 || target >= newOrder.length) return;
        [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
        dispatch(updateContactOrder(newOrder));
    };

    const handleChange = e => {
        const { name, value } = e.target;
        dispatch(updateResumeValue({ tab: 'contact', name, value }));
    };

    const processFile = async file => {
        if (!file || !file.type.startsWith('image/')) return;
        const base64 = await toBase64(file);
        dispatch(updatePhoto(base64));
    };

    const onDrop = async e => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        await processFile(file);
    };

    const onInputChange = async e => {
        const file = e.target.files?.[0];
        await processFile(file);
        e.target.value = '';
    };

    const removePhoto = () => {
        dispatch(updatePhoto(null));
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 shadow-xl backdrop-blur-sm md:p-6">
                <p className="mb-4 text-sm text-gray-400">
                    Edit your contact details below. Use the arrows to set the order in which these details appear in the PDF contact line.
                </p>
                <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                    {CONTACT_FIELD_ORDER.map(fieldName => {
                        const field = ResumeFields.contact.fields.find(f => f.name === fieldName);
                        if (!field) return null;
                        return (
                            <input
                                key={fieldName}
                                name={fieldName}
                                type={field.type || 'text'}
                                placeholder={field.placeholder}
                                value={contact[fieldName] || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 outline-none focus:border-primary-400"
                            />
                        );
                    })}
                </div>
            </div>

            <div
                onDragOver={e => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`rounded-xl border border-dashed p-6 text-center transition-colors ${
                    dragOver ? 'border-primary-400 bg-primary-400/10' : 'border-gray-600 bg-gray-800/30'
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onInputChange}
                    className="hidden"
                />
                {mounted && photo ? (
                    <div className="flex flex-col items-center gap-3">
                        <img src={photo} alt="Profile preview" className="h-24 w-24 rounded-lg object-cover" />
                        <button
                            type="button"
                            onClick={e => {
                                e.stopPropagation();
                                removePhoto();
                            }}
                            className="text-xs text-red-400 hover:text-red-300"
                        >
                            Remove photo
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                        <span>Drag & drop a profile photo here, or click to browse</span>
                        <span className="text-xs text-gray-500">JPG, PNG, WebP</span>
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 shadow-xl backdrop-blur-sm md:p-6">
                <p className="mb-4 text-sm text-gray-400">
                    Contact line order in PDF: use the arrows to reorder.
                </p>
                <div className="flex flex-col gap-2">
                    {order.map((key, index) => {
                        const item = CONTACT_ITEMS.find(ci => ci.key === key);
                        if (!item) return null;
                        return (
                            <div key={key} className="flex items-center justify-between rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-3">
                                <span className="text-sm text-gray-200">{item.label}</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => move(index, -1)}
                                        disabled={index === 0}
                                        className="rounded-md border border-gray-600 px-2 py-1 text-xs text-gray-300 disabled:opacity-40"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => move(index, 1)}
                                        disabled={index === order.length - 1}
                                        className="rounded-md border border-gray-600 px-2 py-1 text-xs text-gray-300 disabled:opacity-40"
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ContactOrderEditor;
