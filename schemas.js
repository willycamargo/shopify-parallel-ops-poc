import { faker } from '@faker-js/faker';

export const METAOBJECT_SCHEMAS = {
  product_color: {
    name: "Product Color",
    type: "product_color",
    fieldDefinitions: [
      {
        name: "Hex Code",
        key: "hex",
        type: "single_line_text_field",
        description: "Hex code of the color"
      }
    ],
    generateFields: () => ([
      {
        key: "hex",
        value: faker.color.rgb({ format: 'hex' })
      }
    ])
  },
  size_chart: {
    name: "Size Chart",
    type: "size_chart",
    fieldDefinitions: [
      {
        name: "Size",
        key: "size",
        type: "single_line_text_field",
        description: "Size identifier (S, M, L, etc)"
      },
      {
        name: "Measurements",
        key: "measurements",
        type: "json",
        description: "Detailed size measurements"
      }
    ],
    generateFields: () => ([
      {
        key: "size",
        value: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
      },
      {
        key: "measurements",
        value: JSON.stringify({
          chest: faker.number.int({ min: 30, max: 50 }),
          waist: faker.number.int({ min: 28, max: 48 }),
          length: faker.number.int({ min: 25, max: 35 })
        })
      }
    ])
  },
  material_info: {
    name: "Material Information",
    type: "material_info",
    fieldDefinitions: [
      {
        name: "Material Name",
        key: "name",
        type: "single_line_text_field",
        description: "Name of the material"
      },
      {
        name: "Composition",
        key: "composition",
        type: "multi_line_text_field",
        description: "Material composition details"
      }
    ],
    generateFields: () => ([
      {
        key: "name",
        value: faker.commerce.productMaterial()
      },
      {
        key: "composition",
        value: `${faker.number.int({ min: 50, max: 100 })}% ${faker.commerce.productMaterial()}\n${faker.number.int({ min: 0, max: 50 })}% ${faker.commerce.productMaterial()}`
      }
    ])
  },
  care_instructions: {
    name: "Care Instructions",
    type: "care_instructions",
    fieldDefinitions: [
      {
        name: "Washing",
        key: "washing",
        type: "multi_line_text_field",
        description: "Washing instructions"
      },
      {
        name: "Temperature",
        key: "temperature",
        type: "single_line_text_field",
        description: "Recommended washing temperature"
      }
    ],
    generateFields: () => ([
      {
        key: "washing",
        value: faker.helpers.arrayElement([
          "Machine wash cold\nDo not bleach\nTumble dry low",
          "Hand wash only\nLay flat to dry",
          "Dry clean only"
        ])
      },
      {
        key: "temperature",
        value: faker.helpers.arrayElement(['30°C', '40°C', 'Cold'])
      }
    ])
  },
  shipping_info: {
    name: "Shipping Information",
    type: "shipping_info",
    fieldDefinitions: [
      {
        name: "Weight",
        key: "weight",
        type: "number_decimal",
        description: "Product weight in kg"
      },
      {
        name: "Dimensions",
        key: "dimensions",
        type: "json",
        description: "Product dimensions"
      }
    ],
    generateFields: () => ([
      {
        key: "weight",
        value: faker.number.float({ min: 0.1, max: 10, precision: 0.01 }).toString()
      },
      {
        key: "dimensions",
        value: JSON.stringify({
          length: faker.number.int({ min: 10, max: 100 }),
          width: faker.number.int({ min: 10, max: 100 }),
          height: faker.number.int({ min: 10, max: 100 })
        })
      }
    ])
  }
};