class OrdersGrid extends Grid {

  constructor(element) {

    super(element);

    this.defaultColumnsNumber = 2;
    this.defaultItemWidth = 340;
    this.defaultMarginSize = 16;

    this.timer = false;

  }

  pushOrder(order) {

    let self = this;

    this.element.style.visibility = 'hidden';

    const ordersGridItem = new OrdersGridItem(order, this);
    this.element.appendChild(ordersGridItem.element);
    this.itemList.push(ordersGridItem);

    if (this.timer)
      clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      setTimeout(function () {

        self.reOderView();
        self.element.style.visibility = 'visible';

      }, 100);
    }, 10);

  }

}