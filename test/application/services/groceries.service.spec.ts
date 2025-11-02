import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GroceriesService } from '../../../src/application/services/groceries.service';

import { GROCERIES_REPOSITORY } from '../../../src/shared/constants/injection-token';

describe('GroceriesService', () => {
  let service: GroceriesService;

  const mockGroceryEntity = {
    id: 1,
    name: 'Apple',
    color: 'Red',
    price: 5.99,
    quantity: 100,
  };

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    getAvailableColors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroceriesService,
        {
          provide: GROCERIES_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GroceriesService>(GroceriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGroceries', () => {
    it('should return paginated groceries with correct structure', () => {
      const mockData = [mockGroceryEntity];
      mockRepository.findAll.mockReturnValue({
        data: mockData,
        total: 1,
      });

      const result = service.getGroceries(1, 10);

      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should convert entity to DTO', () => {
      mockRepository.findAll.mockReturnValue({
        data: [mockGroceryEntity],
        total: 1,
      });

      const result = service.getGroceries(1, 10);

      expect(result.data[0].id).toBe(1);
      expect(result.data[0].name).toBe('Apple');
    });

    it('should call repository with correct parameters', () => {
      mockRepository.findAll.mockReturnValue({
        data: [],
        total: 0,
      });

      service.getGroceries(2, 20, 'Red');

      expect(mockRepository.findAll).toHaveBeenCalledWith(2, 20, 'Red');
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple groceries', () => {
      const mockMultipleGroceries = [
        { id: 1, name: 'Apple', color: 'Red', price: 5.99, quantity: 100 },
        { id: 2, name: 'Banana', color: 'Yellow', price: 3.99, quantity: 150 },
        { id: 3, name: 'Grape', color: 'Green', price: 7.99, quantity: 80 },
      ];

      mockRepository.findAll.mockReturnValue({
        data: mockMultipleGroceries,
        total: 3,
      });

      const result = service.getGroceries(1, 10);

      expect(result.data.length).toBe(3);
      expect(result.total).toBe(3);
      expect(result.data[0].name).toBe('Apple');
      expect(result.data[1].name).toBe('Banana');
      expect(result.data[2].name).toBe('Grape');
    });
  });

  describe('getGroceryById', () => {
    it('should return grocery by id', () => {
      mockRepository.findById.mockReturnValue(mockGroceryEntity);

      const result = service.getGroceryById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Apple');
    });

    it('should convert entity to DTO on getById', () => {
      mockRepository.findById.mockReturnValue(mockGroceryEntity);

      const result = service.getGroceryById(1);

      expect(result.color).toBe('Red');
      expect(result.price).toBe(5.99);
      expect(result.quantity).toBe(100);
    });

    it('should throw NotFoundException when grocery not found', () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.getGroceryById(999)).toThrow(
        NotFoundException,
      );
      expect(() => service.getGroceryById(999)).toThrow(
        'Grocery with id 999 not found',
      );
    });

    it('should call repository with correct id', () => {
      mockRepository.findById.mockReturnValue(mockGroceryEntity);

      service.getGroceryById(42);

      expect(mockRepository.findById).toHaveBeenCalledWith(42);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAvailableColors', () => {
    it('should return list of available colors', () => {
      const colors = ['Red', 'Green', 'Yellow', 'Blue'];
      mockRepository.getAvailableColors.mockReturnValue(colors);

      const result = service.getAvailableColors();

      expect(result).toEqual(colors);
      expect(result.length).toBe(4);
    });

    it('should return empty array when no colors available', () => {
      mockRepository.getAvailableColors.mockReturnValue([]);

      const result = service.getAvailableColors();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should call repository method', () => {
      mockRepository.getAvailableColors.mockReturnValue(['Red']);

      service.getAvailableColors();

      expect(mockRepository.getAvailableColors).toHaveBeenCalled();
      expect(mockRepository.getAvailableColors).toHaveBeenCalledTimes(1);
    });
  });
});