"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Coordinates = {
  lat: number;
  lon: number;
};

type TravelMode = "DRIVE" | "TWO_WHEELER";

type RouteFormValues = {
  origin: Coordinates;
  destination: Coordinates;
  travelMode: TravelMode;
  departureTime: string;
};

type RouteFormProps = {
  onSubmit?: (values: RouteFormValues) => void | Promise<void>;
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
  coordinates,
  onCoordinatesChange,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  coordinates: Coordinates | null;
  onCoordinatesChange: (coordinates: Coordinates | null) => void;
  error?: string;
}) {
  const places = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<
    InstanceType<NonNullable<typeof places>["Autocomplete"]> | null
  >(null);
  const coordinatesRef = useRef(coordinates);

  useEffect(() => {
    coordinatesRef.current = coordinates;
  }, [coordinates]);

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
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;

      if (!location) {
        onCoordinatesChange(null);
        return;
      }

      onCoordinatesChange({
        lat: location.lat(),
        lon: location.lng(),
      });
    });

    return () => {
      listener.remove();
      autocompleteRef.current = null;
    };
  }, [onCoordinatesChange, places]);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        ref={inputRef}
        id={id}
        name={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={() => {
          if (coordinatesRef.current) {
            onCoordinatesChange(null);
          }
        }}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

function RouteFormFields({ onSubmit }: RouteFormProps) {
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>("DRIVE");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "selected"
  >("idle");

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser.");
      return;
    }

    setError(null);
    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setOrigin({ lat: coords.latitude, lon: coords.longitude });
        setLocationStatus("selected");
      },
      (geolocationError) => {
        setLocationStatus("idle");
        setError(
          geolocationError.code === geolocationError.PERMISSION_DENIED
            ? "Location permission was denied. Enter your starting point instead."
            : "We could not determine your location. Enter your starting point instead.",
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!origin || !destination) {
      setError("Select both locations from the Google suggestions before continuing.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit?.({
        origin,
        destination,
        travelMode,
        departureTime: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">Plan your route</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose locations from the suggestions so we can use their exact
          coordinates.
        </p>
      </div>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldGroup>
            <PlaceInput
              id="origin"
              label="From"
              placeholder="Enter your starting point"
              coordinates={origin}
              onCoordinatesChange={(coordinates) => {
                setOrigin(coordinates);
                setLocationStatus("idle");
                setError(null);
              }}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={useMyLocation}
              disabled={locationStatus === "loading" || isSubmitting}
              className="w-fit border-success text-success hover:bg-success/10 hover:text-success"
            >
              {locationStatus === "loading"
                ? "Finding your location…"
                : "Use my location"}
            </Button>

            {locationStatus === "selected" ? (
              <p className="text-xs text-muted-foreground">
                Current location selected as your starting point.
              </p>
            ) : null}
          </FieldGroup>

          <PlaceInput
            id="destination"
            label="To"
            placeholder="Enter your destination"
            coordinates={destination}
            onCoordinatesChange={(coordinates) => {
              setDestination(coordinates);
              setError(null);
            }}
          />
        </div>

        <Field data-invalid={Boolean(error && !origin && !destination)}>
          <FieldLabel htmlFor="travel-mode">Travel mode</FieldLabel>
          <Select
            value={travelMode}
            onValueChange={(value) => setTravelMode(value as TravelMode)}
          >
            <SelectTrigger
              id="travel-mode"
              className="w-full"
              aria-invalid={Boolean(error && !origin && !destination)}
            >
              <SelectValue placeholder="Choose travel mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRIVE">Driving</SelectItem>
              <SelectItem value="TWO_WHEELER">Two-wheeler</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Departure time uses the moment you submit the route.
          </FieldDescription>
        </Field>

        {error ? <FieldError>{error}</FieldError> : null}
      </FieldGroup>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Analyzing routes..." : "Find safer route →"}
      </Button>
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
export type { Coordinates, RouteFormValues, TravelMode };
