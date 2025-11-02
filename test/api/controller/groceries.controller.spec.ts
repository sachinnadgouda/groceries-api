import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
// optimise with barrel imports
import { GroceriesController } from '../../../src/api/controllers/groceries.controller';
import { GroceriesService } from '../../../src/application/services/groceries.service';
import { GroceryResponseDto } from '../../../src/application/dto/grocery-response.dto';
import { PaginationResponseDto } from '../../../src/application/dto/pagination-response.dto';

describe('GroceriesController', () => {
  let controller: GroceriesController;
  let service: GroceriesService;


  const mockGroceryResponseDto = new GroceryResponseDto(
    1,
    'Apple',
    'Red',
    5.99,
    100,
  );

  const mockGroceriesService = {
    getGroceries: jest.fn(),
    getGroceryById: jest.fn(),
    getAvailableColors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroceriesController],
      providers: [
        {
          provide: GroceriesService,
          useValue: mockGroceriesService,
        },
      ],
    }).compile();

    controller = module.get<GroceriesController>(GroceriesController);
    service = module.get<GroceriesService>(GroceriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGroceries', () => {
    it('should return paginated groceries with default params', () => {
      const mockPaginationResult = new PaginationResponseDto(
        [mockGroceryResponseDto],
        1,
        1,
        10,
      );

      mockGroceriesService.getGroceries.mockReturnValue(mockPaginationResult);

      const result = controller.getGroceries();

      expect(result).toEqual(mockPaginationResult);
      expect(mockGroceriesService.getGroceries).toHaveBeenCalledWith(1, 10, undefined);
    });

    it('should return paginated groceries with custom params', () => {
      const mockPaginationResult = new PaginationResponseDto(
        [mockGroceryResponseDto],
        1,
        2,
        20,
      );

      mockGroceriesService.getGroceries.mockReturnValue(mockPaginationResult);

      const result = controller.getGroceries(2, 20);

      expect(result).toEqual(mockPaginationResult);
      expect(mockGroceriesService.getGroceries).toHaveBeenCalledWith(2, 20, undefined);
    });

    it('should filter groceries by color', () => {
      const mockPaginationResult = new PaginationResponseDto(
        [mockGroceryResponseDto],
        1,
        1,
        10,
      );

      mockGroceriesService.getGroceries.mockReturnValue(mockPaginationResult);

      const result = controller.getGroceries(1, 10, 'Red');

      expect(result).toEqual(mockPaginationResult);
      expect(mockGroceriesService.getGroceries).toHaveBeenCalledWith(1, 10, 'Red');
    });
  });

  describe('getGroceryById', () => {
    it('should return a single grocery by id', () => {
      mockGroceriesService.getGroceryById.mockReturnValue(mockGroceryResponseDto);

      const result = controller.getGroceryById('1');

      expect(result).toEqual(mockGroceryResponseDto);
      expect(mockGroceriesService.getGroceryById).toHaveBeenCalledWith(1);
    });

    it('should convert string id to number', () => {
      mockGroceriesService.getGroceryById.mockReturnValue(mockGroceryResponseDto);

      controller.getGroceryById('42');

      expect(mockGroceriesService.getGroceryById).toHaveBeenCalledWith(42);
    });

    it('should throw NotFoundException when grocery not found', () => {
      mockGroceriesService.getGroceryById.mockImplementation(() => {
        throw new NotFoundException('Grocery with id 999 not found');
      });

      expect(() => controller.getGroceryById('999')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('getColors', () => {
    it('should return available colors', () => {
      const colors = ['Red', 'Green', 'Yellow', 'Blue'];
      mockGroceriesService.getAvailableColors.mockReturnValue(colors);

      const result = controller.getColors();

      expect(result).toEqual(colors);
      expect(mockGroceriesService.getAvailableColors).toHaveBeenCalled();
    });

    it('should return empty array when no colors available', () => {
      mockGroceriesService.getAvailableColors.mockReturnValue([]);

      const result = controller.getColors();

      expect(result).toEqual([]);
    });
  });
});