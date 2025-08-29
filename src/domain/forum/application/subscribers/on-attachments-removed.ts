import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { Injectable } from '@nestjs/common'

import { DeleteFile } from '../storage/delete-file'
import { AttachmentsRemovedEvent } from '../../enterprise/events/attachments-removed-event'
import { UnableToMakeChangesError } from '../use-cases/errors/unable-to-make-changes-error'

@Injectable()
export class OnAttachmentsRemoved implements EventHandler {
  constructor(private readonly deleteFile: DeleteFile) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onAttachmentsRemovedDeleteFromCloud.bind(this),
      AttachmentsRemovedEvent.name,
    )
  }

  private async onAttachmentsRemovedDeleteFromCloud({
    removedAttachments,
  }: AttachmentsRemovedEvent) {
    for (const attachment of removedAttachments) {
      try {
        await this.deleteFile.deleteFile({
          url: attachment.url,
        })
        console.log(`Deleted attachmentId: "${attachment.id.toString()}"`)
      } catch (error) {
        console.log(error)
        throw new UnableToMakeChangesError(
          `attachment: "${attachment.id.toString()}" did NOT upload file to CLOUD`,
        )
      }
    }
  }
}
