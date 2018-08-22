// Copyright (c) 2018 Jiří Šimeček. All rights reserved.

// https://bgr.com/2018/05/15/google-chrome-picture-in-picture-mode/
const isEnabled = document.pictureInPictureEnabled;
// Called when the user clicks on the browser action.
const onClink = `
    const showPiP = (videoElement) => {
      const wasPlaying = !videoElement.paused;
      console.log('show', wasPlaying);
      videoElement.requestPictureInPicture()
      .then(() => {
        if(wasPlaying) {
          videoElement.play()
          .catch(error => {
            console.error(error);
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
    };

    const hidePiP = (videoElement) => {
      const wasPlaying = !videoElement.paused;
      console.log('hide', wasPlaying);
      videoElement.disablePictureInPicture = true;
      videoElement.disablePictureInPicture = false;
      if(wasPlaying) {
        setTimeout(() => {
          videoElement.play()
          .catch(error => {
            console.error(error);
          });
        }, 100);
      }
    };

    if (!document.pictureInPictureElement) {
      showPiP(document.querySelector('video'));
    } else {
      hidePiP(document.pictureInPictureElement);
    }
`;

chrome.browserAction.onClicked.addListener(function(tab) {
  if(!isEnabled) {
    console.log('Picture in picture not enabled.')
    return;
  }
  console.log('Quering for video element on ' + tab.url + ' and toggling PiP.')
  chrome.tabs.executeScript({
    code: `(function() {${onClink}})();`
  });
});
