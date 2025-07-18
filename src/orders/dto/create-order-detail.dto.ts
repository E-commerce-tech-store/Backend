import { IsNumber, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDetailDto {
  @IsUUID()
  id_product: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;
}
