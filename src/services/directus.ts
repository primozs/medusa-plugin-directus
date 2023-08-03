import { Lifetime } from "awilix";
import {
  TransactionBaseService,
  ProductService,
  ProductVariantService,
  ProductCategoryService,
  RegionService,
  ProductVariantInventoryService,
  Region,
  ProductTag as MedusaProductTag,
  Product as MedusaProduct,
  ProductType as MedusaProductType,
  ProductCollection as MedusaProductCollection,
  ProductCategory as MedusaProductCategory,
  ProductCollectionService,
} from "@medusajs/medusa";
import {
  type IEventBusService,
  type ConfigModule,
  ICacheService,
  ProductCollectionDTO,
  ProductTypeDTO,
  ProductTagDTO,
  Logger,
} from "@medusajs/types";
import {
  DirectusClient,
  DirectusSchema,
  Product,
  ProductCollection,
  ProductOption,
  ProductTag,
  ProductType,
  ProductVariant,
  Product_ProductCollection,
  StoreRegion,
  getDirectusClient,
} from "../modules/directus/createDirectus";
import {
  readCollections,
  readCollection,
  readFieldsByCollection,
  deleteCollection,
  deleteField,
  createItem,
  updateItem,
  readItems,
  Query,
  deleteItems,
  deleteItem,
  importFile,
  readFiles,
  readItem,
} from "@directus/sdk";

export type ProjectConfig = ConfigModule["projectConfig"] & {
  directusConfig: {
    host: string;
    token: string;
  };
};

const IGNORE_THRESHOLD = 2; // seconds
const MEDUSA_LANGUAGE_CODE = "en";
const DIRECTUS_PRODUCT_FOLDER = "36b0982a-ce85-4ed0-8f28-382b6651b4ca";

