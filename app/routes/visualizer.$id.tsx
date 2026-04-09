import { useNavigate, useOutletContext, useParams, Link } from "react-router";
import type { Route } from "./+types/visualizer.$id";
import { useCallback, useEffect, useRef, useState } from "react";
import { generate3DView } from "../../lib/ai.action";
import {
  Download,
  Share2,
  X,
  Trash2,
  Mail,
  MessageCircle,
  Facebook,
  Linkedin,
  Copy,
  Check,
  RefreshCcw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import type { ToastType } from "@/components/ui/Toast";
import {
  createProject,
  getProjectById,
  deleteProject,
} from "../../lib/puter.action";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export const meta: Route.MetaFunction = ({ params }) => {
  const projectId = params.id;
  const title = `Sketchify - Architectural Render`;
  const description = `Check out this architectural render created with Sketchify - Transform floor plans into photorealistic 3D visualizations instantly!`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: "/logo.svg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: "/logo.svg" },
  ];
};

const VisualizerId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useOutletContext<AuthContext>();

  const hasInitialGenerated = useRef(false);

  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // Toast helper functions
  const addToast = (message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleBack = () => navigate("/");
  const handleExport = () => {
    if (!currentImage) return;

    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `sketchify-${id || "design"}.png`;
    link.click();
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      await deleteProject({ id });
      setShowDeleteModal(false);
      addToast("Project deleted successfully", "success");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete project";
      addToast(errorMessage, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShareClick = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    setShareLink(url);
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareSocial = (platform: string) => {
    const projectName = project?.name || `Sketchify - ${id}`;
    const message = `Check out this architectural render I created with Sketchify!`;
    const encodedMessage = encodeURIComponent(`${message} ${shareLink}`);

    const platforms: Record<string, string> = {
      email: `mailto:?subject=${encodeURIComponent(projectName)}&body=${encodedMessage}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`,
    };

    if (platforms[platform]) {
      window.open(platforms[platform], "_blank");
    }
  };

  // Wrap runGeneration in useCallback to avoid recreation on every render
  const runGeneration = useCallback(
    async (item: DesignItem) => {
      if (!id || !item.sourceImage) {
        console.warn("Cannot run generation: missing id or sourceImage", {
          id,
          sourceImage: !!item.sourceImage,
        });
        return;
      }

      try {
        setIsProcessing(true);

        const result = await generate3DView({ sourceImage: item.sourceImage });

        if (result.renderedImage) {
          setCurrentImage(result.renderedImage);

          const updatedItem = {
            ...item,
            renderedImage: result.renderedImage,
            renderedPath: result.renderedPath,
            timestamp: Date.now(),
            ownerId: item.ownerId ?? userId ?? null,
            isPublic: item.isPublic ?? false,
          };

          const saved = await createProject({
            item: updatedItem,
            visibility: "private",
          });

          if (saved) {
            setProject(saved);
            setCurrentImage(saved.renderedImage || result.renderedImage);
            addToast("Visualization generated successfully", "success");
          }
        } else {
          addToast(
            "Failed to generate 3D visualization. Please try again.",
            "error",
          );
          console.warn("generate3DView returned no renderedImage");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Generation failed: ", errorMessage);
        addToast(
          "Failed to generate visualization. Please try again.",
          "error",
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [id, userId],
  );

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      try {
        const fetchedProject = await getProjectById({ id });

        if (!isMounted) return;

        setProject(fetchedProject);
        setCurrentImage(fetchedProject?.renderedImage || null);
      } catch (err) {
        console.error("Failed to load project:", err);
        if (isMounted) {
          addToast("Failed to load project. Please try again.", "error");
        }
      } finally {
        if (isMounted) {
          setIsProjectLoading(false);
          hasInitialGenerated.current = false;
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (
      isProjectLoading ||
      hasInitialGenerated.current ||
      !project?.sourceImage
    )
      return;

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenerated.current = true;
      return;
    }

    hasInitialGenerated.current = true;
    void runGeneration(project);
  }, [project, isProjectLoading, runGeneration]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <Link to="/" className="brand">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2000 636"
            width="350"
            height="50"
            className="logo"
          >
            <clipPath id="_clip1">
              <path d="M17.236 29.829h1965.528v596.342H17.236z" />
            </clipPath>
            <g clipPath="url(#_clip1)">
              <path
                d="M971.291 514.309c17.361-1.218 17.189-2.62 34.617-3.071 5.875-.152 9.651-1.829 17.12-2.449 13.979-1.161 14.894.204 45.139-3.602 10.424-1.312 10.451-.011 20.954-1.219 24.238-2.786 24.299-1.251 48.697-2.638 24.37-1.385 98.219-.051 100.162-1.813.852-.773.939-2.208.824-3.353-.327-3.272-2.188-4.238-128.888-4.256-142.2-.021-142.119 2.109-163.028 3.06-17.333.789-17.302.396-34.642 1.257-12.149.604-12.104.311-24.182 1.247-15.66 1.213-15.621.826-31.229 2.865-1.672.218-1.651-.496-21.01 1.659-11.183 1.245-11.256-.14-24.071 1.781-9.784 1.467-9.842.763-41.43 4.719-17.591 2.203-17.669 1.112-35.113 3.971-13.047 2.138-31.802 3.623-34.576 3.843-4.461.353-4.276 1.136-55.428 7.512-17.535 2.186-17.221 3.856-34.777 6.1-8.338 1.066-61.083 9.5-86.421 15.545-20.868 4.979-21.001 4.116-41.904 9.185-18.861 4.574-19.048 3.435-37.811 8.266-48.456 12.476-76.577 18.551-107.586 27.361-17.015 4.834-32.608 7.651-42.268 12.355-.95.463-8.947 4.357-12.787 3.304-4.921-1.349-13.884-17.712.012-25.304 9.253-5.056 109.56-34.964 165.69-47.405 2.817-.624 2.746-.775 35.126-8.171 15.79-3.607 93.322-19.37 128.234-24.033 14.295-1.909 50.539-9.051 69.295-10.814 13.994-1.315 13.856-1.898 27.803-3.031 15.686-1.274 15.422-2.845 31.103-4.154 7.381-.616 39.825-4.49 48.288-5.58 4.107-.529 26.165-1.821 41.675-3.395 11.361-1.153 36.562-1.648 69.539-5.016 3.594-.367 3.619.393 45.101-2.386 8.818-.591 12.846.556 38.105-1.162 5.812-.395 12.878.219 20.783-.452 21.774-1.849 51.695-.55 65.838-1.518 12.516-.857 99.2.575 110.962 2.1 9.956 1.29 12.713-.774 24.256.303 12.234 1.142 12.234.191 24.505 1.286 7.602.678 34.337 1.368 86.494 5.351 3.056.233 3.086-.466 58.853 4.386 2.226.194 2.157.551 27.772 3.009 38.366 3.682 50.235 6.203 55.53 6.608 17.408 1.331 17.243 2.263 34.576 4.021.205.021 82.892 12.693 90.099 13.797 5.174.793 8.992 2.512 17.417 3.328 7.628.739 64.249 9.147 79.914 12.808 9.698 2.266 37.599 4.921 44.494 11.16 9.056 8.195 8.774 29.51-9.855 30.01-1.384.037-1.374-.026-17.302-.161-8.319-.07-8.045-3.41-10.835-5.323-3.779-2.591-5.887-1.361-51.566-8.158-10.457-1.556-10.465-.995-20.868-2.988-12.244-2.345-17.691-1.587-65.817-7.486-1.946-.239-1.937-.054-24.373-2.583-11.761-1.326-15.056.377-58.818-4.638-15.777-1.808-16.553-.236-45.106-3.269-3.599-.382-3.629.729-45.22-1.441-15.684-.819-19.163.822-48.465-1.41-4.597-.35-114.683-.339-149.058 1.075-27.794 1.144-27.787.305-55.539 2.083-3.61.231-3.558.4-45.093 3.298-36.504 2.546-36.421 3.017-72.891 6.336-25.979 2.364-70.274 9.354-76.363 10.315-13.843 2.184-13.742 2.477-27.631 4.074-12.84 1.476-13.28 2.75-38.208 6.656-1.283.201-59.816 11.124-113.79 26.682-10.788 3.11-34.307 11.053-38.224 13.057-9.73 4.978-6.901 9.268-13.894 11.078-12.604 3.264-28.012-14.401-13.198-27.977.534-.489 13.316-8.101 15.812-9.222 12.548-5.635 99.015-26.606 100.92-27.082 34.402-8.585 34.606-7.38 69.215-14.841 12.019-2.591 12.178-1.274 24.304-3.543 1.622 1.533 2.04 4.071 3.661 5.604.61.577.829.784 10.376 1.553 9.066.731 12.097-3.548 13.897-3.852 1.153-.195 2.314.736 3.468.54l3.468-.459 3.468-.641 3.468-.768 3.468-2.339 3.468-.57 3.468.44 3.468-1.417c1.136.211 2.331-.212 3.468-.001 1.213.226 2.286.938 3.468 1.291.785.234 5.993 1.788 10.221.513 1.308-.395 2.389-1.408 3.717-1.726 1.102-.264 2.315.346 3.4.02 1.292-.389 2.176-1.698 3.468-2.087l-3.051-5.115-.328-2.893Z"
                fill="#e3672a"
              />
              <path d="M1413.146 305.679c-.003 64.684-.842 65.946 5.442 72.753 5.189 5.62 19.034 8.09 20.042 14.031.13.764 1.182 6.971-6.172 7.467-7.755.524-7.688-.413-97.163.067-.768.004-7.832.042-9.472-1.559-3-2.928-1.272-9.364 3.258-11.419 2.457-1.115 7.421-1.796 13.403-8.298 8.86-9.629 5.074-27.196 5.707-121.601.028-4.126 1.68-31.812-12.429-45.553-.86-.838-8.475-10.848-35.316-7.594-11.927 1.446-31.516 12.638-33.721 22.167-.868 3.752-1.647 129.952.111 141.799 2.995 20.185 26.725 15.468 23.612 27.957-.989 3.969-6.461 4.124-7.12 4.142-2.405.068-89.371-.165-97.143-.186-.549-.001-5.715-.015-6.817-.766-4.229-2.882-3.115-9.12-.564-10.707 7.816-4.86 21.847-4.969 22.566-23.682.13-3.381.643-245.694.038-253.315-1.785-22.481-23.818-17.769-24.881-27.728-.638-5.97 5.013-7.831 5.767-8.08 2.176-.717 2.487.508 27.732-7.138 22.008-6.665 50.874-14.737 52.23-14.361.519.144 3.75 1.041 4.096 5.348.555 6.917-.387 6.868-.42 86.743-.018 43.89-.626 43.871-.733 48.653-.015.656-.256 11.397 7.55 3.198 1.729-1.816 1.433-1.996 3.188-3.764 30.309-30.538 72.911-33.963 97.249-23.203 16.714 7.389 20.743 12.89 29.196 26.437 1.695 2.716 7.152 11.462 10.115 38.72.996 9.159 1.234 52.715.651 69.469Z" />
              <path
                d="M369.19 364.476c2.037 13.697 2.765 14.89 19.019 22.035 8.221 3.614 6.768 12.299.534 13.37-1.994.343-89.42.088-97.195.065-.827-.002-9.219-.027-10.299-.816-4.128-3.018-2.959-10.206.749-12.044 4.808-2.385 20.15-4.21 21.093-22.397.195-3.768.642-251.328-.246-256.809-2.738-16.903-21.234-15.744-24.142-24.308-1.999-5.885 4.695-7.954 5.447-8.186 1.933-.597 2.033-.046 24.468-6.381 8.959-2.529 8.788-2.995 17.845-5.037 8.598-1.938 34.765-10.85 37.838-10.261.585.112 4.542.871 4.911 5.591.156 1.994-.336 63.982-.38 69.545-.3 37.845-.096 134.243-.545 142.136-.369 6.474 2.47 8.911 6.968 4.237 17.364-18.043 23.77-19.497 58.976-55.739 9.276-9.549 21.791-19.038 10.246-28.652-7.105-5.916-16.831-3.474-19.048-9.429-3.641-9.782 7.281-9.857 8.313-9.864 7.182-.049 86.234-.588 89.771.297 4.591 1.149 5.618 11.132.867 13.312-.926.425-21.447 2.028-48.074 24.611-3.138 2.662-18.558 15.739-38.193 34.458-9.694 9.242-4.77 11.831 8.347 31.006 18.68 27.307 18.472 27.392 31.203 45.158 26.319 36.729 29.111 50.494 59.574 66.116 6.787 3.481 9.156 13.277-2.932 13.445-5.828.081-65.862.917-72.855-.524-7.777-1.604-15.176-13.652-41.157-52.43-11.282-16.838-10.767-17.081-22.381-33.602-9.942-14.144-11.605-20.292-16.163-20.346-4.758-.057-10.853 8.469-11.03 8.86-2.291 5.073-2.035 16.169-2.002 28.05.082 29.765.199 29.742.476 34.531ZM142.456 92.215c-1.169.08-23.412-2.301-39.32 14.773-3.656 3.924-10.417 10.029-12.765 28.771-.171 1.361-.698 5.566 1.752 17.055 6.954 32.619 70.747 51.533 94.488 64.406 6.874 3.728 7.016 3.33 13.952 6.856.884.449.643.722 10.558 6.498 6.626 3.86 25.487 18.214 32.19 29.837 3.02 5.237 9.647 12.561 14.031 41.738 2.279 15.167-3.895 43.11-14.841 58.666-9.053 12.866-9.416 13.396-26.385 25.85-18.764 13.772-57.391 21.635-84.077 19.698-29.387-2.133-29.175-3.492-51.814-7.93-2.318-.454-9.777-1.917-27.994-9.385-18.915-7.755-19.652-9.139-19.744-17.498-.061-5.539-.704-64.07-.057-69.237.813-6.501 13.128-8.585 16.432-.117 1.224 3.137 11.436 39.932 41.083 66.456 28.077 25.119 80.432 25.842 100.647-4.283 4.965-7.399 10.713-23.957 7.794-37.972-9.316-44.718-69.418-53.069-115.63-81.903-.006-.004-5.705-2.573-12.858-8.499-4.506-3.733-21.274-15.786-31.352-41.333-5.269-13.357-5.864-47.186 1.172-61.81 5.868-12.196 17.573-40.421 60.883-53.253 4.385-1.299 21.19-8.568 62.652-6.204 27.011 1.54 71.774 15.283 74.704 21.624 1.386 3 .604 3.148 1.193 58.086.062 5.743 1.133 11.723-2.364 14.84-.71.633-10.56 4.716-14.258-4.573-4.053-10.181-3.277-10.453-8.086-20.258-25.225-51.436-55.165-50.227-71.986-50.901Z"
                fill="#010101"
              />
              <path
                d="M1840.276 271.392c7.992 27.81 13.99 40.59 18.825 58.465.163.603 1.649 6.096 5.666 5.38 1.26-.225 3.057-10.554 21.502-64.342.655-1.911 16.241-51.378 24.024-72.908.702-1.942 7.694-24.595 11.374-34.363 3.09-8.201 6.66-6.207 30.853-6.404 25.327-.206 25.356-.564 27.374.286 3.61 1.52 2.831 5.27 2.727 5.77-.472 2.271-18.945 50.348-34.222 93.619-9.327 26.416-9.318 26.374-19.399 52.559-2.333 6.059-1.892 6.194-27.801 76.244-24.043 65.004-33.064 93.429-73.681 106.568-23.101 7.473-68.698 3.992-70.052-6.129-.182-1.361 10.156-36.729 11.072-38.431 4.892-9.091 22.809 9.855 45.564-6.432 10.989-7.865 19.036-31.629 18.036-38.633-.712-4.982-31.23-81.798-77.513-207.834-1.342-3.654-3.771-8.789-9.402-24.622-.272-.764-2.892-8.132-2.754-9.756.244-2.874 5.071-3.081 5.582-3.103 12.499-.536 41.343-.171 44.937-.125 10.887.138 10.545 2.828 13.599 13.336 1.542 5.306 1.878 5.138 21.819 65.53 7.167 21.706 6.984 21.73 11.869 35.324Z"
                fill="#e86525"
              />
              <path
                d="M690.291 363.042c19.677-1.255 23.791-3.584 38.058-12.458 10.605-6.596 13.215-20.84 21.502-14.542 4.13 3.138 5.27 6.391-2.763 18.991-13.22 20.737-17.475 23.434-25.767 30.131-4.703 3.799-14.075 9.784-21.162 12.689-4.21 1.726-19.895 6.377-23.887 6.926-13.058 1.796-43.255 5.171-76.357-11.926-21.993-11.359-39.419-33.585-45.661-48.68-9.207-22.267-8.938-27.289-10.76-38.282-3.819-23.047 1.193-52.992 4.875-62.55 5.862-15.218 11.976-36.807 44.222-59.98 23.114-16.61 57.823-18.132 59.692-18.29 11.14-.943 33.776 2.265 41.514 5.372 12.135 4.873 12.38 4.388 23.088 11.977 27.699 19.631 36.021 55.22 36.986 81.609.413 11.292-6.765 9.155-18.469 9.213-44.253.219-123.064-.22-125.073.265-1.201.29-6.763 1.634-3.887 14.954 4.63 21.441 8.923 34.826 18.941 47.747 24.047 31.014 56.162 26.624 64.908 26.835Zm-38.139-180.221c-4.945.502-22.072-.308-36.524 26.633-4.576 8.53-12.661 39.516-8.578 44.258 2.603 3.024 9.889 1.77 69.43 2.23 12.402.096 15.999-.191 15.639-12.575-.337-11.596-1.36-39.865-19.78-54.737-1.373-1.109-7.38-3.903-9.65-4.615-5.121-1.607-5.182-.935-10.537-1.194"
                fill="#010101"
              />
              <path
                d="M1706.326 157.211c8.856.468 9.24-.52 11.492 1.638 1.674 1.604 2.368 2.269 2.047 28.915-.01.814-.112 9.272-.498 10.159-1.654 3.793-1.865 4.131-6.016 4.451-5.073.39-41.895-.527-44.356.92-3.947 2.321-3.236 3.439-3.312 36.512-.027 11.65-.269 115.878-.161 145.63.003.848.035 9.738-.176 10.605-1.927 7.892-18.84 3.74-45.691 4.761-.801.03-7.829.298-9.819-2.004-1.856-2.147-1.648-2.565-1.713-106.977-.037-58.805.083-58.748.043-76.314-.022-9.709.311-12.72-9.372-12.77-12.035-.062-24.138.687-26.736-2.121-1.833-1.981-2.186-2.363-1.702-33.691.122-7.936 1.697-9.691 11.148-9.712 13.075-.028 23.804 1.328 25.65-3.298 3.181-7.974-3.543-30.037 11.671-60.24 1.656-3.288 13.282-23.123 38.731-31.445 35.647-11.656 68.247.695 70.721 2.959 5.853 5.356-2.163 19.623-5.385 35.689-3.044 15.18-11.049.767-33.758 4.496-2.31.379-16.747 2.75-21.497 19.859-.622 2.241-3.244 24.891-.592 28.593 2.993 4.178 4.01 3.327 39.28 3.386Z"
                fill="#e86525"
              />
              <path
                d="M1082.292 363.133c6.066.167 28.565 2.966 49.032-11.426 14.788-10.398 13.664-21.143 23.855-15.073 6.663 3.969 1.007 12.146-8.456 27.145-3.51 5.564-19.45 21.193-23.721 23.995-13.996 9.181-21.248 11.535-23.245 12.183-3.507 1.138-38.895 14.926-82.925-2.082-30.606-11.823-46.926-38.796-49.655-43.305-16.126-26.653-16.451-47.694-16.984-62.756-.993-28.017 3.683-41.283 4.878-44.673 2.865-8.129 9.854-30.585 29.725-49.254 8.528-8.012 21.03-19.878 48.664-27.954 33.378-9.755 101.931-7.178 118.843 38.351 8.693 23.402-7.81 48.88-35.555 42.348-25.454-5.992-14.537-32.998-24.81-52.128-15.285-28.462-54.939-14.251-65.811 9.809-2.884 6.383-14.45 24.143-11.625 73.027.918 15.881 6.926 41.542 20.496 57.848 6.29 7.559 13.742 12.187 15.097 13.028 9.137 5.675 10.526 8.752 32.199 10.917Z"
                fill="#010101"
              />
              <path d="M931.46 180.872c-.344 2.232.307 4.543-.037 6.775-.61 3.951-.926 4.262-4.827 5.306-3.623.97-52.853-.129-56.247.757-5.126 1.337-4.44 2.649-4.559 7.9-.275 12.081-.001 114.891.025 124.881.008 2.846.066 24.761 8.418 34.565 10.399 12.207 32.889 13.039 47.646 2.441.883-.634 7.395-6.764 11.726-3.07 7.969 6.798.195 13.013-4.014 18.07-7.495 9.005-24.027 18.759-25.003 19.166-27.741 11.592-43.954 8.994-47.786 8.38-5.292-.848-13.168-1.248-24.377-6.591-2.68-1.278-17.745-8.459-24.754-27.657-7.027-19.245-5.2-19.859-5.332-156.268-.008-8.328.583-17.74-1.731-20.152-3.264-3.404-24.351-1.349-26.63-2.371-5.445-2.442-5.907-14.532.362-17.459 1.019-.476 7.257-1.854 23.539-11.958 1.18-.732 1.052-.888 13.93-10.347 16.24-11.928 28.795-35.045 30.674-38.506 2.999-5.521 5.607-7.025 10.737-7.534.856-.085 9.16-.909 10.739.514 1.088.98 1.664 2.509 1.919 3.951.045.254-.033 44.518-.04 48.389-.015 8.641-.373 11.305 8.224 11.504 1.257.029 51.429-.042 51.911.094 5.751 1.625 4.259 3.366 5.487 9.221Z" />
              <path
                d="M1501.75 157.264c22.795.202 28.627-.622 31.368 2.674 1.345 1.617 1.018 17.28 1.018 17.392-.37 92.54.124 199.035-.227 215.075-.189 8.623-2.749 8.423-11.36 8.422-41.873-.006-42.53 1.025-45.029-1.573-2.944-3.061-2.231-8.627-2.165-86.639.124-147.027-1.504-147.516 1.53-153.037 1.605-2.92 10.814-2.287 24.866-2.313Z"
                fill="#e76527"
              />
              <path
                d="M1488.399 120.716c-3.349-1.99-13.709-7.589-17.03-19.848-.601-2.219-4.197-15.494 4.832-28.324 17.693-25.14 49.48-11.965 57.217.475 12.215 19.639 1.553 42.516-14.55 48.33-15.792 5.702-26.646.638-30.47-.633Z"
                fill="#e66626"
              />
              <path
                d="m936.156 519.075.372 6.781-3.468 2.339-3.468.768-3.468.641-3.468.459c-1.153.195-2.314-.736-3.468-.54-1.799.305-4.831 4.583-13.897 3.852-9.547-.769-9.766-.977-10.376-1.553-1.622-1.533-2.04-4.071-3.661-5.604 22.325-4.594 22.437-3.491 44.901-7.143Z"
                fill="#dd8352"
              />
              <path
                d="m971.291 514.309.328 2.893 3.051 5.115c-1.292.389-2.176 1.698-3.468 2.087-1.085.327-2.298-.284-3.4-.02-1.329.319-2.409 1.332-3.717 1.726-4.228 1.275-9.436-.279-10.221-.513-1.182-.353-2.255-1.065-3.468-1.291-1.136-.211-2.331.212-3.468.001l-3.468 1.417-3.468-.44-3.468.57-.372-6.781c20.395-2.549 20.231-3.322 35.135-4.766Z"
                fill="#d97c4d"
              />
            </g>
          </svg>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" /> Exit Editor
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className="note">
                Created by {project?.ownerName || "Unknown"}
              </p>
            </div>
            <div className="panel-actions">
              <Button
                size="sm"
                onClick={handleExport}
                className="export"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button size="sm" onClick={handleShareClick} className="share">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="delete"
                variant="ghost"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="AI Render" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {project?.sourceImage && (
                  <img
                    src={project?.sourceImage}
                    alt="Original"
                    className="render-fallback"
                  />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">
                    Generating your 3D visualization
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="panel compare">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Comparison</p>
              <h3>Before and After</h3>
            </div>
            <div className="hint">Drag to compare</div>
          </div>

          <div className="compare-stage">
            {project?.sourceImage && currentImage ? (
              <ReactCompareSlider
                defaultValue={50}
                style={{ width: "100%", height: "100%", display: "flex" }}
                itemOne={
                  <ReactCompareSliderImage
                    src={project?.sourceImage}
                    alt="before"
                    className="compare-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={currentImage || project?.renderedImage || undefined}
                    alt="after"
                    className="compare-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                }
              />
            ) : (
              <div className="compare-fallback">
                {project?.sourceImage && (
                  <img
                    src={project.sourceImage}
                    alt="Before"
                    className="compare-img"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-zinc-900 mb-2">
                Delete Project
              </h3>
              <p className="text-zinc-600 text-sm">
                Are you sure you want to delete "
                {project?.name || `Residence ${id}`}"? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-900 font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-zinc-900">
                Share Project
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Copy Link */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-zinc-900 mb-2 block">
                Copy Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 text-sm text-zinc-600"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-lg bg-primary text-white hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Share */}
            <div>
              <label className="text-sm font-semibold text-zinc-900 mb-3 block">
                Share on Social Media
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShareSocial("email")}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors text-sm font-medium text-zinc-900"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  onClick={() => handleShareSocial("whatsapp")}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShareSocial("facebook")}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShareSocial("linkedin")}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors text-sm font-medium"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
export default VisualizerId;
