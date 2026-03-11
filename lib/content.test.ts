import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getEntry, getSlugs, getAllEntries } from './content';
import { ContentType } from '../types/content';

// Mock modules
jest.mock('fs');
jest.mock('path');
jest.mock('gray-matter');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;
const mockMatter = matter as jest.MockedFunction<typeof matter>;

describe('content.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup simple path mocks
    mockPath.join.mockImplementation((...args) => args.join('/'));

    // Setup default matter mock
    mockMatter.mockReturnValue({
      content: '# Test Content',
      data: {
        title: 'Test Job',
        company: 'Test Company',
        role: 'Test Role',
        location: 'Test Location',
        start: 'Jan 2023',
        end: 'Dec 2023',
      },
      orig: '# Test Content',
      language: 'md',
      matter: '',
      stringify: jest.fn(),
      excerpt: '',
      isEmpty: false,
    } as any);
  });

  describe('getSlugs', () => {
    it('should filter MDX files and remove extensions correctly', () => {
      // Arrange
      const mockFiles = [
        'job1.mdx',
        'job2.mdx',
        'job3.pt-BR.mdx', // Should be excluded (has extra dot)
        'not-mdx-file.txt',
        'job4.mdx',
      ];

      mockFs.readdirSync.mockReturnValue(mockFiles as any);

      // Act
      const result = getSlugs('experience');

      // Assert
      expect(result).toEqual(['job1', 'job2', 'job4']);
    });

    it('should handle empty directory', () => {
      // Arrange
      mockFs.readdirSync.mockReturnValue([]);

      // Act
      const result = getSlugs('experience');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getEntry', () => {
    const mockFileContent = '---\ntitle: Test\n---\n# Test Content';
    const mockMatterResult = {
      content: '# Test Content',
      data: {
        title: 'Test',
        company: 'Test Company',
        role: 'Test Role',
        location: 'Test Location',
        start: 'Jan 2023',
        end: 'Dec 2023',
      },
      orig: '# Test Content',
      language: 'md',
      matter: '',
      stringify: jest.fn(),
      excerpt: '',
      isEmpty: false,
    } as any;

    it('should return content entry for English locale', () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(mockFileContent);
      mockMatter.mockReturnValue(mockMatterResult);

      // Act
      const result = getEntry('experience', 'test-job', 'en');

      // Assert
      expect(result).toEqual({
        slug: 'test-job',
        type: 'experience',
        frontmatter: mockMatterResult.data,
        content: mockMatterResult.content,
      });
    });

    it('should return content entry for non-English locale with localized file', () => {
      // Arrange
      const locale = 'pt-BR';

      mockFs.existsSync.mockImplementation((filePath) => {
        const pathStr = filePath as string;
        return pathStr.includes('.pt-BR.mdx');
      });
      mockFs.readFileSync.mockReturnValue(mockFileContent);
      mockMatter.mockReturnValue(mockMatterResult);

      // Act
      const result = getEntry('experience', 'test-job', locale);

      // Assert
      expect(result).toEqual({
        slug: 'test-job',
        type: 'experience',
        frontmatter: mockMatterResult.data,
        content: mockMatterResult.content,
      });
    });

    it('should fallback to base file for non-English locale when localized file does not exist', () => {
      // Arrange
      const locale = 'pt-BR';

      mockFs.existsSync.mockImplementation((filePath) => {
        const pathStr = filePath as string;
        return !pathStr.includes('.pt-BR.mdx') && pathStr.includes('.mdx');
      });
      mockFs.readFileSync.mockReturnValue(mockFileContent);
      mockMatter.mockReturnValue(mockMatterResult);

      // Act
      const result = getEntry('experience', 'test-job', locale);

      // Assert
      expect(result).toEqual({
        slug: 'test-job',
        type: 'experience',
        frontmatter: mockMatterResult.data,
        content: mockMatterResult.content,
      });
    });

    it('should throw error when no file exists', () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(false);

      // Act & Assert
      expect(() => getEntry('experience', 'test-job', 'en')).toThrow(
        'Content not found: test-job',
      );
    });

    it('should handle minimal frontmatter', () => {
      // Arrange
      const minimalMatterResult = {
        content: '# Minimal Content',
        data: { title: 'Minimal' },
        orig: '# Minimal Content',
        language: 'md',
        matter: '',
        stringify: jest.fn(),
        excerpt: '',
        isEmpty: false,
      } as any;

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        '---\ntitle: Minimal\n---\n# Minimal Content',
      );
      mockMatter.mockReturnValue(minimalMatterResult);

      // Act
      const result = getEntry('experience', 'test-job', 'en');

      // Assert
      expect(result.frontmatter).toEqual(minimalMatterResult.data);
    });
  });

  describe('getAllEntries', () => {
    it('should return all entries for a content type and locale', () => {
      // Arrange
      const mockFiles = ['job1.mdx', 'job2.mdx', 'job3.mdx'];
      mockFs.readdirSync.mockReturnValue(mockFiles as any);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('---\ntitle: Test\n---\n# Content');
      mockMatter.mockReturnValue({
        content: '# Content',
        data: { title: 'Test' },
        orig: '# Content',
        language: 'md',
        matter: '',
        stringify: jest.fn(),
        excerpt: '',
        isEmpty: false,
      } as any);

      // Act
      const result = getAllEntries('experience', 'en');

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe('job1');
      expect(result[1].slug).toBe('job2');
      expect(result[2].slug).toBe('job3');
    });

    it('should return empty array when no slugs exist', () => {
      // Arrange
      mockFs.readdirSync.mockReturnValue([]);

      // Act
      const result = getAllEntries('experience', 'en');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should throw error when no file exists', () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(false);

      // Act & Assert
      expect(() => getEntry('experience', 'test-job', 'en')).toThrow(
        'Content not found: test-job',
      );
    });

    it('should handle file system errors', () => {
      // Arrange
      const error = new Error('File system error');
      mockFs.existsSync.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => getEntry('experience', 'test-job', 'en')).toThrow(
        'File system error',
      );
    });

    it('should handle read file errors', () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });

      // Act & Assert
      expect(() => getEntry('experience', 'test-job', 'en')).toThrow(
        'Read error',
      );
    });

    it('should handle matter parsing errors', () => {
      // Arrange
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid frontmatter');
      mockMatter.mockImplementation(() => {
        throw new Error('Parse error');
      });

      // Act & Assert
      expect(() => getEntry('experience', 'test-job', 'en')).toThrow(
        'Parse error',
      );
    });

    it('should handle directory read errors', () => {
      // Arrange
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error('Directory read error');
      });

      // Act & Assert
      expect(() => getSlugs('experience')).toThrow('Directory read error');
    });
  });
});
