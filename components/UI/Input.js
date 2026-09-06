'use client';

import { twMerge } from 'tailwind-merge';
import { sentenceCase } from 'change-case';
import ContentEditable from 'react-contenteditable';
import { useRef, useState } from 'react';

/** Small Bold / Color toolbar. Buttons use onMouseDown-preventDefault so the
 *  text selection in the field underneath is preserved when they are clicked. */
const RichToolbar = ({ color, setColor, onBold, onColor }) => (
    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <button
            type="button"
            title="Make selected text bold (wraps with **)"
            onMouseDown={e => e.preventDefault()}
            onClick={onBold}
            className="rounded-md border border-gray-600/50 bg-gray-700/50 px-2.5 py-1 font-bold text-gray-200 transition-all hover:border-gray-500 hover:bg-gray-600/50"
        >
            B
        </button>
        <span className="flex items-center gap-1 rounded-md border border-gray-600/50 bg-gray-700/50 px-2 py-1">
            <input
                type="color"
                title="Pick a text color"
                value={color}
                onChange={e => setColor(e.target.value)}
                onMouseDown={e => e.stopPropagation()}
                className="h-4 w-6 cursor-pointer bg-transparent"
            />
            <button
                type="button"
                title="Apply the picked color to the selected text"
                onMouseDown={e => e.preventDefault()}
                onClick={onColor}
                className="font-bold transition-all hover:opacity-80"
                style={{ color }}
            >
                A
            </button>
        </span>
        <span className="text-gray-500">
            **bold** · [color=#e11d48]colored[/color] · one line = one bullet
        </span>
    </div>
);

const Input = ({ label, name, type, placeholder, options, span, rich, value, ...props }) => {
    const inputClassName = `block w-full rounded-lg border border-gray-600/50 bg-gray-700/50 px-3 py-2 text-sm text-gray-100 shadow-sm outline-none backdrop-blur-sm transition-all duration-200 focus:border-primary-500/50 focus:bg-gray-700/75 focus:ring-1 focus:ring-primary-500/20 md:text-base 2xl:p-2.5`;

    const inputRef = useRef(null);
    const textRef = useRef(null);
    const [formatColor, setFormatColor] = useState('#2563eb');

    // Wrap the current selection (plain textarea) with markers.
    const wrapPlain = (before, after) => {
        const el = textRef.current;
        const val = (el ? el.value : value) ?? '';
        const s = el && el.selectionStart != null ? el.selectionStart : val.length;
        const e = el && el.selectionEnd != null ? el.selectionEnd : val.length;
        const selected = val.slice(s, e);
        const next = val.slice(0, s) + before + selected + after + val.slice(e);
        props.onChange({ target: { name, value: next } });
        requestAnimationFrame(() => {
            try {
                if (!el) return;
                el.focus();
                const caret = selected ? s + before.length + selected.length + after.length : s + before.length;
                el.setSelectionRange(caret, caret);
            } catch (_) {}
        });
    };

    // Wrap the current selection (multipoints ContentEditable) with markers.
    const wrapEditable = (before, after) => {
        const el = inputRef.current;
        if (!el) return;
        try {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                if (el.contains(range.commonAncestorContainer)) {
                    const selected = range.toString();
                    const node = document.createTextNode(before + selected + after);
                    range.deleteContents();
                    range.insertNode(node);
                    range.setStartAfter(node);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else {
                    el.appendChild(document.createTextNode(before + after));
                }
            }
        } catch (_) {}
        props.onChange({ target: { name, value: el.innerText } });
    };

    const isEditable = type === 'textarea' && props.multipoints;
    const doBold = () => (isEditable ? wrapEditable('**', '**') : wrapPlain('**', '**'));
    const doColor = () =>
        isEditable
            ? wrapEditable(`[color=${formatColor}]`, '[/color]')
            : wrapPlain(`[color=${formatColor}]`, '[/color]');

    // Props safe to spread onto native inputs (multipoints/rich are editor-only).
    const { multipoints, ...domProps } = props;

    const InputEl = () => {
        // if (type === 'textarea' && props.multipoints) {
        //     return (
        //         <div
        //             contentEditable={true}
        //             role="textbox"
        //             className={twMerge(inputClassName, 'min-h-56 whitespace-pre-wrap text-sm md:min-h-40 md:text-sm')}
        //             {...props}
        //             // onInput={e => {
        //             //     const text = e.target.innerText;
        //             //     console.log(text);
        //             //     props.onChange({ target: { name, value: text } });

        //             // }}

        //             // onKeyDown={e => {console.log('key down')}}
        //         >
        //             <ul className="space-y-2 list-disc">
        //                 {value?.split('\n')?.map((line, index) => (
        //                     <li
        //                         key={index}
        //                         className={
        //                             "relative ml-[10px] leading-[1.35em] before:absolute before:left-[-10px] before:content-['•']"
        //                         }
        //                     >
        //                         {line}
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //     );
        // }

        if (type === 'textarea' && props.multipoints) {
            // <ul className='space-y-1.5 list-disc pl-5'></ul>
            // <li className="relative ml-[10px] leading-[1.35em] before:absolute before:left-[-10px] before:content-['•']"></li>;

            const html = `
                <ul class="space-y-1.5 list-disc pl-4 md:pl-5">
                    ${value
                        ?.split('\n')
                        ?.filter(line => line.trim())
                        ?.map(
                            line => `
                            <li>
                                ${line || ''}${' '}
                            </li>
                            `,
                        )
                        .join('')}
                </ul>
            `;

            return (
                <div>
                    {rich && (
                        <RichToolbar color={formatColor} setColor={setFormatColor} onBold={doBold} onColor={doColor} />
                    )}
                    <ContentEditable
                        role="textbox"
                        html={value && html}
                        innerRef={inputRef}
                        className={twMerge(inputClassName, 'min-h-56  text-sm md:min-h-40 md:text-sm ')}
                        onChange={e => {
                            const text = inputRef.current.innerText;
                            props.onChange({ target: { name, value: text } });
                        }}
                    />
                </div>
            );
        }

        if (type === 'textarea') {
            return (
                <div>
                    {rich && (
                        <RichToolbar color={formatColor} setColor={setFormatColor} onBold={doBold} onColor={doColor} />
                    )}
                    <textarea
                        id={name}
                        name={name}
                        ref={textRef}
                        placeholder={placeholder}
                        className={twMerge(inputClassName, 'min-h-56 text-sm md:min-h-40')}
                        {...domProps}
                    >
                        {value}
                    </textarea>
                </div>
            );
        }

        if (type == 'select') {
            return (
                <select
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className={inputClassName}
                    defaultValue={value}
                    {...domProps}
                >
                    {options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option?.name || option?.value}
                        </option>
                    ))}
                </select>
            );
        }

        if (type == 'color') {
            return (
                <input
                    type={'color'}
                    name={name}
                    id={name}
                    className={twMerge(inputClassName, 'py-1')}
                    placeholder={placeholder || `Enter ${label}`}
                    {...domProps}
                />
            );
        }

        if (type === 'checkbox') {
            return (
                <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-gray-200 md:text-base">
                    <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={value ?? true}
                        onChange={e =>
                            domProps.onChange && domProps.onChange({ target: { name, value: e.target.checked } })
                        }
                        className="h-4 w-4 shrink-0 accent-emerald-500"
                    />
                    <span>
                        {label ?? sentenceCase(name)} {domProps.required && '*'}
                    </span>
                </label>
            );
        }

        return (
            <input
                type={type ?? 'text'}
                name={name}
                id={name}
                // className={inputClassName}
                className={inputClassName}
                placeholder={placeholder || `Enter ${label}`}
                defaultValue={type === 'file' ? undefined : props.defaultValue}
                value={value}
                {...domProps}
            />
        );
    };

    return (
        <div className={`${span ? 'md:col-span-2' : ''}`}>
            {label && type !== 'checkbox' && (
                <label htmlFor={name} className="mb-0.5 block text-xs text-gray-300 md:text-sm 2xl:text-base">
                    {label ?? sentenceCase(name)} {props.required && '*'}
                </label>
            )}

            {InputEl()}
        </div>
    );
};

export default Input;
