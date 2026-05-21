import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

export default function AboutUs() {
  return (
    <>
      <Header />

      <div className="flex gap-2 bg-main-100 dark:bg-main-950 lg:bg-[url('/src/assets/bg-new4.jpg')] bg-cover bg-fixed bg-blend-normal">
        <main className="flex flex-col w-full overflow-hidden gap-6 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 xl:px-6 p-6 rounded-lg text-main-0 dark:text-main-1000 text-left">
          {/* TITLE */}
          <section className="text-center py-6">
            <h1 className="text-3xl font-black text-main-600 dark:text-main-400 uppercase">
              About us
            </h1>
            <p className="mt-2 font-semibold ">Snowtrekk</p>
            <p className="text-sm opacity-70 mt-1">Last updated: 27/11/2025</p>
          </section>

          {/* CONTENT */}
          <section className="flex flex-col gap-6 text-sm leading-relaxed">
            <p className="font-semibold">
              It's about having unique experiences.
            </p>
            <p>
              <strong>Snowtrekk</strong> was born from the shared dream of a
              group of skiers, mountaineers and mountain lovers who travelled
              through Patagonia, the United States, Europe and Japan looking for
              more than just a destination: they were looking for moments that
              would remain etched in their memories forever. In each place, the
              same need arose: to find, in a simple way, everything that made
              each adventure possible—a good rental, a refuge to rest, reliable
              transport, food that comforts the soul. Thus began the story of
              Snowtrekk: A platform created to save, share, and multiply those
              experiences that left a mark on us. Every route travelled, every
              night in a new place, every encounter was recorded along the way,
              and today we want that knowledge to be part of yours. Snowtrekk
              invites you to explore the mountains your way, accompanied by
              those who have already walked those trails. We want planning your
              adventure to be as enjoyable as experiencing it. We are inspired
              to recommend local providers who, with passion and experience,
              keep the outdoor spirit alive. They are the ones who turn each
              activity into an unforgettable memory, guaranteeing quality,
              safety, and an authentic connection to the place. We believe in
              the transformative power of outdoor experiences and in the people
              who make them possible. That's why we created a marketplace and a
              SaaS platform designed to help these providers grow with
              technology, strengthening their communities and protecting the
              environment that gives us so many emotions.
            </p>

            <h2 className="text-lg font-bold">Our essence</h2>
            <p className="font-semibold">
              Technology that drives experiences and generates triple impact. We
              scale your outdoor business with purpose. More reach. More impact.
              More growth.
            </p>
            <p>
              We work today so that tomorrow continues to be full of adventures.
              We are driven to support communities that seek to prosper while
              continuing to value their land. That is where we find ourselves:
              in every story behind an experience, in every memory we want to
              help preserve for those who have not yet arrived.
            </p>
            <p className="font-semibold">
              Impact today, future for all. Growth with purpose, stories that
              endure. We cherish today's adventures for tomorrow's generations.
            </p>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
