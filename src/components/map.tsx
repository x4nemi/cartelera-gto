import { useState, useEffect, useRef } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from '@heroui/react';
import { MapPinIcon } from './icons';

// Get API key from runtime config (Azure) or build-time env (local dev)
const API_KEY = window.APP_CONFIG?.GOOGLE_MAPS_API_KEY?.startsWith('%%') 
    ? import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
    : window.APP_CONFIG?.GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""

export const MapInput = () => {
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);
    return (
        <APIProvider apiKey={API_KEY}>
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
        </APIProvider>
    );
};

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
    const [placeAutocomplete, setPlaceAutocomplete] =
        useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');
    const [place, setPlace] = useState("")

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            componentRestrictions: { country: 'mx' },
            fields: ['geometry', 'name', 'formatted_address'],
            
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
            var foundPlace = placeAutocomplete.getPlace();
            onPlaceSelect(foundPlace);
            setPlace(foundPlace.formatted_address || "")
        });

    }, [onPlaceSelect, placeAutocomplete]);

    return (
        <Input 
            ref={inputRef}
            placeholder="Ingresa el domicilio"
            type="text"
            value={place}
            name="address"
            onChange={(e) => setPlace(e.target.value)}
            startContent={<MapPinIcon size={20} className="text-indigo-300" />}
        />
    );
};