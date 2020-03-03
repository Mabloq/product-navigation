ProductFilter = function (id) {
  /**
   * @param {number}         id     - The Product Sub-Category Id (eg. 4434 (Area Luminaries))
   *
   * @namespace
   * @property {number}      subcat             - This propery is set to id paramter during instatiation of ProductFilter, used to query SubCat API,
   *
   *
   * @property {object}      filters            - The default values for our filters that gets overiden by getFilters
   * @property {number[]}    filters.products   - Array of base product ID's  (eg. [4682, 4671]) that belong to sub-category
   * @property {string[]}    filters.watts      - Array of watt values  (eg. ['100','150']) to filter skus against
   * @property {string[]}    filters.lumens     - Array of lumen range values (eg. ['5001-10000','10001-15000']) to filter skus against
   * @property {string[]}    filters.CCT        - Array of CCT values (eg. ['4000','5000']) to filter skus against
   *
   * @property {object} skus    - this object holds the default product data feteched from the server using {@link getProducts}
   */

  this.skus = {};
  this.temp_skus = {};
  this.subcat = id;
  this.filtered_skus = {};
  this.filters = {
    products: [],
    watts: ['0-100', '101-200', '201-300', '301-400', '401-500'],
    lumens: [
      '0-5000',
      '5001-10000',
      '10001-15000',
      '15001-20000',
      '20001-25000',
      '25001-30000',
      '30001-35000',
      '35001-40000',
      '40001-45000',
      '45001-50000',
    ],
    CCT: [],
  };
  this.page_low = 0;
  this.page_high = 20;
  this.active_filters = {
    products: [],
    watts: [],
    lumens: [],
    CCT: [],
  };

  this.sku_vector = [];
};

ProductFilter.prototype.init = function () {
  this.getPages ();
  this.getFilters ();
  this.renderFilters ();
  this.getSkus ();
  this.renderSkus ();
};
ProductFilter.prototype.getPages = function () {
  pages = document.getElementById ('product-pages');

  p_ids = sub_product_data[this.subcat]['products'];

  p_ids.forEach (function (id) {
    product = products_data[id];

    p_div = document.createElement ('div');
    p_div.style =
      'display:inline-block;width:150px;margin:5px;vertical-align:top';

    p_a_img = document.createElement ('a');
    p_a_img.href = '/products/' + product['seo'];
    p_img = document.createElement ('img');
    p_img.style = 'width:150px';
    p_img.src =
      'https://www.maxlite.com/_assets/images/products/' + product['image'];

    p_a_img.appendChild (p_img);

    h4_a = document.createElement ('a');
    h4_a.href = '/products/' + product['seo'];
    h4 = document.createElement ('h4');
    h4.innerHTML = product['name'];

    h4_a.appendChild (h4);

    p_div.appendChild (p_a_img);
    p_div.appendChild (h4_a);

    pages.appendChild (p_div);
  });
};
//=================== GET PRODUCTS =====================

//==========================================================
ProductFilter.prototype.getProducts = function () {
  sub = sub_product_data[this.subcat];

  prods = [];
  sub.products.forEach (function (p) {
    prod = products_data[p];
    name = prod.name;
    prods.push ({id: p, name: name});
  });
  return prods;
};
//=================== GET SKUS =====================

//==========================================================
ProductFilter.prototype.getSkus = function () {
  var that = this;
  sub = sub_product_data[this.subcat];

  //create keys
  sub.products.forEach (function (p) {
    that.skus[p] = {};
    that.filtered_skus[p] = {};
  });

  sub.products.forEach (function (p) {
    that.skus[p] = products_data[p].skus;
    that.filtered_skus[p] = products_data[p].skus;
  });
};

//=================== FILTER PRODUCTS =====================

//==========================================================
ProductFilter.prototype.filterProducts = function (keys) {
  var that = this;
  this.temp_skus = {};
  keys.forEach (function (key) {
    that.temp_skus[key] = that.skus[key];
  });

  if (
    Object.keys (this.temp_skus).length === 0 &&
    this.temp_skus.constructor === Object
  ) {
    this.temp_skus = this.skus;
  }
  this.filtered_skus = this.temp_skus;
};

