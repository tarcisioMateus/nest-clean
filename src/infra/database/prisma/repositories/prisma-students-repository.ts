import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  findByEmail(email: string): Promise<Student | null> {
    throw new Error('Method not implemented.')
  }

  create(student: Student): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
