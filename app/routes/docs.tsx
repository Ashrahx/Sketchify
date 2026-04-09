import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Copy, Check, Code2, AlertCircle, HelpCircle, Terminal } from "lucide-react";
import { useState, useCallback } from "react";

export function meta() {
    return [
        { title: "Sketchify Documentation – Guides & Tutorials" },
        { name: "description", content: "Complete documentation, tutorials, and guides for integrating Sketchify API into your application." },
    ];
}

const API_BASE = "https://your-sketchify-instance.puter.site";

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

export default function DocsPage() {
    const [activeFramework, setActiveFramework] = useState("react");

    const frameworks = {
        react: {
            name: "React",
            code: `import { useState } from 'react';

export function FloorPlanUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleRender = async () => {
        setLoading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const response = await fetch('${API_BASE}/api/render', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: reader.result,
                        options: { width: 1024, height: 1024 }
                    })
                });
                const data = await response.json();
                setResult(data.data.renderedImage);
            };
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
            <button onClick={handleRender} disabled={!file || loading}>
                {loading ? 'Rendering...' : 'Generate 3D'}
            </button>
            {result && <img src={result} alt="3D Render" />}
        </div>
    );
}`
        },
        vue: {
            name: "Vue 3",
            code: `<script setup>
import { ref } from 'vue';

const file = ref(null);
const loading = ref(false);
const result = ref(null);

const handleRender = async () => {
    loading.value = true;
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file.value);
        reader.onload = async () => {
            const response = await fetch('${API_BASE}/api/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: reader.result,
                    options: { width: 1024, height: 1024 }
                })
            });
            const data = await response.json();
            result.value = data.data.renderedImage;
        };
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <input type="file" @change="(e) => file = e.target.files[0]" />
        <button @click="handleRender" :disabled="!file || loading">
            {{ loading ? 'Rendering...' : 'Generate 3D' }}
        </button>
        <img v-if="result" :src="result" alt="3D Render" />
    </div>
</template>`
        },
        vanilla: {
            name: "Vanilla JS",
            code: `const fileInput = document.querySelector('input[type="file"]');
const button = document.querySelector('button');
const resultImg = document.querySelector('img');

button.addEventListener('click', async () => {
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    reader.onload = async () => {
        button.disabled = true;
        button.textContent = 'Rendering...';
        
        try {
            const response = await fetch('${API_BASE}/api/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: reader.result,
                    options: { width: 1024, height: 1024 }
                })
            });
            
            const data = await response.json();
            resultImg.src = data.data.renderedImage;
        } finally {
            button.disabled = false;
            button.textContent = 'Generate 3D';
        }
    };
});`
        }
    };

    const faqItems = [
        {
            question: "¿Cuál es el tamaño máximo de archivo?",
            answer: "El tamaño máximo permitido es de 50MB. Para archivos más grandes, considera comprimir la imagen o reducir la resolución."
        },
        {
            question: "¿Cuánto tiempo tarda en generar un render?",
            answer: "Típicamente entre 8-15 segundos dependiendo de la complejidad del plano. Los planos más complejos pueden tomar más tiempo."
        },
        {
            question: "¿Qué formatos de imagen se aceptan?",
            answer: "Aceptamos JPG, PNG y WebP. Recomendamos PNG para mejor calidad y WebP para menor tamaño de archivo."
        },
        {
            question: "¿Hay límite de requests por día?",
            answer: "Depende de tu plan. Consulta la página de Pricing para detalles específicos de cada tier."
        },
        {
            question: "¿Puedo obtener renders de mayor resolución?",
            answer: "Por defecto ofrecemos 1024×1024. Para mayores resoluciones, contacta a nuestro equipo de soporte."
        }
    ];

    const troubleshootingItems = [
        {
            title: "Error 400: Invalid image format",
            solution: "Asegúrate de que el archivo está en formato Base64 correcto. Verifica que el MIME type es correcto (image/jpeg, image/png, etc.)."
        },
        {
            title: "Error 413: Payload too large",
            solution: "El archivo excede el límite de 50MB. Reduce el tamaño comprimiendo la imagen o usando un formato más eficiente como WebP."
        },
        {
            title: "Error 401: Unauthorized",
            solution: "Tu sesión de Puter ha expirado. Intenta hacer logout y login nuevamente desde la aplicación principal."
        },
        {
            title: "Timeout después de 30 segundos",
            solution: "El plano es muy complejo. Intenta simplificar el diseño o dividirlo en secciones más pequeñas."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-medium mb-6">
                        <Code2 size={16} />
                        <span>Documentation</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 mb-4 font-serif">Learn Sketchify</h1>
                    <p className="text-xl text-zinc-600 leading-relaxed">Complete guides, tutorials, and best practices for integrating AI-powered 3D rendering into your application.</p>
                </div>
            </section>

            {/* Tutorial Section */}
            <section className="py-20 px-6 bg-zinc-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-zinc-900 mb-8 font-serif">Step-by-step Tutorial</h2>
                    
                    <div className="space-y-8">
                        {[
                            { num: 1, title: "Setup Authentication", desc: "Make sure you're signed into Puter. The API uses your browser session for authentication." },
                            { num: 2, title: "Prepare Your Floor Plan", desc: "Convert your floor plan image to Base64 format. Support JPG, PNG, WebP up to 50MB." },
                            { num: 3, title: "Create Project (Optional)", desc: "Save your floor plan as a project for future reference and comparisons." },
                            { num: 4, title: "Generate 3D Render", desc: "Send the floor plan to the render API and receive a photorealistic 3D visualization." },
                            { num: 5, title: "Handle the Response", desc: "Process the rendered image. Save it, display it, or integrate into your workflow." },
                        ].map((step) => (
                            <div key={step.num} className="flex gap-6">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white font-bold">
                                        {step.num}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-zinc-900 mb-2">{step.title}</h3>
                                    <p className="text-zinc-600">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Framework Guides */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-zinc-900 mb-8 font-serif">Framework Integration Guides</h2>
                    
                    <div className="flex gap-4 mb-8 border-b border-zinc-200">
                        {Object.entries(frameworks).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => setActiveFramework(key)}
                                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                                    activeFramework === key
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-zinc-600 hover:text-zinc-900"
                                }`}
                            >
                                {value.name}
                            </button>
                        ))}
                    </div>

                    <div className="bg-zinc-950 rounded-lg overflow-hidden shadow-lg">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                            <span className="text-sm font-mono text-zinc-400">{frameworks[activeFramework as keyof typeof frameworks].name}</span>
                            <CopyButton text={frameworks[activeFramework as keyof typeof frameworks].code} />
                        </div>
                        <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
                            <code>{frameworks[activeFramework as keyof typeof frameworks].code}</code>
                        </pre>
                    </div>
                </div>
            </section>

            {/* Troubleshooting */}
            <section className="py-20 px-6 bg-zinc-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-zinc-900 mb-8 font-serif">Troubleshooting</h2>
                    
                    <div className="space-y-6">
                        {troubleshootingItems.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg border border-red-100">
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-zinc-900 mb-2">{item.title}</h3>
                                        <p className="text-zinc-600">{item.solution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-zinc-900 mb-8 font-serif">Frequently Asked Questions</h2>
                    
                    <div className="space-y-6">
                        {faqItems.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg border border-zinc-200">
                                <div className="flex items-start gap-4">
                                    <HelpCircle className="text-orange-500 shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-zinc-900 mb-2">{item.question}</h3>
                                        <p className="text-zinc-600">{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 bg-zinc-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-3 font-serif">Still have questions?</h2>
                    <p className="text-zinc-600 mb-6">Check out the API documentation or contact our support team.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="/api" className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
                            API Reference
                        </a>
                        <a href="mailto:hello@sketchify.com" className="inline-flex items-center justify-center px-6 py-3 bg-white text-zinc-700 border border-zinc-300 font-medium rounded-lg hover:bg-zinc-50 transition-colors">
                            Contact Support
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
