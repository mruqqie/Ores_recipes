import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	InputBase,
	Stack,
	Button,
	ButtonProps,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import FoodLottie from "./FoodLottie";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
	backgroundColor: "#7b0bd9",
	"&:active": {
		backgroundColor: "#b071c4",
	},
	"&:hover": {
		backgroundColor: "#9143e0",
	},
	"&:focus": {
		backgroundColor: "#9143e0",
	},
}));

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: "16px",
	backgroundColor: "#8d6bb6",
	"&:hover": {
		backgroundColor: "#ad95ca",
	},
	marginRight: "10px",
	marginLeft: 0,
	width: "20ch",
	height: "30px",
	[theme.breakpoints.up("sm")]: {
		marginLeft: "10px",
		width: "auto",
		height: "auto"
	},
}));

const SearchIconWrapper = styled("div")({
	padding: "10px",
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
});

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	width: "100%",
	"& .MuiInputBase-input": {
		padding: 4,
		paddingLeft: 40,
		[theme.breakpoints.up("sm")]: {
			width: "23ch",
			padding: 8,
			paddingLeft: 45,
		},
	},
}));
const NavBar = () => {
	const [searchValue, setSearchValue] = useState<string>("");
	const router = useRouter();

	const handleEnter = (event: KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === "Enter") {
			router.push(`/searchfeed?query=${searchValue}`);
		}
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setSearchValue(event.target.value);
	};

	const handleClick = () => {
		router.push("/restaurants");
		return <FoodLottie />;
	};
	return (
		<AppBar position="sticky" sx={{ backgroundColor: "#5f2e97" }}>
			<Toolbar
				sx={{
					display: "flex",
					flexGrow: 1,
					justifyContent: "space-between",
					gap: { xs: 3, sm: 1 },
				}}
			>
				<Stack
					direction="row"
					sx={{
						display: "flex",
						flexGrow: 1,
						gap: { xs: 1, sm: 3 },
						alignItems: "center",
					}}
				>
					<Typography
						sx={{ fontSize: { xs: 18, sm: 25 }, fontWeight: 700 }}
						onClick={() => router.push("/")}
					>
						Ore&#39;s Recipes
					</Typography>
					<ColorButton
						onClick={handleClick}
						variant="contained"
						sx={{
							// marginBottom: 2,
							// marginTop: 1,
							borderRadius: "13px",
							fontSize: { xs: "10px", sm: "16px" },
						}}
					>
						Restaurants
					</ColorButton>
				</Stack>

				<Search>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="Find recipe"
						inputProps={{ "aria-label": "search" }}
						value={searchValue}
						onChange={handleInputChange}
						onKeyDown={handleEnter}
					/>
				</Search>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
