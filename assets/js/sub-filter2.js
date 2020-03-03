SubFilter = function (data, filts) {
  this.temp_skus = {};
  this.subcat = id;
  this.filtered_skus = {};
  this.general_filters = filts;
  this.filters = {
    products: [],
  };

  this.page_low = 0;
  this.page_high = 20;
  this.active_filters = {
    products: [],
    Watts: [],
    Lumens: [],
    'Color Temp': [],
    'Color Rendering Index': [],
  };
  this.skus = {};
  this.sku_vector = [];
  this.prods = data;

  //   this.render (function () {
  //     this.prods.keys.array.forEach (function (key) {
  //       console.log ('key', key);
  //     });
  //   });
};
SubFilter.prototype.init = function () {
  this.genFilters ();
  this.getSkus ();

  this._maxLumen ();
  this._maxWatts ();
  this.renderFilters ();

  this.renderSkus ();
};

SubFilter.prototype.renderSkus = function () {
  products = Object.keys (this.filtered_skus);
  results = $ ('#prod-results');
  rcontrols = $ ('#result-controls');
  rcontrols.html ('');
  results.html ('');
  this.resultCount ();
  count = this.sku_vector.length;
  rcontrols.append (`
      <div>
       <label style="font-weight:bold"> Results: </label>
       <span style="color:green">${count}</span>
      </div>
    `);
  that = this;
  products.forEach (function (p) {
    skus = Object.keys (that.filtered_skus[p]);
    skus.forEach (function (s) {
      console.log (s);
      q = s.replace ('/', '');
      console.log (q);
      item = that.filtered_skus[p][s];
      console.log (item);
      htmlcont = '';
      htmlcont = `<div style="background:green" class="ui fluid popup hidden">`;
      fkeys = Object.keys (that.active_filters);
      fkeys.forEach (function (k) {
        htmlcont += `<span style=
        "color:white">${k}:${item[k]}</span>`;
      });
      htmlcont += '</div>';
      content = `<div class="column" style="margin:10px;padding:15px;border:1px solid #e7e7e7;border-radius:3px;width:200px" data-sku="${item['Sku']}" data-id="${p}">
          <img id="${s}" class="img-pop"  style="width:100px;margin:25px" src="https://websvc.maxlite.com/api/products/images/item/${item['Sku']}?size=small"/>
          <h4><a href="https://maxlite.com/products/${that.prods['products'][p]['seo']}">${that.prods['products'][p]['name']}</a></h4>
          <a href="https://maxlite.com/products/${that.prods['products'][p]['seo']}/${item['Sku']}">${item['Sku']}</a>
          </div>`;
      results.append (content);

      attContent = ``;
      atts = Object.keys (that.filters);
      atts.forEach (function (l) {
        if (
          l == 'Listings' ||
          item[l] == '' ||
          l == 'Available' ||
          l == 'In Transit' ||
          l == 'products'
        )
          return;
        attContent += `<span style="color:white;display:block"><strong style="font-size:16px">${l}:</strong>        ${item[l]}</span>`;
      });

      listContent = ``;
      lists = Object.keys (item['Listings']);
      lists.forEach (function (l) {
        if (item['Listings'][l] == '') return;
        listContent += `<span style="color:white;display:block"><strong style="font-size:16px">${l}:</strong>           ${item['Listings'][l]}</span>`;
      });
      $ (`#${s}`).popup ({
        lastResort: 'bottom left',
        hoverable: true,
        html: `<div style="padding:10px; width:300px">
                    <h3 style="color:white">Electrical</h3>
                    <hr>
                   ${attContent}
                    <h3 style="color:white">Listings</h3>
                    <hr>
                    ${listContent}
                    <h3 style="color:white">Inventory</h3>
                    <hr>
                    <span style="color:white;display:block"><strong style="font-size:16px">Available:</strong> ${item['Available']}</span>
                    <span style="color:white;display:block"><strong style="font-size:16px">In Transit:</strong> ${item['In Transit']}</span>
            </div>`,
        position: 'bottom left',
        delay: {
          show: 100,
          hide: 100,
        },
      });
    });
  });
};
SubFilter.prototype.renderProds = function (id, event) {
  console.log (id);
  prods = this.prods['products'];
  console.log ('Product: ', prods[id]['name']);
  results = $ ('#prod-results');
  if (event.target.checked) {
    var prod_ids = Object.keys (prods[id]['skus']);
    prod_ids.forEach (function (key) {
      p = prods[id]['skus'][key];
      console.log ('p: ', p);

      content = `<div class="column ${prods[id]['seo']}">
            <img style="width:100px" src="https://websvc.maxlite.com/api/products/images/item/${p['Sku']}?size=small"/>
            <h4><a href="https://maxlite.com/products/${prods[id]['name']}">${prods[id]['name']}</a></h4>
            <a href="https://maxlite.com/products/${prods[id]['name']}/${p['Sku']}">${p['Sku']}</a>
            </div>`;

      results.append (content);
    });
  } else {
    c = $ ('#prod-results')
      .find (`.${this.prods['products'][id]['seo']}`)
      .remove ();
    // c.forEach (function (el) {
    //   el.remove ();
    // });
  }
};

