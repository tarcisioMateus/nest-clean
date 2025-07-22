import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaStudentMapper } from '@/infra/database/prisma/mapper/prisma-student-mapper'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}

@Injectable()
export class StudentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaStudent(
    override: Partial<StudentProps> = {},
    id?: UniqueEntityID,
  ): Promise<Student> {
    const student = makeStudent(override, id)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPersistence(student),
    })

    return student
  }
}
