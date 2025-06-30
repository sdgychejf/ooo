"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="w-64 bg-white shadow-lg border-l flex flex-col min-h-screen">
      <div className="p-6 border-b">
        <Link href="/" className="text-xl font-bold text-gray-900">
          QAnything
        </Link>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col space-y-2">
          <Link
            href="/"
            className={`w-full px-4 py-3 rounded-md text-sm font-medium transition-colors text-left ${
              isActive("/") && pathname === "/"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            知识库管理
          </Link>

          <Link
            href="/agents"
            className={`w-full px-4 py-3 rounded-md text-sm font-medium transition-colors text-left ${
              isActive("/agents")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            Agent管理
          </Link>

          <Link
            href="/chat"
            className={`w-full px-4 py-3 rounded-md text-sm font-medium transition-colors text-left ${
              isActive("/chat")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            Stream对话
          </Link>

          <Link
            href="/homework"
            className={`w-full px-4 py-3 rounded-md text-sm font-medium transition-colors text-left ${
              isActive("/homework")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            过往作业
          </Link>
        </div>
      </div>
    </nav>
  );
}
