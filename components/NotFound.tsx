import { useRouter } from 'next/router';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="pt-10 text-center">
      <span className="block text-emerald-600">404</span>
      <span className="block font-bold text-4xl">Page not found</span>

      <p className="font-light mb-6 text-gray-500">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <span
        onClick={router.back}
        className="cursor-pointer text-emerald-500 hover:text-emerald-400"
      >
        &larr; Go back
      </span>
    </div>
  );
}