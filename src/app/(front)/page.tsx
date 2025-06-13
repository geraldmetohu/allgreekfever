import Hero from "@/app/components/front/Hero";

import { getBanners, getEvents } from "../actions";
import WhyBookOnline from "../components/front/WhyBookOnline";
import NextEvent from "../components/front/NextEvent";
import SlideShow from "../components/front/SlideShow";
import EventShowcase from "../components/front/EventShowCase";
import MemoriesPreview from "../components/front/MemoriesPreview";
import { FeaturedPosters } from "../components/front/FeaturedPosters";

export default async function Home() {
  const banners = await getBanners();
  const events = await getEvents();

  if (!banners || banners.length === 0) {
    return <p>No banners found.</p>;
  }

  const banner = banners[0];

  return (
    
    <div className="space-y-20 text-amber-50">
      <Hero
        backgroundImage={banner.imageString}
        title={banner.title}
        subtitle={banner.subtitle}
      />
      <FeaturedPosters />


      {/* Why book online section */}
      <WhyBookOnline  />

      {/* Next Event (based on closest date) */}
      <NextEvent events={events} />

      {/* Showcase 3 latest events */}
      <EventShowcase events={events} />

      {/* Full width slideshow */}
      <SlideShow />

      {/* Memories Preview Section */}
      <MemoriesPreview />
    </div>
  );
}
