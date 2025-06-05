jest.mock("@prisma/client", () => ({ PrismaClient: class {} }));
import { AlertsService } from './alerts.service';

// simple mock PrismaService
const prisma = {
  alert: {
    findMany: jest.fn().mockResolvedValue([]),
  },
} as any;

const pushService = {} as any;

describe('AlertsService', () => {
  it('findAll returns an array', async () => {
    const service = new AlertsService(prisma, pushService);
    const result = await service.findAll('all', {} as any);
    expect(Array.isArray(result)).toBe(true);
  });
});
