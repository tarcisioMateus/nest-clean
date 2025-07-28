/* eslint-disable @typescript-eslint/no-explicit-any */

export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObject<any>) {
    if (vo === undefined || vo === null) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    if (JSON.stringify(vo.props) === JSON.stringify(this.props)) {
      return true
    }

    return false
  }
}
