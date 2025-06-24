import { rssService } from '../services/RSSService';

/**
 * This script can be used to manually fetch RSS articles and analyze sentiment.
 * It can be run using the following command:
 * npx ts-node src/scripts/fetchRSSArticles.ts
 */
async function main() {
  console.log('Starting RSS article fetching and sentiment analysis...');
  
  try {
    // Fetch articles from all RSS sources
    await rssService.fetchAllSources();
    
    console.log('RSS article fetching and sentiment analysis completed successfully.');
  } catch (error) {
    console.error('Error fetching RSS articles:', error);
  }
}

// Run the main function
main().catch(console.error);
