export interface deleteFileParams {
  url: string
}

export abstract class DeleteFile {
  abstract deleteFile(params: deleteFileParams): Promise<void>
}
