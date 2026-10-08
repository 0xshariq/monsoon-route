"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

type Coordinates = {
  lat: number;
  lon: number;
};

type RouteFormValues = {
  origin: Coordinates;
  destination: Coordinates;
};

type RouteFormProps = {
  onSubmit?: (values: RouteFormValues) => void;
};

const MUMBAI_BOUNDS = {
  north: 19.35,
  south: 18.85,
  east: 73.15,
  west: 72.65,
};

function PlaceInput({
  id,
  label,
  placeholder,
  onCoordinatesChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  onCoordinatesChange: (coordinates: Coordinates | null) => void;
}) {
  const places = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "name", "formatted_address"],
      bounds: MUMBAI_BOUNDS,
      strictBounds: false,
      types: ["geocode", "establishment"],
    });

    autocompleteRef.current = autocomplete;
    const listener = autocomplete.addListener("place_changed", () => {
      const location = autocomplete.getPlace().geometry?.location;
      if (!location) {
        onCoordinatesChange(null);
        return;
      }

      onCoordinatesChange({ lat: location.lat(), lon: location.lng() });
    });

    return () => {
      listener.remove();
      autocompleteRef.current = null;
    };
  }, [onCoordinatesChange, places]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        onChange={() => onCoordinatesChange(null)}
        className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function RouteFormFields({ onSubmit }: RouteFormProps) {
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!origin || !destination) {
      setError("Select both locations from the Google suggestions before continuing.");
      return;
    }

    setError(null);
    onSubmit?.({ origin, destination });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Plan your route</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose locations from the suggestions so we can use their exact coordinates.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <PlaceInput
          id="origin"
          label="From"
          placeholder="Enter your starting point"
          onCoordinatesChange={setOrigin}
        />
        <PlaceInput
          id="destination"
          label="To"
          placeholder="Enter your destination"
          onCoordinatesChange={setDestination}
        />
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      <button
        type="submit"
        className="h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Find safer route
      </button>
    </form>
  );
}

export function RouteForm({ onSubmit }: RouteFormProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      <RouteFormFields onSubmit={onSubmit} />
    </APIProvider>
  );
}

export default RouteForm;
export type { Coordinates, RouteFormValues };