export default class DirectusService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  private readonly eventBus_: IEventBusService;
  private readonly productService_: ProductService;
  private readonly productVariantService_: ProductVariantService;
  private readonly productCategoryService_: ProductCategoryService;
  private readonly regionService_: RegionService;
  private readonly productVariantInventoryService_: ProductVariantInventoryService;
  private readonly productCollectionService: ProductCollectionService;
  private readonly featureFlagRouter_: any;
  private directus: DirectusClient;
  private readonly config_: ProjectConfig["directusConfig"];
  private readonly cacheService_: ICacheService;
  private options_: Record<string, any>;
  protected readonly logger: Logger;

  constructor(
    {
      regionService,
      productService,
      productCollectionService,
      cacheService,
      productVariantService,
      productCategoryService,
      eventBusService,
      productVariantInventoryService,
      featureFlagRouter,
      logger,
    }: {
      regionService: RegionService;
      productService: ProductService;
      cacheService: ICacheService;
      productVariantService: ProductVariantService;
      productCategoryService: ProductCategoryService;
      productCollectionService: ProductCollectionService;
      eventBusService: IEventBusService;
      productVariantInventoryService: ProductVariantInventoryService;
      featureFlagRouter: any;
      logger: Logger;
    },
    options: Record<string, any>
  ) {
    // @ts-ignore
    super(...arguments);

    this.regionService_ = regionService;
    this.productService_ = productService;
    this.productVariantService_ = productVariantService;
    this.productCategoryService_ = productCategoryService;
    this.eventBus_ = eventBusService;
    this.productVariantInventoryService_ = productVariantInventoryService;
    this.featureFlagRouter_ = featureFlagRouter;
    this.cacheService_ = cacheService;

    const projectConfig = options.projectConfig as ProjectConfig;
    const config = projectConfig.directusConfig;
    this.config_ = config;

    const directus = getDirectusClient(this.config_.host, this.config_.token);
    this.directus = directus;
    this.options_ = options;
    this.logger = logger;
    this.productCollectionService = productCollectionService;
  }

  async addIgnore_(id: string, side: "medusa" | "directus") {
    const key = `${id}_ignore_${side}`;
    return await this.cacheService_.set(
      key,
      1,
      this.options_.ignore_threshold || IGNORE_THRESHOLD
    );
  }

  async shouldIgnore_(id: string, side: "medusa" | "directus") {
    const key = `${id}_ignore_${side}`;
    return await this.cacheService_.get(key);
  }

  getDirectus() {
    return this.directus;
  }

  async createProductCategory(category: MedusaProductCategory) {
    const pc = category.parent_category_id
      ? await this.productCategoryService_.retrieve(category.parent_category_id)
      : null;

    const parentProductCategory: any = pc
      ? await this.upsertProductCategory(pc)
      : null;

    const result = await this.directus.request(
      createItem("ProductCategory", {
        medusa_id: category.id,
        parent_medusa_id: category.parent_category_id ?? "",
        translations: [
          {
            name: category.name,
            handle: category.handle ?? "",
            description: category.description ?? "",
            languages_code: MEDUSA_LANGUAGE_CODE,
          },
        ],
        ...(parentProductCategory && {
          parent_category_id: parentProductCategory.id,
        }),
      })
    );

    return result;
  }

  async upsertProductCategory(category: MedusaProductCategory) {
    const productCategories = await this.directus.request(
      readItems("ProductCategory", {
        filter: {
          medusa_id: {
            _eq: category.id,
          },
        },
        // @ts-ignore
        fields: ["*", "translations.*", "category.*"],
      })
    );

    const productCategory = productCategories[0];
    if (!productCategory) {
      return this.createProductCategory(category);
    }

    const translations = productCategory.translations.map((item) => {
      if (item.languages_code === MEDUSA_LANGUAGE_CODE) {
        return {
          ...item,
          name: category.name,
          handle: category.handle,
          description: category.description,
        };
      } else {
        return item;
      }
    });

    const pc = category.parent_category_id
      ? await this.productCategoryService_.retrieve(category.parent_category_id)
      : null;

    const parentProductCategory: any = pc
      ? await this.upsertProductCategory(pc)
      : null;

    const result = await this.directus.request(
      updateItem("ProductCategory", productCategory.id, {
        medusa_id: category.id,
        parent_medusa_id: category.parent_category_id ?? "",
        translations,
        ...(parentProductCategory && {
          parent_category_id: parentProductCategory.id,
        }),
      })
    );
    return result;
  }

  async upsertProductCategories(categories: MedusaProductCategory[]) {
    const result: Awaited<ReturnType<typeof this.upsertProductCategory>>[] = [];
    for (const c of categories) {
      const res = await this.upsertProductCategory(c);
      result.push(res);
    }
    return result;
  }

  async createProductTag(tag: ProductTagDTO | MedusaProductTag) {
    const result = await this.directus.request(
      createItem("ProductTag", {
        medusa_id: tag.id,
        translations: [
          {
            value: tag.value,
            languages_code: MEDUSA_LANGUAGE_CODE,
          },
        ],
      })
    );

    return result;
  }

  async upsertProductTag(tag: ProductTagDTO | MedusaProductTag) {
    const productTags = await this.directus.request(
      readItems("ProductTag", {
        filter: {
          medusa_id: {
            _eq: tag.id,
          },
        },
        fields: ["*", "translations.*"],
      })
    );

    const productTag = productTags[0];
    if (!productTag) {
      return this.createProductTag(tag);
    }

    const translations = productTag.translations.map((item) => {
      if (item.languages_code === MEDUSA_LANGUAGE_CODE) {
        return {
          ...item,
          value: tag.value,
        };
      } else {
        return item;
      }
    });

    const result = await this.directus.request(
      updateItem("ProductTag", productTag.id, {
        medusa_id: tag.id,
        translations,
      })
    );
    return result;
  }

  async createProductCollection(
    collection: ProductCollectionDTO | MedusaProductCollection
  ) {
    const result = await this.directus.request(
      createItem("ProductCollection", {
        medusa_id: collection.id,
        translations: [
          {
            title: collection.title,
            handle: collection.handle,
            languages_code: MEDUSA_LANGUAGE_CODE,
          },
        ],
      })
    );
    return result;
  }

  async upsertProductCollection(
    collection: ProductCollectionDTO | MedusaProductCollection
  ) {
    if (!collection) return null;
    let productCollection: ProductCollection | undefined = undefined;

    const productCollections = await this.directus.request(
      readItems<
        DirectusSchema,
        "ProductCollection",
        Query<DirectusSchema, ProductCollection>
      >("ProductCollection", {
        filter: {
          medusa_id: {
            _eq: collection.id,
          },
        },
        fields: ["*.*"],
      })
    );
    productCollection = productCollections[0];

    if (!productCollection) {
      return this.createProductCollection(collection);
    }

    const translations = productCollection.translations.map((item) => {
      if (item.languages_code === MEDUSA_LANGUAGE_CODE) {
        return {
          ...item,
          title: collection.title,
          handle: collection.handle,
        };
      } else {
        return item;
      }
    });

    const result = await this.directus.request(
      updateItem("ProductCollection", productCollection.id, {
        medusa_id: collection.id,
        translations,
      })
    );

    return result;
  }

  async createProductType(type: ProductTypeDTO | MedusaProductType) {
    const result = await this.directus.request(
      createItem("ProductType", {
        medusa_id: type.id,
        translations: [
          {
            value: type.value,
            languages_code: MEDUSA_LANGUAGE_CODE,
          },
        ],
      })
    );
    return result;
  }

  async upsertProductType(type: ProductTypeDTO | MedusaProductType) {
    if (!type) return null;
    const productTypes = await this.directus.request(
      readItems<
        DirectusSchema,
        "ProductType",
        Query<DirectusSchema, ProductType>
      >("ProductType", {
        filter: {
          medusa_id: {
            _eq: type.id,
          },
        },
        fields: ["*.*"],
      })
    );
    const productType = productTypes[0];

    if (!productType) {
      return this.createProductType(type);
    }

    const translations = productType.translations.map((item) => {
      if (item.languages_code === MEDUSA_LANGUAGE_CODE) {
        return {
          ...item,
          value: type.value,
        };
      } else {
        return item;
      }
    });

    return this.directus.request(
      updateItem("ProductType", productType.id, {
        medusa_id: type.id,
        translations,
      })
    );
  }

  async updateStoreRegions() {
    const list = await this.regionService_.list(undefined, {
      relations: ["countries", "payment_providers", "fulfillment_providers"],
    });

    for (const region of list) {
      await this.upsertStoreRegion(region.id);
    }
  }

  async createStoreRegion(r: Region) {
    this.directus.request(
      createItem("StoreRegion", {
        // id: r.id,
        medusa_id: r.id,
        name: r.name,
        currency_code: r.currency_code,
        currency: r.currency
          ? {
              code: r.currency.code,
              name: r.currency.name,
              symbol: r.currency.symbol,
              symbol_native: r.currency.symbol_native,
              includes_tax: r.currency.includes_tax,
            }
          : undefined,
        countries: r.countries.map((item) => {
          return {
            id: item.id,
            display_name: item.display_name,
            iso_2: item.iso_2,
            iso_3: item.iso_3,
            name: item.name,
            num_code: item.num_code,
            region_id: item.region_id,
          };
        }),
        payment_providers: r.payment_providers.map((item) => {
          return {
            id: item.id,
            is_installed: item.is_installed,
          };
        }),
        fulfillment_providers: r.fulfillment_providers.map((item) => {
          return {
            id: item.id,
            is_installed: item.is_installed,
          };
        }),
      })
    );
  }

  async upsertStoreRegion(id: string) {
    const ignore = await this.shouldIgnore_(id, "directus");
    if (ignore) {
      return;
    }

    const r = await this.regionService_.retrieve(id, {
      relations: ["countries", "payment_providers", "fulfillment_providers"],
    });

    let storeRegion: StoreRegion | undefined = undefined;

    const storeRegions = await this.directus.request(
      readItems<
        DirectusSchema,
        "StoreRegion",
        Query<DirectusSchema, StoreRegion>
      >("StoreRegion", {
        filter: {
          medusa_id: {
            _eq: id,
          },
        },
      })
    );

    storeRegion = storeRegions[0];

    if (!storeRegion) {
      return this.createStoreRegion(r);
    }

    storeRegion = await this.directus.request(
      updateItem("StoreRegion", storeRegion.id, {
        medusa_id: r.id,
        name: r.name,
        currency_code: r.currency_code,
        currency: r.currency
          ? {
              code: r.currency.code,
              name: r.currency.name,
              symbol: r.currency.symbol,
              symbol_native: r.currency.symbol_native,
              includes_tax: r.currency.includes_tax,
            }
          : null,
        countries: r.countries.map((item) => {
          return {
            id: item.id,
            display_name: item.display_name,
            iso_2: item.iso_2,
            iso_3: item.iso_3,
            name: item.name,
            num_code: item.num_code,
            region_id: item.region_id,
          };
        }),
        payment_providers: r.payment_providers.map((item) => {
          return {
            id: item.id,
            is_installed: item.is_installed,
          };
        }),
        fulfillment_providers: r.fulfillment_providers.map((item) => {
          return {
            id: item.id,
            is_installed: item.is_installed,
          };
        }),
      })
    );

    await this.addIgnore_(id, "medusa");

    return storeRegion;
  }

  async getDirectusCollection(collection: string) {
    // throws if not found
    const res = await this.directus.request(readCollection(collection));
    return res;
  }

  async getDirectusCollectionFields(collection: string) {
    const res = await this.directus.request(readFieldsByCollection(collection));
    return res;
  }

  async getDirectusCollections() {
    const collections = await this.directus.request(readCollections());
    return collections;
  }

  async deleteCollection(collection: string) {
    try {
      this.logger.info(`Delete collection: ${collection}`);
      await this.directus.request(deleteCollection(collection));
    } catch (error) {
      this.logger.error("Not deleted");
    }
  }

  async deleteField(collection: string, field: string) {
    try {
      this.logger.info(`Delete field collection: ${field}, ${collection}`);
      await this.directus.request(deleteField(collection, field));
    } catch (error) {
      this.logger.error("Not deleted");
    }
  }

  // medusa events
  async createRegionInDirectus(data: { id: string }) {
    this.logger.info(`region.created ${data.id}`);
    await this.upsertStoreRegion(data.id);
  }

  async updateRegionInDirectus(data: { id: string; fields: string[] }) {
    this.logger.info(`region.updated ${data.id}`);
    await this.upsertStoreRegion(data.id);
  }

  async deleteRegionInDirectus(data: { id: string }) {
    this.logger.info(`region.deleted ${data.id}`);
    this.directus.request(
      deleteItems("StoreRegion", {
        filter: {
          medusa_id: {
            _eq: data.id,
          },
        },
      })
    );
  }

  async archiveRegionInDirectus(data: { id: string }) {
    let regionEntity;
    const ignore = await this.shouldIgnore_(data.id, "directus");
    if (ignore) {
      return Promise.resolve();
    }

    try {
      regionEntity = await this.regionService_.retrieve(data.id);
    } catch {}

    if (regionEntity) {
      return Promise.resolve();
    }

    const items = await this.directus.request(
      readItems<
        DirectusSchema,
        "StoreRegion",
        Query<DirectusSchema, StoreRegion>
      >("StoreRegion", {
        filter: {
          medusa_id: {
            _eq: data.id,
          },
        },
      })
    );
    const item = items[0];

    if (!item) {
      return Promise.resolve();
    }

    const res = await this.directus.request(
      updateItem("StoreRegion", item.id, {
        status: "archived",
      })
    );

    await this.addIgnore_(data.id, "medusa");

    return res;
  }

  async createProductCollectionInDirectus(data: { id: string }) {
    this.logger.info(`product-collection.created ${data.id}`);
    const collection = await this.productCollectionService.retrieve(data.id);
    await this.upsertProductCollection(collection);
  }

  async updateProductCollectionInDirectus(data: { id: string }) {
    this.logger.info(`product-collection.updated ${data.id}`);
    const collection = await this.productCollectionService.retrieve(data.id);
    await this.upsertProductCollection(collection);
  }

  async deleteProductCollectionInDirectus(data: { id: string }) {
    this.logger.info(`product-collection.deleted ${data.id}`);
    this.directus.request(
      deleteItems("ProductCollection", {
        filter: {
          medusa_id: {
            _eq: data.id,
          },
        },
      })
    );
  }

  async importProductFile(url: string | null, title: string) {
    if (!url) {
      return null;
    }

    const files = await this.directus.request(
      readFiles({
        limit: 1,
        filter: {
          // @ts-ignore
          import_url: {
            _eq: url,
          },
        },
      })
    );

    const file = files[0];

    if (!file) {
      const res = await this.directus.request(
        importFile(url, {
          title: title,
          folder: DIRECTUS_PRODUCT_FOLDER,
          // @ts-ignore
          import_url: url,
        })
      );
      return res;
    } else {
      return file;
    }
  }

  async importProductMedia(product: MedusaProduct) {
    // const images = product.images.filter(
    //   (image) => image.url !== product.thumbnail
    // );
    const images = product.images;

    const dImages: NonNullable<
      Awaited<ReturnType<typeof this.importProductFile>>
    >[] = [];
    for (const img of images) {
      const image = await this.importProductFile(img.url, product.title);
      if (image !== null) {
        dImages.push(image);
      }
    }

    return dImages;
  }

  async createProductVariantInDirectus(data: { id: string }) {
    try {
      this.logger.info(`product-variant.created ${data.id}`);

      const v = await this.productVariantService_.retrieve(data.id, {
        relations: ["prices", "options"],
      });

      let sku = v.sku;
      if (this.featureFlagRouter_.isFeatureEnabled("inventoryService")) {
        const [inventoryItem] =
          await this.productVariantInventoryService_.listInventoryItemsByVariant(
            v.id
          );
        if (inventoryItem) {
          sku = inventoryItem.sku ?? "";
        }
      }

      const products = await this.directus.request(
        readItems("Product", {
          filter: {
            medusa_id: {
              _eq: v.product_id,
            },
          },
          // @ts-ignore
          fields: ["*", "options.*"],
        })
      );
      const product = products[0];
      if (!product) return null;

      const options = [];
      for (const item of product.options) {
        const foundMedusaOption = v.options.find(
          (vOption) => vOption.option_id === item.medusa_id
        );

        if (!foundMedusaOption) continue;
        options.push({
          ProductOption_id: item.id,
          value: foundMedusaOption?.value ?? "",
        });
      }

      const result = await this.directus.request(
        createItem("ProductVariant", {
          Product_id: product.id,
          medusa_id: v.id,
          sku: sku,
          translations: [
            {
              title: v.title,
              languages_code: MEDUSA_LANGUAGE_CODE,
            },
          ],
          prices: v.prices.map((item) => {
            return {
              medusa_id: item.id,
              amount: item.amount,
              currency_code: item.currency_code,
            };
          }),
          options,
        })
      );

      return result;
    } catch (error: any) {
      console.log(
        "createProductVariantInDirectus",
        JSON.stringify(error, null, 2)
      );
      throw new Error(error?.message);
    }
  }

  async updateProductVariantInDirectus(data: {
    id: string;
    fields?: string[];
  }) {
    try {
      this.logger.info(`product-variant.updated ${data.id}`);

      const ignore = await this.shouldIgnore_(data.id, "directus");
      if (ignore) {
        return Promise.resolve();
      }

      const productVariants = await this.directus.request(
        readItems("ProductVariant", {
          filter: {
            medusa_id: {
              _eq: data.id,
            },
          },
          fields: ["*", "translations.*", "prices.*", "options.*"],
        })
      );
      const productVariant = productVariants[0];
      if (!productVariant) {
        return this.createProductVariantInDirectus(data);
      }

      const v = await this.productVariantService_.retrieve(data.id, {
        relations: ["prices", "options"],
      });

      let sku = v.sku;
      if (this.featureFlagRouter_.isFeatureEnabled("inventoryService")) {
        const [inventoryItem] =
          await this.productVariantInventoryService_.listInventoryItemsByVariant(
            v.id
          );
        if (inventoryItem) {
          sku = inventoryItem.sku ?? "";
        }
      }

      const products = await this.directus.request(
        readItems("Product", {
          filter: {
            medusa_id: {
              _eq: v.product_id,
            },
          },
          // @ts-ignore
          fields: ["*", "options.*"],
        })
      );
      const product = products[0];
      if (!product) return null;

      const translations = productVariant.translations.map((item) => {
        if (item.languages_code === MEDUSA_LANGUAGE_CODE) {
          return {
            ...item,
            title: v.title,
          };
        } else {
          return item;
        }
      });

      const options = [];
      for (const item of v.options) {
        const productOption = product.options.find(
          (pItem) => pItem.medusa_id === item.option_id
        );
        if (!productOption) continue;

        const variantOption = productVariant.options.find(
          (vItem) => vItem.ProductOption_id === productOption.id
        );

        if (!variantOption) {
          // create
          options.push({
            ProductOption_id: productOption.id,
            value: item.value,
          });
        } else {
          // update
          options.push({
            id: variantOption.id,
            ProductVariant_id: variantOption.ProductVariant_id,
            ProductOption_id: variantOption.ProductOption_id,
            value: item.value,
          });
        }
      }

      const prices = [];
      for (const vPrice of v.prices) {
        const productVariantPrice = productVariant.prices.find(
          (item) => item.medusa_id === vPrice.id
        );
        if (!productVariantPrice) {
          // create
          prices.push({
            medusa_id: vPrice.id,
            currency_code: vPrice.currency_code,
            amount: vPrice.amount,
          });
        } else {
          // update
          prices.push({
            id: productVariantPrice.id,
            medusa_id: productVariantPrice.id,
            currency_code: vPrice.currency_code,
            amount: vPrice.amount,
          });
        }
      }

      const updatedVariant = await this.directus.request(
        updateItem("ProductVariant", productVariant.id, {
          medusa_id: data.id,
          Product_id: product.id,
          sku: sku,
          translations,
          options,
          prices,
        })
      );

      await this.addIgnore_(data.id, "medusa");

      return updatedVariant;
    } catch (error: any) {
      console.log(
        "updateProductVariantInDirectus",
        JSON.stringify(error, null, 2)
      );
      throw new Error(error?.message);
    }
  }

  async archiveProductVariantInDirectus(data: { id: string }) {
    this.logger.info(`product-variant.deleted ${data.id}`);

    const ignore = await this.shouldIgnore_(data.id, "directus");
    if (ignore) {
      return Promise.resolve();
    }

    let variantEntity;
    try {
      variantEntity = await this.productVariantService_.retrieve(data.id);
    } catch {}

    if (variantEntity) {
      return Promise.resolve();
    }

    const items = await this.directus.request(
      readItems<
        DirectusSchema,
        "ProductVariant",
        Query<DirectusSchema, ProductVariant>
      >("ProductVariant", {
        filter: {
          medusa_id: {
            _eq: data.id,
          },
        },
      })
    );
    const item = items[0];

    if (!item) {
      return Promise.resolve();
    }

    const res = await this.directus.request(
      deleteItem("ProductVariant", item.id)
    );

    await this.addIgnore_(data.id, "medusa");

    return res;
  }

  async createProductInDirectus(data: { id: string }) {
    this.logger.info(`product.created ${data.id}`);
    const p = await this.productService_.retrieve(data.id, {
      relations: [
        "variants",
        "options",
        "tags",
        "type",
        "collection",
        "images",
        "categories",
      ],
    });

    try {
      const thumbnail = await this.importProductFile(p.thumbnail, p.title);
      const media = await this.importProductMedia(p);
      const type = await this.upsertProductType(p.type);
      const collection = await this.upsertProductCollection(p.collection);
      const categories = await this.upsertProductCategories(p.categories);

      const dTags: ProductTag[] = [];
      for (const t of p.tags) {
        const tag = await this.upsertProductTag(t);
        dTags.push(tag);
      }

      const product = await this.directus.request(
        createItem("Product", {
          drupal_id: "",
          medusa_id: p.id,
          date_created: p.created_at,
          status: p.status,
          date_updated: new Date(p.updated_at).toISOString(),
          translations: [
            {
              title: p.title,
              subtitle: p.subtitle ?? "",
              description: p.description ?? "",
              handle: p.handle ?? "",
              material: p.material ?? "",
              languages_code: MEDUSA_LANGUAGE_CODE,
            },
          ],
          ...(type && {
            type: { id: type.id },
          }),
          ...(collection && {
            collection: { id: collection.id },
            collections: [{ ProductCollection_id: collection.id }],
          }),
          tags: dTags.map((item) => {
            return {
              ProductTag_id: item.id,
            };
          }),
          ...(thumbnail &&
            thumbnail.id && {
              thumbnail: thumbnail.id,
            }),
          media: media.map((item) => {
            return {
              directus_files_id: item.id,
            };
          }),
          options: p.options.map((item) => {
            return {
              medusa_id: item.id,
              translations: [
                {
                  name: item.title,
                  languages_code: MEDUSA_LANGUAGE_CODE,
                },
              ],
            };
          }),
          categories: categories.map((item) => {
            return {
              ProductCategory_id: item.id,
            };
          }),
        })
      );

      for (const v of p.variants) {
        await this.updateProductVariantInDirectus({ id: v.id });
      }

      return product;
    } catch (error: any) {
      console.log("creteProductInDirectus", JSON.stringify(error, null, 2));
      throw new Error(error?.message);
    }
  }

  async updateProductInDirectus(data: { id: string; fields: string[] }) {
    try {
      this.logger.info(`product.updated ${data.id}`);

      const updateFields = [
        "variants",
        "options",
        "tags",
        "title",
        "subtitle",
        "tags",
        "type",
        "type_id",
        "collection",
        "collection_id",
        "thumbnail",
      ];

      const found = data.fields.find((f) => updateFields.includes(f));
      if (!found) {
        return Promise.resolve();
      }

      const ignore = await this.shouldIgnore_(data.id, "directus");
      if (ignore) {
        return Promise.resolve();
      }

      const p = await this.productService_.retrieve(data.id, {
        relations: [
          "options",
          "variants",
          "type",
          "collection",
          "tags",
          "images",
          "categories",
        ],
      });

      const products = await this.directus.request(
        readItems("Product", {
          filter: {
            medusa_id: {
              _eq: p.id,
            },
          },
          // @ts-ignore
          fields: ["*", "options.*", "translations.*", "collections.*"],
        })
      );
      const product = products[0];

      if (!product) {
        return this.createProductInDirectus(data);
      }

      const translations = product.translations.map((item) => {
        if (item.languages_code === MEDUSA_LANGUAGE_CODE) {
          return {
            ...item,
            title: p.title,
            subtitle: p.subtitle,
            description: p.description,
            handle: p.handle,
            material: p.material,
          };
        } else {
          return item;
        }
      });

      const thumbnail = await this.importProductFile(p.thumbnail, p.title);
      const media = await this.importProductMedia(p);
      const type = await this.upsertProductType(p.type);
      const collection = await this.upsertProductCollection(p.collection);
      const categories = await this.upsertProductCategories(p.categories);

      const dTags: ProductTag[] = [];
      for (const t of p.tags) {
        const tag = await this.upsertProductTag(t);
        dTags.push(tag);
      }

      const collections: {
        update: Partial<Product_ProductCollection>[];
        create: Partial<Product_ProductCollection>[];
      } = {
        update: [],
        create: [],
      };

      for (const c of product.collections) {
        collections.update.push(c);
      }

      const pcInCollections = product.collections.find(
        (item) => item.ProductCollection_id === collection?.id
      );

      if (!pcInCollections && collection) {
        collections.create.push({
          Product_id: product.id,
          ProductCollection_id: collection.id,
        });
      }

      const options: Partial<ProductOption>[] = [];
      for (const o of p.options) {
        const productOption = product.options.find(
          (pOpt) => pOpt.medusa_id === o.id
        ) as NonNullable<ProductOption>;

        if (!productOption) continue;

        const translations = productOption.translations.map((item) => {
          if (item.languages_code === MEDUSA_LANGUAGE_CODE) {
            return {
              ...item,
              name: o.title,
            };
          } else {
            return item;
          }
        });

        options.push({
          id: productOption.id,
          medusa_id: o.id,
          Product_id: productOption.Product_id,
          translations,
        });
      }

      const updatedProduct = await this.directus.request(
        updateItem("Product", product.id, {
          medusa_id: p.id,
          date_created: p.created_at,
          status: p.status,
          date_updated: new Date(p.updated_at).toISOString(),
          translations,
          ...(type && {
            type: { id: type.id },
          }),
          ...(collection && {
            collection: { id: collection.id },
          }),
          collections,
          tags: dTags.map((item) => {
            return {
              ProductTag_id: item.id,
            };
          }),
          ...(thumbnail &&
            thumbnail.id && {
              thumbnail: thumbnail.id,
            }),
          media: media.map((item) => {
            return {
              directus_files_id: item.id,
            };
          }),
          options,
          categories: categories.map((item) => {
            return {
              ProductCategory_id: item.id,
            };
          }),
        })
      );

      for (const v of p.variants) {
        await this.updateProductVariantInDirectus({ id: v.id });
      }

      await this.addIgnore_(data.id, "medusa");

      return updatedProduct;
    } catch (error) {
      console.log("updateProductInDirectus", JSON.stringify(error, null, 2));
      this.logger.error(error);
    }
  }

  async archiveProductInDirectus(data: { id: string }) {
    this.logger.info(`product.deleted ${data.id}`);
    const ignore = await this.shouldIgnore_(data.id, "directus");
    if (ignore) {
      return Promise.resolve();
    }

    let productEntity;
    try {
      productEntity = await this.productService_.retrieve(data.id);
    } catch {}

    if (productEntity) {
      return Promise.resolve();
    }

    const items = await this.directus.request(
      readItems<DirectusSchema, "Product", Query<DirectusSchema, Product>>(
        "Product",
        {
          filter: {
            medusa_id: {
              _eq: data.id,
            },
          },
        }
      )
    );
    const item = items[0];

    if (!item) {
      return Promise.resolve();
    }

    const res = await this.directus.request(
      updateItem("Product", item.id, {
        status: "archived",
      })
    );

    await this.addIgnore_(data.id, "medusa");

    return res;
  }

  async sendDirectusProductToAdmin(id: string): Promise<Record<string, any>> {
    this.logger.info(`sendDirectusProductToAdmin ${id}`);
    const type = "Product";
    try {
      const ignore = await this.shouldIgnore_(id, "medusa");
      if (ignore) {
        return { type, id, ignore: true };
      }

      const productEntry = await this.directus.request(
        readItem("Product", id, {
          // @ts-ignore
          fields: ["*", "translations.*", "thumbnail.*"],
        })
      );
      const product_medusa_id = productEntry.medusa_id;

      // const product = await this.productService_.retrieve(product_medusa_id, {
      //   select: [
      //     "id",
      //     "handle",
      //     "title",
      //     "subtitle",
      //     "description",
      //     "thumbnail",
      //   ],
      // });

      const translations = productEntry.translations.find(
        (item) => item.languages_code === MEDUSA_LANGUAGE_CODE
      );

      const title = translations?.title ?? "";
      const subtitle = translations?.subtitle ?? "";
      const handle = translations?.handle ?? "";
      const description = translations?.description ?? "";
      // const thumbnail = getDirectusImageUrl(productEntry.thumbnail)

      const updatedProduct = await this.productService_.update(
        product_medusa_id,
        {
          title,
          subtitle,
          handle,
          description,
          // thumbnail
        }
      );

      await this.addIgnore_(product_medusa_id, "directus");

      return { id, type, product: updatedProduct };
    } catch (error: any) {
      return { type, id, error: error.message };
    }
  }

  async sendDirectusProductVariantToAdmin(
    id: string
  ): Promise<Record<string, any>> {
    this.logger.info(`sendDirectusProductVariantToAdmin ${id}`);
    const type = "ProductVariant";
    try {
      const ignore = await this.shouldIgnore_(id, "medusa");
      if (ignore) {
        return { type, id, ignore: true };
      }

      const variantEntry = await this.directus.request(
        readItem("ProductVariant", id, {
          // @ts-ignore
          fields: ["*", "translations.*"],
        })
      );
      const variant_medusa_id = variantEntry.medusa_id;
      const translation = variantEntry.translations.find(
        (item) => item.languages_code === MEDUSA_LANGUAGE_CODE
      );

      const updatedVariant = await this.productVariantService_.update(
        variant_medusa_id,
        {
          title: translation?.title,
        }
      );

      await this.addIgnore_(variant_medusa_id, "directus");

      return { id, type, variant: updatedVariant };
    } catch (error: any) {
      return { type, id, error: error.message };
    }
  }
}
