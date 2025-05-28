import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
        </div>
    );
};

export default Loading;
