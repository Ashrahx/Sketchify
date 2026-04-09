import type { Route } from "./+types/home";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Layers,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Upload from "@/components/Upload";
import { useNavigate, useOutletContext } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProjects } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sketchify - AI-Powered Architectural Rendering" },
    {
      name: "description",
      content:
        "Turn your architectural visions into stunning renders instantly. Transform floor plans into photorealistic 3D visualizations in seconds.",
    },
    {
      name: "keywords",
      content: "AI, floor plans, 3D renders, architecture, visualization",
    },
    { property: "og:type", content: "website" },
    {
      property: "og:title",
      content: "Sketchify - AI-Powered Architectural Rendering",
    },
    {
      property: "og:description",
      content:
        "Turn your architectural visions into stunning renders instantly",
    },
    { property: "og:image", content: "/logo.svg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Sketchify - AI-Powered Architectural Rendering",
    },
    {
      name: "twitter:description",
      content:
        "Turn your architectural visions into stunning renders instantly",
    },
    { name: "twitter:image", content: "/logo.svg" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { isSignedIn } = useOutletContext<AuthContext>();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const isCreatingProjectRef = useRef(false);

  const handleUploadError = (uploadError: UploadError) => {
    console.error("Upload error:", uploadError);
    setError(`${uploadError.code}: ${uploadError.message}`);

    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  const handleUploadComplete = async (base64Image: string): Promise<void> => {
    try {
      setError(null);

      if (isCreatingProjectRef.current) {
        return;
      }

      isCreatingProjectRef.current = true;
      setIsCreatingProject(true);
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem: DesignItem = {
        id: newId,
        name,
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now(),
      };

      let saved: DesignItem | null | undefined;
      try {
        saved = await createProject({ item: newItem, visibility: "private" });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create project";
        setError(`Project creation failed: ${errorMessage}`);
        console.error("Failed to create project:", err);
        return;
      }

      if (!saved) {
        setError(
          "Failed to create project. Please ensure all required environment variables are set.",
        );
        console.error("Unexpected: createProject returned null");
        return;
      }

      setProjects((prev) => [saved, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name,
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`An unexpected error occurred: ${errorMessage}`);
      console.error("Unexpected error in handleUploadComplete:", err);
    } finally {
      isCreatingProjectRef.current = false;
      setIsCreatingProject(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const items = await getProjects();
        setProjects(items);
      } catch (err) {
        console.error("Failed to load projects:", err);
        // Don't show error to user for listing, just log it
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="home">
      <Navbar />

      <div className="flex-1 w-full">
        {error && (
          <div
            style={{
              position: "fixed",
              top: "1rem",
              right: "1rem",
              left: "1rem",
              backgroundColor: "#fee2e2",
              borderLeft: "4px solid #dc2626",
              color: "#991b1b",
              padding: "1rem",
              borderRadius: "0.375rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              zIndex: 50,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <section className="hero">
          <div className="announce">
            <div className="dot">
              <div className="pulse"></div>
            </div>

            <p>Introducing Sketchify 2.0</p>
          </div>

          <h1>
            Turn your architectural visions into stunning renders instantly
          </h1>

          <p className="subtitle">
            The AI-powered design platform that transforms floor plans into
            photorealistic 3D visualizations in seconds, not days.
          </p>

          <div className="actions">
            <a href="#upload" className="cta">
              Start Building <ArrowRight className="icon" />
            </a>

            {/* TODO: Implement demo video in future expansion */}
            {/* <Button variant="outline" size="lg" className="demo">
                      Watch Demo
                  </Button> */}
          </div>

          <div id="upload" className="upload-shell">
            <div className="grid-overlay" />

            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers className="icon" />
                </div>

                <h3>Upload your floor plan</h3>
                <p>Supports JPG, PNG, WebP formats up to 50MB</p>
              </div>

              <Upload
                onComplete={handleUploadComplete}
                onError={handleUploadError}
                isDisabled={isCreatingProject}
              />
            </div>
          </div>
        </section>

        {isSignedIn && (
          <section className="projects">
            <div className="section-inner">
              <div className="section-head">
                <div className="copy">
                  <h2>Projects</h2>
                  <p>
                    Your latest work and shared community projects, all in one
                    place.
                  </p>
                </div>
              </div>

              <div className="projects-grid">
                {projects.map(
                  ({
                    id,
                    name,
                    renderedImage,
                    sourceImage,
                    timestamp,
                    ownerName,
                  }) => (
                    <div
                      key={id}
                      className="project-card group"
                      onClick={() => navigate(`/visualizer/${id}`)}
                    >
                      <div className="preview">
                        <img src={renderedImage || sourceImage} alt="Project" />

                        <div className="badge">
                          <span>Community</span>
                        </div>
                      </div>

                      <div className="card-body">
                        <div>
                          <h3>{name}</h3>

                          <div className="meta">
                            <Clock size={12} />
                            <span>
                              {new Date(timestamp).toLocaleDateString()}
                            </span>
                            <span>By {ownerName || "Unknown"}</span>
                          </div>
                        </div>
                        <div className="arrow">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
