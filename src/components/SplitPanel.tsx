interface SplitPanelProps {
  list: React.ReactNode;
  detail: React.ReactNode;
  showDetail?: boolean;
  onCloseDetail?: () => void;
}

export function SplitPanel({
  list,
  detail,
  showDetail = false,
  onCloseDetail,
}: SplitPanelProps) {
  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden h-[calc(100vh-56px)] lg:flex">
        <aside className="flex w-[400px] shrink-0 flex-col border-r border-nf-grey bg-white">
          {list}
        </aside>
        <section className="flex-1 overflow-y-auto bg-nf-light-grey" aria-live="polite">
          {detail}
        </section>
      </div>

      {/* Tablet: stacked */}
      <div className="hidden h-[calc(100vh-56px)] flex-col md:flex lg:hidden">
        <div className="flex h-1/2 shrink-0 flex-col border-b border-nf-grey bg-white">
          {list}
        </div>
        <div className="flex-1 overflow-y-auto bg-nf-light-grey" aria-live="polite">
          {detail}
        </div>
      </div>

      {/* Mobile: list-only, detail as overlay */}
      <div className="flex h-[calc(100vh-56px)] flex-col md:hidden">
        <div className={`flex-1 flex-col bg-white ${showDetail ? 'hidden' : 'flex'}`}>
          {list}
        </div>
        {showDetail && (
          <div className="flex flex-1 flex-col bg-nf-light-grey">
            <div className="flex items-center border-b border-nf-grey bg-white px-4 py-2">
              <button
                type="button"
                onClick={onCloseDetail}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-nf-muted-grey transition-colors hover:text-nf-deep-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nf-green"
                aria-label="Back to token list"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" aria-live="polite">
              {detail}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
