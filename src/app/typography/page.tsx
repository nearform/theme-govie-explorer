import { Suspense } from 'react';

import { TypographyContent } from './TypographyContent';

export default function TypographyPage() {
  return (
    <Suspense>
      <TypographyContent />
    </Suspense>
  );
}
