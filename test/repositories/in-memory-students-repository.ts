import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findById(id: string): Promise<Student | null> {
    const student = this.items.find((item) => item.id.toString() === id)

    if (!student) {
      return null
    }

    return student
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email.toString() === email)

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
