'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestAuthPage(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Redirection vers la nouvelle page compte
    router.replace('/compte');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boulangerie-gold mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers votre compte...</p>
      </div>
    </div>
  );
}
