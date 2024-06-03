"use client";
import React from "react";
import { Box } from "@mui/material";
import NavBar from "../components/NavBar";
import Restaurants from "./Restaurants";

const page = () => {
	return (
		<Box>
			<NavBar />
			<Restaurants />
		</Box>
	);
};

export default page;
