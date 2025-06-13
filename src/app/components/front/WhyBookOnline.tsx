export default function WhyBookOnline() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-zinc-900 to-black text-white text-center">
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Should I Book a Table Online?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-lg">
          <div className="p-6 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl">
            <span className="text-2xl font-semibold block mb-2">01</span>
            Quickly and immediately
          </div>
          <div className="p-6 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl">
            <span className="text-2xl font-semibold block mb-2">02</span>
            All shapes in 1 click
          </div>
          <div className="p-6 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl">
            <span className="text-2xl font-semibold block mb-2">03</span>
            Super Offers
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <img
            src="/singer.jpg"
            alt="Table Preview"
            className="w-64 h-64 object-cover rounded-full animate-pulse shadow-lg border-4 border-white"
          />
          <div className="text-left max-w-md">
            <h3 className="text-xl font-semibold mb-2">See Preview of Your Table</h3>
            <p className="text-sm text-zinc-300">
              Instantly visualize the table you’ll reserve. From VIP to Silver – style, shape, and placement, all visible before you book.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
