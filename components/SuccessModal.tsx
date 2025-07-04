"use client";

import { motion } from "framer-motion";

interface SuccessModalProps {
  message: string;
}

export default function SuccessModal({ message }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center max-w-sm w-full"
      >
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
        <p className="text-sm text-gray-500">Giriş səhifəsinə yönləndirilirsiniz...</p>
      </motion.div>
    </div>
  );
}