/**
 *
 * This is a function filters return truth value indication if a sku's watts value matches at least one
 * of the watt values provided
 *
 * @param {string[]} watts - array of watt values to filter for (eg. ['100','150'])
 * @param {string} key - Product ID used to prefilter set of skus (eg. 4682)
 * @param {string} sku - Product SKU that is a child of Prooduct ID, use to retrieve Sku to check against (eg. MP-AR100HT3-50B)
 *
 * @return {boolean} - Returns true if at least one CCT value matches the sku's lumen value
 *
 * @example
 *
 *     filterWatts(['100','150'], '4682', 'MP-AR100HT3-50B')
 */
ProductFilter.prototype.filterWatts = function (watts, key, sku) {
  var that = this;
  if (watts.length < 1) {
    return true;
  }
  for (var i = 0; i < watts.length; i++) {
    //extract min and max values of tange
    split = watts[i].split ('-');
    low = split[0];
    high = split[1];

    //checks if sku falls within range

    if (
      that.skus[key][sku]['watts'] >= low &&
      that.skus[key][sku]['watts'] <= high
    ) {
      return true;
    }
  }

  //   for (var i = 0; i < watts.length; i++) {
  //     if (watts[i] == that.skus[key][sku]["watts"]) {
  //       return true;
  //     }
  //   }

  return false;
};

/**
 *
 * This is a function filters return truth value indicating if a sku's CCT value matches at least one
 * of the cct values provided
 *
 * @param {string[]} ccts - array of Color Temp. values to filter for (eg. ['4000','5000'])
 * @param {string} key - Product ID used to prefilter set of skus (eg. 4682)
 * @param {string} sku - Product SKU that is a child of Prooduct ID, use to retrieve Sku to check against (eg. MP-AR100HT3-50B)
 *
 * @return {boolean} - Returns true if at least one CCT value matches the sku's lumen value
 *
 * @example
 *
 *     filterCCT(['4000','5000'], '4682', 'MP-AR100HT3-50B')
 */
ProductFilter.prototype.filterCCT = function (ccts, key, sku) {
  var that = this;
  if (ccts.length < 1) {
    return true;
  }

  for (var i = 0; i < ccts.length; i++) {
    if (ccts[i] == that.skus[key][sku]['CCT']) {
      return true;
    }
  }

  return false;
};

/**
 *
 * This is a function filters return truth value indication if a sku's lumen value matches at least one
 * of the lumen values provided
 *
 * @param {string[]} lumens - array of Lumen ranges to filter for (eg. ['1000-2000','2001-3000'])
 * @param {string} key - Product ID used to prefilter set of skus
 * @param {string} sku - Product SKU that is a child of Prooduct ID, use to retrieve Sku to check against
 *
 * @return {boolean} - Returns true if at least one lumen value matches the sku's lumen value
 *
 * @example
 *
 *     filterLumens(['1000-2000','2001-3000'], '4682', 'MP-AR100HT3-50B')
 */
ProductFilter.prototype.filterLumens = function (lumens, key, sku) {
  var that = this;
  if (lumens.length < 1) {
    return true;
  }

  for (var i = 0; i < lumens.length; i++) {
    //extract min and max values of tange
    split = lumens[i].split ('-');
    low = split[0];
    high = split[1];
    dude = that.skus[key][sku];

    //checks if sku falls within range

    if (
      that.skus[key][sku]['lumens'] >= low &&
      that.skus[key][sku]['lumens'] <= high
    ) {
      return true;
    }
  }

  return false;
};

/**
 *
 * This is a function calls all the individual filters (lumens, watts,cct...) one one sku at a time
 * then it determins the skus that match and re-renders the product skus visible on the page
 *
 * @param {string[]} ftype - array of Lumen ranges to filter for (eg. ['1000-2000','2001-3000'])
 *
 * @example
 *
 *     filter('products')
 */
