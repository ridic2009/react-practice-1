import Cart from "./components/Cart";
import Home from "./pages/Home";
import Header from "./components/Header";
import Favorites from "./pages/Favorites";


import { Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";


export const RootContext = createContext({});


function App() {
  useEffect(() => {
    try {
      const fetchData = async () => {
        setIsLoading(true);
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
        );

        const dataForFavorites = await responseForFavorites.json();

        setItems(data);
        setCartItems(dataForCart);
        setFavoriteItems(dataForFavorites);
        setIsLoading(false);
      };

      fetchData();
    } catch (error) {
      alert("Ошибка при запросе данных с backend", error);
    }
  }, []);

  // Добавление товаров из корзины в Backend для последующего запроса при загрузке страницы
  const fetchDataToBackend = async obj => {
    try {
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
    } catch (error) {
      alert("Ошибка при отправке данных на backend", error);
    }
  };

  const fetchFavoritesToBackend = async obj => {
    try {
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
    } catch (error) {
      alert("Ошибка при отправке данных [Избранное]", error);
    }
  };

  // Стэйты

  const [favoriteItems, setFavoriteItems] = useState([]);
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(true);

  // Функция добавления определённого товара в корзину
  const onAddToCart = card => {
    try {
      const isCardAdded = cartItems.some(item => item.id === card.id);

      if (!isCardAdded) {
        setCartItems(prev => [...prev, card]);
        fetchDataToBackend(card);
      }
    } catch (error) {
      alert("Ошибка при добавлении в корзину", error);
    }
  };

  // Функция удаления определённого товара из корзины
  const onRemoveFromCart = id => {
    try {
      setCartItems(prev => prev.filter(item => item.id !== id));

      fetch(`https://6499727d79fbe9bcf83f4533.mockapi.io/cart/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      });
    } catch (error) {
      alert("Ошибка при удалении из корзины", error);
    }
  };

  // Функция добавления товара в избранное
  const onAddToFavorite = async card => {
    try {
      if (favoriteItems.find(item => item.id === card.id)) {
        fetch(
          `https://64bb72ab5e0670a501d7089b.mockapi.io/Favorites/${card.id}`,
          {
            method: "delete",
            headers: {
              "Content-Type": "application/json;charset=utf-8"
            }
          }
        );

        setFavoriteItems(prev => prev.filter(item => item.id !== card.id));
      } else {
        const resp = await fetchFavoritesToBackend(card);
        setFavoriteItems(prev => [...prev, resp]);
      }
    } catch (error) {
      console.error("Что-то пошло не так", error);
    }
  };

  // Функция поиска по товарам
  const onChangeSearchValue = event => {
    setSearchValue(event.target.value);
  };

  return (
    <RootContext.Provider
      value={{ favoriteItems, items, cartItems, isAdded, setCartOpened, setCartItems, setIsAdded }}
    >
      <div className="page">
        <Cart
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveFromCart}
          opened={cartOpened}
        />

        <Header handleCartOpen={() => setCartOpened(true)} items={cartItems} />

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
                isLoading={isLoading}
              />
            }
          ></Route>
          <Route
            path="/favorites"
            element={
              <Favorites
                searchValue={searchValue}
                onChangeSearchValue={onChangeSearchValue}
                onAddToFavorite={onAddToFavorite}
              />
            }
          ></Route>
        </Routes>
      </div>
    </RootContext.Provider>
  );
}

export default App;
