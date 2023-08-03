import {
  createDirectus,
  rest,
  staticToken,
  type DirectusClient as DC,
  type RestClient,
  type StaticTokenClient,
} from "@directus/sdk";

export const getDirectusClient = (host: string, token: string) => {
  const client = createDirectus<DirectusSchema>(host)
    .with(rest())
    .with(staticToken(token));

  return client;
};

export type DirectusClient = DC<DirectusSchema> &
  RestClient<DirectusSchema> &
  StaticTokenClient<DirectusSchema>;

export interface DirectusSchema {
  ProductCollection: ProductCollection[];
  ProductType: ProductType[];
  StoreRegion: StoreRegion[];
  ProductVariant: ProductVariant[];
  Product: Product[];
  ProductCategory: ProductCategory[];
  ProductTag: ProductTag[];
  ProductVariantPrice: ProductVariantPrice[];
  ProductOption: ProductOption[];
}

export interface Product {
  id: string;
  drupal_id: string;
  medusa_id: string;
  status: string;
  date_created: string | Date;
  date_updated: string | Date;
  translations: {
    title: string;
    subtitle: string;
    handle: string;
    material: string;
    description: string;
    languages_code: string;
  }[];
  website: string;
  thumbnail: string;
  media: Partial<Product_files>[];
  variants: ProductVariant[];
  type: Partial<ProductType>;
  tags: Partial<Product_ProductTag>[];
  options: Partial<ProductOption>[];
  collection: Partial<ProductCollection>;
  collections: Partial<Product_ProductCollection>[];
  categories: Partial<Product_ProductCategory>[];
}

export interface Product_ProductCategory {
  id: number;
  Product_id: string;
  ProductCategory_id: string;
}

export interface Product_files {
  id: number;
  Product_id: string;
  directus_files_id: string;
}

export interface Product_ProductCollection {
  id: number;
  Product_id: string;
  ProductCollection_id: string;
}

export interface ProductVariant_ProductOption {
  id: number;
  ProductVariant_id: string;
  ProductOption_id: string;
  value: string;
}

export interface Product_ProductTag {
  id: number;
  Product_id: string;
  ProductTag_id: string;
}

export interface ProductCategory {
  id: string;
  medusa_id: string;
  translations: {
    name: string;
    handle: string;
    description: string;
    languages_code: string;
  }[];
  category: ProductCategory;
  parent_category_id: string;
  parent_medusa_id: string;
}

export interface ProductVariant {
  id: string;
  Product_id: string;
  sku: string;
  medusa_id: string;
  translations: {
    title: string;
    languages_code: string;
  }[];
  prices: Partial<ProductVariantPrice>[];
  options: Partial<ProductVariant_ProductOption>[];
}

export interface ProductTag {
  id: string;
  medusa_id: string;
  translations: {
    id?: number;
    value: string;
    languages_code: string;
  }[];
}

export interface ProductVariantPrice {
  id: string;
  medusa_id: string;
  ProductVariant_id: string;
  currency_code: string;
  amount: number;
}

export interface ProductOption {
  id: string;
  medusa_id: string;
  Product_id: string;
  translations: {
    name: string;
    languages_code: string;
  }[];
}

export interface ProductCollection {
  id: string;
  medusa_id: string;
  translations: {
    title: string;
    handle: string;
    languages_code: string;
  }[];
}

export interface ProductType {
  id: string;
  medusa_id: string;
  translations: {
    id?: number;
    value: string;
    languages_code: string;
  }[];
}

export interface StoreRegion {
  id: string;
  medusa_id: string;
  name: string;
  currency_code: string;
  currency: Currency;
  countries: Country[];
  payment_providers: PaymentProvider[];
  fulfillment_providers: FulfillmentProvider[];
}

interface Currency {
  code: string;
  symbol: string;
  symbol_native: string;
  name: string;
  includes_tax?: boolean;
}

interface Country {
  id: number;
  iso_2: string;
  iso_3: string;
  num_code: number;
  name: string;
  display_name: string;
  region_id: string | null;
}

interface FulfillmentProvider {
  id: string;
  is_installed: boolean;
}

interface PaymentProvider {
  id: string;
  is_installed: boolean;
}
