import giveDefaultImage from "@/utils/profileshoppic";

export default function InformationCard({ shop }) {
  console.log(shop);
  return (
    <div className="flex items-start justify-center gap-4 bg-main-50 dark:bg-main-950 rounded w-full max-w-7xl p-2 shadow">
      <div className="flex items-center justify-center p-2 bg-main-100 dark:bg-main-900 rounded border border-main-600 dark:border-main-400 max-w-38">
        <img
          src={
            shop?.Image.url ||
            giveDefaultImage(Math.floor(Math.random() * 6) + 1)
          }
          className="w-full object-contain aspect-square"
          alt={shop.name}
        />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <h1 className="text-2xl text-left font-bold">{shop.name}</h1>
        <pre className="text-left max-h-62 overflow-auto bg-main-100 dark:bg-main-900 p-1 rounded-sm whitespace-pre-wrap">
          {shop.description}{" "}
        </pre>
        <div className="flex w-full justify-evenly p-2 mt-2 border-t border-main-600 dark:border-main-400">
          <span>Activities: {shop.Services.length}</span>
          <span>Products: {shop.Products?.length || 0}</span>
          {/* <span>Sales amount: {shop.salesAmount}</span> */}
          <span>Average score: {shop.averageScore}</span>
        </div>
      </div>
    </div>
  );
}
