'use client';

import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        {title}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={() => router.push(action.href)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
