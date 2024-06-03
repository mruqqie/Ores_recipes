import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Grid,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RestaurantsType } from "../constants";
import FoodLottie from "../components/FoodLottie";

interface Location {
	latitude: number | null;
	longitude: number | null;
}

const Restaurants = () => {
	const [location, setLocation] = useState<Location>({
		latitude: null,
		longitude: null,
	});
	const [error, setError] = useState<boolean | null>(false);
	const [loading, setLoading] = useState<boolean | null>(true);
	const [restaurants, setRestaurants] = useState<RestaurantsType | null>(
		null
	);

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(error) => {
					setError(true);
					alert(error.message);
				}
			);
		} else {
			setError(true);
			alert("Error fetching location");
		}
	};

	const fetchRestaurants = async (latitude: number, longitude: number) => {
		const apiKey = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;
		if (!apiKey) {
			console.log("API key is missing");
			return;
		}

		const url = `https://api.foursquare.com/v3/places/search?query=Restaurant&ll=${latitude},${longitude}&radius=1000`;

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: apiKey,
					accept: "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				setRestaurants(data);
				setLoading(false);
			} else {
				console.error("Failed to fetch places.");
				setError(true);
			}
		} catch (error) {
			console.error("Error fetching places:", error);
			setError(true);
		}
	};
	const addSpacesBetweenCapitalLetters = (text: string) => {
		return text.replace(/([A-Z])/g, " $1").trim();
	};

	useEffect(() => {
		getLocation();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (location.latitude !== null && location.longitude !== null) {
				fetchRestaurants(location.latitude, location.longitude);
			}
		}, 3000);
		return () => clearTimeout(timer);
	}, [location]);

	if (loading) {
		return <FoodLottie />;
	}

	if (error) {
		return (
			<Box sx={{ padding: 2 }}>
				<Typography
					sx={{ fontSize: 18, fontWeight: 600, color: "red" }}
				>
					Failed to load recipe. Please try again later.
				</Typography>
			</Box>
		);
	}
	return (
		<Box sx={{ padding: 2 }}>
			<Typography
				variant="h5"
				sx={{ marginBottom: 2, fontWeight: 600, paddingLeft: 1 }}
			>
				Restaurants Near You
			</Typography>
			<Grid container spacing={2} sx={{ padding: 1 }}>
				{restaurants?.results.map((item) => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
						<Card
							sx={{
								height: "230px",
								borderRadius: "20px",
							}}
						>
							<CardHeader
								title={item?.name}
								subheader={`Type: ${item.categories
									.map((item) => item.name)
									.join(", ")}`}
							/>
							<CardContent sx={{ paddingY: 0 }}>
								<Typography sx={{ fontSize: "18px" }}>
									{item.location.formatted_address}
								</Typography>
								<Typography sx={{ fontSize: "18px" }}>
									Open:{" "}
									{addSpacesBetweenCapitalLetters(
										item.closed_bucket
									)}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default Restaurants;
