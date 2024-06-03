import React from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { Box } from "@mui/material";

const FoodLottie = () => {
	return (
		<Box sx={{height:"90vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
			<Player
				autoplay
				loop
				src="https://lottie.host/c7038db6-d57b-49ed-924c-0706792904f8/VvKgRop2ge.json"
				style={{ height: "200px", width: "200px"}}
			>
				{/* <Controls
					visible={false}
					buttons={["play", "repeat", "frame", "debug"]}
				/> */}
			</Player>
		</Box>
	);
};

export default FoodLottie;
