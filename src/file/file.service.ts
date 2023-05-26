import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Base64 } from 'js-base64';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as tar from 'tar';
import * as archiver from 'archiver';
import * as unzipper from 'unzipper';

export const sleep = (seconds: number) => {
  const milliseconds = 1000;

  return new Promise((resolve) => setTimeout(resolve, seconds * milliseconds));
};

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  async create(createFileDto: CreateFileDto) {
    const { base64, fileName } = createFileDto;

    if (!base64 || !fileName) return false;

    const reg = new RegExp(/data:(.*);base64/gi); // base64 url에서 data mime만 가져오는 정규식
    const mime = reg.exec(base64)?.[1].split('/')[1];
    const isZipFormat = mime === 'zip';

    const data = {
      fileName,
      contents: base64,
      mime,
    };

    if (!isZipFormat) {
      const stringToDecode = base64.split(',')[1];
      const bin = Base64.atob(stringToDecode);
      const filePath = `public/file/${fileName}`;

      fs.writeFileSync(filePath, bin, 'binary');

      const outputPath = filePath.replace('.tar', '.zip');

      /*----------------------------------- */

      const output = fs.createWriteStream(outputPath);

      // create a new archiver object and set the output to the write stream
      const archive = archiver('zip');

      const destination = `public/file/${new Date().getTime()}`;

      fs.mkdirSync(destination);

      tar?.x({
        file: filePath,
        cwd: destination,
        sync: true,
      });

      archive.pipe(output);

      archive.glob('', {
        cwd: destination,
      });

      // finalize the archive (this might take some time)

      archive.finalize();

      const convertedBase64 = fs.readFileSync(outputPath, 'base64');

      data.contents = `data:application/zip;base64,${convertedBase64}`;

      const filePathList = [filePath, outputPath];

      for (const path of filePathList) {
        setTimeout(() => {
          fs.unlinkSync(path);
        }, 10000);
      }

      setTimeout(() => {
        fs.rm(
          destination,
          { recursive: true },
          // eslint-disable-next-line
          (err) => console.log(err),
        );
      }, 10000);
    }

    await this.filesRepository.insert(data);

    return true;
  }

  async findAll() {
    const fileList = await this.filesRepository.find({
      select: ['id', 'fileName'],
    });

    return fileList;
  }

  async findOne(id: number) {
    const file = await this.filesRepository.findOne({
      where: { id },
    });

    return file;
  }

  async update(id: number, updateFileDto: UpdateFileDto) {
    await this.filesRepository.update(id, updateFileDto);

    return true;
  }

  async getDataUrl(fileId: number) {
    const { id, contents, fileName, mime } = await this.filesRepository.findOne(
      {
        where: {
          id: fileId,
        },
      },
    );

    if (!id) return false;

    const data = { dataUrl: contents, fileName };

    if (mime !== 'x-tar') return data;

    const stringToDecode = contents.split(',')[1];
    const bin = Base64.atob(stringToDecode);
    const filePath = `public/file/${fileName.replace('.tar', '.zip')}`;

    fs.writeFileSync(filePath, bin, 'binary');

    const destination = `public/file/${new Date().getTime()}`;

    fs.mkdirSync(destination);

    fs.createReadStream(filePath).pipe(
      unzipper.Extract({
        path: destination,
      }),
    );

    const outputPath = filePath.replace('.zip', '.tar');

    tar.c({ gzip: true, file: outputPath, sync: true, cwd: destination }, [
      '.',
    ]);

    // const path: string = await new Promise((resolve, reject) => {
    //   fs.createReadStream(filePath)
    //     .pipe(
    //       unzipper.Extract({
    //         path: destination,
    //       }),
    //     )
    //     .on('finish', () => {
    //       console.log('완료');
    //       const outputPath = filePath.replace('.zip', '.tar');

    //       tar.c(
    //         { gzip: true, file: outputPath, sync: true, cwd: destination },
    //         ['.'],
    //       );

    //       resolve(outputPath);
    //     })
    //     .on('error', (err) => {
    //       console.log(err);
    //       reject(err);
    //     });
    // });

    const convertedBase64 = fs.readFileSync(outputPath, 'base64');

    data.dataUrl = `data:application/zip;base64,${convertedBase64}`;

    const filePathList = [filePath, outputPath];

    for (const path of filePathList) {
      setTimeout(() => {
        fs.unlinkSync(path);
      }, 10000);
    }

    fs.rm(
      destination,
      { recursive: true },
      // eslint-disable-next-line
      (err) => {},
    );

    return data;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
