var user;
const client = stitch.Stitch.initializeDefaultAppClient("bankingdogs-ukaex");

(async ()=>{
    user = await client.auth.loginWithCredential(new stitch.AnonymousCredential());
     
})()

const userAction = async () =>
{
    console.log("IN USER ACTION");

    let cust = await document.getElementById('myInput').value;
    let txt = "";
    let account_txt = "";
    let img = "dog.png";
   
    console.log(cust);
      
    const resp = await axios({
        url: 'https://realm.mongodb.com/api/client/v2.0/app/bankingdogs-ukaex/graphql',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${user.auth.activeUserAuthInfo.accessToken}`
        },
        data: {
            variables: {cust},
            query :`
             query ($cust: String) {
                  customer(query:{name:$cust}) {
                    name
                    email
                    address
                    accounts{
                        account_id
                        products
                    }  
                  }
                  DogAndQuote {
                    author
                    dogImage
                    quote
                  }   
                }
                `
            }
        });            
       
       
        console.log(resp);

        // IF DOG QUOTE IS HIT
        if (resp.data.data.DogAndQuote){
            txt = `${resp.data.data.DogAndQuote.quote}<br><br> 
            
            -  ${resp.data.data.DogAndQuote.author}`;
        img = resp.data.data.DogAndQuote.dogImage;
       }

     //   IF ACCOUNTS HIT
        if (resp.data.data.customer.accounts){
            let accounts_array = resp.data.data.customer.accounts;
            if (accounts_array.length !== 0) {
                console.log("Length of array is: " + accounts_array.length);
            let i =0;
            let j = 0;
            //ITERATE THROUGH ACCOUNTS
                for (i= 0; i < accounts_array.length; i++) {
                    account_txt += 
                    `<div class="card-deck">
                    
                        <div class="card" style="width: 6rem;">
                        <div class="card-body">
                        <h4 class="card-title" style="background-color:#ffffa1;"><b>
                            Account ID: ${accounts_array[i].account_id}</b></h4>
                        <hr>`;
                   console.log("Number of products: " + accounts_array[i].products.length);
                   // ITERATE THROUGH PRODUCTS
                    if (accounts_array[i].products.length != 0){
                        for (j= 0; j < accounts_array[i].products.length; j++) {
                            console.log(accounts_array[i].products[j]);
                            account_txt += `<h4 class="card-text"> &nbsp &nbsp ${accounts_array[i].products[j]}</h4>`
                        }
                    }
                account_txt += `</div></div></div><br>`;
                }
            }
        }


    document.getElementById("quote").innerHTML = txt;
    
    document.getElementById("accounts").innerHTML = account_txt;

   
    let name = resp.data.data.customer.name;
    let email = resp.data.data.customer.email;
    let address = resp.data.data.customer.address;
    document.getElementById("first-image").innerHTML = `<img src=${img} class="img-fluid " height:300px;>`;
    let first_txt = `<b><h2>${name}</h2></b><br><h4>Email: ${email} </h4><br>
        <h4>Address: ${address} </h4><br><br>`;

    document.getElementById("first-description").innerHTML = first_txt;    
}
