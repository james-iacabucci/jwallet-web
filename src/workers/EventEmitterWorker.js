// @flow

import EventEmitter from 'events'

import WorkerError from 'errors/WorkerError'

type EventEmitterWorkerEventResult = {|
  +payload: any,
  +error: boolean,
|}

type EventEmitterWorkerEventPayload = {|
  +payload?: any,
  +transfer?: ArrayBuffer,
|}

const WORKER_TYPE = 'event-emitter'

/**
 * Private methods for EventEmitterWorker
 */

function handleError(err: Error) {
  throw new WorkerError({
    originError: err,
    workerType: WORKER_TYPE,
  })
}

function handleEvent(self, {
  error,
  payload,
}: EventEmitterWorkerEventResult) {
  if (error) {
    self.ee.emit('error', payload)
  } else {
    self.ee.emit('data', payload)
  }
}

function startListen(self: Object) {
  const { worker }: Object = self

  worker.onerror = err => handleError(err)
  worker.onmessage = msg => handleEvent(self, msg.data)
}

function endListen(self: Object) {
  if (!self.worker) {
    return
  }

  self.worker.onerror = null
  self.worker.onmessage = null
}

class EventEmitterWorker {
  worker: ?Object
  ee: ?EventEmitter

  subscribe = (worker: Object, {
    payload,
    transfer,
  }: EventEmitterWorkerEventPayload): EventEmitter => {
    if (!worker) {
      throw new WorkerError({
        workerType: WORKER_TYPE,
      }, 'Worker is not started')
    } else if (worker.onerror || worker.onmessage) {
      throw new WorkerError({
        workerType: WORKER_TYPE,
      }, 'Worker has been already listened')
    } else if (this.ee) {
      throw new WorkerError({
        workerType: WORKER_TYPE,
      }, 'Already subscribed')
    } else if (transfer) {
      worker.postMessage(payload, transfer)
    } else {
      worker.postMessage(payload)
    }

    const ee: EventEmitter = new EventEmitter()

    this.ee = ee
    this.worker = worker

    startListen(this)

    return ee
  }

  unsubscribe = () => {
    endListen(this)
    this.ee = null

    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

export default EventEmitterWorker