ProductFilter.prototype.filter = function (ftype) {
  var that = this;
  f = ftype + '_filters';
  filter_change = document.getElementById (f);
  checks = filter_change.querySelectorAll ('.check_filter');
  this.active_filters[ftype] = [];
  checks.forEach (function (c) {
    if (c.checked) {
      that.active_filters[ftype].push (c.value);
      // console.log("current filters: ", c.value);
    }
  });

  if (
    this.active_filters['products'].length > 0 ||
    this.active_filters['products'] != undefined
  ) {
    this.filterProducts (this.active_filters['products']);
  }
  //   if (this.active_filters["watts"].length > 0) {
  //     this.filterWatts(this.active_filters["watts"]);
  //   }
  //   if (this.active_filters["CCT"].length > 0) {
  //     this.filterCCT(this.active_filters["CCT"]);
  //   }

  this.temp_skus = {};
  keys = Object.keys (this.filtered_skus);
  keys.forEach (function (key) {
    that.temp_skus[key] = {};
    skus = Object.keys (that.skus[key]);
    skus.forEach (function (sku) {
      //here we do a triple condition check to see if this sku matches all filters
      // each flilter function immediately returns false if active filters is empty for flulter type
      // else do your check if sku matches filter criteria and return True or False
      watt = that.filterWatts (that.active_filters['watts'], key, sku);
      cct = that.filterCCT (that.active_filters['CCT'], key, sku);
      lumens = that.filterLumens (that.active_filters['lumens'], key, sku);

      if (watt && cct && lumens) {
        match = that.skus[key][sku];
        that.temp_skus[key][sku] = match;
      }
    });
  });

  this.filtered_skus = this.temp_skus;
  prod_containter = document.getElementById ('products-container');
  prod_containter.innerHTML = '';
  this.renderSkus ();
};

/**
 *
 * This is a function that determins which filters will be showing in the filter panel
 *
 */
ProductFilter.prototype.getFilters = function () {
  var that = this;
  this.filters.products = this.getProducts ();

  filters_names = ['CCT'];
  filters_names.forEach (function (filter) {
    filter_set = new Set ();

    that.filters.products.forEach (function (product) {
      products_data[product.id][filter].forEach (function (choice) {
        //if filetset alread has this choice return
        if (filter_set.has (choice)) {
          return;
        }
        //else add choice to filter set and to filter options
        filter_set.add (choice);
        that.filters[filter].push (choice);
      });
    });

    that.filters[filter].sort ();
  });
};

/**
 *
 * This is a function that renders the filters  and adds precalcFilter and precalcClean
 * event listeners to show precalculated item count before filtering also added is the
 * rotateCaret onclick listener used to toggle view of filter types (eg. products, watts, cct..)
 *
 */
