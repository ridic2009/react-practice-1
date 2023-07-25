import Cart from "./components/Cart";
import Home from "./pages/Home";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Favorites from "./pages/Favorites";

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

      const responseForFavorites = await fetch(
        "https://64bb72ab5e0670a501d7089b.mockapi.io/Favorites"
      )

      const dataForFavorites = await responseForFavorites.json()

      setItems(data);
      setCartItems(dataForCart);
      setFavoriteItems(dataForFavorites)
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

  const fetchFavoritesToBackend = async obj => {
    const response = await fetch(
      "https://64bb72ab5e0670a501d7089b.mockapi.io/Favorites",
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

  const [favoriteItems, setFavoriteItems] = useState([]);
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Функция добавления определённого товара в корзину
  const onAddToCart = card => {
    const isCardAdded = cartItems.some(item => item.id === card.id);

    if (!isCardAdded) {
      fetchDataToBackend(card);
      setCartItems(prev => [...prev, card]);
    }
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

  // Функция добавления товара в избранное
  const onAddToFavorite = card => {
    fetchFavoritesToBackend(card);
    setFavoriteItems(prev => [...prev, card]);
    console.log(favoriteItems);
  };

  // Функция удаления определённого товара из избранного
  // const onRemoveFromFavorite = () => {
  //   fetch(`https://64bb72ab5e0670a501d7089b.mockapi.io/Favorites/`, {
  //     method: "delete",
  //     headers: {
  //       "Content-Type": "application/json;charset=utf-8"
  //     }
  //   });

  //   setFavoriteItems(prev => [])
  // }

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

      <Routes>
        <Route
          path="/"
          element={
            <Home
              items={items}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchValue={onChangeSearchValue}
              onAddToCart={onAddToCart}
              onAddToFavorite={onAddToFavorite}
            />
          }
        ></Route>
        <Route
          path="/favorites"
          element={
            <Favorites
              items={favoriteItems}
              searchValue={searchValue}
              onChangeSearchValue={onChangeSearchValue}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
