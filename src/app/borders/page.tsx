import { Suspense } from 'react';

import { BordersContent } from './BordersContent';

export default function BordersPage() {
  return (
    <Suspense>
      <BordersContent />
    </Suspense>
  );
}
