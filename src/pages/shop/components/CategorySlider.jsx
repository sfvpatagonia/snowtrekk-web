import hexColor from "@/utils/generateHexColor";

export default function CategorySlider({
  shop,
  setServices,
  setProducts,
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  const handleSelectCategory = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setServices(shop.services || []);
      setProducts(shop.products || []);
    } else {
      setSelectedCategory(category);

      const filteredServices = shop.Services?.filter((service) =>
        service.categories.some((cat) => cat.id === category),
      );

      const filteredProducts = shop.Products?.filter((product) =>
        product.categories.some((cat) => cat.id === category),
      );

      setProducts(filteredProducts);
      setServices(filteredServices);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl items-center">
      <h3 className="text-xl font-bold text-left w-full">Categories</h3>
      <div className="flex max-w-full overflow-x-auto gap-4 justify-evenly p-4">
        {categories.map((category, index) => {
          console.log(category);
          return (
            <div
              className="group flex flex-col items-center justify-start gap-2 cursor-pointer duration-200 ease-in "
              key={index}
              onClick={() => {
                handleSelectCategory(category.id);
              }}
            >
              {/* <p
                className={`outline-2 ${
                  selectedCategory === category.id
                    ? "outline-green-700 dark:outline-green-500"
                    : "outline-main-950 dark:outline-main-50"
                } flex items-center justify-center w-[100px] aspect-square rounded-full  font-bold text-lg text-main-0 dark:text-main-1000  group-hover:outline-main-600 group-hover:dark:outline-main-400 uppercase duration-200 ease-in`}
                style={{
                  backgroundColor: hexColor(),
                }}
              >
                {category.name.split(" ")[0][0]}
                {category.name.split(" ")[1] && category.name.split(" ")[1][0]}
              </p> */}
              <img
                src={category.Images[0].url}
                alt={category.name}
                className={`outline-2 ${
                  selectedCategory === category.id
                    ? "outline-green-700 dark:outline-green-500"
                    : "outline-main-950 dark:outline-main-50"
                } flex w-[150px] aspect-square rounded-full  font-bold text-lg text-main-0 dark:text-main-1000  group-hover:outline-main-600 group-hover:dark:outline-main-400 duration-200 ease-in
                bg-center bg-contain`}
                style={{
                  backgroundColor: hexColor(),
                }}
              />
              <p
                className={`${
                  selectedCategory === category.id &&
                  "font-bold text-green-700 dark:text-green-500"
                } text-center overflow-hidden group-hover:text-main-600 group-hover:dark:text-main-400 duration-200 ease-in`}
              >
                {category.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
