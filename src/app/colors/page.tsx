import { Suspense } from 'react';

import { ColorsContent } from './ColorsContent';

export default function ColorsPage() {
  return (
    <Suspense>
      <ColorsContent />
    </Suspense>
  );
}
