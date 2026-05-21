export default function FAQ({ faqs }) {
  return (
    <div className="flex flex-col text-left rounded shadow text-main-0 dark:text-main-1000 p-4 gap-4 w-full bg-main-50 dark:bg-main-950">
      <h3 className="text-xl w-full flex-1 text-left border-b-2 border-main-600 dark:border-main-400  ">
        Frecuently asked questions
      </h3>
      <ul>
        {faqs.map((item, index) => {
          return (
            <li key={index} className=" text-main-0 dark:text-main-1000">
              <h3 className="text-lg ">{item.question}</h3>
              <p className="p-2 bg-main-100 dark:bg-main-900 mb-2">
                {item.answer}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
