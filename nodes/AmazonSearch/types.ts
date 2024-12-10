export type Product = {
	id: string;
	title: string;
	description: string;
	price: number;
	image: string;
	rating?: number;
	reviews?: number;
	prime?: boolean;
	url: string;
	currency: string;
};

export type RegionInfo = {
	code: string;
	name: string;
	currency: string;
};

export type SearchResult =
	| {
			success: true;
			data: Product[];
			region: RegionInfo;
	  }
	| {
			success: false;
			error: string;
	  };

export type AmazonRegion = {
	baseUrl: string;
	affiliateTag: string;
	name: string;
	currency: string;
};
