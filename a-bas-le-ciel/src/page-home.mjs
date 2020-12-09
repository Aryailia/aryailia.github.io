import  *  as Headers from './headers.mjs';

//run: ../../make.sh eisel -l -f

export default function home_page(config, rel_path, playlist_list) {
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
      <p>
        This site was created by <a href="https://aryailia.site/">Aryailia</a>.
        If you find any problems submit an issue on the <a href="https://github.com/Aryailia/aryailia.github.io">GitHub page</a> for this project.
      </p>
      <p>This is an archive of the videos on Eisel Mazard's YouTube channels provided with permission by Eisel Mazard.</p>
      <hr>
      <p>Currently, this site archives:</p>
      <ul>
        <li><a href="https://www.youtube.com/user/HeiJinZhengZhi/videos">à-bas-le-ciel</a>  <a href="https://www.youtube.com/feeds/videos.xml?channel_id=UCWPKJM4CT6ES2BrUz9wbELw">[RSS feed link]</a></li>
        <li>Maybe more will come</li>
      </ul>

      <p>Eisel Mazard's other YouTube channels:</p>
      <ul>
        <li>
          <a href="https://www.youtube.com/channel/UCP3fLeOekX2yBegj9-XwDhA/videos">Active Research and Informed Opinion</a>
          <a href="https://www.youtube.com/feeds/videos.xml?channel_id=UCP3fLeOekX2yBegj9-XwDhA">[RSS]</a>
        </li>

        <li>
          <a href="https://www.youtube.com/channel/UCwFVGsSXOM5d3xLSunquAPA/videos">AR&amp;IO: Reviews</a>
          <a href="https://www.youtube.com/feeds/videos.xml?channel_id=UCwFVGsSXOM5d3xLSunquAPA">[RSS]</a></li>
      </ul>

      <p>Other places to find Eisel Mazard:</p>
      <ul>
        <li>Discord (See <a href="${config.domain}/1.html">latest video</a> for newest invite link)</li>
        <li><a href="http://a-bas-le-ciel.blogspot.com/">Blogspot</a></li>
        <li><a href="https://www.patreon.com/a_bas_le_ciel">Patreon</a></li>
        <li><a href="https://www.instagram.com/a_bas_le_ciel/?hl=en">Instagram</a></li>
      </ul>

    </section>
    <aside></aside>
  </main>
  <!-- Specifically skipping footer -->
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
