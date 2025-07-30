import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ReadNotificationUseCase } from './read-notification'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sut: ReadNotificationUseCase
describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    await inMemoryNotificationsRepository.create(notification)

    const response = await sut.execute({
      recipientId: 'recipient-1',
      notificationId: notification.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      notification: expect.objectContaining({
        recipientId: notification.recipientId,
      }),
    })
    expect(inMemoryNotificationsRepository.items[0].readAt).toBeInstanceOf(Date)
  })

  it('should Not be able to read another user notification', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    await inMemoryNotificationsRepository.create(notification)

    const response = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(undefined)
  })
})
