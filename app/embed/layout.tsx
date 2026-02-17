import Script from "next/script";

export default async function EmbedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Record<string, string | string[]>>;
}) {
  await params;
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.contentWindow.min.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
