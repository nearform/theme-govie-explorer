import { Suspense } from 'react';

import { ShadowsContent } from './ShadowsContent';

export default function ShadowsPage() {
  return (
    <Suspense>
      <ShadowsContent />
    </Suspense>
  );
}
