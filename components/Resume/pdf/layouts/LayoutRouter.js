/**
 * LayoutRouter — switches between the five layout components based on
 * the `layout` field in Redux state. Each layout reads the same normalized
 * data schema; switching layouts never touches data entry or storage.
 */
import SidebarExecutiveLayout from './SidebarExecutive';
import PhotoHeaderLayout from './PhotoHeader';
import MinimalTimelineLayout from './MinimalTimeline';
import IconStatHighlightLayout from './IconStatHighlight';
import CompactSidebarLayout from './CompactSidebar';
import { normalizeResume, getLayoutTheme } from './normalize';
import { DEFAULT_LAYOUT } from '@/config/layouts';

const LAYOUT_COMPONENTS = {
    'sidebar-executive': SidebarExecutiveLayout,
    'photo-header': PhotoHeaderLayout,
    'minimal-timeline': MinimalTimelineLayout,
    'stat-highlight': IconStatHighlightLayout,
    'compact-sidebar': CompactSidebarLayout,
};

const LayoutRouter = ({ data, size, padding }) => {
    const layoutKey = data?.layout || DEFAULT_LAYOUT;
    const Layout = LAYOUT_COMPONENTS[layoutKey] || LAYOUT_COMPONENTS[DEFAULT_LAYOUT];
    const normalized = normalizeResume(data);
    const theme = getLayoutTheme(data?.template);

    return <Layout data={normalized} theme={theme} size={size} padding={padding} />;
};

export default LayoutRouter;
