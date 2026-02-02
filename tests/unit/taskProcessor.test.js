import * as process from '../../taskProcessor.js';

describe('Task 2: Task Processor Utilities', () => {

  const mockTasks = [
    { id: 1, userId: 10, title: 'Learn Testing', completed: true, getStatus: () => 'Completed', priority: 'high', tags: ['edu', 'js'] },
    { id: 2, userId: 10, title: 'Write Code', completed: false, getStatus: () => 'Pending', priority: 'medium', tags: ['js'] },
    { id: 3, userId: 20, title: 'Sleep', completed: false, getStatus: () => 'Pending', priority: 'low' }
  ];

  describe('filterByStatus()', () => {
    test('should return only tasks matching the status string', () => {
      const pending = process.filterByStatus(mockTasks, 'Pending');
      expect(pending).toHaveLength(2);
      expect(pending[0].title).toBe('Write Code');
    });
  });

  describe('calculateStatistics()', () => {
    test('should aggregate counts and priority levels correctly', () => {
      const stats = process.calculateStatistics(mockTasks);
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
      expect(stats.byPriority.high).toBe(1);
    });

    test('should handle an empty array by returning initial state', () => {
      const stats = process.calculateStatistics([]);
      expect(stats.total).toBe(0);
      expect(stats.byPriority).toEqual({});
    });
  });

  describe('groupByUser()', () => {
    test('should return a Map with userId as the key', () => {
      const grouped = process.groupByUser(mockTasks);
      expect(grouped instanceof Map).toBe(true);
      expect(grouped.get(10)).toHaveLength(2);
      expect(grouped.get(20)).toHaveLength(1);
    });
  });

  describe('extractUniqueTags()', () => {
    test('should return a Set of unique tags across all tasks', () => {
      const tags = process.extractUniqueTags(mockTasks);
      expect(tags instanceof Set).toBe(true);
      expect(tags.size).toBe(2); 
      expect(tags.has('js')).toBe(true);
    });

    test('should not crash if tags property is missing (Optional Chaining)', () => {
      const noTags = [{ title: 'No Tags' }]; 
      const tags = process.extractUniqueTags(noTags);
      expect(tags.size).toBe(0);
    });
  });

  describe('searchTasks()', () => {
    test('should find tasks matching keyword regardless of case', () => {
      const results = process.searchTasks(mockTasks, 'SLEEP');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(3);
    });
  });
});