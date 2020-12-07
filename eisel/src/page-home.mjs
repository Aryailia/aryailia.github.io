import  *  as Headers from './headers.mjs';

//../../make.sh eisel -l

export default function home_page(config, rel_path) {
  return `<!DOCTYPE html>
<html>
<head>${
  Headers.head("Archive of Eisel Mazard's videos")}
  <style>
main {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 600px 1fr;
}
  </style>
</head>
</head>
<body>${
  Headers.navbar(config, rel_path)}
  <main>
    <aside></aside>
    <section>
      <p>This is an archive of archive the videos the Eisel Mazard's youtube channels.</p>
      <p>Currently, this site archives:</p>
      <ul>
        <li><a href="https://www.youtube.com/user/HeiJinZhengZhi">à-bas-le-ciel</a></li>
        <li>Maybe more will come</li>
      </ul>

      <p>Other links:</p>
      <ul>
        <li><a href="http://a-bas-le-ciel.blogspot.com/">Blogspot</a></li>
        <li><a href="https://www.patreon.com/a_bas_le_ciel">Patreon</a></li>
        <li><a href="https://www.instagram.com/a_bas_le_ciel/?hl=en">Instagram</a></li>
      </ul>

      <p>If you find any problems submit an issue on <a href="https://github.com/Aryailia/aryailia.github.io">GitHub</a></p>
    </section>
    <aside></aside>
  </main>
</body>
</html>`;
}
