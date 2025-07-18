import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { UserWithStats } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if user with this email already exists
      const existingUser = await this.prisma.tbl_user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.tbl_user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          password: hashedPassword,
          role: createUserDto.role || 'USER',
          status: createUserDto.status ?? true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          created_at: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll(): Promise<UserWithStats[]> {
    try {
      const users = await this.prisma.tbl_user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          created_at: true,
          tbl_orders: {
            select: {
              total: true,
              created_at: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Calculate order statistics for each user
      const usersWithStats: UserWithStats[] = users.map((user) => {
        const orders = user.tbl_orders;
        const totalOrders = orders.length;
        const totalSpent = orders.reduce(
          (sum, order) => sum + Number(order.total),
          0,
        );
        const lastOrderDate =
          orders.length > 0
            ? orders.reduce(
                (latest, order) =>
                  order.created_at > latest ? order.created_at : latest,
                orders[0].created_at,
              )
            : null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          created_at: user.created_at,
          totalOrders,
          totalSpent,
          lastOrderDate,
        };
      });

      return usersWithStats;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new BadRequestException('Failed to retrieve users');
    }
  }

  async findOne(id: string): Promise<UserWithStats> {
    try {
      const user = await this.prisma.tbl_user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          created_at: true,
          tbl_orders: {
            select: {
              id: true,
              total: true,
              created_at: true,
              status: true,
              tbl_order_details: {
                select: {
                  quantity: true,
                  subtotal: true,
                  current_price: true,
                  tbl_products: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const orders = user.tbl_orders;
      const totalOrders = orders.length;
      const totalSpent = orders.reduce(
        (sum, order) => sum + Number(order.total),
        0,
      );
      const lastOrderDate = orders.length > 0 ? orders[0].created_at : null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        created_at: user.created_at,
        totalOrders,
        totalSpent,
        lastOrderDate,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding user:', error);
      throw new BadRequestException('Failed to retrieve user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.tbl_user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // If email is being updated, check for conflicts
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        const emailConflict = await this.prisma.tbl_user.findUnique({
          where: { email: updateUserDto.email },
        });

        if (emailConflict) {
          throw new ConflictException('User with this email already exists');
        }
      }

      // Hash password if it's being updated
      const updateData = { ...updateUserDto };
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = await this.prisma.tbl_user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          created_at: true,
        },
      });

      return updatedUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      console.error('Error updating user:', error);
      throw new BadRequestException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const existingUser = await this.prisma.tbl_user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Soft delete by setting status to false
      const updatedUser = await this.prisma.tbl_user.update({
        where: { id },
        data: { status: false },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          created_at: true,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error removing user:', error);
      throw new BadRequestException('Failed to remove user');
    }
  }

  async getUserOrderHistory(id: string) {
    try {
      const user = await this.prisma.tbl_user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          tbl_orders: {
            select: {
              id: true,
              total: true,
              created_at: true,
              status: true,
              tbl_order_details: {
                select: {
                  quantity: true,
                  subtotal: true,
                  current_price: true,
                  tbl_products: {
                    select: {
                      id: true,
                      name: true,
                      image_url: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        orders: user.tbl_orders,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error getting user order history:', error);
      throw new BadRequestException('Failed to retrieve user order history');
    }
  }

  async getUserStats() {
    try {
      const stats = await this.prisma.tbl_user.aggregate({
        where: {
          status: true,
        },
        _count: {
          id: true,
        },
      });

      const adminCount = await this.prisma.tbl_user.count({
        where: {
          role: 'ADMIN',
          status: true,
        },
      });

      const userCount = await this.prisma.tbl_user.count({
        where: {
          role: 'USER',
          status: true,
        },
      });

      return {
        totalUsers: stats._count.id,
        adminUsers: adminCount,
        regularUsers: userCount,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new BadRequestException('Failed to retrieve user statistics');
    }
  }
}
