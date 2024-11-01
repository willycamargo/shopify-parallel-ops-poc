import dotenv from 'dotenv';
dotenv.config();

import { createAdminApiClient } from '@shopify/admin-api-client';

const client = createAdminApiClient({
  storeDomain: process.env.SHOP_DOMAIN,
  apiVersion: '2024-01',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});

async function waitForBulkOperation(id, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await client.request(`
      query GetBulkOperation($id: ID!) {
        node(id: $id) {
          ... on BulkOperation {
            id
            status
            errorCode
            url
          }
        }
      }
    `, {
      variables: { id }
    });

    if (data.node.status === 'COMPLETED') {
      return data.node;
    } else if (data.node.status === 'FAILED') {
      throw new Error(`Bulk operation failed: ${data.node.errorCode}`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Timeout waiting for bulk operation');
}

async function fetchAndLogMetaobjects(type) {
  console.log(`[${new Date().toISOString()}] Starting fetch for type: ${type}`);
  const startTime = Date.now();

  // Start bulk operation
  const { data: bulkData } = await client.request(`
    mutation MetaObjectBulkQuery($query: String!) {
      bulkOperationRunQuery(query: $query) {
        bulkOperation {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      query: `
        query {
          metaobjectDefinitionByType(type: "${type}") {
            metaobjects {
              edges {
                node {
                  id
                  displayName
                  fields {
                    key
                    value
                  }
                }
              }
            }
          }
        }
      `
    }
  });

  if (!bulkData?.bulkOperationRunQuery?.bulkOperation?.id) {
    console.log(`[${new Date().toISOString()}] No bulk operation created. Result:`, JSON.stringify(bulkData, null, 2));
    return;
  }
  console.log(`[${new Date().toISOString()}] Bulk operation created: ${bulkData.bulkOperationRunQuery.bulkOperation.id}`);

  // Wait for completion
  const bulkOperation = await waitForBulkOperation(
    bulkData.bulkOperationRunQuery.bulkOperation.id
  );

  // Download and parse results
  if (bulkOperation?.url) {
    const response = await fetch(bulkOperation.url);
    const text = await response.text();
    
    // Parse and log each metaobject
    const metaobjects = text
      .trim()
      .split('\n')
      .map(line => JSON.parse(line))
      .filter(obj => obj.id);

    console.log(`[${new Date().toISOString()}] Metaobjects found for ${type}: ${metaobjects.length}`);
  }

  const endTime = Date.now();
  console.log(`\n[${new Date().toISOString()}] Operation completed in ${endTime - startTime}ms`);
}

// Accept type argument from command line
const type = process.argv[2];

if (!type) {
  console.error('Please provide a metaobject type as an argument');
  process.exit(1);
}

fetchAndLogMetaobjects(type).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
