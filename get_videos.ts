import fs from 'fs';

async function getVideos() {
  const res = await fetch('https://www.youtube.com/results?search_query=Profil+Perpustakaan+Nasional+RI');
  const html = await res.text();
  const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
  if (match && match[1]) {
    try {
      const data = JSON.parse(match[1]);
      const contents = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
      const videos = [];
      for (const item of contents) {
        if (item.videoRenderer) {
          const v = item.videoRenderer;
          videos.push({
            id: v.videoId,
            title: v.title.runs[0].text,
            duration: v.lengthText ? v.lengthText.simpleText : '',
            thumbnail: `https://i.ytimg.com/vi/${v.videoId}/maxresdefault.jpg`,
            channel: v.ownerText.runs[0].text
          });
        }
      }
      console.log(JSON.stringify(videos.slice(0, 9), null, 2));
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log("No data found");
  }
}

getVideos();
