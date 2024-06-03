import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	Button,
	CardActions,
	Collapse,
	Stack,
	Popover,
	ButtonProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { useSearchParams } from "next/navigation";
import { Recipe } from "../constants";
import FoodLottie from "../components/FoodLottie";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
	backgroundColor: "#9f55b7",
	"&:active": {
		backgroundColor: "#b071c4",
	},
	"&:hover": {
		backgroundColor: "#b071c4",
	},
	"&:focus": {
		backgroundColor: "#b071c4",
	},
}));

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
	return (
		<Stack direction="row" sx={{ marginX: 1, paddingTop: 2 }}>
			<Typography sx={{ fontSize: "18px" }}>Expand</Typography>
			<IconButton sx={{ marginY: 0, padding: 0 }} {...other} />
		</Stack>
	);
})(({ theme, expand }) => ({
	transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
	marginX: "auto",
	transition: theme.transitions.create("transform", {
		duration: theme.transitions.duration.shortest,
	}),
}));

const RecipeDetail = () => {
	const searchParams = useSearchParams();
	const query = searchParams.get("query");

	const [recipeId, setRecipeId] = useState<string>(query || "");
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [nairaPrice, setNairaPrice] = useState<number>(0);
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
		null
	);
	const summary = recipe?.summary || "";

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "popover" : undefined;

	const fetchRandomRecipes = async () => {
		const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
		try {
			const response = await fetch(
				`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
				// `https://api.sacular.com/recipes/random?apiKey=`
			);
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				setLoading(false);
				setRecipe(data);
			} else {
				console.error("Failed to fetch recipes.");
				setError(true);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching recipes:", error);
			setError(true);
			setLoading(false);
		}
	};

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const convertToNaira = async (value: number) => {
		const valueInDollars = value / 100;
		const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
		try {
			const response = await fetch(
				`https://v6.exchangerate-api.com/v6/${apiKey}/pair/USD/NGN/${valueInDollars}`
				// `https://v6.exgerate-api.com/v6/${apiKey}/pair/USD/NGN/${value}`
			);
			if (response.ok) {
				const data = await response.json();
				const formattedPrice = data.conversion_result.toLocaleString(
					"en-NG",
					{ minimumFractionDigits: 2, maximumFractionDigits: 2 }
				);
				setNairaPrice(formattedPrice);
			} else {
				console.error("Failed to convert price.");
			}
		} catch (error) {
			console.error("Error converting price:", error);
		}
	};

	const convertToDollar = (value: number | undefined) => {
		if (value) {
			const valueInDollars = value / 100;
			return valueInDollars;
		}
	};

	useEffect(() => {
		if (query && query !== recipeId) {
			setRecipeId(query);
		}
	}, [query, recipeId]);
	useEffect(() => {
		if (recipe?.pricePerServing) {
			convertToNaira(recipe?.pricePerServing);
		}
	}, [recipe]);
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchRandomRecipes();
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

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
			<Typography sx={{ fontSize: 24, fontWeight: 600 }}>
				Full Recipe
			</Typography>
			<Card sx={{ marginY: 2, borderRadius: "16px" }}>
				<CardHeader
					title={recipe?.title}
					subheader={`Type: ${recipe?.dishTypes
						.map(
							(dishType) =>
								dishType.charAt(0).toUpperCase() +
								dishType.slice(1)
						)
						.join(", ")}`}
				/>
				<Grid container spacing={0}>
					<Grid item xs={12} md={8}>
						<CardMedia
							component="img"
							sx={{
								height: "400px",
								paddingX: 2,
								paddingBottom: 2,
							}}
							image={recipe?.image}
							alt={recipe?.title}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<CardContent sx={{ paddingY: 0 }}>
							<Typography sx={{ fontSize: "18px" }}>
								Vegan: {recipe?.vegan ? "Yes" : "No"}
							</Typography>
							<Typography sx={{ fontSize: "18px" }}>
								Vegetarian: {recipe?.vegetarian ? "Yes" : "No"}
							</Typography>
							<Typography sx={{ fontSize: "18px" }}>
								Gluten Free: {recipe?.glutenFree ? "Yes" : "No"}
							</Typography>
							<Typography sx={{ fontSize: "18px" }}>
								Dairy Free: {recipe?.dairyFree ? "Yes" : "No"}
							</Typography>
							<Typography sx={{ fontSize: "18px" }}>
								Price: ₦ {nairaPrice}
							</Typography>
							<ColorButton
								onClick={handleClick}
								variant="contained"
								sx={{
									marginBottom: 2,
									marginTop: 1,
								}}
							>
								Click to see USD price
							</ColorButton>
							<Popover
								id={id}
								open={open}
								anchorEl={anchorEl}
								onClose={handleClose}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
							>
								<Typography sx={{ p: 2 }}>
									Price in Dollar: $
									{convertToDollar(recipe?.pricePerServing)}
								</Typography>
							</Popover>
							<Stack direction="row">
								<Typography sx={{ fontSize: "18px" }}>
									Preparation time: {recipe?.readyInMinutes}
								</Typography>
								<Typography
									sx={{ paddingLeft: 1, fontSize: "18px" }}
								>
									Minutes
								</Typography>
							</Stack>

							<Typography sx={{ fontSize: "18px" }}>
								Servings: {recipe?.servings}
							</Typography>
						</CardContent>
						<CardActions disableSpacing sx={{ paddingY: 0 }}>
							<ExpandMore
								expand={expanded}
								onClick={handleExpandClick}
								aria-expanded={expanded}
								aria-label="show more"
							>
								<ExpandMoreIcon />
							</ExpandMore>
						</CardActions>
					</Grid>
					<Grid item xs={12} md={8}>
						<Collapse in={expanded} timeout="auto" unmountOnExit>
							<CardContent>
								<Typography
									sx={{ paddingBottom: 1 }}
									variant="h5"
								>
									Summary
								</Typography>
								<Box
									dangerouslySetInnerHTML={{
										__html: summary,
									}}
									sx={{ marginTop: 2 }}
								/>
								<Typography sx={{ paddingY: 1 }} variant="h5">
									Ingredients
								</Typography>
								<Box>
									{recipe?.extendedIngredients.map((item, index) => (
										<Typography key={index}>{item.original}</Typography>
									))}
								</Box>
								<Typography sx={{ paddingY: 1 }} variant="h5">
									Instructions
								</Typography>
								{recipe?.analyzedInstructions[0].steps.map(
									(item) => (
										<Stack
											direction="row"
											key={item.number}
										>
											<Typography sx={{ marginRight: 1 }}>
												{item.number}.
											</Typography>
											<Typography>{item.step}</Typography>
										</Stack>
									)
								)}
							</CardContent>
						</Collapse>
					</Grid>
				</Grid>
			</Card>
		</Box>
	);
};

export default RecipeDetail;
