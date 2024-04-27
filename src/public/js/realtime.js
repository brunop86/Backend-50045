const socket = io();

socket.on("products", (data) => {
  renderProducts(data);
});

const renderProducts = (products) => {
  const containerProducts = document.getElementById("containerProducts");
  containerProducts.innerHTML = "";

  products.docs.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
                <div class="containerProducts">
                    <div class="card" style="width: 25rem;">
                        <div class="card-body">
                            <h2>${item.title}</h2>
                            <p>${item.description}</p>
                            <p>$${item.price}</p>
                            <p>Id: ${item.id}</p>
                            <button class="btn btn-primary">Delete</button>
                        </div>
                    </div>
                </div>
                    `;
    containerProducts.appendChild(card);
    card.querySelector("button").addEventListener("click", () => {
      deleteProduct(item.id);
    });
  });
};

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

document.getElementById("btnSend").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    categoty: document.getElementById("category").value,
    thumbnails: document.getElementById("thumbnails").value,
    status: document.getElementById("status").value === "true",
  };
  socket.emit("addProduct", product);
};
