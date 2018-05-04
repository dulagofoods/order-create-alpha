class CustomerAutoCompleteItem {

  constructor(customer = {}, autocomplete) {

    this.customer = customer;
    this.autocomplete = autocomplete;

    this.element = document.createElement('li');
    this.hasFocus = false;

    this.build();

  }

  build() {

    this.element.span = document.createElement('span');
    this.element.span.innerHTML = this.customer.data.customerName;
    this.element.addEventListener('click', () => this.autocomplete.select(this));
    this.element.appendChild(this.element.span);

  }

  highlight(string) {

    string = string.replace(/[^\w\s]/gi, '');

    this.element.span.innerHTML = string
      ? this.customer.data.customerName.replace(new RegExp('(' + string + ')', 'ig'), '<span class=highlight>$1</span>')
      : this.customer.data.customerName;

  }

  focus() {

    this.hasFocus = true;
    this.element.classList.add('has-focus');

  }

  blur() {

    this.hasFocus = false;
    this.element.classList.remove('has-focus');

  }

}