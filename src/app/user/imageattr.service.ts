import { Injectable } from '@angular/core';
import { ImageObject } from './image.object';

@Injectable()
export class ImageAttrService {
  imageObj: ImageObject[] = [];
}
