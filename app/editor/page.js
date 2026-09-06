import dynamic from 'next/dynamic';
import Editor from '@/components/Editor';
import Tabs from '@/components/Tabs';

const Preview = dynamic(() => import('@/components/Resume/Preview'), {
    ssr: false,
    loading: () => (
        <div className="flex min-h-[40rem] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-400 border-t-transparent" />
                <span className="text-sm text-gray-400">Loading editor...</span>
            </div>
        </div>
    ),
});

const page = ({ searchParams: { tab = 'contact' } }) => {
    return (
        <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-6">
            {/* Editor Panel - Left */}
            <div className="flex min-w-0 flex-1 flex-col lg:max-w-[55%]">
                <Tabs activeTab={tab} />
                <div className="flex-1">
                    <Editor tab={tab} />
                </div>
            </div>

            {/* Preview Panel - Right */}
            <div className="flex min-w-0 flex-1 flex-col lg:sticky lg:top-6 lg:max-h-[calc(100vh-4.5rem)] lg:self-start">
                <Preview />
            </div>
        </div>
    );
};

export default page;
