import Link from "next/link";

// Injected after the collection/global links in the admin nav (afterNavLinks).
export function ManualNavLink() {
  return (
    <Link className="manual-nav-link" href="/admin/manual">
      CMS Manual
    </Link>
  );
}
