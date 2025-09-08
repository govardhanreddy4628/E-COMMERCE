import { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdInfo, MdInventory } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi2";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdOutlinePermMedia } from "react-icons/md";

import BasicInfo from "./BasicInfo";
import { sideBarContext } from "../../../../context/sidebarContext";

const TABS = [
    { id: "basic", label: "Basic Info", icon: <MdInfo /> },
    { id: "pricing", label: "Pricing", icon: <BsCurrencyDollar /> },
    { id: "inventory", label: "Inventory", icon: <MdInventory /> },
    { id: "media", label: "Media", icon: <MdOutlinePermMedia /> },
    { id: "seo&tags", label: "SEO&Tags", icon: <HiOutlineTag /> },
];

export default function CreateProduct3() {
    const navigate = useNavigate();
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const [activeTab, setActiveTab] = useState("basic");
    const [wizardMode, setWizardMode] = useState(false);
    const [currentTab, setCurrentTab] = useState("basic");

    const context = useContext(sideBarContext);
    if (!context) { throw new Error('sideBarContext must be used within a Provider') }
    const { setIsExpand } = context;

    useEffect(() => { setIsExpand(false) }, [setIsExpand])

    const [validation, setValidation] = useState<Record<string, boolean>>(
        TABS.reduce((acc, tab) => ({ ...acc, [tab.id]: false }), {})
    );

    // IntersectionObserver for scroll spy
    useEffect(() => {
        if (wizardMode) return; // skip in wizard mode

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveTab(entry.target.id);
                    }
                });
            },
            { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
        );

        Object.values(sectionRefs.current).forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [wizardMode]);

    const scrollToSection = (id: string) => {
        if (wizardMode) {
            setCurrentTab(id);
        } else {
            sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleSave = () => {
        const allValid = Object.values(validation).every(Boolean);
        if (allValid) alert("Product saved successfully!");
        else alert("Please complete all required sections.");
    };

    const validateSection = (id: string, isValid: boolean) => {
        setValidation((prev) => ({ ...prev, [id]: isValid }));
    };

    const nextTab = () => {
        const idx = TABS.findIndex((t) => t.id === currentTab);
        if (idx < TABS.length - 1) setCurrentTab(TABS[idx + 1].id);
    };
    const prevTab = () => {
        const idx = TABS.findIndex((t) => t.id === currentTab);
        if (idx > 0) setCurrentTab(TABS[idx - 1].id);
    };

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
            {/* Breadcrumb */}
            <div className="p-4 border-b bg-white sticky top-0 z-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">← Back</button>
                    <span>/</span>
                    <span className="font-medium text-gray-800">Create Product</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <label>Wizard Mode</label>
                    <input type="checkbox" checked={wizardMode} onChange={(e) => setWizardMode(e.target.checked)} />
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Tabs */}
                <div className="w-64 bg-white border-r p-4 overflow-y-auto hidden md:flex flex-col gap-2 sticky top-16 h-[calc(100vh-4rem)]">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => scrollToSection(tab.id)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md text-left transition-all ${(activeTab === tab.id || currentTab === tab.id)
                                    ? "bg-blue-100 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <span>{tab.label}</span>
                            {!validation[tab.id] && <span className="ml-auto text-red-500 text-xs">⚠️</span>}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-32">
                    {TABS.map((tab) => {
                        const isVisible = wizardMode ? currentTab === tab.id : true;
                        if (!isVisible) return null;

                        return (
                            <section
                                key={tab.id}
                                id={tab.id}
                                ref={(el) => (sectionRefs.current[tab.id] = el)}
                                className="scroll-mt-20"
                            >
                                <h2 className="text-2xl font-bold mb-4">{tab.label}</h2>

                                <BasicInfo validateSection={validateSection} tab={tab} />

                            </section>
                        );
                    })}

                    {wizardMode && (
                        <div className="flex justify-between mt-12">
                            <button onClick={prevTab} disabled={TABS[0].id === currentTab} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={nextTab} disabled={TABS[TABS.length - 1].id === currentTab} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-4 right-4 z-50">
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition">
                    Save Product
                </button>
            </div>
        </div>
    );
}
