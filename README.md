# n8n-nodes-amazon-search

This is a custom n8n node that allows you to search for products on Amazon across different regions and get structured data in response. The node uses Puppeteer for web scraping and supports various search parameters including price filtering and sorting options.

## Features

- Search products across multiple Amazon regions (US, UK, India, Germany, France, Italy, Spain, Canada)
- Filter results by price range
- Sort results by different criteria (Featured, Price, Reviews, etc.)
- Limit the number of results
- Support for Amazon affiliate tags per region
- Returns structured data including product details, prices, ratings, and more

## Installation

1. Go to your n8n installation directory and install the package:
```bash
npm install n8n-nodes-amazon-search
```

2. Restart n8n

## Usage

1. Add the "Amazon Search" node to your workflow
2. Configure the following parameters:
   - Query: The search term (e.g., "iPhone 13")
   - Region: Select the Amazon marketplace to search in
   - Affiliate Tag: Your Amazon affiliate tag for the selected region
   - Optional parameters:
     - Minimum Price: Filter products above this price
     - Maximum Price: Filter products below this price
     - Results Limit: Maximum number of products to return
     - Sort By: How to order the results

## Response Format

The node returns data in the following format:

```typescript
{
  success: true,
  data: [
    {
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
    }
  ],
  region: {
    code: string;
    name: string;
    currency: string;
  }
}
```

## Error Handling

If the search fails, the node will return:

```typescript
{
  success: false,
  error: string
}
```

## License

MIT

## Author

Rahul Retnan 