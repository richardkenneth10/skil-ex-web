export default function toggleFullscreen(
  fullscreen: boolean,
  element: HTMLElement
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _element: any = element;

  if (fullscreen) {
    if (_element.requestFullscreen) {
      _element.requestFullscreen();
    } else if (_element.msRequestFullscreen) {
      _element.msRequestFullscreen();
    } else if (_element.mozRequestFullScreen) {
      _element.mozRequestFullScreen();
    } else if (_element.webkitRequestFullscreen) {
      _element.webkitRequestFullscreen();
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _document: any = document;

    if (_document.exitFullscreen) {
      _document.exitFullscreen();
    } else if (_document.mozCancelFullScreen) {
      _document.mozCancelFullScreen();
    } else if (_document.webkitExitFullscreen) {
      _document.webkitExitFullscreen();
    } else if (_document.msExitFullscreen) {
      _document.msExitFullscreen();
    }
  }
}
