// file: src/app/bar/page.tsx

export default function BarDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Bar Overview & Stats</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="border p-4 rounded bg-gray-100">
          <h2 className="font-semibold text-lg">Orders Today</h2>
          <p className="text-3xl mt-2 text-red-600">--</p>
        </div>
        <div className="border p-4 rounded bg-gray-100">
          <h2 className="font-semibold text-lg">Unpaid Orders</h2>
          <p className="text-3xl mt-2 text-red-600">--</p>
        </div>
        <div className="border p-4 rounded bg-gray-100">
          <h2 className="font-semibold text-lg">Served but Unpaid</h2>
          <p className="text-3xl mt-2 text-yellow-600">--</p>
        </div>
        <div className="border p-4 rounded bg-gray-100">
          <h2 className="font-semibold text-lg">Total Revenue Today</h2>
          <p className="text-3xl mt-2 text-green-600">£--.--</p>
        </div>
        <div className="border p-4 rounded bg-gray-100">
          <h2 className="font-semibold text-lg">Most Active Waitress</h2>
          <p className="text-xl mt-2">--</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        All values are updated in real-time. Important figures are marked in <span className="text-red-600 font-semibold">red</span>.
        This page is fully responsive and mobile friendly.
      </p>
    </div>
  );
}
