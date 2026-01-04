"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { logout } from "@/lib/logout";

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: false,
                        onError: (error: any) => {
                            // 🔐 Global 401 handling
                            if (error?.message === "Unauthorized") {
                                toast.error("Session expired. Please login again.");
                                logout();
                            }
                        },
                    },
                    mutations: {
                        onError: (error: any) => {
                            if (error?.message === "Unauthorized") {
                                toast.error("Session expired. Please login again.");
                                logout();
                            }
                        },
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster richColors position="top-right" />
        </QueryClientProvider>
    );
}
