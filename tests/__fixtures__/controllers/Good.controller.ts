import { BaseController, Controller, Delete, Get, Head, Patch, Post, Put } from '@universal-packages/express-controllers'

@Controller('good')
export default class GoodController extends BaseController {
  @Get()
  public async getEnd(): Promise<void> {
    this.response.json({ get: true })
  }

  @Post('post-end')
  public async postEnd(): Promise<void> {
    this.json({ post: true })
  }

  @Patch('patch-end')
  public async patchEnd(): Promise<void> {
    this.response.json({ patch: true })
  }

  @Put('put-end')
  public async putEnd(): Promise<void> {
    this.response.json({ put: true })
  }

  @Delete('delete-end')
  public async deleteEnd(): Promise<void> {
    this.response.json({ delete: true })
  }

  @Head('head-end')
  public async headEnd(): Promise<void> {}
}
