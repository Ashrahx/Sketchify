import { useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({
  id,
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const styles: Record<
    ToastType,
    { bg: string; border: string; icon: string }
  > = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
    },
  };

  const typeStyle = styles[type];

  const IconComponent = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  }[type];

  return (
    <div
      className={`${typeStyle.bg} border ${typeStyle.border} rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-80 max-w-md animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <IconComponent className={`w-5 h-5 mt-0.5 shrink-0 ${typeStyle.icon}`} />
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            type === "success"
              ? "text-green-900"
              : type === "error"
                ? "text-red-900"
                : type === "info"
                  ? "text-blue-900"
                  : "text-yellow-900"
          }`}
        >
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed top-6 left-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default Toast;
