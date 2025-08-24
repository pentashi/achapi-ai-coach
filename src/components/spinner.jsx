export default function Spinner({ size = 64, color = 'cyan' }) {
  // size in px, color Tailwind prefix, customizable for flexibility
  const sizeClass = `w-${size / 4} h-${size / 4}`; // e.g. w-16 h-16 for 64px
  return (
    <div
      className={`border-4 border-dashed rounded-full animate-spin border-${color}-400 border-t-transparent`}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}
