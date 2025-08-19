import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';
import ImageKit from 'imagekit';

@Injectable()
export class ImagekitService {
    private imagekit: ImageKit;

    constructor(private readonly configService: ConfigService) {
        this.imagekit = new ImageKit({
            publicKey: this.configService.get<string>('IMAGEKIT_PUBLIC_KEY') ?? '',
            privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY') ?? '',
            urlEndpoint: this.configService.get<string>('IMAGEKIT_URL_ENDPOINT') ?? '',
        });
    }

    async uploadFile(file: Buffer, fileName: string, folder: string = '/uploads'): Promise<UploadResponse> {
        return this.imagekit.upload({
            file,
            fileName,
            folder,
        });
    }

    getUrl(path: string) {
        return this.imagekit.url({
            path,
        });
    }
}
