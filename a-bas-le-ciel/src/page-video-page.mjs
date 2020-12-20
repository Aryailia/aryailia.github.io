import * as Headers from './headers.mjs';
import { promises as Fs } from 'fs';

//run: ../../make.sh eisel -l

export default function video_page_promise(config, rel_path, video_data) {
  const { id, url, title, upload_date, description } = video_data;
  const transcript = `${config.transcript_dir}/${id}.en.vtt`;
  return Fs.readFile(transcript, "UTF8")
    .catch(_ => "")
    .then(transcription => `
<html>
<head>${Headers.head(title)}
</head>
<body>
${Headers.navbar(config, rel_path)}
  <main>
    <iframe src="https://www.youtube.com/embed/${id}" width="560" height="315" frameborder="0">
      <a href="https://youtube-iframe.com"></a>
    </iframe>
    <h1>${title}</h1>
    <p>${Headers.format_date(upload_date)} <a href="${url}">[link youtube]</a></p>
    <hr>
    <p>${Headers.format_desc(description)}</p>
    <hr>
    <h2>Youtube Automatic Transcription</h2>
    <p>${transcription}</p>
  </main>
  ${Headers.footer()}
</body>
</html>`);
}
