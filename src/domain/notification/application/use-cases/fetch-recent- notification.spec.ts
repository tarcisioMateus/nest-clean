import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchRecentNotificationUseCase } from './fetch-recent-notifications'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sut: FetchRecentNotificationUseCase
describe('fetch Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new FetchRecentNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to fetch Recent notifications paginated', async () => {
    for (let i = 1; i < 21; i++) {
      const notification = makeNotification({
        recipientId: new UniqueEntityID('recipient-1'),
        readAt: new Date(2025, 6, i),
      })
      await inMemoryNotificationsRepository.create(notification)
    }

    const response = await sut.execute({
      recipientId: 'recipient-1',
      loading: 7,
      perLoading: 3,
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      notifications: expect.arrayContaining([
        expect.objectContaining({ readAt: new Date(2025, 6, 2) }),
        expect.objectContaining({ readAt: new Date(2025, 6, 1) }),
      ]),
    })
  })
})
