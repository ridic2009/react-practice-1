import Cart from "./components/Cart";
import Card from "./components/Card";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      // Запрос товаров для рендера в главной части
      const response = await fetch(
        "https://6499727d79fbe9bcf83f4533.mockapi.io/items"
      );

      const data = await response.json();

      // Запрос товаров для корзины
      const responseForCart = await fetch(
        "https://6499727d79fbe9bcf83f4533.mockapi.io/cart"
      );
      const dataForCart = await responseForCart.json();

      setItems(data);
      setCartItems(dataForCart);
    };

    fetchData();
  }, []);

  // Добавление товаров из корзины в Backend для последующего запроса при загрузке страницы
  const fetchDataToBackend = async obj => {
    const response = await fetch(
      "https://6499727d79fbe9bcf83f4533.mockapi.io/cart",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(obj)
      }
    );

    const data = await response.json();

    return data;
  };

  // Стэйты
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Функция добавления определённого товара в корзину
  const onAddToCart = card => {
    fetchDataToBackend(card);

    // Если карточка товара добавлена, то больше не добавлять в общий массив карточек
    // const isCardAdded = cartItems.some(item => item.id === card.id);

    // if (!isCardAdded) {
    //   setCartItems(prev => [...prev, card]);
    // }

    setCartItems(prev => [...prev, card]);
  };

  // Функция удаления определённого товара из корзины
  const onRemoveFromCart = id => {
    fetch(`https://6499727d79fbe9bcf83f4533.mockapi.io/cart/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    });

    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Функция поиска по товарам
  const onChangeSearchValue = event => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="page">
      {cartOpened && (
        <Cart
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveFromCart}
        />
      )}

      <Header handleCartOpen={() => setCartOpened(true)} />

      <main className="content">
        <section className="products">
          <div className="container">
            <div className="products__top">
              <Routes>
                <Route path="/sercolox" element="dfg"></Route>
              </Routes>
              <h1>
                {searchValue
                  ? `Поиск по запросу "${searchValue}"`
                  : "Все кроссовки"}
              </h1>
              <div className="search">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.25 15.25L11.8855 11.8795L15.25 15.25ZM13.75 7.375C13.75 9.06576 13.0784 10.6873 11.8828 11.8828C10.6873 13.0784 9.06576 13.75 7.375 13.75C5.68424 13.75 4.06274 13.0784 2.86719 11.8828C1.67165 10.6873 1 9.06576 1 7.375C1 5.68424 1.67165 4.06274 2.86719 2.86719C4.06274 1.67165 5.68424 1 7.375 1C9.06576 1 10.6873 1.67165 11.8828 2.86719C13.0784 4.06274 13.75 5.68424 13.75 7.375V7.375Z"
                    stroke="#E4E4E4"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Поиск..."
                  maxLength={42}
                  autoComplete="off"
                  onChange={onChangeSearchValue}
                  value={searchValue}
                />
              </div>
            </div>

            <ul className="products-list">
              {items
                .filter(item =>
                  item.title.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((card, index) => (
                  <Card
                    key={index}
                    id={card.id}
                    title={card.title}
                    imgURL={card.imgURL}
                    price={card.price}
                    onAdd={card => {
                      onAddToCart(card);
                    }}
                  />
                ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
