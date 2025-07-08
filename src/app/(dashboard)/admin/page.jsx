// app/(dashboard)/page.jsx 
import styles from "./AdminPage.module.css";
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

export default function AdminPage() {
  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={`${styles.leftSection} ${styles.leftTwoThirds}`}>
        {/* USER CARDS */}
        <div className={styles.userCards}>
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className={styles.middleCharts}>
          {/* COUNT CHART */}
          <div className={styles.countChart}>
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className={styles.attendanceChart}>
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className={styles.financeChart}>
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className={styles.rightSection}>
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}