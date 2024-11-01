import dotenv from 'dotenv';
dotenv.config();

import { createAdminApiClient } from '@shopify/admin-api-client';

const client = createAdminApiClient({
  storeDomain: process.env.SHOP_DOMAIN,
  apiVersion: '2024-01',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});

async function deleteMetaobjects(type) {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting deletion of metaobjects with type: ${type}`);

  const { data, errors } = await client.request(`
    mutation DeleteMetaobjects($where: MetaobjectBulkDeleteWhereCondition!) {
      metaobjectBulkDelete(where: $where) {
        job {
          id
          done
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      where: {
        type: type
      }
    }
  });

  if (errors) {
    console.error('Error in bulk delete:', JSON.stringify(errors, null, 2));
    return;
  }

  const endTime = Date.now();
  console.log(`\n[${new Date().toISOString()}] Deletion job created for ${type} (took ${endTime - startTime}ms)`);
  return data.metaobjectBulkDelete.job;
}

async function main() {
  const type = process.argv[2];

  if (!type) {
    console.error('Please provide a metaobject type as an argument');
    process.exit(1);
  }

  try {
    await deleteMetaobjects(type);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
