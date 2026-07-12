type LoadingStateProps = {
    message?: string;
    compact?: boolean;
}

const LoadingState = ({ message = "Loading...", compact = false }: LoadingStateProps) => {
  return (
    <div role="status" aria-live="polite" className={compact
        ? "flex min-h-24 items-center justify-center"
        : "flex min-h-64 items-center justify-center"
      }>
        <p className="text-body-md text-on-surface-secondary">
            {message}
        </p>
    </div>
  )
}

export default LoadingState