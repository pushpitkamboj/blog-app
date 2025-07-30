import { Client } from '@elastic/elasticsearch';

// Initialize Elasticsearch client
const client = new Client({
  node: 'http://localhost:9200', // Update with your Elasticsearch host
  // For production with authentication:
  // auth: { username: 'elastic', password: 'your-password' }
});

// Function to check if Elasticsearch is connected
export async function checkElasticsearchConnection(): Promise<void> {
  try {
    const health = await client.cluster.health();
    console.log('Elasticsearch cluster health:', health.status);
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error);
    throw error;
  }
}

export default client;