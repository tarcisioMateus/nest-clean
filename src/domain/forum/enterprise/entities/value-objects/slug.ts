export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slugText: string) {
    return new Slug(slugText)
  }

  /**
   * Receives a string and normalize it as a slug.
   *
   * @example "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')
      .replace(/^-/g, '')

    return new Slug(slugText)
  }
}
