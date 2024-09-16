import Dropzone from 'dropzone'

Dropzone.autoDiscover = false

/**
 * @class Dropzone
 */
export default class DropzoneExtended extends Dropzone {
  /**
   * Override parallel chunk uploads handling logic
   * Add support limit of parallel chunk uploads.
   *
   * @param {File[]} files
  */
  uploadFiles(files) {
    this._transformFiles(files, (transformedFiles) => {
      if (this.options.chunking) {
        // Chunking is not allowed to be used with `uploadMultiple` so we know
        // that there is only __one__file.
        let transformedFile = transformedFiles[0];
        files[0].upload.chunked =
          this.options.chunking &&
          (this.options.forceChunking ||
            transformedFile.size > this.options.chunkSize);
        files[0].upload.totalChunkCount = Math.ceil(
          transformedFile.size / this.options.chunkSize
        );
      }

      if (files[0].upload.chunked) {
        // This file should be sent in chunks!

        // If the chunking option is set, we **know** that there can only be **one** file, since
        // uploadMultiple is not allowed with this option.
        let file = files[0];
        let transformedFile = transformedFiles[0];
        let startedChunkCount = 0;

        file.upload.chunks = [];

        let handleNextChunk = () => {
          let chunkIndex = 0;

          // Find the next item in file.upload.chunks that is not defined yet.
          while (file.upload.chunks[chunkIndex] !== undefined) {
            chunkIndex++;
          }

          // This means, that all chunks have already been started.
          if (chunkIndex >= file.upload.totalChunkCount) return;

          startedChunkCount++;

          let start = chunkIndex * this.options.chunkSize;
          let end = Math.min(
            start + this.options.chunkSize,
            transformedFile.size
          );

          let dataBlock = {
            name: this._getParamName(0),
            data: transformedFile.webkitSlice
              ? transformedFile.webkitSlice(start, end)
              : transformedFile.slice(start, end),
            filename: file.upload.filename,
            chunkIndex: chunkIndex,
          };

          file.upload.chunks[chunkIndex] = {
            file: file,
            index: chunkIndex,
            dataBlock: dataBlock, // In case we want to retry.
            status: Dropzone.UPLOADING,
            progress: 0,
            retries: 0, // The number of times this block has been retried.
          };

          this._uploadData(files, [dataBlock]);
        };

        const handleNextChunks = () => {
          const firstChunk = file.upload.chunks[0];
          if (this.options.parallelChunkUploads && firstChunk) {
            if (firstChunk.status === Dropzone.UPLOADING) {
              // If the first chunk is still uploading, wait for it to finish before uploading the next chunks.
              return;
            }

            let maxParallelRequests;
            if (this.options.parallelChunkUploads === true) {
              maxParallelRequests = this.options.parallelUploads;
            } else {
              maxParallelRequests = parseInt(this.options.parallelChunkUploads);
            }

            maxParallelRequests = Math.min(maxParallelRequests, file.upload.totalChunkCount);

            const uploadedChunks = file.upload.chunks.filter(chunk => chunk.status === Dropzone.SUCCESS).length;
            let uploadingChunks = file.upload.chunks.filter(chunk => chunk.status === Dropzone.UPLOADING).length;
            let waitingChunks = file.upload.totalChunkCount - (uploadingChunks + uploadedChunks);

            if (waitingChunks === 1 && uploadingChunks > 0) {
              // If there is only one chunk left to upload and there are some chunks uploading,
              // wait for them to finish before uploading the last chunk.
              return;
            }

            while (waitingChunks > 0 && uploadingChunks < maxParallelRequests) {
              handleNextChunk();

              uploadingChunks++;
              waitingChunks--;

              if (waitingChunks === 1) {
                // If there is only one chunk left to upload and there are some chunks uploading,
                // wait for them to finish before uploading the last chunk.
                break;
              }
            }
          } else {
            handleNextChunk();
          }
        }

        file.upload.finishedChunkUpload = (chunk, response) => {
          let allFinished = true;
          chunk.status = Dropzone.SUCCESS;
          chunk.response = response;

          // Clear the data from the chunk
          chunk.dataBlock = null;
          // Leaving this reference to xhr intact here will cause memory leaks in some browsers
          chunk.xhr = null;

          for (let i = 0; i < file.upload.totalChunkCount; i++) {
            if (file.upload.chunks[i] === undefined) {
              return handleNextChunks();
            }
            if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
              allFinished = false;
            }
          }

          if (allFinished) {
            this.options.chunksUploaded(file, () => {
              this._finished(files, response, null);
            });
          }
        };

        handleNextChunk();
      } else {
        let dataBlocks = [];
        for (let i = 0; i < files.length; i++) {
          dataBlocks[i] = {
            name: this._getParamName(i),
            data: transformedFiles[i],
            filename: files[i].upload.filename,
          };
        }
        this._uploadData(files, dataBlocks);
      }
    });
  }

}
