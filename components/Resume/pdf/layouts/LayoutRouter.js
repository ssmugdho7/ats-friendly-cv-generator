'use client';

import { useState } from 'react';
import ClassicLayout from './ClassicLayout';
import PhotoHeaderLayout from './PhotoHeader';

const layoutComponents = {
    classic: ClassicLayout,
    modern: PhotoHeaderLayout,
};

const LayoutRouter = ({ data, size, padding, layout, hiddenSections = [] }) => {
    const [currentLayout, setCurrentLayout] = useState(layout || 'classic');

    const LayoutComponent = layoutComponents[currentLayout] || layoutComponents['classic'];

    return <LayoutComponent data={data} size={size} padding={padding} hiddenSections={hiddenSections} />;
};

export default LayoutRouter;