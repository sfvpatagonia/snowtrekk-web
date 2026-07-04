function CardNew({ id, title, img, setOnFront, featuredUrl }) {
  return (
    <div
      className="flex bg-main-100 dark:bg-main-900 flex-col p-2 w-[300px] cursor-pointer overflow-hidden shadow-lg duration-200 ease-in-out rounded-xl hover:outline-2 hover:outline-green-700"
      onClick={setOnFront}
      key={id}
    >
      <div className="group w-full rounded-md object-cover border-2 border-main-600 dark:border-main-400 aspect-[3/2] overflow-hidden">
        <img
          src={img}
          alt="imgnoticia"
          className="w-full object-cover h-full group-hover:scale-120 duration-300 ease-linear"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 justify-between flex-1">
        <div>
          <h2 className="text-lg font-bold text-main-600 dark:text-main-400 text-left">
            {title}
          </h2>
        </div>
        {featuredUrl && (
          <a
            href={`https://${featuredUrl}`}
            className="text-green-700 text-end cursor-pointer duration-300 ease-in hover:scale-105"
          >
            View More &#187;
          </a>
        )}
      </div>
    </div>
  );
}

export default CardNew;
