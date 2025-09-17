import { useEffect } from "react";

type ToastMessageProps = {
  show: boolean;
  message: string;
  type?: "success" | "danger" | "info";
  onClose: () => void;
};

export default function ToastMessage({ show, message, type = "success", onClose }: ToastMessageProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-4 ${show ? "show" : ""}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ zIndex: 9999, minWidth: 220 }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></button>
      </div>
    </div>
  );
}