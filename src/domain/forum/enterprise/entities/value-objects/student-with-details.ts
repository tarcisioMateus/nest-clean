import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

interface StudentWithDetailsProps {
  student: {
    id: UniqueEntityID
    name: string
    email: string
    password: string
  }
  notifications: {
    pendent: number
  }
}
export class StudentWithDetails extends ValueObject<StudentWithDetailsProps> {
  get studentId() {
    return this.props.student.id
  }

  get studentName() {
    return this.props.student.name
  }

  get studentEmail() {
    return this.props.student.email
  }

  get studentPassword() {
    return this.props.student.password
  }

  get notifications() {
    return this.props.notifications
  }

  static create(props: StudentWithDetailsProps) {
    const studentWithDetails = new StudentWithDetails(props)

    return studentWithDetails
  }
}
