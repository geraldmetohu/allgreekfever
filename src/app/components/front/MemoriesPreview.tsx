import Link from "next/link";

const memories = [
  { src: "/kelly_edit.mp4", type: "video" },
  { src: "/dancing2.jpg", type: "image" },
  { src: "/edit_first.mp4", type: "video" },
  { src: "/sax.jpg", type: "image" },
];

export default function MemoriesPreview() {
  return (
    <section className="bg-gradient-to-r from-zinc-900 to-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Memories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
          {memories.map((mem, i) => (
            mem.type === "image" ? (
              <img
                key={i}
                src={mem.src}
                alt={`Memory ${i + 1}`}
                className="w-full h-40 object-cover rounded-xl shadow-md border-2 border-amber-600"
              />
            ) : (
              <video
                key={i}
                src={mem.src}
                className="w-full h-40 object-cover rounded-xl shadow-md auto border-2 border-amber-600"
                controls
                autoPlay
                
              />
            )
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/memories"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-800"
          >
            See More
          </Link>
        </div>
      </div>
    </section>
  );
}
