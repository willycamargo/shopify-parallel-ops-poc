# Shopify Bulk & Job Operations POC

This project demonstrates running concurrent Bulk and Job operations with Shopify's GraphQL Admin API, specifically focusing on Metaobject operations.

## Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file with the following variables:
    ```bash
    SHOP_DOMAIN=your-shop.myshopify.com
    SHOPIFY_ACCESS_TOKEN=your_access_token
    ```

## Available Scripts

### Create Metaobject Definitions and Sample Data

Creates 5 Metaobject definitions and 100 sample metaobjects for each type:

    ```bash
    node create-metaobjects.js
    ```

### Fetch Metaobjects (Bulk Operation)

Fetch metaobjects of a specific type using Shopify's Bulk Operation:

    ```bash
    node bulk-fetch-metaobjects.js <TYPE>
    ```

Replace `<TYPE>` with one of:
- product_color
- size_chart
- material_info
- care_instructions
- shipping_info

### Delete Metaobjects (Job Operation)

Delete all metaobjects of a specific type using Shopify's Job Operation:

    ```bash
    node job-delete-metaobjects.js <TYPE>
    ```

### Parallel Operations

#### Run Multiple Job Operations
You can run multiple delete operations in parallel:

    ```bash
    node job-delete-metaobjects.js product_color &\
    node job-delete-metaobjects.js size_chart &\
    node job-delete-metaobjects.js material_info &\
    node job-delete-metaobjects.js care_instructions &\
    node job-delete-metaobjects.js shipping_info
    ```

#### Run Bulk and Job Operations Together
You can run both bulk fetch and delete operations simultaneously:

    ```bash
    node job-delete-metaobjects.js product_color &\
    node bulk-fetch-metaobjects.js size_chart &\
    node job-delete-metaobjects.js material_info &\
    node job-delete-metaobjects.js care_instructions &\
    node job-delete-metaobjects.js shipping_info
    ```

### Cleanup All Metaobject Definitions

To remove all metaobject definitions and their data:

    ```bash
    node cleanup-metaobjects.js
    ```

## Key Findings

1. Multiple Bulk Operations cannot run concurrently - Shopify will return an error
2. Multiple Job Operations can run concurrently
3. You can run Bulk Operations and Job Operations simultaneously

## Project Structure

- `schemas.js` - Defines metaobject schemas and fake data generators
- `create-metaobjects.js` - Creates metaobject definitions and sample data
- `bulk-fetch-metaobjects.js` - Demonstrates bulk operation fetching
- `job-delete-metaobjects.js` - Demonstrates job operation deletion
- `cleanup-metaobjects.js` - Removes all metaobject definitions
