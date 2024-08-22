'use client'
import { createContext, useState } from "react";
import Header from "./_components/Header";
import { TabSection } from "./_components/Tabs";

export const showBar = createContext<any>(null);

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [value, setValue] = useState(false);

    return (
        <showBar.Provider value={{ value, setValue }}>
            <div className="">
                <Header />
                <div className="flex gap-2">
                    <div className={`flex-1 ${value ? 'md:block hidden' : 'flex-1'}`}>
                        {children}
                    </div>
                    <div className={`flex items-center justify-center h-[80vh] ${value ? 'sm:w-[26vw] w-full' : 'hidden'}`}>
                        <TabSection />
                    </div>
                </div>
            </div>
        </showBar.Provider>
    );
}
