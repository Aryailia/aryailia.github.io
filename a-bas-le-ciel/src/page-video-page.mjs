import * as Headers from './headers.mjs';
import { promises as Fs } from 'fs';

//run: ../../make.sh eisel -l

export default function video_page_promise(config, rel_path, video_data) {
  const { id, url, title, upload_date, description } = video_data;
  const transcript = `${config.transcript_dir}/${id}.en.vtt`;
  return Fs
    .readFile(transcript, "UTF8")
    .then(
      webvtt => {
        try {
          return parse_webvtt(webvtt);
        } catch (err) {
          console.log(`Cannot parse the webvtt subtitle file '${transcript}'. ${err}`);
          process.exit(1);
        }
      },
      _ => "Unavailable"
    )
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

function hello() {
}


function parse_webvtt(input_string) {
  if (typeof input_string !== "string") {
    throw new ParseError("Not a string");
  }
  // Guard against Windows "/r/n" (probably not necessary)
  input_string = input_string.replace(/\r\n|\r/, "\n");
  // Delimiter is a blank line
  const input = input_string.split('\n\n');

  if (!input[0].startsWith("WEBVTT") && !input[0].substring(1).startsWith("WEBVTT")) {
    throw new ParseError("Invalid vtt format: Does not start with 'WEBVTT' or '[BOM]WEBVTT'. [BOM] is a single byte");
  }

  const cues = parse_cues(input, 1);
  return cues.join("");
}

function parse_cues(input, start) {
  const length = input.length;
  //const output = new Array(Math.ceil(length / 2));
  const output = new Array(length - 1);
  let index = 0;
  let cache = " ";
  for (; start < length; ++start) {
    const cue = input[start].split("\n");
    if (cache != cue[2] && typeof cue[2] === "string") {
      cache = cue[2];
      //output[index] = cache;
      output[index] = cue[2].replace(/<[^>]*>/g, "");
      index += 1;
    }
  }
  //if (length > 0) {
  //  const cue = input[length - 1].split("\n");
  //  console.log(cue);
  //  //output[index] = cue[2].replace(/<.*>/g, "");
  //}
  return output.slice(0, index);
}

