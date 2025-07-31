import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudentWithDetails } from '@/domain/forum/enterprise/entities/value-objects/student-with-details'
import { Prisma } from '@prisma/client'

type PrismaUserQueryResult = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    name: true
    password: true
    _count: {
      select: {
        notifications: true
      }
    }
  }
}>

export class PrismaStudentWithDetailsMapper {
  static toDomain(raw: PrismaUserQueryResult): StudentWithDetails {
    return StudentWithDetails.create({
      student: {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        id: new UniqueEntityID(raw.id),
      },
      notifications: {
        pendent: raw._count.notifications,
      },
    })
  }
}
