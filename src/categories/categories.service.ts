import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
  status?: boolean;
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.tbl_categories.create({
      data: createCategoryDto,
    });
  }

  // Get all active categories
  async findAll() {
    return await this.prisma.tbl_categories.findMany({
      where: {
        status: true,
      },
      include: {
        tbl_products: {
          where: {
            status: true,
          },
        },
      },
    });
  }

  // Get category by ID
  async findOne(id: string) {
    return await this.prisma.tbl_categories.findUnique({
      where: { id },
      include: {
        tbl_products: {
          where: {
            status: true,
          },
        },
      },
    });
  }

  // Update category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.tbl_categories.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  // Soft delete category
  async remove(id: string) {
    return await this.prisma.tbl_categories.update({
      where: { id },
      data: { status: false },
    });
  }

  // Get category with product count
  async getCategoriesWithProductCount() {
    return await this.prisma.tbl_categories.findMany({
      where: {
        status: true,
      },
      include: {
        _count: {
          select: {
            tbl_products: {
              where: {
                status: true,
              },
            },
          },
        },
      },
    });
  }
}