SubFilter.prototype.getProducts = function () {
  prods = [];
  that = this;
  keys = Object.keys (this.prods['products']);
  console.log (keys);
  keys.forEach (function (p) {
    prod = that.prods['products'][p];
    name = prod.name;
    prods.push ({id: p, name: name});
  });
  return prods;
};

//=================== GET SKUS =====================

//==========================================================
SubFilter.prototype.getSkus = function () {
  var that = this;
  //create keys
  products = Object.keys (this.prods['products']);

  products.forEach (function (p) {
    console.log ('stud:', p);
    that.skus[p] = {};
    that.filtered_skus[p] = {};
  });

  products.forEach (function (p) {
    console.log ('stud:', that.prods['products'][p]);
    that.skus[p] = that.prods['products'][p]['skus'];
    that.filtered_skus[p] = that.prods['products'][p]['skus'];
  });

  prods = Object.keys (this.filtered_skus);
  sku_vector = [];

  prods.forEach (function (p) {
    keys = Object.keys (that.filtered_skus[p]);

    keys.forEach (function (key) {
      s = that.filtered_skus[p][key];

      sku_vector.push (s);
    });
  });
  this.sku_vector = sku_vector;
};

/**
   *
   * This is a function that determines which filters will be showing in the filter panel
   *
   */

