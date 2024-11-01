import dotenv from 'dotenv';
dotenv.config();

import { createAdminApiClient } from '@shopify/admin-api-client';
import { METAOBJECT_SCHEMAS } from './schemas.js';

const client = createAdminApiClient({
  storeDomain: process.env.SHOP_DOMAIN,
  apiVersion: '2024-01',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});

async function deleteAllMetaobjects(definitionType) {
  // fetch the definition by type
  const { data: defData, errors: defErrors } = await client.request(`
    #graphql
    query MetaobjectDefinitionByType($type: String!) {
      metaobjectDefinitionByType(type: $type) {
        id
      }
    }
  `, {
    variables: { type: definitionType }
  });

  if (defErrors) {
    console.error('Error fetching definition:', defErrors);
    return false;
  }

  // delete the definition
  if (defData.metaobjectDefinitionByType) {
    const { errors: deleteDefErrors } = await client.request(`
      #graphql
      mutation DeleteMetaobjectDefinition($id: ID!) {
        metaobjectDefinitionDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
            code
          }
        }
      }
    `, {
      variables: { id: defData.metaobjectDefinitionByType.id }
    });

    if (deleteDefErrors) {
      console.error('Error deleting definition:', deleteDefErrors);
      return false;
    }
  } else {
    console.error('Definition not found:', definitionType);
    return false;
  }

  console.log(`Deleted metaobject definition of type ${definitionType}:`, defData.metaobjectDefinitionByType.id);
  return true;
}

async function main() {
  // Delete all existing metaobject definitions
  for (const schema of Object.values(METAOBJECT_SCHEMAS)) {
    await deleteAllMetaobjects(schema.type);
  }
}

main(); 