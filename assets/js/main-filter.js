MainFilter = function (data) {
  this.prods = data;

  //   this.render (function () {
  //     this.prods.keys.array.forEach (function (key) {
  //       console.log ('key', key);
  //     });
  //   });
};
MainFilter.prototype.renderFilters = function () {
  keys = Object.keys (prods);
  acc = $ ('#prod-accord');
  that = this;
  keys.forEach (function (key) {
    cat = that.prods[key];

    title = `
    <div class="title">
      <i class="dropdown icon"></i>
      ${cat['name']}
    </div>`;
    acc.append (title);
    sub_cat = Object.keys (cat['sub-products']);
    checkCT = document.createElement ('div');
    acc.append (`<div  id="${key}-${cat['name']}" class="ui form">
    <div id="${cat['name']}-checks" style="padding: 0 10px 10px 10px" class="grouped fields"></div></div>`);
    i = 0;
    sub_cat.forEach (function (subkey) {
      prod = that.prods[key]['sub-products'][subkey];

      c2 = `
      <div style="margin:5px" class="field">
        <div class="ui radio checkbox">
          <input id="${i}-${cat['name']}" type="radio" onchange="mf.renderProds(${subkey},${key}, event)" name="group" class="hidden">
          <label>${prod['name']}</label>
        </div>
      </div>`;

      $ (`#${cat['name']}-checks`).append (c2);
      i++;
    });
  });
};

MainFilter.prototype.renderProds = function (id, cat, event) {
  console.log ('Product: ', this.prods[cat]['sub-products'][id]['name']);
  results = $ ('#prod-results');
  group = $ ('#prod-group');
  results.html ('');
  group.html ('');
  group.append (
    `<h2 style="display:inline-block;margin:10px 0 20px 0">${this.prods[cat]['sub-products'][id]['name']}</h2>`
  );
  if (cat == 10) {
    pageid = `newprodlist.html?group=${id}`;
  } else {
    pageid = `indoorprods.html?group=${id}`;
  }
  group.append (
    `<a style="display: inline-block;
    width: 120px;
    margin: 15px 10px 15px 10px;
    color: white;
    background: green;
    padding: 10px;
    border-radius: 3px;" href="${pageid}">Filter All  <i style="margin-left:10px"class="icon external alternate"></i></a>`
  );

  var prod_ids = Object.keys (this.prods[cat]['sub-products'][id]['products']);
  prod_ids.forEach (function (key) {
    p = this.prods[cat]['sub-products'][id]['products'][key];
    content = `<div class="column ${this.prods[cat]['name']}">
        <img style="width:200px" src="https://maxlite.com/_assets/images/products/${p['image']}"/>
        <h4><a href="https://maxlite.com/products/${p['seo']}">${p['name']}</a></h4>
        </div>`;

    results.append (content);
  });
};
