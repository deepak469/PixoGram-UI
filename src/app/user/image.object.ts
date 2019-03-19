export class ImageObject {
  filename: String;
  filetype: String;
  size: String;

  constructor(inputFilename: String, inputFiletype: String, inputSize: String)
  {
    this.filename = inputFilename;
    this.filetype = inputFiletype;
    this.size = inputSize;
  }
}
