import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface InstructorProps {
  name: string
  email: string
  password: string
}

export class Instructor extends Entity<InstructorProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: InstructorProps, id?: UniqueEntityID) {
    const instructor = new Instructor(
      {
        ...props,
      },
      id,
    )

    return instructor
  }
}
