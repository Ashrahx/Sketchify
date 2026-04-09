import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function meta() {
    return [
        { title: "Cookie Policy – Sketchify" },
        { name: "description", content: "Cookie Policy for Sketchify. Learn about the cookies we use and how to manage them." },
    ];
}

export default function CookiePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold text-zinc-900 mb-8 font-serif">Cookie Policy</h1>

                <div className="prose prose-zinc max-w-none">
                    <p className="text-lg text-zinc-600 mb-8">Last updated: April 2026</p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">1. What Are Cookies?</h2>
                    <p className="text-zinc-600 mb-4">
                        Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">2. Types of Cookies We Use</h2>
                    
                    <h3 className="text-xl font-semibold text-zinc-900 mt-6 mb-3">Essential Cookies</h3>
                    <p className="text-zinc-600 mb-4">
                        These cookies are necessary for the website to function properly. They enable core functionality like authentication and security.
                    </p>

                    <h3 className="text-xl font-semibold text-zinc-900 mt-6 mb-3">Performance Cookies</h3>
                    <p className="text-zinc-600 mb-4">
                        These cookies collect information about how you use our website, such as pages visited and time spent. This helps us improve our services.
                    </p>

                    <h3 className="text-xl font-semibold text-zinc-900 mt-6 mb-3">Functional Cookies</h3>
                    <p className="text-zinc-600 mb-4">
                        These cookies remember your choices and preferences to provide a personalized experience.
                    </p>

                    <h3 className="text-xl font-semibold text-zinc-900 mt-6 mb-3">Analytics Cookies</h3>
                    <p className="text-zinc-600 mb-4">
                        We use analytics tools to understand user behavior and improve our platform. These may include third-party analytics providers.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">3. Third-Party Cookies</h2>
                    <p className="text-zinc-600 mb-4">
                        Some cookies are set by third-party services we use, such as:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-zinc-600 space-y-2">
                        <li>Analytics platforms (to measure usage)</li>
                        <li>Authentication services (to verify your identity)</li>
                        <li>Content delivery networks (to optimize performance)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">4. Managing Cookies</h2>
                    <p className="text-zinc-600 mb-4">
                        Most browsers allow you to refuse cookies or alert you when cookies are being sent. You can typically find these settings in your browser's options or preferences menu.
                    </p>
                    <p className="text-zinc-600 mb-4">
                        <strong>Note:</strong> Disabling essential cookies may impair website functionality.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">5. Cookie Retention</h2>
                    <p className="text-zinc-600 mb-4">
                        Essential and functional cookies are retained for as long as needed to provide our services. Analytics cookies are typically retained for up to 2 years.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">6. Updates to This Policy</h2>
                    <p className="text-zinc-600 mb-4">
                        We may update this Cookie Policy periodically. We recommend reviewing it regularly for any changes.
                    </p>

                    <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">7. Contact Us</h2>
                    <p className="text-zinc-600 mb-4">
                        For questions about our Cookie Policy, please contact us at: <strong>privacy@sketchify.com</strong>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
