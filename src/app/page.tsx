import RouteForm from "@/components/route-form";
import RouteMap from "@/components/route-map";

export default function MonsoonRouteHome() {
  return (
    <main className="flex-1 bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            MonsoonRoute
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose the safer route when rain changes the road.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Compare routes using forecast rain, waterlogging evidence, and
            travel-time trade-offs.
          </p>
        </header>

        <RouteForm />

        <RouteMap origin={{
          lat: 0,
          lon: 0
        }} destination={{
          lat: 0,
          lon: 0
        }} routes={[]} recommendedRouteId={""} hotspots={[]} />
      </div>
    </main>
  );
}
