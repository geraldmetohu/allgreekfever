export default function Loading() {
  return (
    <div className="space-y-8 px-6 py-20 text-center animate-pulse">
      <div className="h-64 bg-muted rounded-xl" />
      <div className="space-y-4">
        <div className="h-6 w-3/4 mx-auto bg-muted rounded" />
        <div className="h-4 w-1/2 mx-auto bg-muted rounded" />
      </div>
      <div className="h-48 bg-muted rounded-xl mx-auto max-w-5xl" />
      <div className="h-48 bg-muted rounded-xl mx-auto max-w-5xl" />
      <div className="h-48 bg-muted rounded-xl mx-auto max-w-5xl" />
    </div>
  );
}
