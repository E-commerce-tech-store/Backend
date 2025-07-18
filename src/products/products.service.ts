import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { UUID } from 'node:crypto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.tbl_products.create({
      data: createProductDto,
      include: {
        tbl_categories: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.tbl_products.findMany({
      where: {
        status: true, // Only active products
      },
      include: {
        tbl_categories: true, // Include category information
      },
    });
  }

  async findOne(id: UUID) {
    return await this.prisma.tbl_products.findUnique({
      where: { id },
      include: {
        tbl_categories: true,
      },
    });
  }

  async update(id: UUID, updateProductDto: UpdateProductDto) {
    return await this.prisma.tbl_products.update({
      where: { id },
      data: updateProductDto,
      include: {
        tbl_categories: true,
      },
    });
  }

  async remove(id: UUID) {
    return await this.prisma.tbl_products.update({
      where: { id },
      data: { status: false }, // Soft delete
    });
  }
}
