import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function meta() {
    return [
        { title: "Privacy Policy – Sketchify" },
        { name: "description", content: "Privacy policy for Sketchify. Learn how we collect, use, and protect your data." },
    ];
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold text-zinc-900 mb-8 font-serif">Privacy Policy</h1>

                <div className="prose prose-zinc max-w-none">
                    <p className="text-lg text-zinc-600 mb-8">Last updated: April 2026</p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">1. Introduction</h2>
                    <p className="text-zinc-600 mb-4">
                        Sketchify ("we," "us," or "our") operates to transform floor plans into 3D renders. This Privacy Policy explains our practices regarding data collection, use, and protection.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">2. Information We Collect</h2>
                    <p className="text-zinc-600 mb-4">We collect information in several ways:</p>
                    <ul className="list-disc list-inside mb-4 text-zinc-600 space-y-2">
                        <li><strong>Authentication Data:</strong> Via Puter, including your username and authentication tokens</li>
                        <li><strong>Floor Plan Images:</strong> Images you upload for 3D rendering</li>
                        <li><strong>Usage Data:</strong> API requests, rendering history, and project information</li>
                        <li><strong>Device Information:</strong> Browser type, IP address, and access times</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">3. How We Use Your Data</h2>
                    <p className="text-zinc-600 mb-4">Your data is used to:</p>
                    <ul className="list-disc list-inside mb-4 text-zinc-600 space-y-2">
                        <li>Provide and improve our rendering services</li>
                        <li>Process your floor plans into 3D renders</li>
                        <li>Maintain your project history and preferences</li>
                        <li>Monitor API usage and service performance</li>
                        <li>Communicate important service updates</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">4. Data Security</h2>
                    <p className="text-zinc-600 mb-4">
                        We implement industry-standard security measures including encryption in transit and at rest. Your data is stored securely and accessed only by authorized personnel.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">5. Third-Party Services</h2>
                    <p className="text-zinc-600 mb-4">
                        We use Puter for authentication. Their privacy practices govern your authentication data. We recommend reviewing their privacy policy.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">6. Your Rights</h2>
                    <p className="text-zinc-600 mb-4">You have the right to:</p>
                    <ul className="list-disc list-inside mb-4 text-zinc-600 space-y-2">
                        <li>Access your personal data</li>
                        <li>Request data deletion</li>
                        <li>Opt-out of non-essential communications</li>
                        <li>Data portability requests</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">7. Contact Us</h2>
                    <p className="text-zinc-600 mb-4">
                        For privacy concerns, contact us at: <strong>privacy@sketchify.com</strong>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
