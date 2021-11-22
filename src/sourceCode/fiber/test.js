function sleep(delay) {
  for (var t = Date().now(); Date().now() <= delay; ) {}
}
var works = [() => {}, () => {}, () => {}];
function workLoop(deadline) {
  while (deadline.timeRemaing() > 1 && works.length > 0) {
    performUnitofWork();
  }
  if (works.length > 0) {
    requestIdleCallback(workLoop);
  }
}
function performUnitofWork() {
  let work = works.shift();
  work();
}
