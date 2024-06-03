"use client";
import React from "react";
import { Box } from "@mui/material";
import RandomRecipe from "./components/RandomRecipe";
import NavBar from "./components/NavBar";

export default function Home() {
	return (
		<Box>
			<NavBar />
			<RandomRecipe />
		</Box>
	);
}
