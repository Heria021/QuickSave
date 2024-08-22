import axios from 'axios';

export async function fetchDiffbotData(url: string) {
  try {
    const DIFFBOT_API_KEY = '33daa33e8e233f52e588cdb9538f4e8a'
    const response = await axios.get(
      `https://api.diffbot.com/v3/article?token=${DIFFBOT_API_KEY}&url=${encodeURIComponent(url)}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Diffbot:', error);
    throw new Error('Failed to fetch data from Diffbot');
  }
}