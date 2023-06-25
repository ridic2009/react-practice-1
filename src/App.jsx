import Cart from "./components/Cart";
import Card from "./components/Card";
import Header from "./components/Header";
import { useState } from "react";

const cards = [
  {
    title: "Мужские Кроссовки Nike Blazer Mid Suede",
    price: 12999,
    imgURL: "./assets/card-img-1.jpg",
  },
  {
    title: "Мужские Кроссовки Nike Air Max 270",
    price: 12999,
    imgURL: "./assets/card-img-2.jpg",
  },
  {
    title: "Мужские Кроссовки Nike Blazer Mid Suede",
    price: 8499,
    imgURL: "./assets/card-img-3.jpg",
  },
  {
    title: "Кроссовки Puma X Aka Boku Future Rider",
    price: 8999,
    imgURL: "./assets/card-img-4.jpg",
  },
];



function App() {

  

  const [isOpened, setIsOpened] = useState(false)

  return (
    <div className="page">

      {
        isOpened ? <Cart handleCartOpen={() => setIsOpened(false)}/> : null
      }

      <Header handleCartOpen={() => setIsOpened(true)}/>

      <main className="content">
        <section className="products">
          <div className="container">
            <div className="products__top">
              <h1>Все кроссовки</h1>
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
                />
              </div>
            </div>

            <ul className="products-list">
              {cards.map((card) => (
                <Card
                  title={card.title}
                  imgURL={card.imgURL}
                  price={card.price}
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
