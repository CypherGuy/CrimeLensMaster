import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const API_KEY = "AIzaSyCy-9dP2gyQzbx5-xRjPbpiefN5a_oeFLY"; 

const containerStyle = {
	width: "100%",
	height: "500px",
};

const center = {
	lat: 51.5074,
	lng: -0.1278,
};

const MapComponent: React.FC = () => {
	const [locations, setLocations] = useState <
		{ lat: number; lng: number; title: string }[]
		> ([]);

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const response = await axios.get("http://localhost:3051/api/get-map"); // Changed 5031 to 3051

				setLocations(response.data.locations);
			} catch (error) {
				console.error("Error fetching locations:", error);
			}
		};

		fetchLocations();
	}, []);

	return (
		<LoadScript googleMapsApiKey={API_KEY}>
			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
				{locations.map((location, index) => (
					<Marker key={index} position={location} title={location.title} />
				))}
			</GoogleMap>
		</LoadScript>
	);
};

export default MapComponent;