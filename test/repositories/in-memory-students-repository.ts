import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { StudentWithDetails } from '@/domain/forum/enterprise/entities/value-objects/student-with-details'
import { InMemoryNotificationsRepository } from './in-memory-notifications-repository'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  constructor(
    private readonly notificationsRepository: InMemoryNotificationsRepository,
  ) {}

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

  async findDetailsByEmail(email: string): Promise<StudentWithDetails | null> {
    const student = this.items.find((item) => item.email.toString() === email)

    if (!student) {
      return null
    }

    const pendent = this.notificationsRepository.items.filter(
      (notification) => {
        if (notification.recipientId.equals(student.id)) {
          if (!notification.readAt) {
            return true
          }
        }
        return false
      },
    ).length

    return StudentWithDetails.create({
      student: {
        id: student.id,
        email: student.email,
        name: student.name,
        password: student.password,
      },
      notifications: { pendent },
    })
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
