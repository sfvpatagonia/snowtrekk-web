const ShopLocations = ({ services }) => {
  const destinations = [
    ...new Map(
      services
        .flatMap((service) => service.destinations || [])
        .map((destination) => [destination.id, destination]),
    ).values(),
  ];

  return (
    <div className="space-y-3 text-black dark:text-white">
      {/* <h3 className="text-lg font-semibold">Destinations</h3> */}

      {destinations.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-200 py-4">
          No services available
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {destinations.map((d) => (
          <div
            key={d.id}
            className="flex flex-row gap-2 bg-main-50 dark:bg-main-950 lg:justify-center p-2 rounded flex-wrap"
          >
            <p className="font-medium">{d.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopLocations;
