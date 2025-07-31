import { StudentWithDetails } from '@/domain/forum/enterprise/entities/value-objects/student-with-details'

export class StudentWithDetailsPresenter {
  static toHttp(details: StudentWithDetails) {
    return {
      student: {
        id: details.studentId.toString(),
        email: details.studentEmail,
        name: details.studentName,
      },
      notifications: {
        pendent: details.notifications.pendent,
      },
    }
  }
}
