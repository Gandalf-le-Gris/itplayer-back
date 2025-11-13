import { Innertube } from 'youtubei.js';

class YoutubeService {
  private yt: Innertube | undefined;

  public async init() {
    this.yt = await Innertube.create();
  }

  public async search(query: string) {
      return await this.yt?.search(query, {
        type: 'video',
        sort_by: 'view_count'
      }) ?? [];
  }
}

const service = new YoutubeService();
service.init();

export default service;
