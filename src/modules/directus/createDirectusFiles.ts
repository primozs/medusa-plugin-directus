import type { DirectusClient } from "./createDirectus";
import { createField } from "@directus/sdk";

export const createDirectusFiles = async (directus: DirectusClient) => {
  const res = await directus.request(
    // @ts-ignore
    createField("directus_files", {
      collection: "directus_files",
      field: "import_url",
      type: "string",
      schema: {
        name: "import_url",
        table: "directus_files",
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
        collection: "directus_files",
        field: "import_url",
        special: null,
        interface: "input",
        options: null,
        display: null,
        display_options: null,
        readonly: false,
        hidden: false,
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
    })
  );

  return res;
};
