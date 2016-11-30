/*
    templates.js
    This file contains reusable HTML templates that can be dynamically inserted
    into the DOM.
*/


var templates = {
    product: _.template("".concat(
        '<div data-product="<%= productName %>" class="product">',
            '<div class="productImageContainer">',
                '<div class="productCart">',
                    '<div class="cartButton add">Add</div>',
                    '<div class="cartButton remove">Remove</div>',
                '</div>',
                '<img class="productImage" src="<%- productImage %>">',
                '<div class="productPrice">$<%- productPrice %></div>',
            '</div>',
            '<div class="productName"><%- productName %></div>',
        '</div>'    
    )),
    
    cartEntry: _.template("".concat(
        '<tr data-product="<%= productName %>" class="">',
            '<td><%- productName %></td>',
            '<td>',
                '<span class="cartQuantity"><%- productQuantity %></span>',
                ' ',
                '<span class="modalCartButton add">+</span>',
                '<span class="modalCartButton remove">-</span>',
            '</td>',
            '<td>',
                '$<span class="productTotal"><%- productPrice %></span>',
            '</td>',
        '</tr>'
    ))
};