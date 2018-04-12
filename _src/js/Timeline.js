class Timeline {

  constructor(ordersRef, ordersViewRef = null, orderList = false, optionalClass = '') {

    this.ordersRef = ordersRef;
    this.ordersViewRef = ordersViewRef;
    this.orderList = orderList;
    this.optionalClass = optionalClass;

    this.element = document.createElement('div');

    if (this.ordersRef && this.ordersViewRef)
      this.init();

  }

  init() {

    this.build();

    this.ordersViewRef.orderByChild('createdTime').on('child_added', snap => {

      const timelineItem = new TimelineItem(this.ordersRef.child(snap.key), this.orderList, false);
      this.element.inner.insertBefore(timelineItem.element, this.element.inner.firstChild);
      timelineItem.init();

    });

  }

  build() {

    this.element.className = 'Timeline';
    this.element.classList.add(this.optionalClass);

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'Timeline-inner';
    this.element.appendChild(this.element.inner);

    this.element.footer = document.createElement('div');
    this.element.footer.className = 'Timeline-footer';
    this.element.appendChild(this.element.footer);

  }

}