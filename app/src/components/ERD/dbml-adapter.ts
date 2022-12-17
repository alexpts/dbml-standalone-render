import {RawDatabase} from "@dbml/core/types/model_structure/database";
import {Edge, Node} from "@vue-flow/core/dist/types";
import Table from "@dbml/core/types/model_structure/table";
import Ref from "@dbml/core/types/model_structure/ref";
import Endpoint from "@dbml/core/types/model_structure/endpoint";


export {Parser} from '@dbml/core'

export const dbml = `
//// -- LEVEL 1
//// -- Schemas, Tables and References

// Creating tables
// You can define the tables with full schema names

Table ecommerce.merchants {
  id int(8, 3)
  country_code int
  merchant_name varchar

  "created at" varchar
  admin_id int [ref: > U.id]
  Indexes {
    (id, country_code) [pk]
  }

   note: "Описание таблицы"
}

// If schema name is omitted, it will default to "public" schema.
Table users as U {
  id int [pk, increment] // auto-increment
  full_name varchar
  created_at timestamp
  country_code int
}

Table countries {
  code int [pk]
  name varchar
  continent_name varchar
}

// Creating references
// You can also define relaionship separately
// > many-to-one; < one-to-many; - one-to-one; <> many-to-many
//Ref: U.country_code > countries.code
//Ref: ecommerce.merchants.country_code > countries.code

//----------------------------------------------//

//// -- LEVEL 2
//// -- Adding column settings

Table ecommerce.order_items {
  order_id int [ref: > ecommerce.orders.id] // inline relationship (many-to-one)
  product_id int
  quantity int [default: 1] // default value
}

//Ref: ecommerce.order_items.product_id > ecommerce.products.id

Table ecommerce.orders {
  id int [pk] // primary key
  user_id int [not null, unique]
  status varchar
  created_at varchar [note: 'When order created'] // add column note
}

//----------------------------------------------//

//// -- Level 3
//// -- Enum, Indexes

// Enum for 'products' table below
Enum ecommerce.products_status {
  out_of_stock
  in_stock
  running_low [note: 'less than 20'] // add column note
}

// Indexes: You can define a single or multi-column index
Table ecommerce.products {
  id int [pk]
  name varchar
  merchant_id int [not null]
  price int
  status ecommerce.products_status
  created_at datetime [default: \`now()\`]

  Indexes {
    (merchant_id, status) [name:'product_status']
    id [unique]
  }
}

// Table ecommerce.product_tags {
//   id int [pk]
//   name varchar
// }

// Table ecommerce.merchant_periods {
//   id int [pk]
//   merchant_id int
//   country_code int
//   start_date datetime
//   end_date datetime
// }

Ref: ecommerce.products.merchant_id > ecommerce.merchants.id // many-to-one
//Ref: ecommerce.product_tags.id <> ecommerce.products.id // many-to-many
//composite foreign key
//Ref: ecommerce.merchant_periods.(merchant_id, country_code) > ecommerce.merchants.(id, country_code)
`

/**
 * Преобразует dbml таблицы/связи в формат для VueFlow
 */
export const convertDbmlFormatToVueFlow = (db: RawDatabase): [Node[], Edge[]] => {
    replaceTableNameFromAlias(db)
    return [
        db.tables.map(convertTable),
        db.refs.map(convertRefs),
    ];
}

const replaceTableNameFromAlias = (db: RawDatabase): void => {
    db.refs.map((ref) => {
        ref.endpoints.map((endpoint: Endpoint) => {
            const name = endpoint.tableName
            const alias = db.aliases.find(item => item.kind === 'table' && item.name === name)
            if (alias) {
                endpoint.tableName = alias.value.tableName
            }
        })
    })
}

const convertRefs = (ref: Ref, index): Edge => {
    const [e0, e1] = ref.endpoints

    return {
        id: `ref-${index}`,
        //type: 'custom_edge_1', // @see defaultEdgeOptions
        source: e0.tableName,
        sourceHandle: e0.fieldNames[0], // @todo multi fields case
        target: e1.tableName,
        targetHandle: e1.fieldNames[0],
        label: `${e0.tableName}.${e0.fieldNames[0]} [${e0.relation}] :: ${e1.tableName}.${e1.fieldNames[0]} [${e1.relation}]`,
        data: {
            sourceRelation: e0.relation,
            targetRelation: e1.relation,
        }
    }
}

const convertTable = (table: Table, index): Node => {
    return {
        id: table.name,
        type: 'table',
        position: {x: index * 180, y: 0},
        draggable: true,
        expandParent: true,
        connectable: true,
        data: {
            dbmlTable: table,
            tags: [],
        }
    }
}