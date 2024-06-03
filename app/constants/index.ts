export interface Recipe {
	vegetarian: boolean;
	vegan: boolean;
	glutenFree: boolean;
	dairyFree: boolean;
	pricePerServing: number;
	extendedIngredients: ExtendedIngredient[];
	title: string;
	readyInMinutes: number;
	servings: number;
	image: string;
	summary: string;
	analyzedInstructions: AnalyzedInstructions[];
	dishTypes: string[];
}

interface ExtendedIngredient {
	image: string;
	consistency: string;
	name: string;
	nameClean: string;
	original: string;
	amount: number;
	unit: string;
}

interface AnalyzedInstructions {
	steps: Steps[];
}

interface Steps {
	number: number;
	step: string;
}

export interface SearchResult {
	results: Result[];
}

interface Result {
	id: number;
	title: string;
	image: string;
}

export interface RestaurantsType {
	results: ResResults[];
}

interface ResResults {
	id: number;
	categories: ResCategories[];
	closed_bucket: string;
	location: { formatted_address: string };
	name: string
}

interface ResCategories {
	name: string;
}

