import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    try {
      // Start a transaction to ensure data consistency
      return await this.prisma.$transaction(async (tx) => {
        let orderTotal = 0;
        const orderDetails: Array<{
          id_product: string;
          quantity: number;
          subtotal: number;
          current_price: number;
        }> = [];

        // Verify and calculate for each product
        for (const item of createOrderDto.items) {
          const product = await tx.tbl_products.findUnique({
            where: { id: item.id_product },
          });

          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.id_product} not found`,
            );
          }

          if (!product.status) {
            throw new BadRequestException(
              `Product ${product.name} is not available`,
            );
          }

          if (Number(product.stock) < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product ${product.name}. Available: ${String(product.stock)}`,
            );
          }

          // Calculate subtotal for this item
          const subtotal = Number(product.price) * item.quantity;
          orderTotal += subtotal;

          // Add to details array
          orderDetails.push({
            id_product: item.id_product,
            quantity: item.quantity,
            subtotal,
            current_price: Number(product.price),
          });

          // Update stock
          await tx.tbl_products.update({
            where: { id: item.id_product },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Create the order
        const order = await tx.tbl_orders.create({
          data: {
            id_user: userId,
            total: orderTotal,
            status: 'PENDING',
            tbl_order_details: {
              create: orderDetails.map(
                ({ id_product, quantity, subtotal, current_price }) => ({
                  id_product,
                  quantity,
                  subtotal,
                  current_price,
                }),
              ),
            },
          },
          include: {
            tbl_order_details: {
              include: {
                tbl_products: true,
              },
            },
            tbl_user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        return order;
      });
    } catch (error) {
      console.error('Error creating order:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create order');
    }
  }

  async findAll(userId?: string, isAdmin = false) {
    try {
      return await this.prisma.tbl_orders.findMany({
        where: isAdmin ? {} : { id_user: userId },
        include: {
          tbl_order_details: {
            include: {
              tbl_products: true,
            },
          },
          tbl_user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      console.error('Error finding orders:', error);
      throw new BadRequestException('Failed to retrieve orders');
    }
  }

  async findOne(id: string, userId?: string, isAdmin = false) {
    try {
      const order = await this.prisma.tbl_orders.findUnique({
        where: { id },
        include: {
          tbl_order_details: {
            include: {
              tbl_products: true,
            },
          },
          tbl_user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      // If not admin and order doesn't belong to user, throw error
      if (!isAdmin && order.id_user !== userId) {
        throw new BadRequestException('You do not have access to this order');
      }

      return order;
    } catch (error) {
      console.error('Error finding order:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve order');
    }
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
    isAdmin = false,
  ) {
    try {
      // First check if order exists and belongs to the user
      await this.findOne(id, userId, isAdmin);

      return await this.prisma.tbl_orders.update({
        where: { id },
        data: updateOrderDto,
        include: {
          tbl_order_details: {
            include: {
              tbl_products: true,
            },
          },
          tbl_user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error updating order:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update order');
    }
  }

  async cancel(id: string, userId?: string, isAdmin = false) {
    try {
      // Verify order exists and belongs to user
      const existingOrder = await this.findOne(id, userId, isAdmin);

      // Can only cancel PENDING orders
      if (existingOrder.status === 'FINISHED') {
        throw new BadRequestException('Cannot cancel a finished order');
      }

      // Start transaction to restore stock
      return await this.prisma.$transaction(async (tx) => {
        // Restore stock for each product
        for (const detail of existingOrder.tbl_order_details) {
          await tx.tbl_products.update({
            where: { id: detail.id_product },
            data: {
              stock: {
                increment: Number(detail.quantity),
              },
            },
          });
        }

        // Update order status
        return await tx.tbl_orders.delete({
          where: { id },
        });
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to cancel order');
    }
  }
}
