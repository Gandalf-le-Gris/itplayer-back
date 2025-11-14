import { VM } from 'vm2';
import { Innertube, UniversalCache } from 'youtubei.js';

class YoutubeService {
  private yt: Innertube | undefined;

  public async init() {
    const vm: VM = new VM({
      timeout: 1000,
      sandbox: {},
    });
    const cache: UniversalCache = new UniversalCache(false);
    this.yt = await Innertube.create({
      cache,
      retrieve_player: true,
      // @ts-ignore
      execute: vm.run.bind(vm),
    });
  }

  public async search(query: string) {
    return await this.yt?.search(query, {
      type: 'video',
      sort_by: 'relevance',
    }) ?? [];
  }

  public async getAudioStream(videoId: string) {
    const videoInfo = await this.yt?.getInfo(videoId);
    const audioFormat = videoInfo?.chooseFormat({
      type: 'audio',
      quality: 'best',
      format: 'audio',
      client: 'ANDROID',
    });
    if (!audioFormat) {
      throw new Error('error.audio.not-found');
    }
    console.log(audioFormat)
    const stream = this.yt?.download(videoId, {
      type: 'audio',
      quality: 'best',
      format: 'audio',
      client: 'ANDROID',
    });
    return { audioFormat, stream };
  }
}

const service = new YoutubeService();
service.init();

export default service;
