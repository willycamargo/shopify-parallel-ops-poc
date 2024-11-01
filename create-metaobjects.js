import dotenv from 'dotenv';
dotenv.config();

import { createAdminApiClient } from '@shopify/admin-api-client';
import { METAOBJECT_SCHEMAS } from './schemas.js';

const client = createAdminApiClient({
  storeDomain: process.env.SHOP_DOMAIN,
  apiVersion: '2024-01',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});

// Update createMetaobjects function to use schema
async function createMetaobjects(schema, count = 5) {
  const metaobjects = [];

  for (let i = 0; i < count; i++) {
    const { data, errors, graphQLErrors } = await client.request(`
      #graphql
      mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            handle
            id
          }
          userErrors {
            field
            message
            code 
          }
        }
      }
    `, {
      variables: {
        metaobject: {
          type: schema.type,
          fields: schema.generateFields()
        }
      }
    });

    if (errors || graphQLErrors) {
      console.error(`Error creating metaobject ${i}:`, errors, graphQLErrors);
    } else {
      metaobjects.push(data.metaobjectCreate.metaobject);
    }
  }

  return metaobjects;
}

// Update createMetaobjectDefinition to use schema
async function createMetaobjectDefinition(schema) {
  const { data, errors } = await client.request(`
    #graphql
    mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
          name
          type
          fieldDefinitions {
            name
            key
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `, {
    variables: {
      definition: {
        name: schema.name,
        type: schema.type,
        fieldDefinitions: schema.fieldDefinitions
      }
    }
  });

  if (errors) {
    console.error('Error creating metaobject definition:', errors);
    return null;
  }

  return data.metaobjectDefinitionCreate.metaobjectDefinition;
}

// Update main function
async function main() {  
  // Create new definitions and metaobjects for each schema
  for (const schema of Object.values(METAOBJECT_SCHEMAS)) {
    console.log(`\nProcessing ${schema.name}...`);
    
    const definition = await createMetaobjectDefinition(schema);
    if (!definition) {
      console.error(`Failed to create metaobject definition for ${schema.name}. Skipping...`);
      continue;
    }
    
    const metaobjects = await createMetaobjects(schema, 100);
    console.log(`Created ${metaobjects.length} metaobjects for ${schema.name}`);
  }
}

main();