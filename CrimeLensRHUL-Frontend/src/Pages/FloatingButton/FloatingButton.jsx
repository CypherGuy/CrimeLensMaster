import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function FloatingButton({ onClick }) {
  return (
    <button
      className="fixed bottom-6 right-6 bg-white text-red-600 p-5 rounded-full shadow-lg border-2 border-red-600 hover:bg-red-100 transition flex items-center justify-center"
      onClick={onClick}
    >
      <img src="/warn.svg" alt="Warning" className="h-12 w-12" />
    </button>
  );
}
