import { Student } from '../../enterprise/entities/student'
import { StudentWithDetails } from '../../enterprise/entities/value-objects/student-with-details'

export abstract class StudentsRepository {
  abstract findById(id: string): Promise<Student | null>
  abstract findByEmail(email: string): Promise<Student | null>
  abstract findDetailsByEmail(email: string): Promise<StudentWithDetails | null>
  abstract create(student: Student): Promise<void>
}