SubFilter.prototype.getFilters = function () {
  var that = this;
  this.filters.products = this.getProducts ();

  filters_names = Object.keys (this.filters);
  filters_names.forEach (function (filter) {
    if (filter == 'Watts' || filter == 'Lumens') {
      return;
    }
    filter_set = new Set ();

    that.filters.products.forEach (function (product) {
      if (typeof product === 'undefined') {
        return;
      }
      items = that.prods['products'][product.id]['skus'];
      keys = Object.keys (items);
      keys.forEach (function (i) {
        //if filetset alreadt has this choice return
        // if (filter_set.has (items[i][filter])) {
        //   return;
        // }
        //else add choice to filter set and to filter options

        if (filter == 'Listings') {
          kys = Object.keys (items[i][filter]);

          kys.forEach (function (k) {
            if (items[i][filter][k] == '') return; //dont add if filter has no value
            filter_set.add (k);
          });

          return;
        }
        filter_set.add (items[i][filter]);
      });
    });

    filter_set.forEach (function (f) {
      if (f == '') return;
      that.filters[filter].push (f);
    });

    that.filters[filter].sort ();
  });
};
SubFilter.prototype.renderFilters = function () {
  this.getFilters ();
  acc = $ ('#prod-accord');
  that = this;
  keys = Object.keys (this.prods['products']);

  title = `
          <div class="title" style="color:#009639;">
            <i class="dropdown icon"></i>
            Products
          </div>
          <div class="content active" id="products-checks">
    
          </div>`;
  acc.append (title);
  keys.forEach (function (key) {
    subcat = that.prods['products'][key];

    content = `<div style="" class="field">
              <div class="ui checkbox" onmouseenter="sf.precalcFilter(event,'products')" onmouseleave="sf.precalcClean('${key}')" style="padding:5px">
            <input type="checkbox" value="${key}" class="check-filter" onchange="sf.filter('products', '${key}')"tabindex="0" class="hidden">
            <label style="display:inline-block">${subcat['name']}</label>
              </div>
              </div>
              `;
    $ (`#products-checks`).append (content);

    // sub_cat = Object.keys (cat['products']);
    // checkCT = document.createElement ('div');
    acc.append (`<div id="${subcat['seo']}-checks"class="content"></div>`);
    // sub_cat.forEach (function (subkey) {
    //   prod = that.prods[key];
    // });
  });
  // The rest of the filters checked here
  f_keys = Object.keys (this.filters);

  f_keys.forEach (function (f) {
    if (f != 'products') {
      title = `
            <div class="title" style="color:#009639;">
              <i class="dropdown icon"></i>
              ${f}
            </div>
            <div class="content active" id="${f.replace (/ /g, '-')}-checks">
            </div>`;

      acc.append (title);
      that.filters[f].forEach (function (key) {
        content = `<div style="margin:5px;" class="field">
            <div class="ui checkbox" onmouseenter="sf.precalcFilter(event,'${f}')" onmouseleave="sf.precalcClean('${key}')" style="padding:5px">
          <input type="checkbox" value="${key}"class="check-filter" onchange="sf.filter('${f}','${key}')"tabindex="0" class="hidden">
          <label style="display:inline-block">${key}</label>
            </div>
            </div>
            `;
        $ (`#${f.replace (/ /g, '-')}-checks`).append (content);
      });
    }
  });
};

//=================== FILTER PRODUCTS =====================

//==========================================================
SubFilter.prototype.filterProducts = function (keys) {
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
     * @param {string[]} filters- array of listing values to filter for (eg. ['ul','dlc'])
     * @param {string} type - filter type
     * @param {string} key - Product ID used to prefilter set of skus (eg. 4682)
     * @param {string} sku - Product SKU that is a child of Prooduct ID, use to retrieve Sku to check against (eg. MP-AR100HT3-50B)
     * 
     * @return {boolean} - Returns true if at least one CCT value matches the sku's lumen value
     *
     * @example
     *
     *     filterAny(['dlc','ul'], 'Listings','4682', 'MP-AR100HT3-50B')
     */
SubFilter.prototype.filterAny = function (filters, type, key, sku) {
  that = this;
  // 4 Types of Filter, Regular, Binary, and range value
  if (filters.length < 1) return;
  sku = that.skus[key][sku];

  //if Binary
  if (sku[type] == 'Y' || sku[type] == 'N') {
    for (var i = 0; i < filters.length; i++) {
      if (filters[i] == sku[type]) {
        return true;
      }
    }
    return false;
    // if Listing
  } else if (typeof sku[type] === 'object' && sku[type] !== null) {
    console.log ('Type: Listing');
    for (var i = 0; i < filters.length; i++) {
      if (sku[type][filters[i]]) {
        return true;
      }
    }
    return false;
    //if range
  } else if (type == 'Lumens' || type == 'Watts') {
    for (var i = 0; i < filters.length; i++) {
      split = filters[i].split ('-');
      low = split[0];
      high = split[1];
      //checks if sku falls within range
      if (skus[type] >= low && skus[type] <= high) {
        return true;
      }
    }
    return false;
  } else {
    // console.log ('Type: Regular');
    for (var i = 0; i < filters.length; i++) {
      if (filters[i] == sku[type]) {
        // console.log ('fy:', filters[i]);
        // console.log ('sy:', sku[type]);
        return true;
      }
    }
    return false;
  }
};

/**
   *
   * This is a function updates the active filters and then calls all the individual filters functions(lumens, watts,cct, listing...) one one sku at a time
   * then it determines the skus that match and re-renders the product skus visible on the page
   *
   * @param {string[]} ftype - 
   *
   * @example
   *
   *     filter('products')
   */
SubFilter.prototype.filter = function (ftype) {
  var that = this;
  f = ftype + '-checks';
  f = f.replace (/ /g, '-');
  filter_change = document.getElementById (f);
  checks = filter_change.querySelectorAll ('.check-filter');
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
    console.log ('not undefined');
  } else {
    this.filtered_skus = this.skus;
    console.log ('defined');
  }

  //   if (this.active_filters["watts"].length > 0) {
  //     this.filterWatts(this.active_filters["watts"]);
  //   }
  //   if (this.active_filters["CCT"].length > 0) {
  //     this.filterCCT(this.active_filters["CCT"]);
  //   }

  this.temp_skus = {};
  keys = Object.keys (this.filtered_skus);
  f_keys = Object.keys (this.filters);
  keys.forEach (function (key) {
    that.temp_skus[key] = {};

    skus = Object.keys (that.skus[key]);
    skus.forEach (function (sku) {
      keep = false;
      f_keys.forEach (function (k) {
        if (k == 'products') return;

        f = that.filterAny (that.active_filters[k], k, key, sku);
        if (f) {
          keep = true;
        }
      });
      if (keep) {
        match = that.skus[key][sku];
        that.temp_skus[key][sku] = match;
      }
    });
  });

  this.filtered_skus = this.temp_skus;
  //   prod_containter = document.getElementById ('products-container');
  //   prod_containter.innerHTML = '';
  $ ('#prod-results').html ('');
  this.renderSkus ();
};

