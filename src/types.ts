
export interface ContentPosition {
    page: number;

    step?: number;
}

export interface ContentMetas {
    page: number;

    /**
     * 播放元信息
     * 如：文档则每页返回图片文件列表，PPT返回云平台的播放参数
     */
    // eslint-disable-next-line
    play: any;

    /**
     * 播放模式
     */
    playMode?: string;
}

export interface ContentPageChangedEventData {
    page: number;

    step?: number;

    width: number;

    height: number;
}

export interface ImgItem {
    src: string;

    page: number;

    /**
     * 是否当前页图片
     */
    active: boolean;

    /**
     * 是否已加载
     */
    load: boolean;
}
