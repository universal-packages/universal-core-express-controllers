import { BaseController, Controller, Delete, Get, Head, Patch, Post, Put } from '@universal-packages/express-controllers'

const MAX_WAIT = 10000

@Controller('good', { bodyParser: 'json' })
export default class GoodController extends BaseController {
  @Get()
  public async getEnd(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * MAX_WAIT)))
    
    this.response.json({ get: true })
  }

  @Post('post-end')
  public async postEnd(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * MAX_WAIT)))

    this.json({ post: true })
  }

  @Patch('patch-end')
  public async patchEnd(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * MAX_WAIT)))

    this.response.json({ patch: true })
  }

  @Put('put-end')
  public async putEnd(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * MAX_WAIT)))

    this.response.json({ put: true })
  }

  @Delete('delete-end')
  public async deleteEnd(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * MAX_WAIT)))

    this.response.json({ delete: true })
  }

  @Head('head-end')
  public async headEnd(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * MAX_WAIT)))
  }
}
