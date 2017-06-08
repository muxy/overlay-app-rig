export default class Analytics {
  constructor(store) {

  }

  sendPageView() {
    console.log("Sent page view");
  }

  sendEvent(name, category, value = 0, label = '') {
    const data = {
      category,
      value,
      label
    };
      console.log("Sent event");
  }
}
