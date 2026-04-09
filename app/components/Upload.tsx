import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import { AlertCircle, CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import {
  PROGRESS_INCREMENT,
  REDIRECT_DELAY_MS,
  PROGRESS_INTERVAL_MS,
  FILE_UPLOAD_CONFIG,
} from "lib/constants";
import { validateFileUpload } from "lib/utils";

const Upload = ({ onComplete, onError, isDisabled }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<UploadError | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isSignedIn } = useOutletContext<AuthContext>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleValidationError = (uploadError: UploadError) => {
    setError(uploadError);
    onError?.(uploadError);
    // Auto-clear error after 4 seconds
    setTimeout(() => {
      setError(null);
      setFile(null);
      setProgress(0);
    }, 4000);
  };

  const processFile = useCallback(
    (file: File) => {
      if (!isSignedIn || isDisabled) return;

      // Validate file
      const validation = validateFileUpload(file);
      if (!validation.valid) {
        handleValidationError(validation.error!);
        return;
      }

      setFile(file);
      setProgress(0);
      setError(null);

      const reader = new FileReader();
      reader.onerror = () => {
        const uploadError: UploadError = {
          code: "READ_ERROR",
          message: "Failed to read file. Please try again.",
          fileName: file.name,
        };
        handleValidationError(uploadError);
      };
      reader.onloadend = () => {
        try {
          const base64Data = reader.result as string;

          intervalRef.current = setInterval(() => {
            setProgress((prev) => {
              const next = prev + PROGRESS_INCREMENT;
              if (next >= 100) {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                // Wait before calling onComplete, which may be async
                timeoutRef.current = setTimeout(async () => {
                  setIsCompleting(true);
                  try {
                    await Promise.resolve(onComplete?.(base64Data));
                  } catch (err) {
                    const uploadError: UploadError = {
                      code: "UNKNOWN",
                      message: "Failed to complete upload. Please try again.",
                      fileName: file.name,
                    };
                    handleValidationError(uploadError);
                  } finally {
                    setIsCompleting(false);
                  }
                  timeoutRef.current = null;
                }, REDIRECT_DELAY_MS);
                return 100;
              }
              return next;
            });
          }, PROGRESS_INTERVAL_MS);
        } catch (err) {
          const uploadError: UploadError = {
            code: "READ_ERROR",
            message: "Failed to process file. Please try again.",
            fileName: file.name,
          };
          handleValidationError(uploadError);
        }
      };
      reader.readAsDataURL(file);
    },
    [isSignedIn, isDisabled, onComplete, onError],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isSignedIn || isDisabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!isSignedIn || isDisabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    processFile(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn || isDisabled) return;

    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  return (
    <div className="upload">
      {!file ? (
        <div
          className={`dropzone ${isDragging && !isDisabled ? "is-dragging" : ""} ${
            isDisabled ? "is-disabled" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={isDisabled ? { opacity: 0.6, pointerEvents: "none" } : {}}
        >
          <input
            type="file"
            className="drop-input"
            accept={FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(",")}
            disabled={!isSignedIn || isDisabled}
            onChange={handleChange}
          />

          <div className="drop-content">
            <div className="drop-icon">
              {error ? (
                <AlertCircle size={20} className="error-icon" />
              ) : (
                <UploadIcon size={20} />
              )}
            </div>
            {error ? (
              <>
                <p className="error-text" style={{ color: "#ef4444" }}>
                  {error.message}
                </p>
                <p
                  className="help"
                  style={{ color: "#dc2626", fontSize: "0.875rem" }}
                >
                  {error.fileName}
                </p>
              </>
            ) : isDisabled ? (
              <>
                <p style={{ color: "#6b7280" }}>Creating project...</p>
                <p
                  className="help"
                  style={{ color: "#9ca3af", fontSize: "0.875rem" }}
                >
                  Please wait while we process your upload
                </p>
              </>
            ) : (
              <>
                <p>
                  {isSignedIn
                    ? "Click to upload or just drag and drop"
                    : "Sign in or sign up with Puter to upload"}
                </p>
                <p className="help">
                  Maximum file size {FILE_UPLOAD_CONFIG.MAX_SIZE_MB} MB.
                  Supported: {FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(", ")}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>

            <h3>{file.name}</h3>

            <div className="progress">
              <div className="bar" style={{ width: `${progress}%` }} />

              <p className="status-text">
                {progress < 100
                  ? "Analyzing Floor Plan..."
                  : isCompleting
                    ? "Processing upload..."
                    : "Redirecting..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Upload;
