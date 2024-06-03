"use client";
import React, { useEffect, useState, Suspense } from "react";
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Grid,
	Typography,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchResult } from "../constants";
import FoodLottie from "../components/FoodLottie";
import NavBar from "../components/NavBar";

const SearchFeedContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const query = searchParams.get("query");
	const [searchTerm, setSearchTerm] = useState<string>(query || "");
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

	const getSearchFeed = async (term: string) => {
		const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
		try {
			const response = await fetch(
				`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${term}&number=100`
			);
			if (response.ok) {
				const data = await response.json();
				setLoading(false);
				setSearchResult(data);
			} else {
				setLoading(false);
				setError(true);
				console.error("Failed to fetch recipes.");
			}
		} catch (error) {
			setLoading(false);
			setError(true);
			console.error("Error fetching recipes:", error);
		}
	};

	const handleClick = (id: number) => {
		router.push(`/recipedetail?query=${id}`);
		setLoading(true);
	};

	useEffect(() => {
		if (query && query !== searchTerm) {
			setSearchTerm(query);
		}
	}, [query, searchTerm]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchTerm) {
				setLoading(true);
				getSearchFeed(searchTerm);
			}
		}, 3000);
		return () => clearTimeout(timer);
	}, [searchTerm]);

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

	if (!searchResult || searchResult.results.length === 0) {
		return (
			<Box sx={{ padding: 2 }}>
				<Typography sx={{ fontSize: 18, fontWeight: 600 }}>
					No recipes found for &quot;{searchTerm}&quot;.
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ padding: 2 }}>
			<Typography variant="h6" sx={{ marginBottom: 2 }}>
				Search Results for &quot;{searchTerm}&quot;
			</Typography>
			<Grid container spacing={2} sx={{ padding: 1 }}>
				{searchResult?.results.map((item) => (
					<Grid
						item
						xs={12}
						sm={4}
						md={3}
						key={item.id}
						onClick={() => handleClick(item.id)}
					>
						<Card
							sx={{
								borderRadius: "16px",
								cursor: "pointer",
							}}
						>
							<CardMedia
								component="img"
								sx={{
									height: { xs: "280px", sm: "200px" },
								}}
								image={item?.image}
								alt={item.title}
							/>
							<CardContent>
								<Typography sx={{ fontSize: "18px" }}>
									{item.title}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

const SearchFeed = () => {
	return (
		<Suspense fallback={<FoodLottie />}>
			<SearchFeedContent />
		</Suspense>
	);
};

export default SearchFeed;
