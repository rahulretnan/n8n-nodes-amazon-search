import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from "n8n-workflow";
import { searchProducts } from "./scraper";
import { AmazonRegion } from "./types";

export class AmazonSearch implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Amazon Search",
    name: "amazonSearch",
    icon: "file:amazon.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Search for products on Amazon",
    defaults: {
      name: "Amazon Search",
    },
    inputs: ["main"],
    outputs: ["main"],
    properties: [
      {
        displayName: "Query",
        name: "query",
        type: "string",
        default: "",
        placeholder: "e.g. iPhone 13",
        description: "The search query to find products",
        required: true,
      },
      {
        displayName: "Region",
        name: "region",
        type: "options",
        options: [
          { name: "India", value: "IN" },
          { name: "United States", value: "US" },
          { name: "United Kingdom", value: "UK" },
          { name: "Germany", value: "DE" },
          { name: "France", value: "FR" },
          { name: "Italy", value: "IT" },
          { name: "Spain", value: "ES" },
          { name: "Canada", value: "CA" },
        ],
        default: "US",
        description: "The Amazon region to search in",
        required: true,
      },
      {
        displayName: "Affiliate Tag",
        name: "affiliateTag",
        type: "string",
        default: "",
        placeholder: "e.g. myamazon-20",
        description: "Your Amazon affiliate tag for the selected region (optional)",
        required: false,
      },
      {
        displayName: "Minimum Price",
        name: "priceMin",
        type: "number",
        default: 0,
        description: "Minimum price filter",
        required: false,
      },
      {
        displayName: "Maximum Price",
        name: "priceMax",
        type: "number",
        default: 0,
        description: "Maximum price filter",
        required: false,
      },
      {
        displayName: "Results Limit",
        name: "limit",
        type: "number",
        default: 10,
        description: "Maximum number of results to return",
        required: false,
      },
      {
        displayName: "Sort By",
        name: "orderBy",
        type: "options",
        options: [
          { name: "Featured", value: "featured" },
          { name: "Price: Low to High", value: "price-asc-rank" },
          { name: "Price: High to Low", value: "price-desc-rank" },
          { name: "Average Customer Review", value: "review-rank" },
          { name: "Newest Arrivals", value: "date-desc-rank" },
        ],
        default: "featured",
        description: "How to sort the results",
        required: false,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const regionMap: { [key: string]: AmazonRegion } = {
      IN: {
        baseUrl: "https://www.amazon.in",
        name: "India",
        currency: "INR",
        affiliateTag: "",
      },
      US: {
        baseUrl: "https://www.amazon.com",
        name: "United States",
        currency: "USD",
        affiliateTag: "",
      },
      UK: {
        baseUrl: "https://www.amazon.co.uk",
        name: "United Kingdom",
        currency: "GBP",
        affiliateTag: "",
      },
      DE: {
        baseUrl: "https://www.amazon.de",
        name: "Germany",
        currency: "EUR",
        affiliateTag: "",
      },
      FR: {
        baseUrl: "https://www.amazon.fr",
        name: "France",
        currency: "EUR",
        affiliateTag: "",
      },
      IT: {
        baseUrl: "https://www.amazon.it",
        name: "Italy",
        currency: "EUR",
        affiliateTag: "",
      },
      ES: {
        baseUrl: "https://www.amazon.es",
        name: "Spain",
        currency: "EUR",
        affiliateTag: "",
      },
      CA: {
        baseUrl: "https://www.amazon.ca",
        name: "Canada",
        currency: "CAD",
        affiliateTag: "",
      },
    };

    try {
      const query = this.getNodeParameter("query", 0) as string;
      const regionCode = this.getNodeParameter("region", 0) as string;
      const affiliateTag = this.getNodeParameter("affiliateTag", 0, "") as string;
      const priceMin = this.getNodeParameter("priceMin", 0, 0) as number;
      const priceMax = this.getNodeParameter("priceMax", 0, 0) as number;
      const limit = this.getNodeParameter("limit", 0, 10) as number;
      const orderBy = this.getNodeParameter("orderBy", 0, "featured") as string;

      const region = regionMap[regionCode];
      if (!region) {
        throw new NodeOperationError(
          this.getNode(),
          `Invalid region: ${regionCode}`
        );
      }

      region.affiliateTag = affiliateTag ? `?tag=${affiliateTag}` : "";

      const searchResult = await searchProducts({
        query,
        priceRange: {
          min: priceMin || undefined,
          max: priceMax || undefined,
        },
        limit,
        orderBy,
        region,
      });

      if (!searchResult.success) {
        throw new NodeOperationError(this.getNode(), searchResult.error);
      }

      returnData.push({
        json: searchResult,
      });

      return [returnData];
    } catch (error: any) {
      if (error.message) {
        throw new NodeOperationError(this.getNode(), error.message);
      }
      throw error;
    }
  }
}