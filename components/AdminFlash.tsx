export default function AdminFlash({ message, error }: { message?: string; error?: string }) {
  if (!message && !error) return null;
  return <p className={`admin-flash ${error ? "error" : "success"}`}>{error || message}</p>;
}
