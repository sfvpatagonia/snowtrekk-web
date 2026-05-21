import { Box, Typography } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { Link } from "react-router-dom";

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

export default function SalesStadistics({
  mostFrequentActivities,
  mostViewedService,
  bestScoredService,
  topProducts,
  monthlySales,
  bestMonth,
  currentMonthSales,
  currentMonthSold,
}) {
  const barChartData = Array.isArray(monthlySales)
    ? monthlySales.map(([month, total]) => ({
        month,
        services: total,
        products: 0, // Example: assuming products are 80% of total
      }))
    : [];

  const pieData = mostFrequentActivities.map(([activity, sold]) => {
    return {
      value: sold,
      label: activity,
    };
  });

  return (
    <div className="bg-main-50 dark:bg-main-950 p-4 rounded w-full max-w-[1024px] flex flex-col gap-4 shadow">
      <h1 className="md:block font-bold text-main-0 dark:text-main-1000 text-left w-full max-w-[1024px] mx-auto">
        Sales Statistics
      </h1>

      <section className="flex flex-col lg:flex-row gap-8 w-full justify-between">
        <div className="w-full lg:w-1/2 min-w-[300px]">
          {/* First Section: Most Frequent Activities */}
          <section className="flex bg-main-100 dark:bg-main-900 p-4 rounded shadow h-full flex-col gap-2">
            <h2 className="text-main-0 dark:text-main-1000 text-center text-xl">
              Most Frequent Activities
            </h2>
            <Box className="w-full mx-auto flex justify-center">
              <PieChart
                colors={colors}
                series={[
                  {
                    data: pieData,
                    innerRadius: 40,
                    outerRadius: 80,
                    cornerRadius: 3,
                    paddingAngle: 2,
                    arcLabel: (data) => `${data.value}`,
                  },
                ]}
                width={200}
                height={200}
                slotProps={{
                  legend: {
                    direction: "horizontal",

                    sx: {
                      marginTop: "16px",
                      "& .MuiPieLegend-itemLabel": {
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#FFFFFF"
                          : "#000000",
                      },
                    },
                  },
                }}
              />
            </Box>
          </section>
        </div>
        <div className="flex flex-col gap-8 w-full text-main-0 dark:text-main-1000">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-col w-full sm:w-1/2 gap-2">
              {/* Second Section: Most Viewed Service */}
              <section className="flex flex-col bg-main-100 dark:bg-main-900 p-4 rounded shadow ">
                <h3 className="font-semibold text-lg text-main-600 dark:text-main-400">
                  Trending
                </h3>
                {mostViewedService && (
                  <Typography variant="body1">
                    The most viewed service is{" "}
                    <Link
                      to={`/service/${mostViewedService.id}`}
                      className="text-green-700 dark:text-green-400 hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in"
                    >
                      {mostViewedService.name}
                    </Link>{" "}
                    with{" "}
                    <span className="font-bold text-main-600 dark:text-main-400">
                      {mostViewedService.views}
                    </span>{" "}
                    views.
                  </Typography>
                )}
              </section>
              <section className="flex flex-col bg-main-100 dark:bg-main-900 p-4 rounded shadow ">
                <h3 className="font-semibold text-lg text-main-600 dark:text-main-400">
                  Sales This Month
                </h3>
                <Typography variant="body1">
                  Total sales for the current month:{" "}
                  <span className="font-bold text-main-600 dark:text-main-400">
                    ${currentMonthSales.toFixed(2)}
                  </span>
                </Typography>
              </section>
            </div>
            <div className="flex flex-col w-full sm:w-1/2 gap-2">
              {/* Third Section: Best Scored Service */}
              <section className="flex flex-col bg-main-100 dark:bg-main-900 p-4 rounded shadow ">
                <h3 className="font-semibold text-lg text-main-600 dark:text-main-400">
                  Best Rated
                </h3>
                {bestScoredService && (
                  <Typography variant="body1">
                    The best rated service is{" "}
                    <Link
                      to={`/service/${bestScoredService.id}`}
                      className="text-green-700 dark:text-green-400 hover:text-main-600 dark:hover:text-main-400 duration-200 ease-in"
                    >
                      {bestScoredService.name}
                    </Link>{" "}
                    with an average score of{" "}
                    <span className="font-bold text-main-600 dark:text-main-400">
                      {bestScoredService.averageScore}
                    </span>
                    .
                  </Typography>
                )}
              </section>
              <section className="flex flex-col bg-main-100 dark:bg-main-900 p-4 rounded shadow ">
                <h3 className="font-semibold text-lg text-main-600 dark:text-main-400">
                  Total Sold This Month
                </h3>
                <Typography variant="body1">
                  Total activities sold this month:{" "}
                  <span className="font-bold text-main-600 dark:text-main-400">
                    {currentMonthSold}
                  </span>
                </Typography>
              </section>
            </div>
          </div>
          <div>
            {/* Monthly Sales Section */}
            <section className="flex flex-col bg-main-100 dark:bg-main-900 p-4 rounded shadow ">
              <h2 className="text-main-0 dark:text-main-1000 text-center text-xl">
                Monthly Charts
              </h2>
              <Box >
                {barChartData.length > 0 ? (
                  <BarChart
                    dataset={barChartData}
                    xAxis={[{ scaleType: "band", dataKey: "month" }]}
                    series={[
                      { dataKey: "services", label: "Services Sales" },
                      { dataKey: "products", label: "Products Sales" },
                    ]}
                    height={300}
                    className="w-full"
                  />
                ) : (
                  <Typography className="text-main-0 dark:text-main-1000 text-center text-xl">
                    No sales data available.
                  </Typography>
                )}
                <Box>
                  <Typography variant="body1">
                    <strong>Best month:</strong> {bestMonth}
                  </Typography>
                </Box>
              </Box>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
