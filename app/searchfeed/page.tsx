"use client";
import React from "react";
import { Box } from "@mui/material";
import NavBar from "../components/NavBar";
import SearchFeed from "./SearchFeed";

const Search = () => {
	return (
		<Box>
			<NavBar />
			<SearchFeed />
		</Box>
	);
};

export default Search;
