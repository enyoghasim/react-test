import { useEffect, useState } from "react";
import "./App.css";
import { axiosGet } from "./utils/api";

const getPercentage = (percentage, value) => {
  return (Number(percentage) / 100) * Number(value);
};

const filterStarred = (items, boolean) => {
  return items.filter((item) => item.starred === boolean);
};

const deleteItem = (items, id) => {
  return items.filter((item) => item.id !== id);
};

const addItem = (items, item) => {
  return [
    ...items,
    {
      ...item,
      id: Date.now(),
      starred: false,
      tax: getPercentage(16, item.net),
    },
  ];
};

const toggleStarred = (items, id, boolean = null) => {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, starred: boolean !== null ? boolean : !item.starred };
    }
    return item;
  });
};

const getTotalSum = (items) => {
  return items.reduce((acc, item) => {
    return acc + Number(item.net);
  }, 0);
};

const getAverage = (items) => {
  return (
    items.reduce((acc, item) => {
      return acc + Number(item.net);
    }, 0) / items.length
  );
};

const addStaredProperty = (items) => {
  return items.map((item) => {
    return item.hasOwnProperty("starred") ? item : { ...item, starred: false };
  });
};

function App() {
  const [apiData, setApiData] = useState([]);
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [items, setItems] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    axiosGet()
      .then((data) => {
        if (data.items && data.items.length) {
          setApiData([...addStaredProperty(data.items)]);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
    // console.log(
    //   filterStarred(
    //     [
    //       {
    //         starred: true,
    //       },
    //       {
    //         starred: true,
    //       },
    //       {
    //         starred: false,
    //       },
    //       {
    //         starred: true,
    //       },
    //     ],
    //     false
    //   )
    // );
    // console.log(
    // deleteItem([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }], 2)
    // );
    // console.log(
    //   addItem([{}, {}, {}, {}, {}], {
    //     net: "100",
    //   })
    // );
    // console.log(
    //   toggleStarred([{ id: 1 }, { id: 2, starred: false }, { id: 3 }], 2, true)
    // );

    // console.log(getTotalSum([{ net: 1 }, { net: "200" }, { net: "300" }]));

    // console.log(getAverage([{ net: 1 }, { net: "200" }, { net: "300" }]));

    // console.log(
    //   addStaredProperty([
    //     { net: 1, starred: true },
    //     { net: "200" },
    //     { net: "300" },
    //   ])
    // );
  }, []);

  useEffect(() => {
    setItems(favouritesOnly ? filterStarred(apiData, true) : apiData);
    setTotalSum((apiData && getTotalSum(apiData)) || 0);
    setAverage((apiData && getAverage(apiData)) || 0);
  }, [apiData]);

  useEffect(() => {
    setItems(favouritesOnly ? filterStarred(apiData, true) : apiData);
  }, [favouritesOnly]);

  return (
    <div className="App">
      {/* <form id="item-form" className="form-main"></form> */}
      <div>
        <button onClick={() => setFavouritesOnly(!favouritesOnly)}>
          show favourite
        </button>
      </div>
      total sum : {totalSum}
      average sum : {average}
      {items.map((item) => {
        return (
          <div className="item-container" key={item.id}>
            <div className="item-container__item">
              <div className="item-container__item__name">{item.name}</div>
              <div className="item-container__item__net">{item.net}</div>
              <div className="item-container__item__tax">{item.tax}</div>
              <div className="item-container__item__total">{item.total}</div>
            </div>
            <div className="item-container__item__starred">
              <input
                type="checkbox"
                checked={item.starred}
                onChange={() => setApiData(toggleStarred(apiData, item.id))}
              />
              <span
                onClick={() => setApiData(deleteItem(apiData, item.id))}
                className="cancel"
              >
                X
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
