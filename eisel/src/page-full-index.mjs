import  *  as Headers from './headers.mjs';
import { MAX_LEN } from '../build.mjs';

//run: ../../make.sh eisel -l

export default function full_index(config, rel_path, title, video_list) {
  return `<!DOCTYPE html>
<html>
<head>${
  Headers.head(title)}
</head>
<style>
  main li {
    /* else there is not enough space for four digits */
    margin: 0em 2em;
  }
  p {
    height: 10em;
    overflow-y: scroll;
  }
</style>
<body>${
  Headers.navbar(config, rel_path)}
  <main>
    <ol>${
function () {
  return video_list.map(({ id, url, title, upload_date, description}) => {
    return `
<li>
  <h2><a href="${config.domain}/video/${id}.html">${title}</a></h2>
  <div>${Headers.format_date(upload_date)} <a href="${url}">[YT link]</a></div>
  <p>${
    Headers.format_desc(description)
    //Headers.format_desc(Headers.ellipt(description, MAX_LEN))
}</p>
</li>`;
  }).join("");
}()}
    </ol>
  </main>
</body>
</html>`;
}
        //<p>${}</p>
