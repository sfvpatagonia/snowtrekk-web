import { Link } from "react-router-dom";

export default function LearnAbout({ destination }) {
  return (
    <section className="flex flex-col gap-6 py-6 bg-main-100 dark:bg-main-900 -mx-6">
      <h2 className="text-center text-2xl font-bold text-main-600 uppercase dark:text-main-400">
        Learn about
      </h2>
      <div className="flex flex-col lg:flex-row w-full h-auto">
        <div className="flex w-full px-4 lg:w-1/2 justify-center items-center ">
          <img
            src={destination.Images[0]?.url || ""}
            alt={destination.name}
            className="aspect-video w-3/4 lg:aspect-square bg-center object-cover rounded-2xl border-3 border-green-700"
          />
        </div>
        <div className="flex flex-col w-full px-4 lg:w-1/2 gap-4 text-main-0 dark:text-main-1000">
          <h3 className="text-center text-lg font-bold text-main-600 dark:text-main-400 uppercase">
            {destination.name}
          </h3>
          <pre className="text-sm text-left w-3/4 lg:w-full lg:px-8 py-2 mx-auto">
            {destination.description}
          </pre>
          <div className="flex px-8 justify-end">
            <Link to={`/destination/${destination.id}`} className="button">
              Go to {destination.name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
