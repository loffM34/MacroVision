import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;
  
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing query' });
    }
  console.log(query)
    const apiKey = process.env.USDA_API_KEY;
    if (!apiKey) {
      console.error('Missing USDA_API_KEY!');
      return res.status(500).json({ error: 'Missing USDA_API_KEY' });
    }
  
    const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=4nocG4ecRrNsudAmboxE5m7cBDfEtVbd6bdmHyBG&query=${query}`;
  
    try {
      const response = await fetch(apiUrl);
      
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        const errorText = await response.text();
        console.error("USDA API Error:", errorText);
        return res.status(response.status).json({ error: 'USDA API error', details: errorText });
      }
  
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON, got:", text);
        return res.status(500).json({ error: "Invalid response format from USDA API" });
      }
  
      const data = await response.json();
  
      if (!data.foods || data.foods.length === 0) {
        return res.status(404).json({ error: 'Food not found' });
      }
  
      res.status(200).json(data.foods[0]);
    } catch (err) {
      console.error('API error:', err);
      res.status(500).json({ error: 'Failed to fetch food data' });
    }
  }
  