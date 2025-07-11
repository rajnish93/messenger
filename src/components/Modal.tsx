import React from 'react';
import { CircleX } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-full relative">
        <CircleX
          size={20}
          className="absolute right-2 top-2 cursor-pointer"
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;