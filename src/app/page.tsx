export default function MonsoonRouteHome() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            MonsoonRoute
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400">
            Rain-aware route decision system — compare routes using forecast rain,
            waterlogging evidence, and travel-time trade-offs to find the safer path.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-primary/30 hover:bg-neutral-800/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                <path d="M13.667 13.667L7.334 7.334" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">Find Safer Route</h2>
            <p className="text-neutral-400">
              Enter origin and destination to compare available routes and get a rain-aware recommendation.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-primary/30 hover:bg-neutral-800/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17V9a2 2 0 0 0-2-2H8v11h11z" />
                <path d="M8 9v3" />
                <path d="M8 12v3" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">Real-time Analysis</h2>
            <p className="text-neutral-400">
              Analyze rain risk, waterlogging exposure, environmental conditions, and time penalties for each route.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-primary/30 hover:bg-neutral-800/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">Smart Recommendation</h2>
            <p className="text-neutral-400">
              Receive deterministic route recommendations based on weighted risk scores and evidence.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-primary/30 hover:bg-neutral-800/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01" />
                <path d="M12 10h.01" />
                <path d="M16 10h.01" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">Natural Language</h2>
            <p className="text-neutral-400">
              Get AI explanations for route decisions — see exactly why your recommended path was chosen.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