ProductFilter.prototype.renderFilters = function () {
  var that = this;
  filters_ctn = document.getElementById ('filter-container');
  products = this.getProducts ();
  filters = ['CCT'];

  product_bar = document.createElement ('div');
  product_bar.className = 'filter-bar';
  product_bar.innerHTML = 'Products';
  product_caret = document.createElement ('div');
  product_caret.className = 'down-caret right';
  product_caret.setAttribute (
    'onclick',
    "Filter.rotateCaret(event,'products_filters')"
  );
  product_bar.appendChild (product_caret);
  product_div = document.createElement ('div');
  product_div.id = 'products_filters';
  product_div.style.display = 'block';
  product_ul = document.createElement ('ul');
  product_ul.style = 'list-style:none;padding-inline-start:20px';
  // strong_tag = document.createElement("strong");
  // strong_tag.innerHTML = "Products";
  // strong_tag.style = "color:#009639";

  filters_ctn.appendChild (product_bar);

  this.filters.products.forEach (function (p) {
    p_li = document.createElement ('li');
    p_li.style = 'padding: 3px';
    p_li.setAttribute (
      'onmouseenter',
      "Filter.precalcFilter(event,'products')"
    );
    p_li.setAttribute (
      'onmouseleave',
      "Filter.precalcClean('" + p['id'] + "')"
    );
    input_chk = document.createElement ('input');
    input_chk.type = 'checkbox';
    input_chk.value = p['id'];
    input_chk.className = 'check_filter';
    input_chk.setAttribute (
      'onchange',
      "Filter.filter('products'," + p['id'] + ')'
    );

    label = document.createElement ('label');
    label.innerHTML = p['name'];

    p_li.appendChild (input_chk);
    p_li.appendChild (label);

    product_ul.appendChild (p_li);
  });

  product_div.appendChild (product_ul);
  filters_ctn.appendChild (product_div);

  watt_bar = document.createElement ('div');
  watt_bar.className = 'filter-bar';
  watt_bar.innerHTML = 'watts';
  watt_caret = document.createElement ('div');
  watt_caret.className = 'down-caret right';
  watt_caret.setAttribute (
    'onclick',
    "Filter.rotateCaret(event,'watts_filters')"
  );
  watt_bar.appendChild (watt_caret);
  watt_div = document.createElement ('div');
  watt_div.id = 'watts_filters';
  watt_div.style.display = 'block';
  watt_ul = document.createElement ('ul');
  watt_ul.style = 'list-style:none;padding-inline-start:20px';

  filters_ctn.appendChild (watt_bar);

  this.filters.watts.forEach (function (w) {
    p_li = document.createElement ('li');
    p_li.style = 'padding: 3px';
    p_li.setAttribute ('onmouseenter', "Filter.precalcFilter(event,'watts')");
    p_li.setAttribute ('onmouseleave', "Filter.precalcClean('" + w + "')");
    input_chk = document.createElement ('input');
    input_chk.type = 'checkbox';
    input_chk.value = w;
    input_chk.className = 'check_filter';
    input_chk.setAttribute ('onchange', "Filter.filter('watts','" + w + "')");
    label = document.createElement ('label');
    label.innerHTML = w;

    p_li.appendChild (input_chk);
    p_li.appendChild (label);

    watt_ul.appendChild (p_li);
  });
  watt_div.appendChild (watt_ul);
  filters_ctn.appendChild (watt_div);

  filters.forEach (function (filter) {
    filter_set = new Set ();
    filter_bar = document.createElement ('div');
    filter_bar.className = 'filter-bar';
    filter_bar.innerHTML = filter;
    filter_caret = document.createElement ('div');
    filter_caret.className = 'down-caret right';
    filter_caret.setAttribute (
      'onclick',
      "Filter.rotateCaret(event,'" + filter + "_filters')"
    );
    filter_bar.appendChild (filter_caret);
    temp_div = document.createElement ('div');
    temp_div.id = filter + '_filters';
    temp_div.style.display = 'block';
    temp_ul = document.createElement ('ul');
    temp_ul.style = 'list-style:none;padding-inline-start:20px';
    strong_tag = document.createElement ('strong');
    strong_tag.innerHTML = filter;
    strong_tag.style = 'color:#009639';

    filters_ctn.appendChild (filter_bar);

    that.filters[filter].forEach (function (choice) {
      if (filter_set.has (choice)) {
        return;
      }
      filter_set.add (choice);
      p_li = document.createElement ('li');
      p_li.style = 'padding: 3px';
      p_li.setAttribute (
        'onmouseenter',
        "Filter.precalcFilter(event,'" + filter + "')"
      );
      p_li.setAttribute (
        'onmouseleave',
        "Filter.precalcClean('" + choice + "')"
      );
      input_chk = document.createElement ('input');
      input_chk.type = 'checkbox';
      input_chk.value = choice;
      input_chk.className = 'check_filter';
      input_chk.setAttribute (
        'onchange',
        "Filter.filter('" + filter + "'," + choice + ')'
      );
      label = document.createElement ('label');
      label.innerHTML = choice;

      p_li.appendChild (input_chk);
      p_li.appendChild (label);

      temp_ul.appendChild (p_li);
    });
    temp_div.appendChild (temp_ul);
    filters_ctn.appendChild (temp_div);
  });
  lumen_bar = document.createElement ('div');
  lumen_bar.className = 'filter-bar';
  lumen_bar.innerHTML = 'lumens';
  lumen_caret = document.createElement ('div');
  lumen_caret.className = 'down-caret right';
  lumen_caret.setAttribute (
    'onclick',
    "Filter.rotateCaret(event,'lumens_filters')"
  );
  lumen_bar.appendChild (lumen_caret);
  lumen_div = document.createElement ('div');
  lumen_div.id = 'lumens_filters';
  lumen_div.style.display = 'block';
  lumen_ul = document.createElement ('ul');
  lumen_ul.style = 'list-style:none;padding-inline-start:20px';

  filters_ctn.appendChild (lumen_bar);

  this.filters.lumens.forEach (function (l) {
    p_li = document.createElement ('li');
    p_li.style = 'padding: 3px';
    p_li.setAttribute ('onmouseenter', "Filter.precalcFilter(event,'lumens')");
    p_li.setAttribute ('onmouseleave', "Filter.precalcClean('" + l + "')");
    input_chk = document.createElement ('input');
    input_chk.type = 'checkbox';
    input_chk.value = l;
    input_chk.className = 'check_filter';
    input_chk.setAttribute ('onchange', "Filter.filter('lumens','" + l + "')");
    label = document.createElement ('label');
    label.innerHTML = l;

    p_li.appendChild (input_chk);
    p_li.appendChild (label);

    lumen_ul.appendChild (p_li);
  });

  lumen_div.appendChild (lumen_ul);
  filters_ctn.appendChild (lumen_div);
};

