import { DomainEvent } from '../events/domain-event'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvents } from '@/core/events/domain-events'

class AnswerCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: Answer // eslint-disable-line

  constructor(aggregate: Answer) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class Answer extends AggregateRoot<null> {
  static create() {
    const aggregate = new Answer(null)

    aggregate.addDomainEvent(new AnswerCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn(() => console.log('trigged'))

    // Subscriber created (watching for events of AnswerCreated)
    DomainEvents.register(callbackSpy, AnswerCreated.name)

    // Subscriber is now watching the event emitted by this entity
    const aggregate = Answer.create()

    // making sure that the subscriber was created but not trigged
    expect(aggregate.domainEvents).toHaveLength(1)

    // after saving in the data base the subscriber is trigged
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Subscriber listening to the event and does what it needs to do
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
