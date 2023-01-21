interface ProgressBarProps {
  progress: number;
}
export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className='h-3 bg-zinc-700 rounded-xl w-full mt-4'>
      <div
        role='progressbar'
        aria-label='Progresso de hábitos completados nesse dia'
        aria-valuenow={progress}
        className='h-3 bg-violet-600 rounded-xl transition-all'
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
