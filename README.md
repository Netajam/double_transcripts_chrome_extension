# YouTube Transcript Auto-Scroller Chrome Extension

## Description

This Chrome extension allows users to add a custom transcript to any YouTube video and have it automatically scroll in sync with the video playback. It provides a floating, draggable, and resizable transcript window that overlays on top of the YouTube page.

## Features

- Add custom transcripts to YouTube videos
- Auto-scrolling transcript that syncs with video playback
- Draggable and resizable transcript window
- Adjustable context lines (number of lines displayed before and after the current line)
- Adaptive font size based on window size

## Installation

1. Download or clone this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Navigate to a YouTube video page.
2. Click the "Add Transcript" button that appears in the top right corner of the page.
3. In the modal window that opens, paste your custom transcript. The transcript should be in the following format:

   ```
   [00:00:08] This is the first line of the transcript.
   [00:00:13] This is the second line of the transcript.
   [00:00:17] And so on...
   ```

4. Click "Save" to add the transcript.
5. The transcript window will appear, and the text will auto-scroll as the video plays.

## Customizing the Transcript Display

- **Move the transcript window**: Click and drag the header of the transcript window.
- **Resize the transcript window**: Click and drag the resize button (↔) in the top right corner of the transcript window.
- **Adjust context lines**: Use the + and - buttons at the bottom of the transcript window to increase or decrease the number of lines displayed before and after the current line.

## Updating the Transcript

To update or change the transcript:

1. Click the "Update Transcript" button (this is the same button that was initially labeled "Add Transcript").
2. In the modal window, paste the new transcript text.
3. Click "Save" to update the transcript.

## Notes

- This extension works best with transcripts that are accurately timed to match the video content.
- The extension does not automatically fetch or generate transcripts. Users must provide their own transcript text.
- For the best experience, ensure that transcript timestamps accurately match the video timeline.

## Troubleshooting

If you encounter any issues:

1. Make sure you're on a YouTube video page (URL should start with `https://www.youtube.com/watch`).
2. Try refreshing the page and re-adding the transcript.
3. Ensure your transcript is correctly formatted with timestamps.
4. If problems persist, try disabling and re-enabling the extension in `chrome://extensions/`.

## Support

For bug reports or feature requests, please open an issue on the GitHub repository.