//=================== RENDER SKUS =====================

//==========================================================
ProductFilter.prototype.renderSkus = function () {
  var that = this;

  prods = Object.keys (this.filtered_skus);
  sku_vector = [];

  prods.forEach (function (p) {
    keys = Object.keys (that.filtered_skus[p]);

    keys.forEach (function (key) {
      s = that.filtered_skus[p][key];
      s['name'] = products_data[p]['name'];
      s['seo'] = products_data[p]['seo'];
      s['id'] = p;
      sku_vector.push (s);
    });
  });

  this.sku_vector = sku_vector;
  this.paginate ();
};

//=================== Hover Show =====================

//==========================================================
ProductFilter.prototype.hoverShow = function (event, sku_id, id) {
  event.stopPropagation ();
  x_pos = event.pageX;
  y_pos = event.pageY;

  var element = document.getElementById (sku_id + '-pop');
  if (typeof element != 'undefined' && element != null) {
    return;
  }

  hover_div = document.createElement ('div');
  hover_div.id = sku_id + '-pop';
  hover_div.style.position = 'absolute';
  hover_div.style.left = x_pos + 10 + 'px';
  hover_div.style.top = y_pos + 10 + 'px';
  hover_div.style.color = 'white';
  hover_div.style.padding = '20px';
  hover_div.style.background = '#3b3b3b';

  sku = products_data[id]['skus'][sku_id];

  keys = Object.keys (sku);

  keys.forEach (function (k) {
    div = document.createElement ('div');
    label = document.createElement ('span');
    label.style =
      "font-weight:bold;font-size: 14px;font-family: 'Lato', arial sans-serif;color:#009639;";
    label.innerHTML = k + ': ';
    span = document.createElement ('span');
    span.innerHTML = sku[k];

    div.appendChild (label);
    div.appendChild (span);
    hover_div.appendChild (div);
  });

  document.body.appendChild (hover_div);
};

//=================== HOVER CLOSE =====================

//==========================================================
ProductFilter.prototype.hoverClose = function (sku_id) {
  event.stopPropagation ();
  element = document.getElementById (sku_id + 'pop');

  var element = document.getElementById (sku_id + '-pop');
  if (typeof element != 'undefined' && element != null) {
    element.parentNode.removeChild (element);
  }
};
//=================== ROTATE CARET =====================

//==========================================================
ProductFilter.prototype.rotateCaret = function (event, id) {
  el = event.target;

  el.className = el.className == 'down-caret right'
    ? 'open-caret right'
    : 'down-caret right';

  filters = document.getElementById (id);
  filters.style.display = filters.style.display == 'block' ? 'none' : 'block';
};

//=================== Precalc Filter =====================

