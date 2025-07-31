import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mapper/prisma-student-mapper'
import { StudentWithDetails } from '@/domain/forum/enterprise/entities/value-objects/student-with-details'
import { PrismaStudentWithDetailsMapper } from '../mapper/prisma-student-with-details-mapper'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async findDetailsByEmail(email: string): Promise<StudentWithDetails | null> {
    const student = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,

        _count: {
          select: {
            notifications: {
              where: {
                readAt: null,
              },
            },
          },
        },
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentWithDetailsMapper.toDomain(student)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPersistence(student)

    await this.prisma.user.create({
      data,
    })
  }
}
