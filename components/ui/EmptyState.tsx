export default function EmptyState({ message = 'NO DATA' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="font-mono text-sm text-[--text-muted] tracking-widest">
        [ {message} ]
      </p>
    </div>
  );
}
