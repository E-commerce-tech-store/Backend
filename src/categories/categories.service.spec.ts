import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let createMock: jest.Mock;
  let findAllMock: jest.Mock;
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;
  let removeMock: jest.Mock;

  // Mock data
  const mockCategory = { id: '1', name: 'Electronics' };
  const mockCategories = [mockCategory];

  beforeEach(async () => {
    const mockPrismaService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);

    createMock = jest.fn().mockResolvedValue(mockCategory);
    findAllMock = jest.fn().mockResolvedValue(mockCategories);
    findOneMock = jest.fn().mockResolvedValue(mockCategory);
    updateMock = jest
      .fn()
      .mockResolvedValue({ ...mockCategory, name: 'Updated' });
    removeMock = jest
      .fn()
      .mockResolvedValue({ ...mockCategory, deleted: true });

    service.create = createMock;
    service.findAll = findAllMock;
    service.findOne = findOneMock;
    service.update = updateMock;
    service.remove = removeMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const dto = { name: 'Electronics' };
    const result = await service.create(dto);
    console.log(result);
    expect(result).toEqual(mockCategory);
    expect(createMock).toHaveBeenCalledWith(dto);
  });

  it('should return all categories', async () => {
    await expect(service.findAll()).resolves.toEqual(mockCategories);
    expect(findAllMock).toHaveBeenCalled();
  });

  it('should return a category by id', async () => {
    await expect(service.findOne('1')).resolves.toEqual(mockCategory);
    expect(findOneMock).toHaveBeenCalledWith('1');
  });

  it('should update a category', async () => {
    const dto = { name: 'Updated' };
    await expect(service.update('1', dto)).resolves.toEqual({
      ...mockCategory,
      name: 'Updated',
    });
    expect(updateMock).toHaveBeenCalledWith('1', dto);
  });

  it('should remove a category', async () => {
    await expect(service.remove('1')).resolves.toEqual({
      ...mockCategory,
      deleted: true,
    });
    expect(removeMock).toHaveBeenCalledWith('1');
  });
});
