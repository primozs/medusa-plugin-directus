import { IEventBusService } from "@medusajs/types";
import { ProductService, ProductVariantService } from "@medusajs/medusa";
import DirectusService from "../services/directus";

export default class DirectusSubscriber {
  protected readonly productService: ProductService;
  protected readonly productVariantService: ProductVariantService;
  protected readonly eventBusService: IEventBusService;
  protected readonly directusService: DirectusService;

  constructor({
    productService,
    productVariantService,
    eventBusService,
    directusService,
  }: {
    productService: ProductService;
    productVariantService: ProductVariantService;
    eventBusService: IEventBusService;
    directusService: DirectusService;
  }) {
    this.productVariantService = productVariantService;
    this.productService = productService;
    this.eventBusService = eventBusService;
    this.directusService = directusService;

    this.eventBusService.subscribe("region.created", async (data) => {
      await this.directusService.createRegionInDirectus(data as { id: string });
    });

    this.eventBusService.subscribe("region.updated", async (data) => {
      await this.directusService.updateRegionInDirectus(
        data as { id: string; fields: string[] }
      );
    });

    this.eventBusService.subscribe("region.deleted", async (data) => {
      await this.directusService.deleteRegionInDirectus(data as { id: string });
    });

    this.eventBusService.subscribe(
      "product-collection.created",
      async (data) => {
        await this.directusService.createProductCollectionInDirectus(
          data as { id: string }
        );
      }
    );

    this.eventBusService.subscribe(
      "product-collection.updated",
      async (data) => {
        await this.directusService.updateProductCollectionInDirectus(
          data as { id: string; fields: string[] }
        );
      }
    );

    this.eventBusService.subscribe(
      "product-collection.deleted",
      async (data) => {
        await this.directusService.deleteProductCollectionInDirectus(
          data as { id: string }
        );
      }
    );

    this.eventBusService.subscribe("product-variant.created", async (data) => {
      await this.directusService.createProductVariantInDirectus(
        data as { id: string }
      );
    });

    this.eventBusService.subscribe("product-variant.updated", async (data) => {
      await this.directusService.updateProductVariantInDirectus(
        data as { id: string; fields: string[] }
      );
    });

    this.eventBusService.subscribe("product-variant.deleted", async (data) => {
      await this.directusService.archiveProductVariantInDirectus(
        data as { id: string }
      );
    });

    this.eventBusService.subscribe("product.updated", async (data) => {
      await this.directusService.updateProductInDirectus(
        data as { id: string; fields: string[] }
      );
    });

    this.eventBusService.subscribe("product.created", async (data) => {
      await this.directusService.createProductInDirectus(
        data as { id: string }
      );
    });

    this.eventBusService.subscribe("product.deleted", async (data) => {
      await this.directusService.archiveProductInDirectus(
        data as { id: string }
      );
    });
  }
}
