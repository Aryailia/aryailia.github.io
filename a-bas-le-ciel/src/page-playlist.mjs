import  *  as Headers from './headers.mjs';

//run: ../../make.sh eisel -l -f

export default function playlist_page(config, rel_path, playlist_list) {
  return `<!DOCTYPE html>
<html>
<head>${
  Headers.head("Archive of Eisel Mazard's videos")}
</head>
<body>${
  Headers.navbar(config, rel_path)}
  <main class="thin-column">
    <aside></aside>
    <section>
      <ul>${
        format_playlists(config, playlist_list)}
      </ul>
    </section>
    <aside></aside>
  </main>
  ${Headers.footer()}
</body>
</html>`;
}

function format_playlists(config, playlist_list) {
  const length = playlist_list.length;
  const lines = new Array(length);
  for (let i = 0; i < length; ++i) {
    const { url, title } = playlist_list[i];
    lines[i] = `
    <li><a href="${url}">${title}</a></li>`
    ;
  }
  return lines.join("\n");
}
