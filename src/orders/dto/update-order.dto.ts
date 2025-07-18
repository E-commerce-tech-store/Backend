import { IsEnum, IsOptional } from 'class-validator';

enum OrderStatus {
  FINISHED = 'FINISHED',
  PENDING = 'PENDING',
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
