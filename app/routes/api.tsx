import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Copy, Check, ArrowRight, Code2, Image, Lock, Gauge, Zap, Terminal } from "lucide-react";
import { useState, useCallback } from "react";
// Asumo que tu botón UI sigue existiendo, aunque en este diseño usaremos clases Tailwind para los enlaces principales
// import Button from "@/components/ui/Button";

export function meta() {
    return [
        { title: "Sketchify API – Transform Floor Plans into 3D Renders" },
        { name: "description", content: "Use the Sketchify API to convert 2D floor plans into photorealistic 3D architectural renders programmatically." },
    ];
}

const API_BASE = "https://your-sketchify-instance.puter.site";

// ... (Mantén tus arrays 'endpoints', 'features' y 'stats' exactamente igual que en tu código original)
const endpoints = [
    {
        method: "POST" as const,
        path: "/api/render",
        title: "Generate 3D Render",
        description: "Convert a 2D floor plan image into a photorealistic 3D architectural render.",
        request: `curl -X POST ${API_BASE}/api/render \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "image": "data:image/png;base64,iVBOR...",\n    "options": {\n      "width": 1024,\n      "height": 1024,\n      "style": "photorealistic"\n    }\n  }'`,
        response: `{\n  "success": true,\n  "data": {\n    "id": "render_abc123",\n    "renderedImage": "data:image/png;base64,iVBOR...",\n    "metadata": {\n      "width": 1024,\n      "height": 1024,\n      "processingTime": 12400\n    }\n  }\n}`
    },
    {
        method: "POST" as const,
        path: "/api/projects",
        title: "Create Project",
        description: "Save a floor plan and its render as a project for later retrieval.",
        request: `curl -X POST ${API_BASE}/api/projects \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Modern Villa",\n    "sourceImage": "data:image/png;base64,iVBOR...",\n    "visibility": "private"\n  }'`,
        response: `{\n  "success": true,\n  "data": {\n    "id": "proj_xyz789",\n    "name": "Modern Villa",\n    "sourceImage": "https://cdn.sketchify.app/...",\n    "renderedImage": null,\n    "timestamp": 1712678400000\n  }\n}`
    },
    {
        method: "GET" as const,
        path: "/api/projects/:id",
        title: "Get Project",
        description: "Retrieve a specific project by its ID.",
        request: `curl ${API_BASE}/api/projects/proj_xyz789 \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{\n  "success": true,\n  "data": {\n    "id": "proj_xyz789",\n    "name": "Modern Villa",\n    "sourceImage": "https://cdn.sketchify.app/...",\n    "renderedImage": "https://cdn.sketchify.app/...",\n    "timestamp": 1712678400000,\n    "isPublic": false\n  }\n}`
    },
    {
        method: "GET" as const,
        path: "/api/projects",
        title: "List Projects",
        description: "Retrieve all projects for the authenticated user.",
        request: `curl ${API_BASE}/api/projects \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{\n  "success": true,\n  "data": {\n    "projects": [\n      {\n        "id": "proj_xyz789",\n        "name": "Modern Villa",\n        "timestamp": 1712678400000\n      }\n    ],\n    "total": 1\n  }\n}`
    }
];

const features = [
    { icon: Zap, title: "AI-Powered Renders", description: "Convert floor plans to photorealistic 3D in seconds." },
    { icon: Lock, title: "Secure & Private", description: "Enterprise-grade security with Puter authentication." },
    { icon: Image, title: "Multiple Formats", description: "Support for JPG, PNG, WebP with flexible sizing." },
    { icon: Gauge, title: "Production Ready", description: "Optimized for scale with intelligent caching." },
];

const stats = [
    { label: "API Endpoints", value: "4" },
    { label: "Max File Size", value: "50 MB" },
    { label: "Output Resolution", value: "1024×1024" },
    { label: "Response Time", value: "~12s" },
];

