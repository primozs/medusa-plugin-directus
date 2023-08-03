import type { DirectusClient } from "./createDirectus";
import { createCollection, createRelation } from "@directus/sdk";

export const createProductTag = async (directus: DirectusClient) => {
  const res = await directus.request(
    createCollection({
      collection: "ProductTag",
      meta: {
        collection: "ProductTag",
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
        name: "ProductTag",
        comment: null,
      },
      // @ts-ignore
      fields: [
        {
          collection: "ProductTag",
          field: "id",
          type: "uuid",
          schema: {
            name: "id",
            table: "ProductTag",
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
            collection: "ProductTag",
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
          collection: "ProductTag",
          field: "medusa_id",
          type: "string",
          schema: {
            name: "medusa_id",
            table: "ProductTag",
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
            collection: "ProductTag",
            field: "medusa_id",
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
          collection: "ProductTag",
          field: "translations",
          type: "alias",
          schema: null,
          meta: {
            collection: "ProductTag",
            field: "translations",
            special: ["translations"],
            interface: "translations",
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
      ],
    })
  );

  await directus.request(
    createCollection({
      collection: "ProductTag_translations",
      meta: {
        collection: "ProductTag_translations",
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
        name: "ProductTag_translations",
        comment: null,
      },
      // @ts-ignore
      fields: [
        {
          collection: "ProductTag_translations",
          field: "id",
          type: "integer",
          schema: {
            name: "id",
            table: "ProductTag_translations",
            schema: "public",
            data_type: "integer",
            is_nullable: false,
            generation_expression: null,
            default_value:
              "nextval('\"ProductTag_translations_id_seq\"'::regclass)",
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
            collection: "ProductTag_translations",
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
          collection: "ProductTag_translations",
          field: "ProductTag_id",
          type: "uuid",
          schema: {
            name: "ProductTag_id",
            table: "ProductTag_translations",
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
            foreign_key_table: "ProductTag",
            foreign_key_column: "id",
          },
          meta: {
            collection: "ProductTag_translations",
            field: "ProductTag_id",
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
          collection: "ProductTag_translations",
          field: "languages_code",
          type: "string",
          schema: {
            name: "languages_code",
            table: "ProductTag_translations",
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
            collection: "ProductTag_translations",
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
          collection: "ProductTag_translations",
          field: "value",
          type: "string",
          schema: {
            name: "value",
            table: "ProductTag_translations",
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
            collection: "ProductTag_translations",
            field: "value",
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
            required: true,
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
      collection: "ProductTag_translations",
      field: "languages_code",
      related_collection: "languages",
      schema: {
        constraint_name: "producttag_translations_languages_code_foreign",
        table: "ProductTag_translations",
        column: "languages_code",
        foreign_key_schema: "public",
        foreign_key_table: "languages",
        foreign_key_column: "code",
        on_update: "NO ACTION",
        on_delete: "SET NULL",
      },
      // @ts-ignore
      meta: {
        many_collection: "ProductTag_translations",
        many_field: "languages_code",
        one_collection: "languages",
        one_field: null,
        one_collection_field: null,
        one_allowed_collections: null,
        junction_field: "ProductTag_id",
        sort_field: null,
        one_deselect_action: "nullify",
      },
    })
  );

  await directus.request(
    createRelation({
      collection: "ProductTag_translations",
      field: "ProductTag_id",
      related_collection: "ProductTag",
      schema: {
        constraint_name: "producttag_translations_producttag_id_foreign",
        table: "ProductTag_translations",
        column: "ProductTag_id",
        foreign_key_schema: "public",
        foreign_key_table: "ProductTag",
        foreign_key_column: "id",
        on_update: "NO ACTION",
        on_delete: "CASCADE",
      },
      // @ts-ignore
      meta: {
        many_collection: "ProductTag_translations",
        many_field: "ProductTag_id",
        one_collection: "ProductTag",
        one_field: "translations",
        one_collection_field: null,
        one_allowed_collections: null,
        junction_field: "languages_code",
        sort_field: null,
        one_deselect_action: "delete",
      },
    })
  );

  return res;
};

export const createProductProductTag = async (directus: DirectusClient) => {
  const res = await directus.request(
    createCollection({
      collection: "Product_ProductTag",
      meta: {
        collection: "Product_ProductTag",
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
        name: "Product_ProductTag",
        comment: null,
      },
      // @ts-ignore
      fields: [
        {
          collection: "Product_ProductTag",
          field: "id",
          type: "integer",
          schema: {
            name: "id",
            table: "Product_ProductTag",
            schema: "public",
            data_type: "integer",
            is_nullable: false,
            generation_expression: null,
            default_value: "nextval('\"Product_ProductTag_id_seq\"'::regclass)",
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
            collection: "Product_ProductTag",
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
          collection: "Product_ProductTag",
          field: "Product_id",
          type: "uuid",
          schema: {
            name: "Product_id",
            table: "Product_ProductTag",
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
            foreign_key_table: "Product",
            foreign_key_column: "id",
          },
          meta: {
            collection: "Product_ProductTag",
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
          collection: "Product_ProductTag",
          field: "ProductTag_id",
          type: "uuid",
          schema: {
            name: "ProductTag_id",
            table: "Product_ProductTag",
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
            foreign_key_table: "ProductTag",
            foreign_key_column: "id",
          },
          meta: {
            collection: "Product_ProductTag",
            field: "ProductTag_id",
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
      ],
    })
  );

  await directus.request(
    createRelation({
      collection: "Product_ProductTag",
      field: "Product_id",
      related_collection: "Product",
      schema: {
        constraint_name: "product_producttag_product_id_foreign",
        table: "Product_ProductTag",
        column: "Product_id",
        foreign_key_schema: "public",
        foreign_key_table: "Product",
        foreign_key_column: "id",
        on_update: "NO ACTION",
        on_delete: "CASCADE",
      },
      // @ts-ignore
      meta: {
        many_collection: "Product_ProductTag",
        many_field: "Product_id",
        one_collection: "Product",
        one_field: "tags",
        one_collection_field: null,
        one_allowed_collections: null,
        junction_field: "ProductTag_id",
        sort_field: null,
        one_deselect_action: "delete",
      },
    })
  );

  await directus.request(
    createRelation({
      collection: "Product_ProductTag",
      field: "ProductTag_id",
      related_collection: "ProductTag",
      schema: {
        constraint_name: "product_producttag_producttag_id_foreign",
        table: "Product_ProductTag",
        column: "ProductTag_id",
        foreign_key_schema: "public",
        foreign_key_table: "ProductTag",
        foreign_key_column: "id",
        on_update: "NO ACTION",
        on_delete: "CASCADE",
      },
      // @ts-ignore
      meta: {
        many_collection: "Product_ProductTag",
        many_field: "ProductTag_id",
        one_collection: "ProductTag",
        one_field: null,
        one_collection_field: null,
        one_allowed_collections: null,
        junction_field: "Product_id",
        sort_field: null,
        one_deselect_action: "delete",
      },
    })
  );

  return res;
};