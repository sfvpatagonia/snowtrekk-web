import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import activitiesAPI from "@/services/activities";
import Reveal from "../../../components/RevealWrapper";

export default function ActivitiesGuide() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    activitiesAPI
      .getFeaturedActivities()
      .then((data) => setActivities(data.body.activities));
  }, []);

  return (
    <section className="bg-main-50 dark:bg-main-950 rounded-lg xl:rounded-none xl:-mx-6 text-main-0 dark:text-main-1000">
      <div className="flex w-full flex-col  p-4 ">
        <h2 className="text-center text-2xl font-bold text-main-600 dark:text-main-400 uppercase">
          No more limits
        </h2>
        <p className="font-bold ">Explore what you want to do</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-5 w-full justify-center gap-6 px-20">
        {activities.map((activity, index) => (
          <Reveal key={index}>
            <Link
              key={activity.id}
              to={`/activity/${activity.id}`}
              className="group flex flex-col w-full items-center text-center 
            font-bold text-main-500 transition-all duration-300 ease-in-out"
            >
              <div
                className="rounded-full overflow-hidden border-3 border-transparent 
              transition-all duration-300 ease-in-out 
              group-hover:border-green-700"
              >
                <img
                  src={activity.Images[0]?.url}
                  alt={activity.name}
                  className="w-full aspect-square object-cover rounded-full 
                transition-transform duration-300 ease-in-out 
                group-hover:scale-120"
                />
              </div>
              <p
                className="mt-2 text-main-0 dark:text-main-1000 transition-colors duration-300 ease-in-out 
              group-hover:text-main-400"
              >
                {activity.name}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="flex px-20 py-6 justify-end">
          {/* <button className="button">See All Activities</button> */}
        </div>
      </Reveal>
    </section>
  );
}
