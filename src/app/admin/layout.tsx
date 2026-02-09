"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FolderTree, Package, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && !pathname.includes("/admin/login")) {
                router.push("/admin/login");
            } else {
                setUser(session?.user || null);
            }
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (!session && !pathname.includes("/admin/login")) {
                router.push("/admin/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    // If login page, don't show sidebar
    if (pathname.includes("/admin/login")) {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Categories", href: "/admin/categories", icon: FolderTree },
        { name: "Products", href: "/admin/products", icon: Package },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0">
                <div className="p-8 border-b border-gray-50">
                    <Link href="/" className="text-xl font-serif tracking-widest uppercase font-semibold">
                        SOOCCI
                    </Link>
                    <p className="text-[8px] tracking-[0.4em] uppercase text-gray-400 mt-2">Admin Panel</p>
                </div>

                <nav className="flex-grow p-6 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 p-4 text-[10px] uppercase tracking-widest transition-colors",
                                pathname === item.href
                                    ? "bg-black text-white font-bold"
                                    : "text-gray-500 hover:bg-gray-50"
                            )}
                        >
                            <item.icon size={16} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-4 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 w-full transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 p-12">
                {children}
            </main>
        </div>
    );
}
