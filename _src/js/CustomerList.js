class CustomerList {

  constructor(databaseRef = false) {

    this.databaseRef = databaseRef;

    this.customersRef = this.databaseRef.ref('customers');

    this.list = {};
    this.minStringLength = 2;

    if (databaseRef)
      this.init();

  }

  init() {

    this.customersRef.on('child_added', snap => this.addItem(snap.key, snap.ref));
    this.customersRef.on('child_removed', snap => this.removeItem(snap.key));

  }

  query(queryString = '', property = 'customerName', list = this.list) {

    queryString = queryString.toLowerCase();

    if (queryString.length >= this.minStringLength)
      return Object.values(list)
        .filter(customer => customer.data[property] ? customer.data[property].toLowerCase().includes(queryString) : false)
        .sort((a, b) => {
          if (a.data[property] < b.data[property])
            return -1;
          if (a.data[property] > b.data[property])
            return 1;
          return 0;
        });

    return [];

  }

  addItem(key, orderRef) {

    this.list[key] = new Customer(orderRef);

  }

  removeItem(key) {

    delete this.list[key];

  }

}