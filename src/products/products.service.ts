import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prisma.tbl_products.create({
        data: createProductDto,
        include: {
          tbl_categories: true,
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw new BadRequestException('Failed to create product');
    }
  }

  async findAll() {
    try {
      return await this.prisma.tbl_products.findMany({
        where: {
          status: true,
        },
        include: {
          tbl_categories: true,
        },
      });
    } catch (error) {
      console.error('Error finding all products:', error);
      throw new BadRequestException('Failed to retrieve products');
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.tbl_products.findUnique({
        where: { id },
        include: {
          tbl_categories: true,
        },
      });
    } catch (error) {
      console.error('Error finding product:', error);
      throw new BadRequestException('Failed to retrieve product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      return await this.prisma.tbl_products.update({
        where: { id },
        data: updateProductDto,
        include: {
          tbl_categories: true,
        },
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new BadRequestException('Failed to update product');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.tbl_products.update({
        where: { id },
        data: { status: false },
      });
    } catch (error) {
      console.error('Error removing product:', error);
      throw new BadRequestException('Failed to remove product');
    }
  }
}
