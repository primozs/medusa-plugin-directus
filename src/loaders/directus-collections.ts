import { AwilixContainer } from "awilix";
import DirectusService from "../services/directus";
import { createProductVariant } from "../modules/directus/createProductVariant";
import { createProduct } from "../modules/directus/createProduct";
import { createCollection, readRelationByCollection } from "@directus/sdk";
import { createProductCollection } from "../modules/directus/createProductCollection";
import {
  createProductProductTag,
  createProductTag,
} from "../modules/directus/createProductTag";
import { createProductType } from "../modules/directus/productType";
import { createProductOption } from "../modules/directus/productOption";
import { createProductCategory } from "../modules/directus/productCategory";
import { createProductVariantPrice } from "../modules/directus/productVariantPrice";
import { createProductVariantOptions } from "../modules/directus/productVariantOptions";
import { createStoreRegion } from "../modules/directus/createRegion";
import { createDirectusFiles } from "../modules/directus/createDirectusFiles";

const checkDirectusCollections = async (container: AwilixContainer) => {
  const directusService = container.resolve(
    "directusService"
  ) as DirectusService;

  const directus = directusService.getDirectus();

  let product;
  try {
    // await deleteAllCollections(directusService);

    product = await directusService.getDirectusCollection("Product");
    await directusService.updateStoreRegions();

    // await debugDirectusMeta(directusService);
  } catch (error) {
    if (!product) {
      console.log("generate schema");
      await directus.request(
        createCollection({
          collection: "store",
          schema: null,
          // @ts-ignore
          meta: {
            collection: "store",
          },
        })
      );
      await createDirectusFiles(directus);
      await createStoreRegion(directus);
      await createProductTag(directus);
      await createProductCollection(directus);
      await createProductType(directus);
      await createProductCategory(directus);
      product = await createProduct(directus);
      await createProductProductTag(directus);
      await createProductOption(directus);
      await createProductVariant(directus);
      await createProductVariantPrice(directus);
      await createProductVariantOptions(directus);
    }
  }
};

const deleteAllCollections = async (directusService: DirectusService) => {
  await directusService.deleteCollection("store");
  await directusService.deleteField("directus_files", "import_url");
  await directusService.deleteCollection("StoreRegion");
  await directusService.deleteCollection("ProductCollection_translations");
  await directusService.deleteField("Product", "collection");
  await directusService.deleteCollection("ProductCollection");
  await directusService.deleteCollection("Product_ProductTag");
  await directusService.deleteCollection("ProductTag_translations");
  await directusService.deleteCollection("ProductTag");
  await directusService.deleteCollection("Product_ProductCollection");
  await directusService.deleteCollection("ProductType_translations");
  await directusService.deleteField("Product", "type");
  await directusService.deleteCollection("ProductType");

  await directusService.deleteCollection("Product_ProductCategory");
  await directusService.deleteCollection("ProductCategory_translations");
  await directusService.deleteField("ProductCategory", "parent_category_id");
  await directusService.deleteCollection("ProductCategory");

  await directusService.deleteCollection("ProductVariantPrice");
  await directusService.deleteCollection("ProductVariant_ProductOption");
  await directusService.deleteCollection("ProductOption_translations");
  await directusService.deleteCollection("ProductOption");
  await directusService.deleteCollection("ProductVariant_translations");
  await directusService.deleteCollection("ProductVariant");

  await directusService.deleteField("Product", "media");
  await directusService.deleteField("Product", "thumbnail");
  await directusService.deleteCollection("Product_translations");
  await directusService.deleteCollection("Product_files");
  await directusService.deleteCollection("Product");
  await directusService.deleteCollection("ProductCollection");
};

const debugDirectusMeta = async (directusService: DirectusService) => {
  const directus = directusService.getDirectus();

  const collection = await directusService.getDirectusCollection(
    "ProductCategory"
  );
  const fields = await directusService.getDirectusCollectionFields(
    "ProductCategory"
  );
  const relations = await directus.request(
    readRelationByCollection("ProductCategory")
  );
  console.log(JSON.stringify(collection, null, 2));
  console.log("---------------------------------------");
  console.log(JSON.stringify(fields, null, 2));
  console.log("---------------------------------------");
  console.log(JSON.stringify(relations, null, 2));
};

// const requiredProductFields = [
//   "title",
//   "subtitle",
//   "handle",
//   "material",
//   "description",
//   "medusa_id",
//   "variants",
//   "type",
//   "tags",
//   "options",
//   "collection",
//   "collections",
//   "categories",
// ];

// const requiredVariantFields = [
//   "id",
//   "sku",
//   "medusa_id",
//   "title",
//   "prices",
//   "options",
// ];

export default checkDirectusCollections;
