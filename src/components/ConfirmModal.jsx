import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, Edit3, CheckCircle2, X } from 'lucide-react';

/**
 * Custom Confirmation Modal
 * @param {boolean} isOpen - Control visibility
 * @param {string} type - 'danger' | 'primary' | 'success' | 'warning'
 * @param {string} title - Modal title
 * @param {string} message - Modal body text
 * @param {string} confirmLabel - Text for the action button
 * @param {string} cancelLabel - Text for the cancel button
 * @param {function} onConfirm - Callback for action
 * @param {function} onClose - Callback for closing
 */
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Xác nhận", 
  cancelLabel = "Hủy bỏ",
  type = "primary" 
}) => {
  
  const themes = {
    danger: {
      icon: <Trash2 size={24} />,
      bg: "bg-red-50",
      text: "text-red-600",
      button: "bg-red-600 hover:bg-red-700 shadow-red-200",
      border: "border-red-100"
    },
    primary: {
      icon: <Edit3 size={24} />,
      bg: "bg-brand/10",
      text: "text-brand",
      button: "bg-gray-900 hover:bg-brand shadow-gray-200",
      border: "border-brand/10"
    },
    success: {
      icon: <CheckCircle2 size={24} />,
      bg: "bg-green-50",
      text: "text-green-600",
      button: "bg-green-600 hover:bg-green-700 shadow-green-200",
      border: "border-green-100"
    },
    warning: {
      icon: <AlertCircle size={24} />,
      bg: "bg-amber-50",
      text: "text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
      border: "border-amber-100"
    }
  };

  const theme = themes[type] || themes.primary;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-gray-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto border border-gray-100"
            >
              {/* Header with Icon */}
              <div className={`p-8 pb-6 flex flex-col items-center text-center`}>
                <div className={`w-16 h-16 ${theme.bg} ${theme.text} rounded-3xl flex items-center justify-center mb-6 border ${theme.border}`}>
                  {theme.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="p-8 pt-2 flex flex-col gap-3">
                <button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full py-4 ${theme.button} text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]`}
                >
                  {confirmLabel}
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-[0.98]"
                >
                  {cancelLabel}
                </button>
              </div>

              {/* Close Icon (Optional) */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
