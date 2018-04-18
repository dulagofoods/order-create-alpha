class Timeline {

  constructor(app = false, optionalClass = '', autoInit = true) {

    this.app = app;
    this.optionalClass = optionalClass;

    // define database instances
    this.ordersRef = this.app.ordersRef;
    this.ordersViewRef = this.app.ordersViewRef || this.app.activeOrdersViewRef;
    this.orderList = this.app.orderList;

    this.element = document.createElement('div');
    this.orders = {};
    this.isVisible = false;

    if (this.ordersRef && this.ordersViewRef && autoInit)
      this.init();

  }

  init() {

    this.build();

    this.ordersViewRef.orderByChild('createdTime').on('child_added', snap => {

      if (snap.val()) {

        this.orders[snap.key] = new TimelineItem(this.ordersRef.child(snap.key), this.orderList, false);
        this.element.inner.insertBefore(this.orders[snap.key].element, this.element.inner.firstChild);
        this.orders[snap.key].init();

      }

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

  toggle() {

    if (this.isVisible)
      this.inactive();
    else
      this.active();

  }

  active() {

    if (this.app.element)
      this.app.element.classList.add('is-timelineVisible');

    this.isVisible = true;

  }

  inactive() {

    if (this.app.element)
      this.app.element.classList.remove('is-timelineVisible');

    this.isVisible = false;

  }

}