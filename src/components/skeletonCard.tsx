import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
    return (
        <div className="p-4 border rounded-md shadow-md bg-white space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
};

export default SkeletonCard;
