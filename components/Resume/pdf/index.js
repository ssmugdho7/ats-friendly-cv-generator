'use client';

import LayoutRouter from './layouts/LayoutRouter';

const PDF = ({ data, size, padding, layout, hiddenSections = [] }) => {
    return (
        <LayoutRouter 
            data={data} 
            size={size} 
            padding={padding}
            layout={layout}
            hiddenSections={hiddenSections}
        />
    );
};

export default PDF;