import { Decimal } from '@prisma/client/runtime/library';

export class CreateProductDto {
  category_id: string;
  name: string;
  stock: Decimal;
  description: string;
  price: Decimal;
  image_url: string;
  status?: boolean;
}
