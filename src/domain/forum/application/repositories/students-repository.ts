import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
  abstract findById(id: string): Promise<Student | null>
  abstract findByEmail(email: string): Promise<Student | null>
  abstract create(student: Student): Promise<void>
}
