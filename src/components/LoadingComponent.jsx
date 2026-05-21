import logo from "@/assets/logoST.png";

const LoadingComponent = () => {
  return (
    <div className="fixed flex flex-col justify-center items-center h-screen w-screen gap-12 bg-main-100 dark:bg-main-900 top-0 left-0 z-[999]">
      <img src={logo} alt="Loading..." className="w-60 md:w-[600px]" />
      <div className="w-1/2 lg:w-2/5 h-[10px] bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full w-0 bg-main-600 dark:bg-main-400 
        animate-fill"
        />
      </div>
    </div>
  );
};

export default LoadingComponent;
