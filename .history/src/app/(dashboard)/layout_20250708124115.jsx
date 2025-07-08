import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      {/* LEFT */}
      <div className={styles.sidebar}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className={styles.logoText}>SchooLama</span>
        </Link>
        <Menu />
      </div>

      {/* RIGHT */}
      <div className={styles.content}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}