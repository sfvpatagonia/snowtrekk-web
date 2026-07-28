export const calculateShopAverageScore = (services = []) => {
  const validScores = services
    .map((s) => s.averageScore)
    .filter((score) => score !== null && score !== undefined);

  if (!validScores.length) return null;

  const total = validScores.reduce((acc, score) => acc + score, 0);

  return (total / validScores.length).toFixed(1);
};

export const calculateShopViews = (services = []) => {
  return services.reduce((total, service) => {
    return total + (service.views || 0);
  }, 0);
};

export const calculateShopSales = (services = []) => {
  return services.reduce((total, service) => {
    return total + (service.sold || 0);
  }, 0);
};
