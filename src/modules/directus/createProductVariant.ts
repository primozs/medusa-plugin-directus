import type { DirectusClient } from "./createDirectus";
import { createCollection, createRelation } from "@directus/sdk";

export const createProductVariant = async (directus: DirectusClient) => {
  const collection = await directus.request(
    createCollection({
      collection: "ProductVariant",
      meta: {
        collection: "ProductVariant",
        icon: null,
        note: null,
        display_template: null,
        hidden: true,
        singleton: false,
        translations: null,
        archive_field: null,
        archive_app_filter: true,
        archive_value: null,
        unarchive_value: null,
        sort_field: null,
        accountability: "all",
        color: null,
        item_duplication_fields: null,
        sort: null,
        group: "store",
        collapse: "open",
        preview_url: null,
      },

      schema: {
        schema: "public",
        name: "ProductVariant",
        comment: null,
      },
      // @ts-ignore
      fields: [
        {
          collection: "ProductVariant",
          field: "id",
          type: "uuid",
          schema: {
            name: "id",
            table: "ProductVariant",
            schema: "public",
            data_type: "uuid",
            is_nullable: false,
            generation_expression: null,
            default_value: null,
            is_generated: false,
            max_length: null,
            comment: null,
            numeric_precision: null,
            numeric_scale: null,
            is_unique: true,
            is_primary_key: true,
            has_auto_increment: false,
            foreign_key_schema: null,
            foreign_key_table: null,
            foreign_key_column: null,
          },
          meta: {
            collection: "ProductVariant",
            field: "id",
            special: ["uuid"],
            interface: "input",
            options: null,
            display: null,
            display_options: null,
            readonly: true,
            hidden: true,
            sort: 1,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          collection: "ProductVariant",
          field: "Product_id",
          type: "uuid",
          schema: {
            name: "Product_id",
            table: "ProductVariant",
            schema: "public",
            data_type: "uuid",
            is_nullable: false,
            generation_expression: null,
            default_value: null,
            is_generated: false,
            max_length: null,
            comment: null,
            numeric_precision: null,
            numeric_scale: null,
            is_unique: false,
            is_primary_key: false,
            has_auto_increment: false,
            foreign_key_schema: "public",
            foreign_key_table: "Product",
            foreign_key_column: "id",
          },
          meta: {
            collection: "ProductVariant",
            field: "Product_id",
            special: null,
            interface: null,
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: true,
            sort: 2,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          collection: "ProductVariant",
          field: "sku",
          type: "string",
          schema: {
            name: "sku",
            table: "ProductVariant",
            schema: "public",
            data_type: "character varying",
            is_nullable: true,
            generation_expression: null,
            default_value: null,
            is_generated: false,
            max_length: 255,
            comment: null,
            numeric_precision: null,
            numeric_scale: null,
            is_unique: false,
            is_primary_key: false,
            has_auto_increment: false,
            foreign_key_schema: null,
            foreign_key_table: null,
            foreign_key_column: null,
          },
          meta: {
            collection: "ProductVariant",
            field: "sku",
            special: null,
            interface: "input",
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: false,
            sort: 2,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          collection: "ProductVariant",
          field: "medusa_id",
          type: "string",
          schema: {
            name: "medusa_id",
            table: "ProductVariant",
            schema: "public",
            data_type: "character varying",
            is_nullable: true,
            generation_expression: null,
            default_value: null,
            is_generated: false,
            max_length: 255,
            comment: null,
            numeric_precision: null,
            numeric_scale: null,
            is_unique: false,
            is_primary_key: false,
            has_auto_increment: false,
            foreign_key_schema: null,
            foreign_key_table: null,
            foreign_key_column: null,
          },
          meta: {
            collection: "ProductVariant",
            field: "medusa_id",
            special: null,
            interface: "input",
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: true,
            sort: 4,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          field: "translations",
          type: "alias",
          schema: null,
          meta: {
            collection: "ProductVariant",
            field: "translations",
            special: ["translations"],
            interface: "translations",
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: false,
            sort: 5,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          collection: "ProductVariant",
          field: "options",
          type: "alias",
          schema: null,
          meta: {
            collection: "ProductVariant",
            field: "options",
            special: ["m2m"],
            interface: "list-m2m",
            options: {
              layout: "table",
              fields: [
                "ProductOption_id.translations",
                "ProductOption_id.translations.name",
                "value",
              ],
              enableSearchFilter: true,
            },
            display: "related-values",
            display_options: {
              template:
                "{{ProductOption_id.translations}}{{ProductOption_id.translations.title}} {{value}}",
            },
            readonly: false,
            hidden: false,
            sort: 9,
            width: "full",
            translations: null,
            note: null,
            conditions: [],
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          collection: "ProductVariant",
          field: "prices",
          type: "alias",
          schema: null,
          meta: {
            collection: "ProductVariant",
            field: "prices",
            special: ["o2m"],
            interface: "list-o2m",
            options: {
              template: "{{amount}} {{currency_code}}",
            },
            display: null,
            display_options: null,
            readonly: false,
            hidden: false,
            sort: 8,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
      ],
    })
  );

  await directus.request(
    createCollection({
      collection: "ProductVariant_translations",
      meta: {
        collection: "ProductVariant_translations",
        icon: "import_export",
        note: null,
        display_template: null,
        hidden: true,
        singleton: false,
        translations: null,
        archive_field: null,
        archive_app_filter: true,
        archive_value: null,
        unarchive_value: null,
        sort_field: null,
        accountability: "all",
        color: null,
        item_duplication_fields: null,
        sort: null,
        group: "store",
        collapse: "open",
        preview_url: null,
      },
      schema: {
        schema: "public",
        name: "ProductVariant_translations",
        comment: null,
      },
      // @ts-ignore
      fields: [
        {
          collection: "ProductVariant_translations",
          field: "id",
          type: "integer",
          schema: {
            name: "id",
            table: "ProductVariant_translations",
            schema: "public",
            data_type: "integer",
            is_nullable: false,
            generation_expression: null,
            default_value:
              "nextval('\"ProductVariant_translations_id_seq\"'::regclass)",
            is_generated: false,
            max_length: null,
            comment: null,
            numeric_precision: 32,
            numeric_scale: 0,
            is_unique: true,
            is_primary_key: true,
            has_auto_increment: true,
            foreign_key_schema: null,
            foreign_key_table: null,
            foreign_key_column: null,
          },
          meta: {
            collection: "ProductVariant_translations",
            field: "id",
            special: null,
            interface: null,
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: true,
            sort: 1,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          collection: "ProductVariant_translations",
          field: "ProductVariant_id",
          type: "uuid",
          schema: {
            name: "ProductVariant_id",
            table: "ProductVariant_translations",
            schema: "public",
            data_type: "uuid",
            is_nullable: true,
            generation_expression: null,
            default_value: null,
            is_generated: false,
            max_length: null,
            comment: null,
            numeric_precision: null,
            numeric_scale: null,
            is_unique: false,
            is_primary_key: false,
            has_auto_increment: false,
            foreign_key_schema: "public",
            foreign_key_table: "ProductVariant",
            foreign_key_column: "id",
          },
          meta: {
            collection: "ProductVariant_translations",
            field: "ProductVariant_id",
            special: null,
            interface: null,
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: true,
            sort: 2,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          collection: "ProductVariant_translations",
          field: "languages_code",
          type: "string",
          schema: {
            name: "languages_code",
            table: "ProductVariant_translations",
            schema: "public",
            data_type: "character varying",
            is_nullable: true,
            generation_expression: null,
            default_value: null,
            is_generated: false,
            max_length: 255,
            comment: null,
            numeric_precision: null,
            numeric_scale: null,
            is_unique: false,
            is_primary_key: false,
            has_auto_increment: false,
            foreign_key_schema: "public",
            foreign_key_table: "languages",
            foreign_key_column: "code",
          },
          meta: {
            collection: "ProductVariant_translations",
            field: "languages_code",
            special: null,
            interface: null,
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: true,
            sort: 3,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
        {
          collection: "ProductVariant_translations",
          field: "title",
          type: "string",
          schema: {
            name: "title",
            table: "ProductVariant_translations",
            schema: "public",
            data_type: "character varying",
            is_nullable: true,
            generation_expression: null,
            default_value: null,
            is_generated: false,
            max_length: 255,
            comment: null,
            numeric_precision: null,
            numeric_scale: null,
            is_unique: false,
            is_primary_key: false,
            has_auto_increment: false,
            foreign_key_schema: null,
            foreign_key_table: null,
            foreign_key_column: null,
          },
          meta: {
            collection: "ProductVariant_translations",
            field: "title",
            special: null,
            interface: "input",
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: false,
            sort: 4,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
          },
        },
      ],
    })
  );

  await directus.request(
    createRelation({
      collection: "ProductVariant_translations",
      field: "ProductVariant_id",
      related_collection: "ProductVariant",
      schema: {
        constraint_name: "product_translations_product_id_foreign",
        table: "ProductVariant_translations",
        column: "ProductVariant_id",
        foreign_key_schema: "public",
        foreign_key_table: "ProductVariant",
        foreign_key_column: "id",
        on_update: "NO ACTION",
        on_delete: "CASCADE",
      },

      // @ts-ignore
      meta: {
        many_collection: "ProductVariant_translations",
        many_field: "ProductVariant_id",
        one_collection: "ProductVariant",
        one_field: "translations",
        one_collection_field: null,
        one_allowed_collections: null,
        junction_field: "languages_code",
        sort_field: null,
        one_deselect_action: "delete",
      },
    })
  );

  await directus.request(
    createRelation({
      collection: "ProductVariant_translations",
      field: "languages_code",
      related_collection: "languages",
      schema: {
        constraint_name: "productvariant_translations_languages_code_foreign",
        table: "ProductVariant_translations",
        column: "languages_code",
        foreign_key_schema: "public",
        foreign_key_table: "languages",
        foreign_key_column: "code",
        on_update: "NO ACTION",
        on_delete: "SET NULL",
      },

      // @ts-ignore
      meta: {
        many_collection: "ProductVariant_translations",
        many_field: "languages_code",
        one_collection: "languages",
        one_field: null,
        one_collection_field: null,
        one_allowed_collections: null,
        junction_field: "ProductVariant_id",
        sort_field: null,
        one_deselect_action: "nullify",
      },
    })
  );

  await directus.request(
    createRelation({
      collection: "ProductVariant",
      field: "Product_id",
      related_collection: "Product",
      schema: {
        constraint_name: "productvariant_product_id_foreign",
        table: "ProductVariant",
        column: "Product_id",
        foreign_key_schema: "public",
        foreign_key_table: "Product",
        foreign_key_column: "id",
        on_update: "NO ACTION",
        on_delete: "CASCADE",
      },
      // @ts-ignore
      meta: {
        many_collection: "ProductVariant",
        many_field: "Product_id",
        one_collection: "Product",
        one_field: "variants",
        one_collection_field: null,
        one_allowed_collections: null,
        junction_field: null,
        sort_field: null,
        one_deselect_action: "delete",
      },
    })
  );

  return collection;
};
