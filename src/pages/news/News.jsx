import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import CardNew from "./components/CardNew";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/LoadingComponent";
import getNews from "@/services/getNews";
import video from "@/assets/videoSnowTrek.mp4";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";

function News() {
  const [loading, setLoading] = useState(false);
  const [isNewsLoaded, setIsNewsLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(true);
  const [news, setNews] = useState([]);
  const [onFront, setOnFront] = useState(0);
  const [playing, setPlaying] = useState(true);

  const snowtrekkFixedContent = {
    id: 0,
    content:
      "Welcome to Snowtrekk, your ultimate destination for travel inspiration and information! Explore our curated guides, tips, and resources to help you plan your next adventure with ease. Stay tuned for an exciting addition: a dedicated online store where you’ll soon find everything you need for your travels. We’re committed to making your journey unforgettable, so check back soon for more updates and offerings.",
    title: "Welcome to Snowtrekk!",
    Images: [
      {
        url: "https://contents.mediadecathlon.com/p2296534/k$f303d5449440d30397c05ec55e42ff06/DREAMSCAPE%20SNOWBOARD%20ALL%20ROAD%20500%20GRIS%20FONCE%20AH23.jpg?format=auto&f=2000x0",
      },
    ],
    video,
    featuredUrl: null,
    tags: [],
  };

  useEffect(() => {
    setLoading(true);
    getNews().then((data) => {
      const gettedNews = data.body.news;
      gettedNews.unshift(snowtrekkFixedContent);

      setNews(gettedNews);
      setIsNewsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isNewsLoaded && isVideoLoaded) {
      setLoading(false);
    }
  }, [isNewsLoaded, isVideoLoaded]);

  return (
    <div>
      <Header />

      <div>
        <div className="flex gap-2  dark:bg-main-950 lg:bg-[url('/src/assets/bg.png')] bg-repeat bg-fixed bg-blend-normal bg-main-100 min-h-[calc(100vh-60px)]">
          {loading ? <LoadingComponent /> : null}

          <main className="flex flex-col w-full overflow-hidden gap-4 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 px-6 ">
            <div className="flex justify-start flex-wrap gap-4 py-4">
              <div className="flex flex-col lg:flex-row lg:aspect-[16/6] bg-main-100 dark:bg-main-900 rounded-xl shadow-lg w-full border-r-3 border-main-600 dark:border-main-400">
                {onFront === 0 ? (
                  <div className="lg:w-[70%] w-full rounded-r-xl object-cover h-auto ">
                    <ReactPlayer
                      url={news[onFront]?.video}
                      playing={playing}
                      onReady={() => {
                        setLoading(false);
                      }}
                      onBuffer={() => setIsVideoLoaded(false)}
                      loop={true}
                      muted
                      width={"100%"}
                      height={"100%"}
                      controls
                    />
                  </div>
                ) : (
                  <img
                    src={news[onFront]?.Images[0].url}
                    className="lg:w-[70%] w-full rounded-r-xl object-cover h-auto "
                  />
                )}
                <div className="flex flex-col p-4 gap-2 flex-1 border-l-0 overflow-y-auto overflow-x-hidden">
                  <h2 className="text-xl text-left text-main-600 dark:text-main-400">
                    {news[onFront]?.title}
                  </h2>
                  <h3 className="text-left text-green-600 dark:text-green-400">
                    {news[onFront]?.subtitle}
                  </h3>
                  <div className="flex gap-1 max-w-full flex-wrap">
                    {news[onFront] &&
                      Object.entries(news[onFront].tags).flatMap(
                        ([key, values]) => {
                          return values.map((value, index) => (
                            <Link
                              key={value.id}
                              to={`/${key}/${value.id}`}
                              className="bg-main-600 dark:bg-main-400 text-main-1000 py-1 px-2 rounded-full text-sm"
                            >
                              {value.name}
                            </Link>
                          ));
                        },
                      )}
                  </div>
                  <div className="text-left relative text-main-0 dark:text-main-1000">
                    <p>{news[onFront]?.content}</p>
                  </div>

                  {news[onFront]?.featuredUrl && (
                    <a
                      href={`https://${news[onFront]?.featuredUrl}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="cursor-pointer text-green-700 duration ease-in text-end hover:scale-20"
                    >
                      View More &#187;
                    </a>
                  )}
                </div>
              </div>

              {news.map((singleNews, index) => {
                if (index === onFront) {
                  return;
                }
                return (
                  <CardNew
                    id={singleNews.id}
                    title={singleNews.title}
                    content={singleNews.content}
                    img={singleNews.Images[0].url}
                    setOnFront={() => {
                      window.scrollTo(0, 0);
                      setOnFront(index);
                    }}
                    featuredUrl={singleNews.featuredUrl}
                    key={index}
                  />
                );
              })}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default News;
