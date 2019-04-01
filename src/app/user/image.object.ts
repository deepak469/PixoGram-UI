export class ImageObject {
  id: String;
  filename: String;
  filetype: String;
  size: String;
  caption: String;

  constructor(inputFilename: String, inputFiletype: String, inputSize: String)
  {
    this.id = '';
    this.filename = inputFilename;
    this.filetype = inputFiletype;
    this.size = inputSize;
    this.caption = '';
  }
}
