import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone } from "lucide-react";

export function meta() {
    return [
        { title: "Políticas Legales – Sketchify" },
        { name: "description", content: "Política de Privacidad, Términos de Servicio y Política de Cookies de Sketchify." },
    ];
}

type Section = "privacy" | "terms" | "cookies";

export default function LegalPage() {
    const [activeSection, setActiveSection] = useState<Section>("privacy");

    const sections: { id: Section; title: string; label: string }[] = [
        { id: "privacy", title: "Política de Privacidad", label: "Privacidad" },
        { id: "terms", title: "Términos de Servicio", label: "Términos" },
        { id: "cookies", title: "Política de Cookies", label: "Cookies" },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 w-full">
                {/* Hero Section */}
                <section className="pt-32 pb-16 px-6 bg-linear-to-br from-zinc-900 to-zinc-800 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Políticas Legales
                        </h1>
                        <p className="text-zinc-300 text-lg">
                            Información importante sobre privacidad, términos de servicio y uso de cookies
                        </p>
                    </div>
                </section>

                {/* Navigation Tabs */}
                <div className="sticky top-0 bg-white border-b border-zinc-200 z-40">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="flex gap-1 -mb-px overflow-x-auto">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`px-6 py-4 font-semibold transition-all whitespace-nowrap border-b-2 ${
                                        activeSection === section.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-zinc-600 hover:text-zinc-900"
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <main className="max-w-4xl mx-auto px-6 py-12">
                    {/* Privacy Policy */}
                    {activeSection === "privacy" && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-2">
                                    Política de Privacidad
                                </h2>
                                <p className="text-sm text-zinc-500">Última actualización: abril de 2026</p>
                            </div>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">1. Introducción</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Sketchify ("nosotros", "nuestro" o "nuestra") opera para transformar planos de piso en renders 3D fotorrealistas. Esta Política de Privacidad explica nuestras prácticas regarding la recopilación, uso y protección de datos.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">2. Información que Recopilamos</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">Recopilamos información de varias formas:</p>
                                <ul className="list-disc list-inside space-y-2 text-zinc-600">
                                    <li><strong>Datos de Autenticación:</strong> A través de Puter, incluyendo tu nombre de usuario y tokens de autenticación</li>
                                    <li><strong>Imágenes de Planos:</strong> Imágenes que cargas para renderizado 3D</li>
                                    <li><strong>Datos de Uso:</strong> Solicitudes de API, historial de renderizado e información de proyectos</li>
                                    <li><strong>Información del Dispositivo:</strong> Tipo de navegador, dirección IP y tiempos de acceso</li>
                                    <li><strong>Datos de Contacto:</strong> Correo electrónico y número de teléfono cuando nos contactas</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">3. Cómo Utilizamos tus Datos</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">Tus datos se utilizan para:</p>
                                <ul className="list-disc list-inside space-y-2 text-zinc-600">
                                    <li>Proporcionar y mejorar nuestros servicios de renderizado</li>
                                    <li>Procesar tus planos en renders 3D de alta calidad</li>
                                    <li>Mantener tu historial de proyectos y preferencias</li>
                                    <li>Monitorear el uso de API y desempeño del servicio</li>
                                    <li>Comunicarte actualizaciones importantes del servicio</li>
                                    <li>Cumplir con obligaciones legales y reglamentarias</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">4. Seguridad de Datos</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Implementamos medidas de seguridad estándar de la industria incluyendo encriptación en tránsito y en reposo. Tus datos se almacenan de forma segura y se accede solo por personal autorizado. Realizamos auditorías de seguridad regulares para garantizar la máxima protección.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">5. Compartir Datos</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    No compartimos tus datos personales con terceros sin tu consentimiento, excepto cuando sea requerido por ley o para proveedores de servicios que nos ayudan a operar la plataforma bajo acuerdos de confidencialidad estrictos.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">6. Derechos del Usuario</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">Tienes derecho a:</p>
                                <ul className="list-disc list-inside space-y-2 text-zinc-600">
                                    <li>Acceder a tus datos personales</li>
                                    <li>Solicitar la corrección de datos incorrectos</li>
                                    <li>Solicitar la eliminación de tus datos</li>
                                    <li>Oponerme al procesamiento de tus datos</li>
                                    <li>Solicitar la portabilidad de tus datos</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">7. Retención de Datos</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Retenemos tus datos mientras tu cuenta esté activa o según sea necesario para proporcionar nuestros servicios. Puedes solicitar la eliminación en cualquier momento, sujeto a obligaciones legales de retención.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">8. Contacto</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Si tienes preguntas sobre esta Política de Privacidad, contáctanos:
                                </p>
                                <div className="space-y-2 text-zinc-600">
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-primary" />
                                        <a href="mailto:ashraahx@gmail.com" className="hover:text-primary transition-colors">
                                            ashraahx@gmail.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-primary" />
                                        <a href="tel:+528662108600" className="hover:text-primary transition-colors">
                                            +52 866 210 8600
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Terms of Service */}
                    {activeSection === "terms" && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-2">
                                    Términos de Servicio
                                </h2>
                                <p className="text-sm text-zinc-500">Última actualización: abril de 2026</p>
                            </div>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">1. Aceptación de Términos</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Al acceder y utilizar Sketchify, aceptas estar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguno de estos términos, no utilices nuestro servicio.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">2. Descripción del Servicio</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Sketchify proporciona una plataforma para transformar planos arquitectónicos en renders 3D fotorrealistas utilizando tecnología de inteligencia artificial. El servicio incluye carga de imágenes, procesamiento y almacenamiento de proyectos.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">3. Cuentas de Usuario</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Eres responsable de mantener la confidencialidad de tu contraseña y información de cuenta. Eres responsable de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente de cualquier uso no autorizado.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">4. Contenido del Usuario</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Al cargar contenido a Sketchify, nos otorgas una licencia para usar, procesar y almacenar ese contenido. Eres el propietario de tu contenido original. Garantizas que tienes derechos sobre todo el contenido que cargas.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">5. Restricciones de Uso</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">No debes:</p>
                                <ul className="list-disc list-inside space-y-2 text-zinc-600">
                                    <li>Reproducir, duplicar o copiar cualquier función de Sketchify</li>
                                    <li>Intentar obtener acceso no autorizado a nuestros sistemas</li>
                                    <li>Cargar contenido ilegal, obsceno o que infrinja derechos</li>
                                    <li>Usar la plataforma para enviar spam o malware</li>
                                    <li>Interferir con la operación normal del servicio</li>
                                    <li>Utilizar bots o scrapers sin permiso explícito</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">6. Limitación de Responsabilidad</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Sketchify se proporciona "tal como está" sin garantías de ningún tipo. No somos responsables por pérdidas indirectas, accidentales o consecuentes derivadas del uso de nuestro servicio. Nuestra responsabilidad total se limita al monto pagado en los últimos 12 meses.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">7. Modificación del Servicio</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Nos reservamos el derecho de modificar, suspender o descontinuar el servicio en cualquier momento. Te notificaremos de cambios significativos con antelación razonable.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">8. Terminación</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Podemos terminar tu cuenta si violas estos términos o utilizas el servicio de manera inapropiada. También puedes cancelar en cualquier momento.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">9. Indemnización</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Aceptas indemnizarnos contra cualquier demanda, pérdida o gasto derivado de tu violación de estos términos o tu uso del servicio.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">10. Ley Aplicable</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Estos términos se rigen por las leyes de México. Cualquier disputa se resolverá en los tribunales competentes de México.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">11. Contacto</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Para preguntas sobre estos Términos de Servicio:
                                </p>
                                <div className="space-y-2 text-zinc-600">
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-primary" />
                                        <a href="mailto:ashraahx@gmail.com" className="hover:text-primary transition-colors">
                                            ashraahx@gmail.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-primary" />
                                        <a href="tel:+528662108600" className="hover:text-primary transition-colors">
                                            +52 866 210 8600
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Cookie Policy */}
                    {activeSection === "cookies" && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-2">
                                    Política de Cookies
                                </h2>
                                <p className="text-sm text-zinc-500">Última actualización: abril de 2026</p>
                            </div>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">1. ¿Qué son las Cookies?</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Se utilizan para recordar información sobre tu visita y mejorar tu experiencia de usuario.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">2. Tipos de Cookies que Usamos</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">Utilizamos los siguientes tipos de cookies:</p>
                                <ul className="list-disc list-inside space-y-3 text-zinc-600">
                                    <li>
                                        <strong>Cookies Esenciales:</strong> Necesarias para la funcionalidad básica del sitio, como autenticación y seguridad.
                                    </li>
                                    <li>
                                        <strong>Cookies de Rendimiento:</strong> Nos ayudan a entender cómo los usuarios interactúan con el sitio para mejorar nuestro servicio.
                                    </li>
                                    <li>
                                        <strong>Cookies de Funcionalidad:</strong> Recuerdan tus preferencias y opciones seleccionadas.
                                    </li>
                                    <li>
                                        <strong>Cookies de Marketing:</strong> Utilizadas para rastrear y mostrar anuncios relevantes según tu interés.
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">3. Cookies de Terceros</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Algunos de nuestros socios pueden establecer cookies en tu dispositivo. Estos incluyen proveedores de análisis, redes publicitarias y proveedores de servicios. Cada tercero tiene su propia política de cookies.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">4. Consentimiento y Control</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Nuestro sitio obtiene tu consentimiento antes de instalar cookies no esenciales. Puedes:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-zinc-600">
                                    <li>Rechazar cookies en nuestra ventana de consentimiento</li>
                                    <li>Cambiar la configuración de cookies en tu navegador</li>
                                    <li>Eliminar cookies existentes en tu dispositivo</li>
                                    <li>Optar por no participar en análisis de rendimiento</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">5. Duración de las Cookies</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Las cookies pueden ser:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-zinc-600">
                                    <li><strong>Sesión:</strong> Se eliminan cuando cierras tu navegador</li>
                                    <li><strong>Persistentes:</strong> Permanecen en tu dispositivo de 30 días a varios años</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">6. Tecnologías Similares</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Además de cookies, utilizamos píxeles de seguimiento, balizas web y tecnologías similares para el análisis y personalización.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">7. Tu Privacidad</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Respetamos tu privacidad y no vendemos tus datos personales. Las cookies se utilizan únicamente para mejorar tu experiencia y nuestros servicios. Para más información, consulta nuestra Política de Privacidad.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">8. Datos Internacionales</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Si accedes a Sketchify desde fuera de México, ten en cuenta que tus datos pueden transferirse a México de acuerdo con nuestras políticas de protección de datos.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">9. Cambios en Esta Política</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    Podemos actualizar esta Política de Cookies periódicamente. Te notificaremos de cambios significativos. Tu uso continuado del sitio constituye aceptación de las nuevas políticas.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">10. Contacto</h3>
                                <p className="text-zinc-600 leading-relaxed mb-4">
                                    Si tienes preguntas sobre esta Política de Cookies:
                                </p>
                                <div className="space-y-2 text-zinc-600">
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-primary" />
                                        <a href="mailto:ashraahx@gmail.com" className="hover:text-primary transition-colors">
                                            ashraahx@gmail.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-primary" />
                                        <a href="tel:+528662108600" className="hover:text-primary transition-colors">
                                            +52 866 210 8600
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}
