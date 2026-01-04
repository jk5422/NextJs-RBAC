import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersTableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between">
                <Skeleton className="h-6 w-40" />
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <div className="p-4 space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-4 gap-4 items-center"
                        >
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-24 ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
