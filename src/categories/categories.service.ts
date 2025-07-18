import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.tbl_categories.create({
        data: createCategoryDto,
      });
    } catch {
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll() {
    try {
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
    } catch {
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.tbl_categories.findUnique({
        where: { id, status: true },
        include: {
          tbl_products: {
            where: {
              status: true,
            },
          },
        },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.findOne(id);

      return await this.prisma.tbl_categories.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.tbl_categories.update({
        where: { id },
        data: { status: false },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete category');
    }
  }

  async getCategoriesWithProductCount() {
    try {
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
    } catch {
      throw new InternalServerErrorException(
        'Failed to fetch categories with product count',
      );
    }
  }
}
