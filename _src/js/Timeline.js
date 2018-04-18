class Timeline {

  constructor(app = false, optionalClass = '', autoInit = true) {

    this.app = app;
    this.optionalClass = optionalClass;

    this.element = document.createElement('div');

    this.ordersRef = this.app.ordersRef;
    this.ordersViewRef = this.app.ordersViewRef;
    this.orderList = this.app.orderList;

    if (this.ordersRef && this.ordersViewRef && autoInit)
      this.init();

  }

  init() {

    this.build();

    this.ordersViewRef.orderByChild('createdTime').on('child_added', snap => {

      if (snap.val()) {

        const timelineItem = new TimelineItem(this.ordersRef.child(snap.key), this.orderList, false);
        this.element.inner.insertBefore(timelineItem.element, this.element.inner.firstChild);
        timelineItem.init();

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
      this.app.element.classList.add('is-agendaVisible');

    this.isVisible = true;

    if (!this.isLoaded)
      this.init();

  }

  inactive() {

    if (this.app.element)
      this.app.element.classList.remove('is-agendaVisible');

    this.isVisible = false;

  }

}