SubFilter.prototype.precalcFilter = function (event, ftype) {
  var that = this;
  f = event.target;
  f = f.querySelector ('input');
  if (f.checked) {
    return;
  }
  inputVal = f.value;
  f = f.value;

  id = `${ftype.replace (/ /g, '-')}-checks`;

  filter_change = document.getElementById (id);
  checks = filter_change.querySelectorAll ('.check-filter');

  this.active_filters[ftype] = [];
  checks.forEach (function (c) {
    if (c.checked) {
      that.active_filters[ftype].push (c.value);
    }
  });

  this.active_filters[ftype].push (f);

  if (
    this.active_filters['products'].length > 0 ||
    this.active_filters['products'] != undefined
  ) {
    this.filterProducts (this.active_filters['products']);
  }

  this.temp_skus = {};
  keys = Object.keys (this.filtered_skus);
  f_keys = Object.keys (this.filters);

  keys.forEach (function (key) {
    that.temp_skus[key] = {};
    skus = Object.keys (that.skus[key]);
    skus.forEach (function (sku) {
      keep = false;
      f_keys.forEach (function (k) {
        if (k == 'products') return;
        f = that.filterAny (that.active_filters[k], k, key, sku);
        //fuck ok we need to somehow
        if (f) {
          keep = true;
        }
      });
      if (keep) {
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
  count_el.id = inputVal + '-pop';
  count_el.innerHTML = '(' + key_count + ')';

  event.target.appendChild (count_el);
  event.target.style.background = '#f7f7f7';

  //removes last added active filter from hovering
  this.active_filters[ftype].pop ();
};

SubFilter.prototype.precalcClean = function (id) {
  var element = document.getElementById (id + '-pop');
  if (element) {
    element.parentNode.style.background = '';
    if (typeof element != 'undefined' && element != null) {
      element.parentNode.removeChild (element);
    }
  }
};

/*
   * Creates a sku vector that lets us count how many skus we have as aresult after a filter event
  */
SubFilter.prototype.resultCount = function () {
  prods = Object.keys (this.filtered_skus);
  sku_vector = [];

  prods.forEach (function (p) {
    keys = Object.keys (that.filtered_skus[p]);

    keys.forEach (function (key) {
      s = that.filtered_skus[p][key];

      sku_vector.push (s);
    });
  });

  this.sku_vector = sku_vector;
};

/**
   * Calculates appropriate Lumnen ranges based on largest lumen value found from all skus
   *
   */

SubFilter.prototype._maxLumen = function () {
  maxL = 0;
  //   console.log (this.sku_vector.length);
  for (var i = 0; i < this.sku_vector.length; i++) {
    // console.log ('lumen: ', this.sku_vector[i]['Lumens']);
    if (this.sku_vector[i]['Lumens'] > maxL) {
      maxL = this.sku_vector[i]['Lumens'];
    }
  }
  //   console.log ('Max Lumen Outpute: ', maxL);
  //   console.log ('Max Lumen Outpute: ', Math.ceil (maxL / 1000) * 1000);
  if (maxL > 30001 && maxL <= 50000) {
    this.filters['Lumens'] = [
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
    ];
  } else if (maxL >= 20000 && maxL < 30000) {
    this.filters['Lumens'] = [
      '0-5000',
      '5001-10000',
      '10001-15000',
      '15001-20000',
      '20001-25000',
      '25001-30000',
    ];
  } else if (maxL > 10000 && maxL <= 20000) {
    this.filters['Lumens'] = [
      '0-5000',
      '5001-10000',
      '10001-15000',
      '15001-20000',
    ];
  } else if (maxL > 5000 && maxL <= 10000) {
    this.filters['Lumens'] = ['0-2500', '2501-5000', '5001-7500', '7501-10000'];
  } else if (maxL > 1000 && maxL <= 5000) {
    this.filters['Lumens'] = [
      '0-1000',
      '1001-2000',
      '2001-3000',
      '3001-4000',
      '4001-5000',
    ];
  } else if (maxL <= 1000) {
    this.filters['Lumens'] = ['0-250', '251-500', '501-750', '751-1000'];
  } else {
    console.log ('no results?:', ' l:', maxL);
  }
};

SubFilter.prototype._maxWatts = function () {
  maxW = 0;
  this.filters['Watts'] = [];
  for (var i = 0; i < this.sku_vector.length; i++) {
    if (this.sku_vector[i]['Watts'] > maxW) {
      maxW = this.sku_vector[i]['Watts'];
    }
  }

  if (maxW > 500 && maxW <= 1000) {
    this.filters['Watts'] = [
      '0-100',
      '101-200',
      '201-300',
      '301-400',
      '401-500',
      '501-600',
      '601-700',
      '701-800',
      '801-900',
      '901-1000',
    ];
  } else if (maxW > 250 && maxW <= 500) {
    this.filters['Watts'] = [
      '0-100',
      '101-200',
      '201-300',
      '301-400',
      '401-500',
    ];
  } else if (maxW > 100 && maxW <= 250) {
    this.filters['Watts'] = ['0-50', '51-100', '101-150', '151-200', '201-250'];
  } else if (maxW > 50 && maxW <= 100) {
    this.filters['Watts'] = ['0-20', '21-40', '41-60', '61-80', '81-100'];
  } else if (maxW <= 50) {
    this.filters['Watts'] = ['0-10', '11-20', '21-30', '31-40', '41-50'];
  }
};

SubFilter.prototype.genFilters = function () {
  keys = Object.keys (this.prods['products']);

  that = this;
  filter_g = new Set ();
  finalSet = new Set ();
  keys.forEach (function (k) {
    filter_g.add (that.prods['products'][k]['filters']);
    filter_g.add (that.prods['products'][k]['options']);
  });

  filter_g.forEach (function (f) {
    //filter or option is null
    if (f == 0) return;
    f_arr = that.general_filters[f];

    f_arr.forEach (function (a) {
      finalSet.add (a);
    });
  });
  finalSet = Array.from (finalSet);
  finalSet.forEach (function (f) {
    that.filters[f] = [];
    that.active_filters[f] = [];
  });
};
