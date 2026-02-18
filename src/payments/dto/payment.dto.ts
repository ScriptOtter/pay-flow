export interface MetadataDto {
  user_id: string;
  product_id: string;
  price: string;
}

export interface CreatePaymentDto {
  amount: number;
  description: string;
  metadata: MetadataDto;
}
