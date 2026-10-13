import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="site-container py-8">
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <Link
        prefetch={false}
        href="/"
        className="mt-4 inline-block text-brand-text"
      >
        Về trang chủ TGB SHOP
      </Link>
    </main>
  );
}
