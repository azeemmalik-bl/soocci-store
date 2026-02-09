"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400 mb-12">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link href="/product" className="hover:text-black transition-colors">Products</Link>

            {items.map((item, index) => (
                <React.Fragment key={item.href}>
                    <ChevronRight size={10} />
                    {index === items.length - 1 ? (
                        <span className="text-black font-semibold">{item.name}</span>
                    ) : (
                        <Link href={item.href} className="hover:text-black transition-colors">
                            {item.name}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

import React from "react";
