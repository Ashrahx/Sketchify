import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function meta() {
    return [
        { title: "Terms of Service – Sketchify" },
        { name: "description", content: "Terms of Service for Sketchify. Read our terms and conditions for using our platform." },
    ];
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold text-zinc-900 mb-8 font-serif">Terms of Service</h1>

                <div className="prose prose-zinc max-w-none">
                    <p className="text-lg text-zinc-600 mb-8">Last updated: April 2026</p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-zinc-600 mb-4">
                        By accessing and using Sketchify, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">2. Use License</h2>
                    <p className="text-zinc-600 mb-4">
                        Permission is granted to temporarily download one copy of the materials (information or software) on Sketchify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-zinc-600 space-y-2">
                        <li>Modify or copy the materials</li>
                        <li>Use the materials for any commercial purpose</li>
                        <li>Attempt to decompile or reverse engineer software</li>
                        <li>Remove any copyright or proprietary notations</li>
                        <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">3. API Usage</h2>
                    <p className="text-zinc-600 mb-4">
                        When using the Sketchify API, you agree to use it only for authorized purposes. You may not:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-zinc-600 space-y-2">
                        <li>Exceed rate limits or quotas</li>
                        <li>Use the API to process illegal content</li>
                        <li>Reverse engineer or attempt to extract proprietary algorithms</li>
                        <li>Distribute or resell the API without authorization</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">4. Disclaimer</h2>
                    <p className="text-zinc-600 mb-4">
                        The materials on Sketchify are provided "as is". Sketchify makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">5. Limitations</h2>
                    <p className="text-zinc-600 mb-4">
                        In no event shall Sketchify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Sketchify.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">6. Accuracy of Materials</h2>
                    <p className="text-zinc-600 mb-4">
                        The materials appearing on Sketchify could include technical, typographical, or photographic errors. Sketchify does not warrant that any of the materials are accurate, complete, or current.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">7. Modifications</h2>
                    <p className="text-zinc-600 mb-4">
                        Sketchify may revise these terms of service for our websites at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">8. Governing Law</h2>
                    <p className="text-zinc-600 mb-4">
                        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where Sketchify operates.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">9. Contact Information</h2>
                    <p className="text-zinc-600 mb-4">
                        If you have any questions about these Terms, please contact us at: <strong>legal@sketchify.com</strong>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
