export interface uploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(params: uploadParams): Promise<{ url: string }>
}
