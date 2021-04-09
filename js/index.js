const app ={
    //data
    data:{
        productsData:[],//全部產品資料
        orderData:[],//購物車資料
        slectProductData:'全部',
        productsListStr:'',
        token:'31kuk1X27zgnWA862m0er6hbrwm1',//後台key
    },
    //methods
    //目標
    //篩選購物車種類
    //取得購物車清單
    //把產品加入購物車
    //刪除購物車的東西
    //客戶資料驗證
    //送出客戶資料給後台
    sendUserData(){//送出客戶資料
        const url='https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/orders';
        const userName=document.querySelector('#userName');
        const userPhone=document.querySelector('#userPhone');
        const userEmail=document.querySelector('#userEmail');
        const userAddress=document.querySelector('#userAddress');
        const userPay=document.querySelector('#userPay');
        axios.post(url,{
            "data": {
                "user": {
                  "name": userName.value,
                  "tel":  userPhone.value,
                  "email": userEmail.value,
                  "address": userAddress.value,
                  "payment": userPay.value,
                }
            }
        }).then(res=>{
            userName.value='';
            userPhone.value='';
            userEmail.value='';
            userAddress.value='';
            userPay.value='';
            swal("已送出訂單", "感謝您的訂購", "success");
            this.getCartData();
        }).catch(err=>{
            console.log(err);
        })
    },
    checkForm(){//檢查表單內容
        const constraints = {
            "姓名": {
                presence:{
                    allowEmpty: false,//不可以空白
                    message:"必填",
                },
            },
            "電話": {
                presence:{
                    allowEmpty: false,
                    message:"必填"
                },
            },
            "Email": {
                presence:{message:"必填"},
                email: true,//email格式需正確
            },
            "寄送地址":{
                presence:{
                    allowEmpty: false,
                    message:"必填"
                },
            },
            "交易方式":{
                presence:{message:"必填"},
            }
        };
        const form=document.querySelector('.userForm');
        const sendOrder=document.querySelector('.sendOrder');
        const inputs=document.querySelectorAll("#userName,#userPhone,#userEmail,#userAddress,#userPay");
        sendOrder.addEventListener('click',()=>{//送出訂單按鈕
            const err =validate(form,constraints);
            if(err){//檢查表單是否有錯誤
                Object.keys(err).forEach(item=>{
                 document.querySelector(`.${item}`).textContent=err[item];
                 swal("訂單輸入錯誤", "請重新輸入", "error");
                })
             }else if(this.data.orderData.length===0){//檢查購物車是否有選購
                swal("購物車內沒有東西", "請重新選購", "error");
             }
             else {
                this.sendUserData();
             }
        });
        inputs.forEach(item=>{//input
            item.addEventListener('change',()=>{
                item.nextElementSibling.textContent='';
                const err =validate(form,constraints);
                if(err){
                   Object.keys(err).forEach(item=>{
                    document.querySelector(`.${item}`).textContent=err[item];
                   })
                }
            });
        })
    },
    removeAllCart(){//刪除全部購物車訂單
        const url ='https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/carts'
        axios.delete(url)
        .then(res=>{
            this.getCartData();
        }).catch(err=>{
            console.log(err.response);
        })
    },
    removeCart(e){//刪除指定的購物車訂單
        e.preventDefault();
        const cartId= e.target.dataset.id;//購物車產品訂單id
        const productId=e.target.dataset.productid//產品id
        const url=`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/carts/${cartId}`
        axios.delete(url)
        .then(res=>{
            this.data.orderData=res.data.carts;
            this.getCartData();
        }).catch(err=>{
            console.log(err);
        })
    },
    addCart(id,vm){//產品加入購物車
        const url='https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/carts';
        let productNum = 1;
        vm.data.orderData.forEach(item=>{
            if(item.product.id===id){
                productNum += item.quantity;
            }
        })
        axios.post(url,{
                "data": {
                  "productId":id,  
                  "quantity":productNum,
                }
        }).then(res=>{  
            swal("訂單成立", "歡迎再次下單", "success");
            vm.getCartData();
        }).catch(err=>{
            console.log(err.response);
        })
    },
    plusCart(e,index){//修改產品數量++
       const url='https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/carts';
       const id = this.data.orderData[index].id;
       axios.patch(url,
        {
            "data": {
              "id": id,
              "quantity":++this.data.orderData[index].quantity,
            }
        }
       ).then(res=>{
           this.getCartData();
       }).catch(err=>{
           console.log(err);
       })
    },
    minusCart(e,index){//修改產品數量--
        const url='https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/carts';
        const id = this.data.orderData[index].id;
        if(this.data.orderData[index].quantity===1){//檢查當前產品數量是否等於1防止-1
            swal("產品數量有誤", "請重新確認","warning");
        }else{
            axios.patch(url,
                {
                    "data": {
                      "id": id,
                      "quantity":--this.data.orderData[index].quantity,
                    }
                }
               ).then(res=>{
                   this.getCartData();
               }).catch(err=>{
                   console.log(err);
               })
        }
       
    },
    filterProduct(e,vm){//篩選產品
        const value = e.target.value;
        vm.data.slectProductData=value;
        vm.render();
        vm.getCartData();
    },
    renderData(item){//印出產品畫面字串
        this.data.productsListStr+= `<li class="card-group col col-sm-6 col-md-3">
        <div class="card border-0">
            <img src="${item.images}" class="card-img-top img-fluid" alt="...">
            <button class='addCart btn-dark btn rounded-0' data-id=${item.id} data-class="addCart">加入購物車</button>
            <div class="card-body">
                <p class="card-title font-M text-Bold mb-2">${item.title}</p>
                <p class="card-text  font-M text-Bold mb-2">
                    <del>NT$${item.origin_price}</del>
                </p>
                <p class="card-text font-XL text-Bold">NT$${item.price}</p>
            </div>
        </div>
        </li>`
    },
    render(){//渲染畫面
        //dom
        const selectProducts =document.querySelector('.selectProducts')//篩選產品
        const productsList=document.querySelector('.productsList');//產品列表
        //data
        const productsData=this.data.productsData;//產品資料
        let selectProductsArr=[];//放入產品種類
        this.data.productsListStr='';//避免從整網頁把上一筆組字串的結果組起來
        //篩選商品種類
        selectProducts.addEventListener('change',(e)=>{
            const vm =this;
            vm.filterProduct(e,vm);
        });
        selectProducts.value=this.data.slectProductData;//把選擇的類型放入select裏頭
        //渲染產品列表字串
        if(this.data.slectProductData==='全部'){
            productsData.forEach(item=>{
                selectProductsArr.push(item.category);
                this.renderData(item);
            });
        }else{
            productsData.forEach(item=>{
                selectProductsArr.push(item.category);
                if(item.category===this.data.slectProductData){
                    this.renderData(item);
                }
            });    
        }
        productsList.innerHTML=this.data.productsListStr;
        productsList.addEventListener('click',(e)=>{
            const vm =this;
            let cartClass=e.target.getAttribute('data-class');
            if(cartClass!=="addCart"){//判斷是否點擊購物車按鈕
                return 
            }
            let id =e.target.dataset.id;//產品id
            vm.addCart(id,vm);
        });       
    },
    getCartData(){//取得購物車列表
        const url ="https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/carts";
        const vm = this;
        const order =document.querySelector('.order');//切換是否購物(購物)
        const noOrder=document.querySelector('.no-Order')//切換是否購物(非購物)
        const orderList =document.querySelector('.orderList');//購物車內容
        let orderListStr='';
        axios.get(url)
        .then(res=>{
            vm.data.orderData=res.data.carts;
                //渲染購物車清單
            if(this.data.orderData.length<=0){//isOrder判斷是否有購物
                noOrder.innerHTML= `
                <i class="fas fa-shopping-cart"></i>
                    沒有任何商品在購物車裡`;
                order.classList.add('d-none');
                noOrder.classList.remove('d-none');
            }else{
                order.classList.remove('d-none');
                noOrder.classList.add('d-none');
                let total=0;
                this.data.orderData.forEach(item=>{
                    total+=item.product.price*item.quantity;
                    orderListStr+=
                    `<tr class="border-Bottom font-M">
                        <th scope="row" class="align-middle">
                            <img src=${item.product.images} alt="" class="cart-Img img-fluid mr-3">
                            ${item.product.title}
                        </th>
                        <td class="align-middle">NT$${item.product.price}</td>
                        <td class="align-middle">
                            <a href="#" class="minusCart">
                                <i class="fas fa-minus"></i>
                            </a>
                            ${item.quantity}
                            <a href="#" class="plusCart">
                                <i class="fas fa-plus"></i>
                            </a>
                        </td>
                        <td class="align-middle">NT$${item.product.price*item.quantity}</td>
                        <td class="align-middle">
                            <a href="#" class="removeOrder">
                                <i class="far fa-trash-alt" data-id=${item.id} 
                                data-productid=${item.product.id}></i>  
                            </a>
                        </td>
                    </tr>`
                });
                orderList.innerHTML=orderListStr+`
                    <tr>
                        <th scope="row" class="align-middle" colspan="3">
                            <button class="btn-outline-dark btn removeAllOrder">刪除所有品項</button>
                        </th>
                        <td class="font-M align-middle text-Bold">總金額</td>
                        <td class="font-XL align-middle text-Bold">NT$${total}</td>
                </tr>`; 
                //修改購物車++
                const plusCart =document.querySelectorAll('.plusCart');//加數量
                plusCart.forEach((item,index)=>{
                    item.addEventListener('click',(e)=>{
                        e.preventDefault();
                        this.plusCart(e,index);
                      
                    })
                })
                //修改購物車--
                const minusCart =document.querySelectorAll('.minusCart');//減數量
                minusCart.forEach((item,index)=>{
                    item.addEventListener('click',(e)=>{
                        e.preventDefault();
                        this.minusCart(e,index);
                    })
                })
                //刪除全部購物車清單
                const removeAllOrder=document.querySelector('.removeAllOrder');
                removeAllOrder.addEventListener('click',()=>{
                        swal({
                            title:"清除全部購物車",
                            icon:"warning",
                            buttons: {
                                cancel: {
                                  text: "取消",
                                  visible: true
                                },
                                danger: {
                                  text: "確定",
                                  visible: true
                                }
                            }
                        }).then((value) => {//接收到選取到的按鈕
                            if(value==='danger'){
                                this.removeAllCart();
                                swal("已全數刪除購物車", "歡迎再次選購", "success");
                            }
                        });
                });
                //刪除特定購物車清單
                const removeOrder=document.querySelectorAll('.removeOrder');
                removeOrder.forEach(item=>{
                    item.addEventListener('click',(e)=>{
                        this.removeCart(e);
                    });
                })
            }
        }).catch(err=>{
            console.log(err);
        })
    },
    getProductData(){//取得產品資料
        const vm =this;
        axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/products`).
          then(function (response) {
            vm.data.productsData= response.data.products;
            vm.render();
          }).catch(err=>{
            console.log(err);
        })
    },
    init(){//初始化
        const productUrl='https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/v268018/products';
      

        this.getProductData();//取得產品資料
        this.getCartData();//取得購物車資料
        this.checkForm();//初始化表單
    }
}
app.init();
  
   