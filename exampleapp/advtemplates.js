Ext.onReady(function() {

    var productTpl = new Ext.XTemplate(
        '<div class="product">',
            '<span class="name">{name}</span>',
            '<span class="price {[ this.saleClass(values) ]}">{price:usMoney}</span>',
            '<div class="desc">{desc}</div>',
        '</div>',
        {
            compiled: true,
            saleClass: function(values) {
                return values.sale ? 'sale' : '';
            }
        }
    );
    
    var productsTpl = new Ext.XTemplate(
        '<tpl for=".">',
            '{[ this.preGroupString(xindex, 3, "<div class=\\"group\\">") ]}',
            '{[ this.renderProduct(values) ]}',
            '{[ this.postGroupString(xindex, xcount, 3, "</div>") ]}',
        '</tpl>',
        {
            renderProduct: function(values) {
                return productTpl.apply(values);
            }
        }
    );
    
    var categoriesTpl = new Ext.XTemplate(
        '<tpl for=".">',
            '<span class="category">- {name}</span>',
            '<div class="children">',
                '{[ this.recurse(values) ]}',
            '</div>',
        '</tpl>',
        {
            compiled: true,
            recurse: function(values) {
                if (values.children && values.children.length) {
                    return this.apply(values.children);
                }
                return '';
            }
        }
    );

    var productData = [{
        name: 'Product A',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 1.99,
        sale: true
    },{
        name: 'Product B',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 6.99
    },{
        name: 'Product C',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 19.99
    },{
        name: 'Product D',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 14.99
    },{
        name: 'Product E',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 4.99,
        sale: true
    },{
        name: 'Product F',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 49.99
    },{
        name: 'Product G',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 4.99
    }];
    
    var categoryData = [{
        name: 'Toys',
        children: [{
            name: 'Infant'
        },{
            name: 'Preschool'
        }]
    },{
        name: 'Books',
        children: [{
            name: 'Fiction',
            children: [{
                name: 'Mystery'
            },{
                name: 'Sci-fi'
            }]
        },{
            name: 'Non-fiction',
            children: [{
                name: 'Biographies'
            }]
        }]
    },{
        name: 'Electronics'
    }];
    
    Ext.XTemplate.prototype.preGroupString = function(xindex, groupCount, str) {
        return xindex == 1 || xindex % groupCount == 1 ? str : "";
    };
    
    Ext.XTemplate.prototype.postGroupString = function(xindex, xcount, groupCount, str) {
        return xindex == xcount || xindex % groupCount == 0 ? str : "";
    };
    
    var categories = new Ext.BoxComponent({
        cls: 'categories',
        width: 200,
        html: categoriesTpl.apply(categoryData)
    });
    
    var products = new Ext.DataView({
        cls: 'productlist',
        flex: 1,
        tpl: productsTpl,
        store: new Ext.data.JsonStore({
            fields: ['name', 'desc', 'price', 'sale'],
            data: productData
        }),
        itemSelector: '.product'
    });
    
    var main = new Ext.Container({
        layout: {
            type: 'hbox',
            align: 'top'
        },
        items: [categories, products]
    });
    
    var details = new Ext.BoxComponent({
        cls: 'details',
        tpl: productTpl
    });
    
    var card = new Ext.Container({
        layout: 'card',
        renderTo: 'content',
        activeItem: 0,
        items: [main, details]
    });
    
    products.on('click', function(dv, index, node) {
        var record = dv.getStore().getAt(index);
        details.update(record.data);
        card.getLayout().setActiveItem(details);
    });
    
    Ext.fly('header').on('click', function() {
        card.getLayout().setActiveItem(main);
    });
    
});