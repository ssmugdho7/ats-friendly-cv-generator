'use client';

import { useDispatch } from 'react-redux';
import Input from '../UI/Input';
import { useSelector } from 'react-redux';
import { updateResumeValue } from '@/store/slices/resumeSlice';
import ResumeFields from '@/config/ResumeFields';

const SingleEditor = ({ tab }) => {
    const stateKey = tab === 'typography' ? 'font' : tab;
    const { fields } = ResumeFields[stateKey] || {};

    const dispatch = useDispatch();
    const resumeData = useSelector(state => state.resume[stateKey]);

    const handleChange = e => {
        const { name, value } = e.target;

        const numFields = ['size', 'titleSize', 'descSize', 'nameSize', 'breakerSize', 'sectionMarginBefore', 'sectionMarginAfter', 'companySize', 'roleSize', 'imageBottomGap'];
        const coerced = stateKey === 'font' && numFields.includes(name) ? Number(value) || value : value;

        dispatch(
            updateResumeValue({
                tab: stateKey,
                name,
                value: coerced,
            }),
        );
    };

    if (!fields) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {fields.map(field => (
                <Input key={field.name} {...field} onChange={handleChange} value={resumeData?.[field?.name]} />
            ))}
        </div>
    );
};

export default SingleEditor;
