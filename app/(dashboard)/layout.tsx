import { Header } from "@/components/layouts/header";
import { Sidebar } from "@/components/layouts/sidebar";
import { ReactNode } from "react";


export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
