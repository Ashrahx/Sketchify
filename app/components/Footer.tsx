import { Link } from "react-router";
import { Mail, Phone, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-100 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/logo-white.svg"
              alt="Sketchify Logo"
              className="footer-logo mb-4"
            />
            <p className="text-zinc-400 text-sm leading-relaxed">
              Transform floor plans into photorealistic 3D renders with AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  API Docs
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              {/* TODO: Pricing page - Future expansion */}
              {/* <li>
                <a
                  href="/pricing"
                  className="text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Pricing
                </a>
              </li> */}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {/* TODO: Help Center - Future expansion */}
              {/* <li>
                <a
                  href="/help"
                  className="text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Help Center
                </a>
              </li> */}
              <li>
                <Link
                  to="/docs"
                  className="text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Troubleshooting
                </Link>
              </li>
              <li>
                <a
                  href="mailto:ashraahx@gmail.com"
                  className="text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:ashraahx@gmail.com"
                  className="flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  <Mail size={16} />
                  ashraahx@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+528662108600"
                  className="flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors text-sm"
                >
                  <Phone size={16} />
                  +52 866 210 8600
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Bottom */}
        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-orange-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-orange-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-orange-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
              <a
                href="/legal"
                className="hover:text-orange-400 transition-colors"
              >
                Políticas Legales
              </a>
              <span className="text-zinc-700">•</span>
              <a
                href="/legal"
                className="hover:text-orange-400 transition-colors"
              >
                Privacidad
              </a>
              <span className="text-zinc-700">•</span>
              <a
                href="/legal"
                className="hover:text-orange-400 transition-colors"
              >
                Términos
              </a>
              <span className="text-zinc-700">•</span>
              <a
                href="/legal"
                className="hover:text-orange-400 transition-colors"
              >
                Cookies
              </a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-zinc-500">
              © 2026 Sketchify. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
