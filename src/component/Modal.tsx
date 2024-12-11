import { useEffect, useRef } from "react";

export function Modal({
  children,
  isOpen = false,
}: {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const modalElement = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalElement.current;
    if (modal) {
      if (isOpen) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  });
  return (
    <>
      <dialog
        ref={modalElement}
        className="modal animate-zoom-in rounded-lg p-8 lg:w-5/12 lg:h-4/6 backdrop:bg-black backdrop:opacity-50 backdrop:animate-fade-in-0-0.5"
      >
        <div className="">{children}</div>
      </dialog>
    </>
  );
}
