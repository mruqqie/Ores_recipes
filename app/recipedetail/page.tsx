"use client";
import React from "react";
import { Box } from "@mui/material";
import NavBar from "../components/NavBar";
import RecipeDetail from "./RecipeDetail";

const page = () => {
	return (
		<Box>
			<NavBar />
			<RecipeDetail />
		</Box>
	);
};

export default page;
