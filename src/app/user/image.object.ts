export class ImageObject {
  filename: String;
  filetype: String;
  size: String;

  ImageObject(inputFilename, inputFiletype, inputSize) {
    this.filename = inputFilename;
    this.filetype = inputFiletype;
    this.size = inputSize;
  }
}
