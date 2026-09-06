'use client';

import { useDispatch } from 'react-redux';
import Input from '../UI/Input';
import { useSelector } from 'react-redux';
import { updateResumeValue } from '@/store/slices/resumeSlice';
import ResumeFields from '@/config/ResumeFields';

const SingleEditor = ({ tab }) => {
    const { fields } = ResumeFields[tab];

    const dispatch = useDispatch();
    const resumeData = useSelector(state => state.resume[tab]);

    const handleChange = e => {
        const { name, value } = e.target;

        // Font tab: coerce number fields back to numbers.
        const numFields = ['size', 'titleSize', 'descSize', 'nameSize', 'sectionGap', 'sectionMarginBefore', 'sectionMarginAfter'];
        const coerced = tab === 'font' && numFields.includes(name) ? Number(value) || value : value;

        dispatch(
            updateResumeValue({
                tab,
                name,
                value: coerced,
            }),
        );
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {fields.map(field => (
                <Input key={field.name} {...field} onChange={handleChange} value={resumeData?.[field?.name]} />
            ))}
        </div>
    );
};

export default SingleEditor;
