import logo from './logo.svg';
import React from "react";
import Title from "./components/Title"
import './App.css';


const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const Form = ({ updateMainCat }) => {

  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;

    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    } else {
      setErrorMessage("");
    }
    setValue(userValue.toUpperCase());
  };

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value == "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }

    updateMainCat(value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img
        src={img}
        alt="고양이"
        width="400"
      />
      <button
        onClick={onHeartClick}
      >
        {heartIcon}
      </button>
    </div>
  );
}

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: '150px' }} />
    </li>
  );
}

function Favorites({ favorites }) {

  if (favorites.length == 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
  }

  return (
    <ul className="favorites">
      {favorites.map(cat => <CatItem img={cat} key={cat} />)}
    </ul>
  );
}

const App = () => {

  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter');
  });
  const [mainCatImage, setMainCatImage] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const alreadyFavorite = favorites.includes(mainCatImage);

  const title = counter ? counter + "번째 " : "";

  async function setInitialCat() {
    const newCat = await fetchCat('FRIST CAT');
    setMainCatImage(newCat);
  };

  React.useEffect(() => {
    setInitialCat();
  }, [])


  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCatImage(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    })

  };

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCatImage];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites)
  };

  return (
    <div>
      <Title>{title}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCatImage} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  );
}

export default App;
