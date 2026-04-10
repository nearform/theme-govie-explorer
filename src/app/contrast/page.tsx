import { Suspense } from 'react';

import { ContrastContent } from './ContrastContent';

export default function ContrastPage() {
  return (
    <Suspense>
      <ContrastContent />
    </Suspense>
  );
}
