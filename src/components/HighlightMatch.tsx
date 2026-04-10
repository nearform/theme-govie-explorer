interface HighlightMatchProps {
  text: string;
  query: string;
}

export function HighlightMatch({ text, query }: HighlightMatchProps) {
  if (!query) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      {before}
      <mark className="rounded-sm bg-nf-light-purple px-0.5 text-inherit">{match}</mark>
      {after}
    </>
  );
}
