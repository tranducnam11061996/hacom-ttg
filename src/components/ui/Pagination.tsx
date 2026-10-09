import { DemoLink } from "./Demo";
export function Pagination({
  totalPages,
  currentPage = 1,
}: {
  totalPages: number;
  currentPage?: number;
}) {
  return (
    <nav className="listing-pagination" aria-label="Phân trang">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <DemoLink
          key={page}
          className={`listing-page${page === currentPage ? " active" : ""}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </DemoLink>
      ))}
    </nav>
  );
}
