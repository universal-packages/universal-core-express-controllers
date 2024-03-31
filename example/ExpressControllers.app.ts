import fetch from 'node-fetch'

import ECA from '../src/ExpressControllers.universal-core-app'

export default class ExpressControllersApp extends ECA {
  private requestTimeout: NodeJS.Timeout

  public async prepare(): Promise<void> {
    super.prepare()

    this.requestTimeout = setTimeout(async (): Promise<void> => {
      this.request()
    }, 1000)
  }

  public async stop(): Promise<void> {
    clearTimeout(this.requestTimeout)

    super.stop()
  }

  private async request(): Promise<void> {
    const requestType = ['get', 'post', 'patch', 'put', 'delete', 'head'][Math.floor(Math.random() * 6)]

    this[`${requestType}Request`]()

    this.requestTimeout = setTimeout(async (): Promise<void> => {
      this.request()
    }, 1000)
  }

  protected async getRequest(): Promise<void> {
    await fetch('http://localhost:3000/good?some=value')
  }

  protected async postRequest(): Promise<void> {
    await fetch('http://localhost:3000/good/post-end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' })
    })
  }

  protected async patchRequest(): Promise<void> {
    await fetch('http://localhost:3000/good/patch-end', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' })
    })
  }

  protected async putRequest(): Promise<void> {
    await fetch('http://localhost:3000/good/put-end', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' })
    })
  }

  protected async deleteRequest(): Promise<void> {
    await fetch('http://localhost:3000/good/delete-end', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' })
    })
  }

  protected async headRequest(): Promise<void> {
    await fetch('http://localhost:3000/good/head-end', {
      method: 'HEAD'
    })
  }
}