const methodColors: Record<string, string> = {
    GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
    POST: "bg-blue-100 text-blue-700 border-blue-200",
    PUT: "bg-yellow-100 text-yellow-700 border-yellow-200",
    DELETE: "bg-red-100 text-red-700 border-red-200",
};

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [text]);

    return (
        <button 
            onClick={handleCopy} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            title="Copy to clipboard"
        >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

function EndpointCard({ endpoint }: { endpoint: typeof endpoints[0] }) {
    const [activeTab, setActiveTab] = useState<"request" | "response">("request");

    return (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-zinc-100">
                <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${methodColors[endpoint.method]}`}>
                        {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-zinc-700 bg-zinc-100 px-2 py-1 rounded">
                        {endpoint.path}
                    </code>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">{endpoint.title}</h3>
                <p className="text-zinc-600">{endpoint.description}</p>
            </div>

            <div className="bg-zinc-50 p-6">
                <div className="flex border-b border-zinc-100 mb-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "request" ? "border-orange-500 text-orange-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}
                        onClick={() => setActiveTab("request")}
                    >
                        Request
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "response" ? "border-orange-500 text-orange-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}
                        onClick={() => setActiveTab("response")}
                    >
                        Response
                    </button>
                </div>

                <div className="bg-zinc-950 rounded-lg overflow-hidden shadow-inner">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                        <span className="text-xs font-mono text-zinc-400">
                            {activeTab === "request" ? "cURL" : "JSON"}
                        </span>
                        <CopyButton text={activeTab === "request" ? endpoint.request : endpoint.response} />
                    </div>
                    <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
                        <code>{activeTab === "request" ? endpoint.request : endpoint.response}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default function ApiPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-medium mb-6">
                    <Code2 size={16} />
                    <span>API Reference</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 font-serif">
                    Sketchify API
                </h1>
                <p className="text-lg md:text-xl text-zinc-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                    Transform 2D floor plans into photorealistic 3D architectural renders programmatically. Integrate Sketchify's AI engine into your own applications seamlessly.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="#endpoints" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                        View Endpoints <ArrowRight size={18} />
                    </a>
                    <a href="#quickstart" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-zinc-700 border border-zinc-300 font-medium rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
                        <Terminal size={18} /> Quick Start
                    </a>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-zinc-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-zinc-900 mb-3 font-serif">Built for developers</h2>
                        <p className="text-zinc-600 text-lg">Everything you need to integrate AI-powered 3D renders into your applications.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
                                <div className="w-10 h-10 flex items-center justify-center bg-orange-50 text-orange-600 rounded-md mb-4">
                                    <feature.icon size={20} />
                                </div>
                                <h3 className="text-base font-bold text-zinc-900 mb-2">{feature.title}</h3>
                                <p className="text-zinc-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quickstart Section */}
            <section id="quickstart" className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-zinc-900 mb-3 font-serif">Get started in minutes</h2>
                        <p className="text-zinc-600 text-lg">Three simple steps to integrate the Sketchify API.</p>
                    </div>

                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">1</div>
                                <div className="w-0.5 h-16 bg-zinc-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <h3 className="text-lg font-bold text-zinc-900 mb-2">Authenticate with Puter</h3>
                                <p className="text-zinc-600 mb-4">Sign in to your Puter account. Your browser session is automatically recognized by the API—no API keys needed.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">2</div>
                                <div className="w-0.5 h-16 bg-zinc-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <h3 className="text-lg font-bold text-zinc-900 mb-2">Prepare your floor plan</h3>
                                <p className="text-zinc-600 mb-4">Convert your floor plan image to Base64. Supports JPG, PNG, WebP (max 50MB).</p>
                                <div className="bg-zinc-950 rounded-lg overflow-hidden shadow-md">
                                    <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                                        <span className="text-xs font-mono text-zinc-400">JavaScript</span>
                                        <CopyButton text={`const reader = new FileReader();\nreader.readAsDataURL(file);\nreader.onload = () => console.log(reader.result);`} />
                                    </div>
                                    <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
                                        <code>{`const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => console.log(reader.result);`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">3</div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-zinc-900 mb-2">Call the API</h3>
                                <p className="text-zinc-600 mb-4">Send your floor plan to the render endpoint and get a photorealistic 3D visualization.</p>
                                <div className="bg-zinc-950 rounded-lg overflow-hidden shadow-md">
                                    <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                                        <span className="text-xs font-mono text-zinc-400">cURL</span>
                                        <CopyButton text={`curl -X POST ${API_BASE}/api/render \\\n  -H "Content-Type: application/json" \\\n  -d '{"image": "data:image/png;base64,..."}'\n`} />
                                    </div>
                                    <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
                                        <code>{`curl -X POST ${API_BASE}/api/render \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/png;base64,..."}'`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Endpoints Section */}
            <section id="endpoints" className="py-20 px-6 bg-zinc-50">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-zinc-900 mb-3 font-serif">API Endpoints</h2>
                        <p className="text-zinc-600 text-lg">Complete reference for all available operations.</p>
                    </div>

                    <div className="space-y-6">
                        {endpoints.map((endpoint) => (
                            <EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-xl p-10 md:p-14 text-center shadow-lg">
                    <h2 className="text-3xl font-bold text-zinc-900 mb-3 font-serif">Ready to integrate?</h2>
                    <p className="text-zinc-600 text-lg mb-8 max-w-2xl mx-auto">Start building with the Sketchify API today. No credit card required.</p>
                    <a href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-md">
                        Get Started <ArrowRight size={18} />
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}