//==========================================================
ProductFilter.prototype.precalcFilter = function (event, ftype) {
  var that = this;
  f = event.target;
  f = f.querySelector ('input');
  if (f.checked) {
    return;
  }
  f = f.value;

  id = ftype + '_filters';
  filter_change = document.getElementById (id);
  checks = filter_change.querySelectorAll ('.check_filter');

  this.active_filters[ftype] = [];
  checks.forEach (function (c) {
    if (c.checked) {
      that.active_filters[ftype].push (c.value);
      // console.log("current filters: ", c.value);
    }
  });

  this.active_filters[ftype].push (f);

  if (
    this.active_filters['products'].length > 0 ||
    this.active_filters['products'] != undefined
  ) {
    this.filterProducts (this.active_filters['products']);
  }
  //   if (this.active_filters["watts"].length > 0) {
  //     this.filterWatts(this.active_filters["watts"]);
  //   }
  //   if (this.active_filters["CCT"].length > 0) {
  //     this.filterCCT(this.active_filters["CCT"]);
  //   }

  this.temp_skus = {};
  keys = Object.keys (this.filtered_skus);
  keys.forEach (function (key) {
    that.temp_skus[key] = {};
    skus = Object.keys (that.skus[key]);
    skus.forEach (function (sku) {
      //here we do a triple condition check to see if this sku matches all filters
      // each flilter function immediately returns false if active filters is empty for flulter type
      // else do your check if sku matches filter criteria and return True or False
      watt = that.filterWatts (that.active_filters['watts'], key, sku);
      cct = that.filterCCT (that.active_filters['CCT'], key, sku);
      lumens = that.filterLumens (that.active_filters['lumens'], key, sku);

      if (watt && cct && lumens) {
        match = that.skus[key][sku];
        that.temp_skus[key][sku] = match;
      }
    });
  });
  this.filtered_skus = this.temp_skus;
  prods = Object.keys (this.filtered_skus);
  key_count = 0;
  prods.forEach (function (p) {
    keys = Object.keys (that.filtered_skus[p]);
    key_count += keys.length;
  });

  //add precalculated count to filter list item
  count_el = document.createElement ('strong');
  count_el.style = 'color:green;padding:5px';
  count_el.id = f + '-pop';
  count_el.innerHTML = '(' + key_count + ')';

  event.target.appendChild (count_el);
  event.target.style.background = '#f7f7f7';

  //removes last added active filter from hovering
  this.active_filters[ftype].pop ();
};

ProductFilter.prototype.precalcClean = function (id) {
  var element = document.getElementById (id + '-pop');
  if (element) {
    element.parentNode.style.background = '';
    if (typeof element != 'undefined' && element != null) {
      element.parentNode.removeChild (element);
    }
  }
};

ProductFilter.prototype.paginate = function () {
  products_list = document.getElementById ('products-container');
  skus = this.sku_vector;
  sku_count = skus.length;
  max_page = 15;

  btn_count = Math.ceil (sku_count / max_page);
  paginate_bar = document.getElementById ('paginator');

  paginate_bar.innerHTML = '';
  if (btn_count <= 1) {
    this.paginate_r (0, max_page);
    return;
  }

  paginate_bar.style =
    'margin-left:150px;margin-bottom:35px;display:grid;justify-self:center;justify-content:center;color:green;';

  low = 0;
  high = max_page;
  div_items = document.createElement ('div');
  for (i = 0; i < btn_count; i++) {
    pag_item = document.createElement ('span');

    pag_item.style = 'cursor:pointer;border: 1px solid green;padding:8px 15px;';
    pag_item.innerHTML = i + 1;
    pag_item.setAttribute (
      'onclick',
      'Filter.paginate_r(' + low + ',' + high + ')'
    );
    div_items.appendChild (pag_item);
    low += max_page;
    high += max_page;
  }
  paginate_bar.appendChild (div_items);
  this.paginate_r (0, max_page);
};

