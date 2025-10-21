export default function ErrorMessage({ children }) {
  return (
    <div className="w-full">
      <p className="text-center text-red-600">{children}</p>
    </div>
  );
}
