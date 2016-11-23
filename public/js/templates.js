/*
    templates.js
    This file contains reusable HTML templates that can be dynamically inserted
    into the DOM.
*/


var templates = {    
    product: function (props) {
        /* Create nodes */
        
        var product = document.createElement("div");
        product.setAttribute("class", "product");
        product.setAttribute("data-product", props.productName);
        
        var productImageContainer = document.createElement("div");
        productImageContainer.setAttribute("class", "productImageContainer");
        
        var productCart = document.createElement("div");
        productCart.setAttribute("class", "productCart");
        
        var cartButtonAdd = document.createElement("div");
        cartButtonAdd.setAttribute("class", "cartButton add");
        cartButtonAdd.appendChild(document.createTextNode("Add"));
        
        var cartButtonRemove = document.createElement("div");
        cartButtonRemove.setAttribute("class", "cartButton remove");
        cartButtonRemove.appendChild(document.createTextNode("Remove"));
        
        var productImage = document.createElement("img");
        productImage.setAttribute("class", "productImage");
        productImage.setAttribute("src", props.productImage);
        
        var productPrice = document.createElement("div");
        productPrice.setAttribute("class", "productPrice");
        productPrice.appendChild(document.createTextNode("$" + props.productPrice));
        
        var productName = document.createElement("div");
        productName.setAttribute("class", "productName");
        productName.appendChild(document.createTextNode(props.productName));
        
        /* Link nodes together */
        
        product.appendChild(productImageContainer);
        productImageContainer.appendChild(productCart);
        productCart.appendChild(cartButtonAdd);
        productCart.appendChild(cartButtonRemove);
        productImageContainer.appendChild(productImage);
        productImageContainer.appendChild(productPrice);
        product.appendChild(productName);
        
        return product;
    },
    
    cartEntry: function (props) {
        /* Create nodes */
        
        var tableRow = document.createElement("tr");
        tableRow.setAttribute("data-product", props.productName);
        
        var cell1 = document.createElement("td");
        cell1.appendChild(document.createTextNode(props.productName));
        
        var cell2 = document.createElement("td");
        
        var cartQty = document.createElement("span");
        cartQty.setAttribute("class", "cartQuantity");
        cartQty.appendChild(document.createTextNode(props.productQuantity));
        
        var modalCartButtonAdd = document.createElement("span");
        modalCartButtonAdd.setAttribute("class", "modalCartButton add");
        modalCartButtonAdd.appendChild(document.createTextNode("+"));
        
        var modalCartButtonRemove = document.createElement("span");
        modalCartButtonRemove.setAttribute("class", "modalCartButton remove");
        modalCartButtonRemove.appendChild(document.createTextNode("-"));
        
        var cell3 = document.createElement("td");
        
        var productTotal = document.createElement("span");
        productTotal.setAttribute("class", "productTotal");
        productTotal.appendChild(document.createTextNode(props.productPrice));
        
        /* Link nodes together */
        
        tableRow.appendChild(cell1);
        tableRow.appendChild(cell2);
        cell2.appendChild(cartQty);
        cell2.appendChild(document.createTextNode(" "));
        cell2.appendChild(modalCartButtonAdd);
        cell2.appendChild(modalCartButtonRemove);
        tableRow.appendChild(cell3);
        cell3.appendChild(document.createTextNode("$"));
        cell3.appendChild(productTotal);

        return tableRow;
    },
};