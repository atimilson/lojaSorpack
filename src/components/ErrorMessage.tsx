export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen text-red-500">
      {message}
    </div>
  );
} 