ProductFilter.prototype.paginate_r = function (low, high) {
  sku_arr = this.sku_vector.slice (low, high);
  products_container = document.getElementById ('products-container');
  products_container.innerHTML = '';

  result_controls = document.createElement ('div');
  result_controls.id = 'results-controls';
  products_container.appendChild (result_controls);

  sku_arr.forEach (function (s) {
    sku_block = document.createElement ('div');
    sku_block.className = 'sku-block';
    sku_block.dataset.sku = s['sku'];
    sku_block.dataset.id = s['id'];

    sku_block.style = 'display: inline-block;padding: 10px';

    //top blocl
    top_block = document.createElement ('div');
    top_block.style =
      'width:150px;border:1px solid #c7c7c7;display: inline-block;border-radius: 5px 5px 0 0;padding:20px;text-align: center';
    top_block.href = href =
      'https://www.maxlite.com/products/mpulse-area-lights';
    top_a = document.createElement ('div');
    top_a.setAttribute (
      'onmouseenter',
      "Filter.hoverShow(event,'" + s['sku'] + "','" + s['id'] + "')"
    );
    top_a.setAttribute (
      'onmouseleave',
      "Filter.hoverClose('" + s['sku'] + "')"
    );
    top_a.dataset.sku = s['sku'];

    top_a.dataset.id = s['id'];

    top_img = document.createElement ('img');
    top_img.src =
      'https://websvc.maxlite.com/api/products/images/item/' +
      s['sku'] +
      '?size=small';
    top_a.appendChild (top_img);

    top_prod_span = document.createElement ('span');

    top_prod_span.style = 'color:#009639;font-weight: bold;display:block';
    top_prod_span.innerHTML = s['name'];

    top_sku_span = document.createElement ('span');
    top_sku_span.innerHTML = s['sku'];

    top_block.appendChild (top_a);
    top_block.appendChild (top_prod_span);
    top_block.appendChild (top_sku_span);
    // bottom block
    bottom_block = document.createElement ('div');
    bottom_block.style =
      'margin:0;border:1px solid #c7c7c7;border-top:none;background:#e7e7e7';
    bottom_block.className = 'filter-interact-btns';

    prod_page = document.createElement ('div');
    prod_page.style =
      'text-align:center;cursor:pointer;border-bottom:1px solid #c7c7c7;width:175px;padding:7px';
    prod_page_link = document.createElement ('a');
    prod_page_link.href = 'https://www.maxlite.com/products/' + s['seo'];
    prod_page_link.style = 'color:#333;text-decoration: none;cursor:pointer;';
    prod_page_link.innerHTML = 'Product Family';
    prod_page.appendChild (prod_page_link);

    datasheet = document.createElement ('div');
    datasheet.style =
      'width:75px;display: inline-block;margin:0;padding:7px;border-right:1px solid #c7c7c7;text-align: center;cursor:pointer;background:#009639;';
    datasheet_link = document.createElement ('a');
    datasheet_link.href =
      'https://websvc.maxlite.com/apis/products/documents/datasheets/?itemno=' +
      s['sku'];
    datasheet_link.style =
      'color:#333;text-decoration: none;cursor:pointer;color:white';
    datasheet_link.innerHTML = 'Datasheet';

    datasheet.appendChild (datasheet_link);

    sku_page = document.createElement ('div');
    sku_page.style =
      'width:86px;display: inline-block;margin:0;padding:7px;text-align: center;background:#009639;';
    sku_page_link = document.createElement ('a');
    sku_page_link.href = '/products/' + s['seo'] + '/' + s['sku'];
    sku_page_link.style =
      'color:#333;text-decoration: none;cursor:pointer;color:white';
    sku_page_link.innerHTML = 'Sku Page';

    sku_page.appendChild (sku_page_link);

    bottom_block.appendChild (prod_page);
    bottom_block.appendChild (datasheet);
    bottom_block.appendChild (sku_page);

    // hover stats

    hover_stats = document.createElement ('div');
    hover_stats.className = 'hover-stats';

    lumen_div = document.createElement ('div');
    hover_lumens_label = document.createElement ('span');
    hover_lumens_label.innerHTML = 'lumens: ';
    hover_lumens_label.style = 'color:white;font-weight:bold;';
    hover_lumens = document.createElement ('span');
    hover_lumens.innerHTML = s['lumens'];
    hover_lumens.style = 'color:white;';
    lumen_div.appendChild (hover_lumens_label);
    lumen_div.appendChild (hover_lumens);

    watts_div = document.createElement ('div');
    hover_watts_label = document.createElement ('span');
    hover_watts_label.innerHTML = 'Watts: ';
    hover_watts_label.style = 'color:white;font-weight:bold;';
    hover_watts = document.createElement ('span');
    hover_watts.innerHTML = s['watts'];
    hover_watts.style = 'color:white;';
    watts_div.appendChild (hover_watts_label);
    watts_div.appendChild (hover_watts);

    hover_stats.appendChild (lumen_div);
    hover_stats.appendChild (watts_div);

    sku_block.appendChild (top_block);
    sku_block.appendChild (bottom_block);
    sku_block.appendChild (hover_stats);

    products_container.appendChild (sku_block);
  });

  result_count = document.createElement ('div');
  result_label = document.createElement ('strong');
  result_label.innerHTML = 'Results: ';
  result_val = document.createElement ('strong');
  result_val.style = 'color:green';

  result_val.innerHTML = this.sku_vector.length;
  result_count.appendChild (result_label);
  result_count.appendChild (result_val);

  result_controls = document.getElementById ('results-controls');
  result_controls.appendChild (result_count);
};
