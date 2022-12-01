 const deleteProduct = (btn)=>{
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    // console.log(productId);
    const productElement = btn.closest("article");
    fetch(`/admin/product/${productId}`,{
        method:"DELETE"
    }).then(response=>{
        console.log("RESPONSE",response);
        return response.json();
    })
    .then(data=>{
        console.log('DATA',data, productElement);
        productElement.parentNode.removeChild(productElement); //for IE
        // productElement.remove();
    })
    .catch(e=> console.log(e))
 }