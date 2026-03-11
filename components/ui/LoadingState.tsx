export default function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="font-mono text-sm text-[--accent]">
        LOADING<span className="cursor-blink">_</span>
      </span>
    </div>
  );
}
