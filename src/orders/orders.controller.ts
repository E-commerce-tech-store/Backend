import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('orders')
@UseGuards(RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  findAll(@GetUser('id') userId: string, @GetUser('role') role: string) {
    const isAdmin = role === 'ADMIN';
    return this.ordersService.findAll(userId, isAdmin);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    return this.ordersService.findOne(id, userId, isAdmin);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    return this.ordersService.update(id, updateOrderDto, userId, isAdmin);
  }

  @Delete(':id')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN';
    return this.ordersService.cancel(id, userId, isAdmin);
  }
}
