import axios from 'axios';

export const searchJobs = async (req, res) => {

    const { query, employment_type, location, page, date_posted } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Search query is required." });
    }

    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
            query: `${query} in ${location || 'India'}`,
            page: page || '1',
            num_pages: '1',
            employment_types: employment_type || 'FULLTIME',

            ...(date_posted && date_posted !== 'all' && { date_posted }),
        },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.status(200).json(response.data.data);
    } catch (error) {
        console.error("Failed to fetch jobs from RapidAPI:", error.message);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};