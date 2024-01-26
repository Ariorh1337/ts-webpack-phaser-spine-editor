export namespace Preload {
    type Spine = {
        key: string;
        json: string;
        atlas: string[];
    };

    type Image = {
        key: string;
        img: string;
    };

    type Sound = {
        key: string;
        path: string;
    };

    type Font = {
        key: string;
        path: string;
    };

    type Atlas = {
        key: string;
        img: string;
        json: string;
    };

    type MultiAtlas = {
        key: string;
        json: string;
        path: string;
    };

    type BitmapFont = {
        key: string;
        img: string;
        data: string;
    };

    type Aseprite = {
        key: string;
        img: string;
        json: string;
    };

    type Svg = {
        key: string;
        path: string;
        config?: Phaser.Types.Loader.FileTypes.SVGSizeConfig;
    };

    type Other = {
        key: string;
        path: string;
    };

    type File = Phaser.Types.Loader.FileConfig;

    type Config = {
        spine?: Spine[];
        image?: Image[];
        audio?: Sound[];
        font?: Font[];
        atlas?: Atlas[];
        multiatlas?: MultiAtlas[];
        bitmapFont?: BitmapFont[];
        aseprite?: Aseprite[];
        preload?: File[];
        svg?: Svg[];
        other?: Other[];
    };

    type Keys = keyof Preload.Config;
}
