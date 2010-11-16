//
// Crash Course
//

var tpl = new Ext.XTemplate('<div>Hello {entity}</div>');

tpl.append(Ext.getBody(), {entity: 'World'});

// '<div>Hello World</div>'



//
// Member Functions
//

var tpl = new Ext.XTemplate(
    '<div class="{[ this.memberClass(values) ]}">',
        '{name:this.formatName}',
    '</div>',
    '<tpl if="this.isChild(age)">',
        '<div>You must be accompanied by an adult</div>',
    '</tpl>',
    {
        memberClass: function(values) {
            return values.isMember ? 'member' : '';
        },
        formatName: function(name) {
            return name.toUpperCase();
        },
        isChild: function(age) {
            return age < 18;
        }
    }
);

tpl.append(Ext.getBody(), {name: 'James Brantly', age: 25, isMember: true});


//
// Subtemplates
//

var characterNameTpl = new Ext.XTemplate(
    '<span class="characterName">',
        '{name} ({level} {class})',
    '</span>'
);

var friendsListTpl = new Ext.XTemplate(
    '<ol>',
    '<tpl for=".">',
        '<li>{[ this.renderCharacterName(values) ]}</li>',
    '</tpl>',
    '</ol>',
    {
        renderCharacterName: function(values) {
            return characterNameTpl.apply(values);
        }
    }
);

friendsListTpl.append(Ext.getBody(), [
    {name: 'Daffy', level: 12, 'class': 'Rogue'},
    {name: 'Donald', level: 32, 'class': 'Wizard'}
]);

//
// Subtemplate manager
//

Ext.XTemplate.prototype.applySubtemplate = function(name, obj) {
    return Ext.XTemplate.subs[name].apply(obj);
};

Ext.XTemplate.registerSubtemplate = function(name, tpl) {
    Ext.XTemplate.subs = Ext.XTemplate.subs || {};
    Ext.XTemplate.subs[name] = tpl;
};

////

Ext.XTemplate.registerSubtemplate(
    'characterName',
    new Ext.XTemplate(
        '<span class="characterName">',
            '{name} ({level} {class})',
        '</span>'
    )
);

var friendsListTpl = new Ext.XTemplate(
    '<ol>',
    '<tpl for=".">',
        '<li>{[ this.applySubtemplate("characterName", values) ]}</li>',
    '</tpl>',
    '</ol>'
);

friendsListTpl.append(Ext.getBody(), [
    {name: 'Daffy', level: 12, 'class': 'Rogue'},
    {name: 'Donald', level: 32, 'class': 'Wizard'}
]);

//
// Recursive templates
//

var crumbTpl = new Ext.XTemplate(
    '<tpl if="parentRef">',
        '{[ this.recurse(values) ]} &gt; ',
    '</tpl>',
    '{name}',
    {
        recurse: function(values) {
            return this.apply(values.parentRef);
        }
    }
);

// Grandparent > Parent > Child

crumbTpl.append(Ext.getBody(), {
    name: 'Child',
    parentRef: {
        name: 'Parent',
        parentRef: {
            name: 'Grandparent',
            parentRef: null
        }
    }
});

//
// List layout
//

Ext.XTemplate.prototype.preGroupString =
    function(xindex, groupCount, str) {
        return xindex == 1 || xindex % groupCount == 1 ? str : "";
    };

Ext.XTemplate.prototype.postGroupString =
    function(xindex, xcount, groupCount, str) {
        return xindex == xcount || xindex % groupCount == 0 ? str : "";
    };

var layoutTpl = new Ext.XTemplate(
    '<tpl for=".">',
        '{[ this.preGroupString(xindex, 2, "<div class=\\"group\\">") ]}',
        '<div class="item"></div>',
        '{[ this.postGroupString(xindex, xcount, 2, "</div>") ]}',
    '</tpl>'
);

// <div class="group">
//     <div class="item"></div>
//     <div class="item"></div>
// </div>
// <div class="group">
//     <div class="item"></div>
// </div>


layoutTpl.append(Ext.getBody(), [0, 0, 0]);

