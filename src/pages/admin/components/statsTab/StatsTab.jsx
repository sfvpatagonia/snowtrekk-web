import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import statsService from "@/services/stats";

const KpiCard = ({ label, value, isMock }) => (
  <div className="bg-main-50 dark:bg-main-950 p-4 rounded-lg relative">
    {isMock && (
      <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase text-yellow-700 bg-yellow-200 dark:text-yellow-200 dark:bg-yellow-900 px-2 py-0.5 rounded">
        Mock
      </span>
    )}
    <h3 className="text-sm text-gray-500 dark:text-gray-200">{label}</h3>
    <p className="text-xl font-bold text-black dark:text-white">{value}</p>
  </div>
);

const StatsBlock = ({ title, children }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-lg font-semibold text-main-0 dark:text-main-1000">
      {title}
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{children}</div>
  </section>
);

export default function StatsTab({ active }) {
  const user = useSelector((state) => state.user);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    statsService.getStats(user.token).then((data) => {
      if (data.ok) {
        setStats(data.body);
      }
      setLoading(false);
    });
  }, [active]);

  if (loading) {
    return <p className="text-main-0 dark:text-main-1000">Loading stats...</p>;
  }

  if (!stats) {
    return (
      <p className="text-main-0 dark:text-main-1000">
        Could not load statistics.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <StatsBlock title="Growth">
        <KpiCard label="Total Users" value={stats.growth.totalUsers} />
        <KpiCard
          label="Active Users (30 days)"
          value={stats.growth.activeUsersLast30Days.value}
          isMock={stats.growth.activeUsersLast30Days.isMock}
        />
        <KpiCard
          label="New Users This Week"
          value={stats.growth.newUsersThisWeek}
        />
      </StatsBlock>

      <StatsBlock title="Business">
        <KpiCard label="Leads Generated" value={stats.business.totalLeads} />
        <KpiCard label="Conversions" value={stats.business.conversions} />
        <KpiCard
          label="Commissions Generated"
          value={`$${stats.business.totalCommissions.toLocaleString()}`}
        />
        <KpiCard
          label="Active Stores"
          value={stats.business.totalActiveStores}
        />
      </StatsBlock>

      <StatsBlock title="Content">
        <KpiCard
          label="Active Destinations"
          value={stats.content.totalActiveDestinations}
        />
      </StatsBlock>
    </div>
  );
}
